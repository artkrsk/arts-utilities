import type { IExtractVideoID, IGenerateEmbedURL } from "../interfaces";
import type { TVideoEmbedOptions } from "../types";
import { detectMediaFromURL } from "./MediaTypeDetection";

const YOUTUBE_PATTERN =
	/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed\/|shorts\/|live\/|v\/)?)([\w-]+)(\S+)?$/i;
const VIMEO_PATTERN =
	/^((?:https?:)?\/\/)?(?:(?:www|player)\.)?vimeo\.com\/(?:(?:channels\/[A-z]+\/)|(?:groups\/[A-z]+\/videos\/)|(?:video\/))?(\d+)/i;

export const extractVideoID: IExtractVideoID = (url: string): string | null => {
	if (!url || typeof url !== "string") {
		return null;
	}

	const mediaType = detectMediaFromURL(url);

	switch (mediaType) {
		case "youtube": {
			const match = url.match(YOUTUBE_PATTERN);
			// YouTube ID is in capture group 5.
			/* c8 ignore next */
			return match?.[5] || null;
		}

		case "vimeo": {
			const match = url.match(VIMEO_PATTERN);
			// Vimeo ID is in capture group 2.
			/* c8 ignore next */
			return match?.[2] || null;
		}

		default:
			return null;
	}
};

export const generateEmbedURL: IGenerateEmbedURL = (
	url: string,
	options: TVideoEmbedOptions = {},
): string => {
	if (!url || typeof url !== "string") {
		return url;
	}

	const { autoplay = false, enablejsapi = true, privacy = false } = options;
	const videoId = extractVideoID(url);
	const mediaType = detectMediaFromURL(url);

	if (!videoId) {
		return url;
	}

	switch (mediaType) {
		case "youtube": {
			const params = new URLSearchParams();
			if (autoplay) params.set("autoplay", "1");
			if (enablejsapi) params.set("enablejsapi", "1");

			const queryString = params.toString();
			const domain = privacy ? "www.youtube-nocookie.com" : "www.youtube.com";
			return `https://${domain}/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
		}

		case "vimeo": {
			const params = new URLSearchParams();
			if (autoplay) params.set("autoplay", "1");
			if (privacy) params.set("dnt", "1");

			const queryString = params.toString();
			return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ""}`;
		}
		/* c8 ignore next */
		default:
			// Unreachable: extractVideoID already returned null for non-YouTube/Vimeo URLs above.
			/* c8 ignore next */
			return url;
	}
};
