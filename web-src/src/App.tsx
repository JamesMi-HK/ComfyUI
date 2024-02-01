import './App.css';
import { useEffect, useRef } from 'react';
import { GraphContextProvider, useGraph } from './context/graphContext';
import { ComfyAppContextProvider, useComfyApp } from './context/appContext.tsx';
import { ComfyDialogContextProvider } from './context/comfyDialogContext.tsx';
import { useLoadGraphData } from './hooks/useLoadGraphData.tsx';
import { mountLiteGraph, loadWorkflow, loadGraphData } from './litegraph/graphUtils.ts';

function RenderComponents() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { graphState } = useGraph();
    const { app } = useComfyApp();
    const { loadGraphData } = useLoadGraphData();

    useEffect(() => {
        if (canvasRef.current) {
            mountLiteGraph(canvasRef.current);
        }

        const loadAppData = async () => {
            const restored = await loadWorkflow();

            // We failed to restore a workflow so load the default
            if (!restored) {
                await loadGraphData();
            }

            if (graphState && graphState.graph) {
                app.enableWorkflowAutoSave(graphState.graph);
            }
        };

        if (canvasRef.current) {
            loadAppData();
        }
    }, [canvasRef.current]);

    return (
        <>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {/* Other UI componets will go here */}
        </>
    );
}
function App() {
    return (
        <div className="App">
            <ComfyAppContextProvider>
                <ComfyDialogContextProvider>
                    <GraphContextProvider>
                        <RenderComponents />
                    </GraphContextProvider>
                </ComfyDialogContextProvider>
            </ComfyAppContextProvider>
        </div>
    );
}

export default App;