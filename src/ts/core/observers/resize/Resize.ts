import { isHTMLElement } from "../../dom";
import type { IResize, IResizeCallbacks } from "../../interfaces";

export class Resize implements IResize {
	private instance: ResizeObserver | null = null;
	private elements: Array<HTMLElement> = [];
	private callbacks: IResizeCallbacks;

	private handleResize = (entries: Array<ResizeObserverEntry>): void => {
		const targets: Array<Element> = [];

		for (const entry of entries) {
			targets.push(entry.target);
		}

		if (this.callbacks.onResize) {
			this.callbacks.onResize(targets, entries);
		}

		// `onResizeDebounced` isn't actually debounced here — it's an extra slot for callers
		// that pass a pre-debounced function. See IResizeCallbacks.
		if (this.callbacks.onResizeDebounced) {
			this.callbacks.onResizeDebounced(targets, entries);
		}
	};

	constructor({
		elements,
		callbackResize,
		callbackResizeDebounced,
	}: {
		elements: Array<HTMLElement>;
		callbackResize?: IResizeCallbacks["onResize"];
		callbackResizeDebounced?: IResizeCallbacks["onResizeDebounced"];
	}) {
		this.elements = elements;

		this.callbacks = {};
		if (callbackResize) {
			this.callbacks.onResize = callbackResize;
		}
		if (callbackResizeDebounced) {
			this.callbacks.onResizeDebounced = callbackResizeDebounced;
		}

		if (
			this.elements.length &&
			(this.callbacks.onResize || this.callbacks.onResizeDebounced)
		) {
			this.init();
		}
	}

	public init(): void {
		if (this.instance) {
			return;
		}

		this.instance = this.createResizeObserver();

		if (!this.instance) {
			return;
		}

		this.observeElements();
	}

	public destroy(): void {
		this.disconnectObserver();
		this.instance = null;
	}

	private createResizeObserver(): ResizeObserver | null {
		if (typeof window === "undefined" || typeof ResizeObserver !== "function") {
			console.warn("Resize: ResizeObserver is not available.");
			return null;
		}

		try {
			return new ResizeObserver(this.handleResize);
		} catch (e) {
			console.error("Resize: Error creating ResizeObserver:", e);
			return null;
		}
	}

	private observeElements(): void {
		if (!this.instance) {
			return;
		}

		for (let index = 0; index < this.elements.length; index++) {
			const element = this.elements[index];

			if (!isHTMLElement(element)) {
				continue;
			}

			this.instance.observe(element);
		}
	}

	private disconnectObserver(): void {
		if (this.instance) {
			this.instance.disconnect();
		}
	}
}
