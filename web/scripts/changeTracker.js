// @ts-check

import { api } from "./api.js";
import { clone } from "./utils.js";

export class ChangeTracker {
	static MAX_HISTORY = 50;

	undo = [];
	redo = [];
	activeState = null;
	isOurLoad = false;
	/** @type { import("./workflows").ComfyWorkflowInstance } */
	workflow;

	ds;

	get app() {
		return this.workflow.manager.app;
	}

	constructor(workflow) {
		this.workflow = workflow;
	}

	storeViewport() {
		this.ds = { scale: this.app.canvas.ds.scale, offset: [...this.app.canvas.ds.offset] };
	}

	restoreViewport() {
		if (!this.ds) return;
		this.app.canvas.ds.scale = this.ds.scale;
		this.app.canvas.ds.offset = this.ds.offset;
	}

	checkState() {
		const currentState = this.app.graph.serialize();
		if (!this.activeState) {
			this.activeState = clone(currentState);
			return;
		}
		if (!ChangeTracker.graphEqual(this.activeState, currentState)) {
			this.undo.push(this.activeState);
			if (this.undo.length > ChangeTracker.MAX_HISTORY) {
				this.undo.shift();
			}
			this.activeState = clone(currentState);
			this.redo.length = 0;
			this.workflow.unsaved = true;
			api.dispatchEvent(new CustomEvent("graphChanged", { detail: this.activeState }));
		}
	}

	async updateState(source, target) {
		const prevState = source.pop();
		if (prevState) {
			target.push(this.activeState);
			this.isOurLoad = true;
			await this.app.loadGraphData(prevState, false, this.workflow);
			this.activeState = prevState;
		}
	}

	async undoRedo(e) {
		if (e.ctrlKey || e.metaKey) {
			if (e.key === "y") {
				this.updateState(this.redo, this.undo);
				return true;
			} else if (e.key === "z") {
				this.updateState(this.undo, this.redo);
				return true;
			}
		}
	}

	/** @param { import("./app.js").ComfyApp } app */
	static init(app) {
		const changeTracker = () => app.workflowManager.activeWorkflow.changeTracker;

		const loadGraphData = app.loadGraphData;
		app.loadGraphData = async function () {
			const v = await loadGraphData.apply(this, arguments);
			const ct = changeTracker();
			if (ct.isOurLoad) {
				ct.isOurLoad = false;
			} else {
				ct.checkState();
			}
			return v;
		};

		let keyIgnored = false;
		window.addEventListener(
			"keydown",
			(e) => {
				requestAnimationFrame(async () => {
					let activeEl;
					// If we are auto queue in change mode then we do want to trigger on inputs
					if (!app.ui.autoQueueEnabled || app.ui.autoQueueMode === "instant") {
						activeEl = document.activeElement;
						if (activeEl?.tagName === "INPUT" || activeEl?.["type"] === "textarea") {
							// Ignore events on inputs, they have their native history
							return;
						}
					}

					keyIgnored = e.key === "Control" || e.key === "Shift" || e.key === "Alt" || e.key === "Meta";
					if (keyIgnored) return;

					// Check if this is a ctrl+z ctrl+y
					if (await changeTracker().undoRedo(e)) return;

					// If our active element is some type of input then handle changes after they're done
					if (ChangeTracker.bindInput(activeEl)) return;
					changeTracker().checkState();
				});
			},
			true
		);

		window.addEventListener("keyup", (e) => {
			if (keyIgnored) {
				keyIgnored = false;
				changeTracker().checkState();
			}
		});

		// Handle clicking DOM elements (e.g. widgets)
		window.addEventListener("mouseup", () => {
			changeTracker().checkState();
		});

		// Handle prompt queue event for dynamic widget changes
		api.addEventListener("promptQueued", () => {
			changeTracker().checkState();
		});

		// Handle litegraph clicks
		const processMouseUp = LGraphCanvas.prototype.processMouseUp;
		LGraphCanvas.prototype.processMouseUp = function (e) {
			const v = processMouseUp.apply(this, arguments);
			changeTracker().checkState();
			return v;
		};
		const processMouseDown = LGraphCanvas.prototype.processMouseDown;
		LGraphCanvas.prototype.processMouseDown = function (e) {
			const v = processMouseDown.apply(this, arguments);
			changeTracker().checkState();
			return v;
		};

		// Handle litegraph context menu for COMBO widgets
		const close = LiteGraph.ContextMenu.prototype.close;
		LiteGraph.ContextMenu.prototype.close = function (e) {
			const v = close.apply(this, arguments);
			changeTracker().checkState();
			return v;
		};
	}

	static bindInput(app, activeEl) {
		if (activeEl && activeEl.tagName !== "CANVAS" && activeEl.tagName !== "BODY") {
			for (const evt of ["change", "input", "blur"]) {
				if (`on${evt}` in activeEl) {
					const listener = () => {
						app.workflowManager.activeWorkflow.changeTracker.checkState();
						activeEl.removeEventListener(evt, listener);
					};
					activeEl.addEventListener(evt, listener);
					return true;
				}
			}
		}
	}

	static graphEqual(a, b, root = true) {
		if (a === b) return true;

		if (typeof a == "object" && a && typeof b == "object" && b) {
			const keys = Object.getOwnPropertyNames(a);

			if (keys.length != Object.getOwnPropertyNames(b).length) {
				return false;
			}

			for (const key of keys) {
				let av = a[key];
				let bv = b[key];
				if (root && key === "nodes") {
					// Nodes need to be sorted as the order changes when selecting nodes
					av = [...av].sort((a, b) => a.id - b.id);
					bv = [...bv].sort((a, b) => a.id - b.id);
				}
				if (!ChangeTracker.graphEqual(av, bv, false)) {
					return false;
				}
			}

			return true;
		}

		return false;
	}
}