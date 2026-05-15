import type { IDetectMediaFromURL, IGetMediaType } from "../interfaces";
import type { TMediaType } from "../types";

const IMAGE_PATTERN =
	/\.(jpg|jpeg|jfif|pjpeg|pjp|bmp|gif|png|apng|webp|svg|avif|heic|heif|tiff|tif)$/i;
const VIDEO_PATTERN = /\.(mp4|ogv|webm|mov|avi|mkv|m4v|wmv|flv)$/i;
const AUDIO_PATTERN = /\.(mp3|wav|ogg|m4a|aac|wma|flac)$/i;

const YOUTUBE_PATTERN =
	/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu\.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/i;
const VIMEO_PATTERN =
	/^((?:https?:)?\/\/)?(?:(?:www|player)\.)?vimeo\.com\/(?:(?:channels\/[A-z]+\/)|(?:groups\/[A-z]+\/videos\/)|(?:video\/))?(\d+)/i;

export const getMediaType: IGetMediaType = (url: string): TMediaType => {
	if (!url || typeof url !== "string") {
		return null;
	}

	// Strip query string and fragment so patterns match the file extension cleanly.
	let pathname: string;
	try {
		pathname = new URL(url).pathname;
	} catch {
		// `new URL` requires an absolute URL — manually trim for relative/malformed inputs.
		const urlWithoutQuery = url.split("?")[0];
		const urlWithoutFragment = urlWithoutQuery?.split("#")[0];
		pathname = urlWithoutFragment || url;
	}

	if (IMAGE_PATTERN.test(pathname)) {
		return "image";
	}

	if (VIDEO_PATTERN.test(pathname)) {
		return "video";
	}

	if (AUDIO_PATTERN.test(pathname)) {
		return "audio";
	}

	return null;
};

export const detectMediaFromURL: IDetectMediaFromURL = (
	url: string,
): TMediaType => {
	if (!url || typeof url !== "string") {
		return null;
	}

	// Streaming platforms first — a `youtube.com/.../video.mp4` URL is still YouTube.
	if (YOUTUBE_PATTERN.test(url)) {
		return "youtube";
	}

	if (VIMEO_PATTERN.test(url)) {
		return "vimeo";
	}

	return getMediaType(url);
};
