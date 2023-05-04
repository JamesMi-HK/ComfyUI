import os
import sys
import asyncio
import nodes
import folder_paths
import execution
import uuid
import json
import glob
try:
    import aiohttp
    from aiohttp import web
except ImportError:
    print("Module 'aiohttp' not installed. Please install it via:")
    print("pip install aiohttp")
    print("or")
    print("pip install -r requirements.txt")
    sys.exit()

import mimetypes
from comfy.cli_args import args


@web.middleware
async def cache_control(request: web.Request, handler):
    response: web.Response = await handler(request)
    if request.path.endswith('.js') or request.path.endswith('.css'):
        response.headers.setdefault('Cache-Control', 'no-cache')
    return response

def create_cors_middleware(allowed_origin: str):
    @web.middleware
    async def cors_middleware(request: web.Request, handler):
        if request.method == "OPTIONS":
            # Pre-flight request. Reply successfully:
            response = web.Response()
        else:
            response = await handler(request)

        response.headers['Access-Control-Allow-Origin'] = allowed_origin
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, DELETE, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    return cors_middleware

class PromptServer():
    def __init__(self, loop):
        PromptServer.instance = self

        mimetypes.init(); 
        mimetypes.types_map['.js'] = 'application/javascript; charset=utf-8'
        self.prompt_queue = None
        self.loop = loop
        self.messages = asyncio.Queue()
        self.number = 0

        middlewares = [cache_control]
        if args.enable_cors_header:
            middlewares.append(create_cors_middleware(args.enable_cors_header))

        self.app = web.Application(client_max_size=20971520, middlewares=middlewares)
        self.sockets = dict()
        self.web_root = os.path.join(os.path.dirname(
            os.path.realpath(__file__)), "web")
        routes = web.RouteTableDef()
        self.routes = routes
        self.last_node_id = None
        self.client_id = None

        @routes.get('/ws')
        async def websocket_handler(request):
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            sid = request.rel_url.query.get('clientId', '')
            if sid:
                # Reusing existing session, remove old
                self.sockets.pop(sid, None)
            else:
                sid = uuid.uuid4().hex      

            self.sockets[sid] = ws

            try:
                # Send initial state to the new client
                await self.send("status", { "status": self.get_queue_info(), 'sid': sid }, sid)
                # On reconnect if we are the currently executing client send the current node
                if self.client_id == sid and self.last_node_id is not None:
                    await self.send("executing", { "node": self.last_node_id }, sid)
                    
                async for msg in ws:
                    if msg.type == aiohttp.WSMsgType.ERROR:
                        print('ws connection closed with exception %s' % ws.exception())
            finally:
                self.sockets.pop(sid, None)
            return ws

        @routes.get("/")
        async def get_root(request):
            return web.FileResponse(os.path.join(self.web_root, "index.html"))

        @routes.get("/embeddings")
        def get_embeddings(self):
            embeddings = folder_paths.get_filename_list("embeddings")
            return web.json_response(list(map(lambda a: os.path.splitext(a)[0].lower(), embeddings)))

        @routes.get("/extensions")
        async def get_extensions(request):
            files = glob.glob(os.path.join(self.web_root, 'extensions/**/*.js'), recursive=True)
            return web.json_response(list(map(lambda f: "/" + os.path.relpath(f, self.web_root).replace("\\", "/"), files)))

        @routes.post("/upload/image")
        async def upload_image(request):
            post = await request.post()
            image = post.get("image")

            if post.get("type") is None:
                upload_dir = folder_paths.get_input_directory()
            elif post.get("type") == "input":
                upload_dir = folder_paths.get_input_directory()
            elif post.get("type") == "temp":
                upload_dir = folder_paths.get_temp_directory()
            elif post.get("type") == "output":
                upload_dir = folder_paths.get_output_directory()

            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)

            if image and image.file:
                filename = image.filename
                if not filename:
                    return web.Response(status=400)

                split = os.path.splitext(filename)
                i = 1
                while os.path.exists(os.path.join(upload_dir, filename)):
                    filename = f"{split[0]} ({i}){split[1]}"
                    i += 1

                filepath = os.path.join(upload_dir, filename)

                with open(filepath, "wb") as f:
                    f.write(image.file.read())
                
                return web.json_response({"name" : filename})
            else:
                return web.Response(status=400)


        @routes.get("/view")
        async def view_image(request):
            if "filename" in request.rel_url.query:
                type = request.rel_url.query.get("type", "output")
                output_dir = folder_paths.get_directory_by_type(type)
                if output_dir is None:
                    return web.Response(status=400)

                if "subfolder" in request.rel_url.query:
                    full_output_dir = os.path.join(output_dir, request.rel_url.query["subfolder"])
                    if os.path.commonpath((os.path.abspath(full_output_dir), output_dir)) != output_dir:
                        return web.Response(status=403)
                    output_dir = full_output_dir

                filename = request.rel_url.query["filename"]
                filename = os.path.basename(filename)
                file = os.path.join(output_dir, filename)

                if os.path.isfile(file):
                    return web.FileResponse(file, headers={"Content-Disposition": f"filename=\"{filename}\""})
                
            return web.Response(status=404)

        @routes.get("/prompt")
        async def get_prompt(request):
            return web.json_response(self.get_queue_info())

        @routes.get("/object_info")
        async def get_object_info(request):
            out = {}
            for x in nodes.NODE_CLASS_MAPPINGS:
                obj_class = nodes.NODE_CLASS_MAPPINGS[x]
                info = {}
                info['input'] = obj_class.INPUT_TYPES()
                info['output'] = obj_class.RETURN_TYPES
                info['output_name'] = obj_class.RETURN_NAMES if hasattr(obj_class, 'RETURN_NAMES') else info['output']
                info['name'] = x
                info['display_name'] = nodes.NODE_DISPLAY_NAME_MAPPINGS[x] if x in nodes.NODE_DISPLAY_NAME_MAPPINGS.keys() else x
                info['description'] = ''
                info['category'] = 'sd'
                if hasattr(obj_class, 'CATEGORY'):
                    info['category'] = obj_class.CATEGORY
                out[x] = info
            return web.json_response(out)

        @routes.get("/history")
        async def get_history(request):
            return web.json_response(self.prompt_queue.get_history())

        @routes.get("/queue")
        async def get_queue(request):
            queue_info = {}
            current_queue = self.prompt_queue.get_current_queue()
            queue_info['queue_running'] = current_queue[0]
            queue_info['queue_pending'] = current_queue[1]
            return web.json_response(queue_info)

        @routes.post("/prompt")
        async def post_prompt(request):
            print("got prompt")
            resp_code = 200
            out_string = ""
            json_data =  await request.json()

            if "number" in json_data:
                number = float(json_data['number'])
            else:
                number = self.number
                if "front" in json_data:
                    if json_data['front']:
                        number = -number

                self.number += 1

            if "prompt" in json_data:
                prompt = json_data["prompt"]
                valid = execution.validate_prompt(prompt)
                extra_data = {}
                if "extra_data" in json_data:
                    extra_data = json_data["extra_data"]

                if "client_id" in json_data:
                    extra_data["client_id"] = json_data["client_id"]
                if valid[0]:
                    self.prompt_queue.put((number, id(prompt), prompt, extra_data))
                else:
                    resp_code = 400
                    out_string = valid[1]
                    print("invalid prompt:", valid[1])

            return web.Response(body=out_string, status=resp_code)
        
        @routes.post("/queue")
        async def post_queue(request):
            json_data =  await request.json()
            if "clear" in json_data:
                if json_data["clear"]:
                    self.prompt_queue.wipe_queue()
            if "delete" in json_data:
                to_delete = json_data['delete']
                for id_to_delete in to_delete:
                    delete_func = lambda a: a[1] == int(id_to_delete)
                    self.prompt_queue.delete_queue_item(delete_func)
                    
            return web.Response(status=200)

        @routes.post("/interrupt")
        async def post_interrupt(request):
            nodes.interrupt_processing()
            return web.Response(status=200)

        @routes.post("/history")
        async def post_history(request):
            json_data =  await request.json()
            if "clear" in json_data:
                if json_data["clear"]:
                    self.prompt_queue.wipe_history()
            if "delete" in json_data:
                to_delete = json_data['delete']
                for id_to_delete in to_delete:
                    self.prompt_queue.delete_history_item(id_to_delete)

            return web.Response(status=200)
        
    def add_routes(self):
        self.app.add_routes(self.routes)
        self.app.add_routes([
            web.static('/', self.web_root),
        ])

    def get_queue_info(self):
        prompt_info = {}
        exec_info = {}
        exec_info['queue_remaining'] = self.prompt_queue.get_tasks_remaining()
        prompt_info['exec_info'] = exec_info
        return prompt_info

    async def send(self, event, data, sid=None):
        message = {"type": event, "data": data}
       
        if isinstance(message, str) == False:
            message = json.dumps(message)

        if sid is None:
            for ws in self.sockets.values():
                await ws.send_str(message)
        elif sid in self.sockets:
            await self.sockets[sid].send_str(message)

    def send_sync(self, event, data, sid=None):
        self.loop.call_soon_threadsafe(
            self.messages.put_nowait, (event, data, sid))

    def queue_updated(self):
        self.send_sync("status", { "status": self.get_queue_info() })

    async def publish_loop(self):
        while True:
            msg = await self.messages.get()
            await self.send(*msg)

    async def start(self, address, port, verbose=True, call_on_start=None):
        runner = web.AppRunner(self.app)
        await runner.setup()
        site = web.TCPSite(runner, address, port)
        await site.start()

        if address == '':
            address = '0.0.0.0'
        if verbose:
            print("Starting server\n")
            print("To see the GUI go to: http://{}:{}".format(address, port))
        if call_on_start is not None:
            call_on_start(address, port)

