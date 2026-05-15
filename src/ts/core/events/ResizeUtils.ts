import type {
	IResponsiveResize,
	TResponsiveResizeCallback,
} from "../interfaces";

export const attachResponsiveResize: IResponsiveResize = (
	callback: TResponsiveResizeCallback,
	immediateCall = true,
) => {
	if (typeof callback !== "function") {
		return { clear: (): void => {} };
	}

	const mqPointer = window.matchMedia("(hover: hover) and (pointer: fine)");

	let lastVW = window.innerWidth;
	let lastVH = window.innerHeight;

	const handleWidthChange = (): void => {
		if (lastVW !== window.innerWidth) {
			lastVW = window.innerWidth;
			callback();
		}
	};

	const handleHeightChange = (): void => {
		if (lastVH !== window.innerHeight) {
			lastVH = window.innerHeight;
			callback();
		}
	};

	const handleMediaQueryChange = (
		event: MediaQueryListEvent | MediaQueryList,
		runCallback = false,
	): void => {
		const matches = event.matches;

		if (matches) {
			// Fine pointer (desktop): height changes are real layout events.
			window.addEventListener("resize", handleHeightChange, false);
		} else {
			// Coarse pointer (touch): the soft keyboard fires resize with height changes — drop the listener.
			window.removeEventListener("resize", handleHeightChange, false);
		}

		if (runCallback) {
			callback();
		}
	};

	const clear = (): void => {
		window.removeEventListener("resize", handleWidthChange, false);
		window.removeEventListener("resize", handleHeightChange, false);

		// Safari < 14 only supports the deprecated `addListener` / `removeListener` API.
		if (typeof mqPointer.removeEventListener === "function") {
			mqPointer.removeEventListener("change", handleMediaQueryChange);
		} else {
			mqPointer.removeListener(handleMediaQueryChange);
		}
	};

	window.addEventListener("resize", handleWidthChange, false);

	handleMediaQueryChange(mqPointer, immediateCall);

	if (typeof mqPointer.addEventListener === "function") {
		mqPointer.addEventListener("change", handleMediaQueryChange);
	} else {
		mqPointer.addListener(handleMediaQueryChange);
	}

	return { clear };
};
