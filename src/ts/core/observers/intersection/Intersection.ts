import { isHTMLElement } from "../../dom";
import type { IIntersection, IIntersectionCallbacks } from "../../interfaces";

export class Intersection implements IIntersection {
	private instance: IntersectionObserver | null = null;
	private elements: Array<HTMLElement> = [];
	private callbacks: IIntersectionCallbacks;
	private options: IntersectionObserverInit;

	private handleIntersection = (
		entries: Array<IntersectionObserverEntry>,
	): void => {
		const intersectingTargets: Array<Element> = [];
		const nonIntersectingTargets: Array<Element> = [];
		const intersectingEntries: Array<IntersectionObserverEntry> = [];
		const nonIntersectingEntries: Array<IntersectionObserverEntry> = [];

		for (const entry of entries) {
			if (entry.isIntersecting) {
				intersectingTargets.push(entry.target);
				intersectingEntries.push(entry);
			} else {
				nonIntersectingTargets.push(entry.target);
				nonIntersectingEntries.push(entry);
			}
		}

		if (intersectingEntries.length > 0) {
			if (this.callbacks.onIntersect) {
				this.callbacks.onIntersect(intersectingTargets, intersectingEntries);
			}

			// `onIntersectDebounced` isn't actually debounced here — it's an extra slot for callers
			// that pass a pre-debounced function. See IIntersectionCallbacks.
			if (this.callbacks.onIntersectDebounced) {
				this.callbacks.onIntersectDebounced(
					intersectingTargets,
					intersectingEntries,
				);
			}
		}

		if (nonIntersectingEntries.length > 0) {
			if (this.callbacks.offIntersect) {
				this.callbacks.offIntersect(
					nonIntersectingTargets,
					nonIntersectingEntries,
				);
			}

			if (this.callbacks.offIntersectDebounced) {
				this.callbacks.offIntersectDebounced(
					nonIntersectingTargets,
					nonIntersectingEntries,
				);
			}
		}
	};

	constructor({
		elements,
		callbackIntersect,
		callbackIntersectDebounced,
		callbackOffIntersect,
		callbackOffIntersectDebounced,
		options = {},
	}: {
		elements: Array<HTMLElement>;
		callbackIntersect?: IIntersectionCallbacks["onIntersect"];
		callbackIntersectDebounced?: IIntersectionCallbacks["onIntersectDebounced"];
		callbackOffIntersect?: IIntersectionCallbacks["offIntersect"];
		callbackOffIntersectDebounced?: IIntersectionCallbacks["offIntersectDebounced"];
		options?: IntersectionObserverInit;
	}) {
		this.elements = elements;
		this.options = options;

		this.callbacks = {};
		if (callbackIntersect) {
			this.callbacks.onIntersect = callbackIntersect;
		}
		if (callbackIntersectDebounced) {
			this.callbacks.onIntersectDebounced = callbackIntersectDebounced;
		}
		if (callbackOffIntersect) {
			this.callbacks.offIntersect = callbackOffIntersect;
		}
		if (callbackOffIntersectDebounced) {
			this.callbacks.offIntersectDebounced = callbackOffIntersectDebounced;
		}

		// Skip auto-init when there's nothing to observe or no callbacks to fire.
		if (this.elements.length && this.hasAnyCallbacks()) {
			this.init();
		}
	}

	public init(): void {
		if (this.instance) {
			return;
		}

		this.instance = this.createIntersectionObserver();

		if (!this.instance) {
			return;
		}

		this.observeElements();
	}

	public destroy(): void {
		this.disconnectObserver();
		this.instance = null;
	}

	private createIntersectionObserver(): IntersectionObserver | null {
		if (
			typeof window === "undefined" ||
			typeof IntersectionObserver !== "function"
		) {
			console.warn("Intersection: IntersectionObserver is not available.");
			return null;
		}

		try {
			return new IntersectionObserver(this.handleIntersection, this.options);
		} catch (e) {
			console.error("Intersection: Error creating IntersectionObserver:", e);
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

	private hasAnyCallbacks(): boolean {
		return !!(
			this.callbacks.onIntersect ||
			this.callbacks.onIntersectDebounced ||
			this.callbacks.offIntersect ||
			this.callbacks.offIntersectDebounced
		);
	}
}
