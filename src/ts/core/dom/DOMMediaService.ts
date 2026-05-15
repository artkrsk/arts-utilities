import type { IDOMMediaService } from "../interfaces/IDOMMediaService";

class DOMMediaServiceClass {
	public static playVideo(video: HTMLVideoElement): Promise<void> {
		try {
			if (!video) {
				return Promise.resolve();
			}

			if (typeof video.play !== "function") {
				return Promise.resolve();
			}

			const playPromise = video.play();

			// Older browsers (pre-Chrome 49 / Firefox 50) return `undefined` instead of a Promise.
			if (playPromise && typeof playPromise.then === "function") {
				return playPromise.catch(() => {
					// Autoplay policies, user interaction requirements — surface nothing.
					return Promise.resolve();
				});
			}

			return Promise.resolve();
		} catch (error) {
			return Promise.resolve();
		}
	}

	public static pauseVideo(video: HTMLVideoElement): void {
		try {
			if (!video) {
				return;
			}

			if (typeof video.pause !== "function") {
				return;
			}

			video.pause();
		} catch (error) {
			return;
		}
	}

	public static postMessageToIframe(
		iframe: HTMLIFrameElement,
		message: string,
		targetOrigin: string = "*",
	): void {
		try {
			if (!iframe) {
				return;
			}

			if (!iframe.contentWindow) {
				return;
			}

			if (!message) {
				return;
			}

			iframe.contentWindow.postMessage(message, targetOrigin);
		} catch (error) {
			// Cross-origin frames raise SecurityError on postMessage when the target origin doesn't match.
			return;
		}
	}
}

export const DOMMediaService: IDOMMediaService = {
	playVideo: DOMMediaServiceClass.playVideo,
	pauseVideo: DOMMediaServiceClass.pauseVideo,
	postMessageToIframe: DOMMediaServiceClass.postMessageToIframe,
};
