import type { ILoadMediaOptions } from "../interfaces";

export const loadMedia = async (
	element: HTMLElement | null,
	options: ILoadMediaOptions = {},
): Promise<HTMLElement> => {
	const { timeout = 10000, setPriority = true } = options;

	if (!element) {
		throw new Error("Element is required for media loading");
	}

	return new Promise((resolve, reject) => {
		let timeoutId: NodeJS.Timeout | null = null;

		if (timeout > 0) {
			timeoutId = setTimeout(() => {
				reject(new Error(`Media loading timed out after ${timeout}ms`));
			}, timeout);
		}

		const resolveWithCleanup = (result: HTMLElement): void => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			resolve(result);
		};

		const rejectWithCleanup = (error: Error): void => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			reject(error);
		};

		const tagName = element.tagName?.toUpperCase();

		if (tagName === "IMG") {
			const imgElement = element as HTMLImageElement;

			// `complete` alone is true even for failed loads, so guard with `naturalWidth`.
			if (imgElement.complete && imgElement.naturalWidth > 0) {
				resolveWithCleanup(imgElement);
				return;
			}

			if (setPriority) {
				imgElement.setAttribute("loading", "eager");
				imgElement.setAttribute("decoding", "sync");
				imgElement.setAttribute("fetchpriority", "high");
			}

			const handleLoad = (): void => {
				imgElement.removeEventListener("load", handleLoad);
				imgElement.removeEventListener("error", handleError);
				resolveWithCleanup(imgElement);
			};

			const handleError = (_event: Event): void => {
				imgElement.removeEventListener("load", handleLoad);
				imgElement.removeEventListener("error", handleError);
				rejectWithCleanup(
					new Error(
						`Image failed to load: ${imgElement.src || "unknown source"}`,
					),
				);
			};

			imgElement.addEventListener("load", handleLoad);
			imgElement.addEventListener("error", handleError);

			// An incomplete image with a src may be mid-fetch — force the load event to fire
			// for both already-cached and pending cases by re-assigning `src`.
			if (imgElement.src && !imgElement.complete) {
				const originalSrc = imgElement.src;
				imgElement.src = "";
				imgElement.src = originalSrc;
			}
		} else if (tagName === "VIDEO") {
			const videoElement = element as HTMLVideoElement;

			if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
				resolveWithCleanup(videoElement);
				return;
			}

			const handleLoaded = (): void => {
				videoElement.removeEventListener("loadeddata", handleLoaded);
				videoElement.removeEventListener("error", handleError);
				resolveWithCleanup(videoElement);
			};

			const handleError = (_event: Event): void => {
				videoElement.removeEventListener("loadeddata", handleLoaded);
				videoElement.removeEventListener("error", handleError);
				rejectWithCleanup(
					new Error(
						`Video failed to load: ${videoElement.src || "unknown source"}`,
					),
				);
			};

			videoElement.addEventListener("loadeddata", handleLoaded);
			videoElement.addEventListener("error", handleError);

			if (setPriority) {
				videoElement.setAttribute("preload", "auto");
			}

			// `preload="none"` (or any state that hasn't started fetching) leaves the network idle —
			// nudge it so `loadeddata` actually fires.
			if (videoElement.networkState === HTMLMediaElement.NETWORK_IDLE) {
				videoElement.load();
			}
		} else {
			// Non-media elements have no loading semantics — resolve immediately.
			resolveWithCleanup(element);
		}
	});
};
