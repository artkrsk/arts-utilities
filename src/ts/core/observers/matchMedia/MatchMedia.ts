import type { IMatchMedia, IMatchMediaCallbacks } from "../../interfaces";

export class MatchMedia implements IMatchMedia {
	private mediaQuery: MediaQueryList | null = null;
	private callbacks: IMatchMediaCallbacks;
	private condition: string;

	// Accept both `MediaQueryListEvent` (modern) and `MediaQueryList` (used during init / legacy fallback).
	private handleChange = (
		event: MediaQueryListEvent | MediaQueryList,
	): void => {
		const matches =
			"matches" in event ? event.matches : this.mediaQuery?.matches;

		if (matches) {
			this.callbacks.match?.();
		} else {
			this.callbacks.noMatch?.();
		}
	};

	constructor({
		condition,
		callbackMatch,
		callbackNoMatch,
	}: {
		condition: string;
		callbackMatch?: IMatchMediaCallbacks["match"];
		callbackNoMatch?: IMatchMediaCallbacks["noMatch"];
	}) {
		this.condition = condition;

		this.callbacks = {};
		if (callbackMatch) {
			this.callbacks.match = callbackMatch;
		}
		if (callbackNoMatch) {
			this.callbacks.noMatch = callbackNoMatch;
		}

		if (this.callbacks.match || this.callbacks.noMatch) {
			this.init();
		}
	}

	public init(): void {
		if (this.mediaQuery) {
			return;
		}

		this.mediaQuery = this.addMatchMedia();

		if (!this.mediaQuery) {
			return;
		}

		// Fire the appropriate callback for the initial state — listeners only fire on subsequent changes.
		this.checkInitialState();
		this.attachEvents();
	}

	public destroy(): void {
		this.detachEvents();
		this.mediaQuery = null;
	}

	private addMatchMedia(): MediaQueryList | null {
		if (
			typeof window === "undefined" ||
			typeof window.matchMedia !== "function"
		) {
			console.warn("MatchMedia: window.matchMedia is not available.");
			return null;
		}
		try {
			return window.matchMedia(this.condition);
		} catch (e) {
			console.error("MatchMedia: Error creating MediaQueryList:", e);
			return null;
		}
	}

	private checkInitialState(): void {
		if (!this.mediaQuery) {
			return;
		}

		this.handleChange(this.mediaQuery);
	}

	private attachEvents(): void {
		if (!this.mediaQuery) {
			return;
		}

		if (typeof this.mediaQuery.addEventListener === "function") {
			this.mediaQuery.addEventListener("change", this.handleChange);
		} else if (typeof this.mediaQuery.addListener === "function") {
			// Safari < 14 only exposes the deprecated `addListener`.
			this.mediaQuery.addListener(this.handleChange);
		}
	}

	private detachEvents(): void {
		if (!this.mediaQuery) {
			return;
		}

		if (typeof this.mediaQuery.removeEventListener === "function") {
			this.mediaQuery.removeEventListener("change", this.handleChange);
		} else if (typeof this.mediaQuery.removeListener === "function") {
			// Safari < 14 only exposes the deprecated `removeListener`.
			this.mediaQuery.removeListener(this.handleChange);
		}
	}
}
