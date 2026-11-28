import type { IBrowserService } from "../interfaces";

class BrowserServiceClass {
	static matchMedia(query: string): boolean {
		try {
			return window.matchMedia(query).matches;
		} catch (_error) {
			return false;
		}
	}

	static getViewportWidth(): number {
		try {
			return Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0,
			);
		} catch (_error) {
			return 0;
		}
	}

	static getViewportHeight(): number {
		try {
			return Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0,
			);
		} catch (_error) {
			return 0;
		}
	}

	static isInIframe(): boolean {
		try {
			return window.self !== window.top;
		} catch (_error) {
			// Defensive: reading `window.top` is not expected to throw, but if it does we assume we are framed.
			return true;
		}
	}
}

export const BrowserService: IBrowserService = {
	matchMedia: BrowserServiceClass.matchMedia,
	getViewportWidth: BrowserServiceClass.getViewportWidth,
	getViewportHeight: BrowserServiceClass.getViewportHeight,
	isInIframe: BrowserServiceClass.isInIframe,
};
