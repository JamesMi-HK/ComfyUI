export default {
    translation: {
        "ui.queue_btn": "冲冲冲",
        "ui.queue_front_btn": "插队冲冲冲",
        "ui.view_queue_btn": "查看队列",
        "ui.view_history_btn": "查看历史",
        "ui.save_btn": "保存",
        "ui.load_btn": "加载",
        "ui.refresh_btn": "刷新",
        "ui.clipspace_btn": "Clipspace",
        "ui.clear_btn": "清空",
        "ui.load_default_btn": "加载默认配置",
        "ui.close_btn": "关闭",
        "ui.queue_size": "队列数量: ",
        "ui.extra_options": "额外选项",
        "ui.extra.batch_count": "批次数量",

        "ui.settings.title": "设置",
        "ui.list.view.prefix": "查看",
        "ui.list.clear.prefix": "清除",
        "ui.list.queue": "队列",
        "ui.list.history": "历史",

        "ui.canvas_menu_add_node": "添加节点",
        "ui.canvas_menu_add_group": "添加组",

        "ui.node_panel.header.properties": "属性",
        "ui.node_panel.header.title": "标题",
        "ui.node_panel.header.mode": "模式",
        "ui.node_panel.header.color": "颜色",

        "node.title.KSampler": "采样器",
        "node.title.KSamplerAdvanced": "采样器 (高级)",
        // Loaders
        "node.title.CheckpointLoader": "加载模型 (指定配置)",
        "node.title.CheckpointLoaderSimple": "加载模型",
        "node.title.VAELoader": "加载 VAE",
        "node.title.LoraLoader": "加载 LoRA",
        "node.title.CLIPLoader": "加载 CLIP",
        "node.title.UNETLoader": "UNETLoader",
        "node.title.DualCLIPLoader": "DualCLIPLoader",
        "node.title.ControlNetLoader": "加载 ControlNet 模型",
        "node.title.DiffControlNetLoader": "加载 ControlNet 模型 (diff)",
        "node.title.StyleModelLoader": "加载样式模型",
        "node.title.CLIPVisionLoader": "加载 CLIP 视觉",
        "node.title.UpscaleModelLoader": "加载外扩模型",
        // Conditioning
        "node.title.CLIPVisionEncode": "CLIP 视觉编码",
        "node.title.StyleModelApply": "Apply Style Model",
        "node.title.unCLIPConditioning": "unCLIPConditioning",
        "node.title.CLIPTextEncode": "CLIP Text Encode (Prompt)",
        "node.title.CLIPSetLastLayer": "CLIP Set Last Layer",
        "node.title.ConditioningCombine": "Conditioning (Combine)",
        "node.title.ConditioningAverage": "Conditioning (Average)",
        "node.title.ConditioningConcat": "Conditioning (Concat)",
        "node.title.ConditioningSetArea": "Conditioning (Set Area)",
        "node.title.ConditioningSetMask": "Conditioning (Set Mask)",
        "node.title.ControlNetApply": "Apply ControlNet",
        "node.title.ControlNetApplyAdvanced": "Apply ControlNet (Advanced)",
        // Latent
        "node.title.VAEEncodeForInpaint": "VAE Encode (for Inpainting)",
        "node.title.SetLatentNoiseMask": "Set Latent Noise Mask",
        "node.title.VAEDecode": "VAE Decode",
        "node.title.VAEEncode": "VAE Encode",
        "node.title.LatentRotate": "Rotate Latent",
        "node.title.LatentFlip": "Flip Latent",
        "node.title.LatentCrop": "Crop Latent",
        "node.title.EmptyLatentImage": "Empty Latent Image",
        "node.title.LatentUpscale": "Upscale Latent",
        "node.title.LatentUpscaleBy": "Upscale Latent By",
        "node.title.LatentComposite": "Latent Composite",
        "node.title.LatentBlend": "Latent Blend",
        "node.title.LatentFromBatch": "Latent From Batch",
        "node.title.RepeatLatentBatch": "Repeat Latent Batch",
        // Image
        "node.title.SaveImage": "Save Image",
        "node.title.PreviewImage": "Preview Image",
        "node.title.LoadImage": "Load Image",
        "node.title.LoadImageMask": "Load Image (as Mask)",
        "node.title.ImageScale": "Upscale Image",
        "node.title.ImageScaleBy": "Upscale Image By",
        "node.title.ImageUpscaleWithModel": "Upscale Image (using Model)",
        "node.title.ImageInvert": "Invert Image",
        "node.title.ImagePadForOutpaint": "Pad Image for Outpainting",
        // _for_testing
        "node.title.VAEDecodeTiled": "VAE Decode (Tiled)",
        "node.title.VAEEncodeTiled": "VAE Encode (Tiled)",
        "node.title.unCLIPCheckpointLoader": "unCLIPCheckpointLoader",
        "node.title.GLIGENLoader": "GLIGENLoader",
        "node.title.GLIGENTextBoxApply": "GLIGENTextBoxApply",
        // extras
        "node.title.Canny": "Canny",
        "node.title.CLIPTextEncodeSDXLRefiner": "CLIPTextEncodeSDXLRefiner",
        "node.title.CLIPTextEncodeSDXL": "CLIPTextEncodeSDXL",
        "node.title.HypernetworkLoader": "HypernetworkLoader",
        "node.title.LatentCompositeMasked": "LatentCompositeMasked",
        "node.title.MaskToImage": "Convert Mask to Image",
        "node.title.ImageToMask": "Convert Image to Mask",
        "node.title.SolidMask": "SolidMask",
        "node.title.InvertMask": "InvertMask",
        "node.title.CropMask": "CropMask",
        "node.title.MaskComposite": "MaskComposite",
        "node.title.FeatherMask": "FeatherMask",
        "node.title.ModelMergeSimple": "ModelMergeSimple",
        "node.title.ModelMergeBlocks": "ModelMergeBlocks",
        "node.title.CheckpointSave": "CheckpointSave",
        "node.title.CLIPMergeSimple": "CLIPMergeSimple",
        "node.title.ImageBlend": "Blend",
        "node.title.ImageBlur": "Blur",
        "node.title.ImageQuantize": "Quantize",
        "node.title.ImageSharpen": "Sharpen",
        "node.title.RebatchLatents": "Rebatch Latents",
        "node.title.TomePatchModel": "TomePatchModel",
        "node.title.UpscaleModelLoader": "UpscaleModelLoader",
        "node.title.ImageUpscaleWithModel": "ImageUpscaleWithModel",
        "node.title.DiffusersLoader": "DiffusersLoader",
        "node.title.LoadLatent": "LoadLatent",
        "node.title.SaveLatent": "SaveLatent",
        "node.title.ConditioningZeroOut": "ConditioningZeroOut",
        "node.title.ConditioningSetTimestepRange": "ConditioningSetTimestepRange",

        "node.input.text": "文本",
        "node.input.clip": "clip",
        "node.input.conditioning_1": "conditioning_1",
        "node.input.conditioning_2": "conditioning_2",
        "node.input.conditioning_to": "conditioning_to",
        "node.input.conditioning_from": "conditioning_from",
        "node.input.conditioning_to_strength": "conditioning_to_strength",
        "node.input.conditioning": "conditioning",
        "node.input.width": "宽度",
        "node.input.height": "高度",
        "node.input.x": "x",
        "node.input.y": "y",
        "node.input.strength": "strength",
        "node.input.mask": "遮罩",
        "node.input.set_cond_area": "set_cond_area",
        "node.input.start": "start",
        "node.input.end": "end",
        "node.input.samples": "samples",
        "node.input.vae": "vae",
        "node.input.pixels": "pixels",
        "node.input.grow_mask_by": "grow_mask_by",
        "node.input.filename_prefix": "文件名前缀",
        "node.input.latent": "latent",
        "node.input.ckpt_name": "模型文件",
        "node.input.config_name": "配置文件",
        "node.input.model_path": "模型路径",
        "node.input.stop_at_clip_layer": "stop_at_clip_layer",
        "node.input.model": "模型",
        "node.input.lora_name": "lora_name",
        "node.input.strength_model": "strength_model",
        "node.input.strength_clip": "strength_clip",
        "node.input.vae_name": "vae_name",
        "node.input.control_net_name": "control_net_name",
        "node.input.control_net": "control_net",
        "node.input.image": "图像",
        "node.input.positive": "positive",
        "node.input.negative": "negative",
        "node.input.start_percent": "start_percent",
        "node.input.end_percent": "end_percent",
        "node.input.unet_name": "unet_name",
        "node.input.clip_name": "clip_name",
        "node.input.clip_name1": "clip_name1",
        "node.input.clip_name2": "clip_name2",
        "node.input.clip_vision": "clip_vision",
        "node.input.style_model_name": "style_model_name",
        "node.input.style_model": "style_model",
        "node.input.clip_vision_output": "clip_vision_output",
        "node.input.noise_augmentation": "noise_augmentation",
        "node.input.gligen_name": "gligen_name",
        "node.input.gligen_textbox_model": "gligen_textbox_model",
        "node.input.batch_size": "batch_size",
        "node.input.batch_index": "batch_index",
        "node.input.length": "length",
        "node.input.amount": "amount",
        "node.input.upscale_method": "upscale_method",
        "node.input.crop": "crop",
        "node.input.scale_by": "scale_by",
        "node.input.images": "images",
        "node.input.samples_to": "samples_to",
        "node.input.samples_from": "samples_from",
        "node.input.feather": "feather",
        "node.input.samples1": "samples1",
        "node.input.samples2": "samples2",
        "node.input.blend_factor": "blend_factor",
        "node.input.seed": "seed",
        "node.input.steps": "steps",
        "node.input.cfg": "cfg",
        "node.input.sampler_name": "sampler_name",
        "node.input.scheduler": "scheduler",
        "node.input.latent_image": "latent_image",
        "node.input.denoise": "denoise",
        "node.input.add_noise": "add_noise",
        "node.input.noise_seed": "noise_seed",
        "node.input.start_at_step": "start_at_step",
        "node.input.end_at_step": "end_at_step",
        "node.input.return_with_leftover_noise": "return_with_leftover_noise",
        "node.input.prompt": "prompt",
        "node.input.extra_pnginfo": "extra_pnginfo",
        "node.input.channel": "channel",
        "node.input.left": "left",
        "node.input.right": "right",
        "node.input.top": "top",
        "node.input.bottom": "bottom",
        "node.input.feathering": "feathering",
        "node.input.control_after_generate": "control_after_generate",
        "node.input.low_threshold": "low_threshold",
        "node.input.high_threshold": "high_threshold",

        "node.output.CONDITIONING": "CONDITIONING",
        "node.output.IMAGE": "图像",
        "node.output.LATENT": "LATENT",
        "node.output.MODEL": "模型",
        "node.output.CLIP": "CLIP",
        "node.output.VAE": "VAE",
        "node.output.CLIP_VISION": "CLIP_VISION",
        "node.output.CONTROL_NET": "CONTROL_NET",
        "node.output.CLIP_VISION_OUTPUT": "CLIP_VISION_OUTPUT",
        "node.output.STYLE_MODEL": "STYLE_MODEL",
        "node.output.GLIGEN": "GLIGEN",
        "node.output.MASK": "遮罩",

        "category.conditioning": "可调参数",
        "category.loaders": "加载器",
        "category.latent": "潜在",
        "category.latent/inpaint": "潜在/修复",
        "category.latent/batch": "潜在/批量",
        "category.image": "图像",
        "category.mask": "遮罩",
        "category.image/upscaling": "图像/外扩",
        "category.sampling": "采样",
        "category._for_testing": "测试",
        "category.latent/transform": "潜在/转换",
        "category.advanced/loaders": "高级/加载器",
        "category.conditioning/style_model": "可调参数/风格模型",
        "category.conditioning/gligen": "可调参数/gligen",
        "category.advanced/loaders/deprecated": "高级/加载器/已弃用",
        "category.advanced/conditioning": "高级/可调参数",
        "category.image/postprocessing": "图像/后期处理",
        "category.advanced/model_merging": "高级/模型合并",
        "category.image/preprocessors": "图像/前期处理",
        "category.utils": "工具",

        "settings.Comfy.ConfirmClear": "清空工作流需要确认",
        "settings.Comfy.PromptFilename": "Prompt for filename when saving workflow",
        "settings.Comfy.PreviewFormat": "预览图格式和压缩尺寸, e.g. webp, jpeg, webp;50, etc.",
        "settings.Comfy.DisableSliders": "Disable sliders.",
        "settings.Comfy.DevMode": "启用开发模式",
        "settings.Comfy.ColorPalette": "主题",
        "settings.Comfy.EditAttention.Delta": "Ctrl+up/down precision",
        "settings.Comfy.InvertMenuScrolling": "反转滚动",
        "settings.Comfy.LinkRenderMode": "链接渲染模式",
        "settings.Comfy.NodeSuggestions.number": "Number of nodes suggestions",
        "settings.Comfy.SnapToGrid.GridSize": "单元格尺寸",
        "settings.Comfy.Logging.Enabled": "记录日志",
        "settings.Comfy.MenuPosition": "保存菜单位置",
        "settings.Comfy.ColorPalette.export": "导出",
        "settings.Comfy.ColorPalette.import": "导入",
        "settings.Comfy.ColorPalette.template": "模版",
        "settings.Comfy.ColorPalette.delete": "删除",
    }
}