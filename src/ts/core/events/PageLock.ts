import type { IPageLock, IPageLockOptions } from "../interfaces";
import { preventDefault } from "./PreventDefault";
import { captureTouchStart, preventDefaultSmart } from "./PreventDefaultSmart";
import { preventKeyboard } from "./PreventKeyboard";

export const pageLock: IPageLock = (
	lock: boolean = true,
	options: IPageLockOptions = {},
): void => {
	const {
		passive = false,
		lockKeyboard = true,
		allowNestedScroll = false,
	} = options || {};

	if (typeof window === "undefined") {
		return;
	}

	const preventFunction = allowNestedScroll
		? preventDefaultSmart
		: preventDefault;

	if (lock) {
		window.addEventListener("wheel", preventFunction, { passive });
		window.addEventListener("touchmove", preventFunction, { passive });

		// Touch direction can only be derived by comparing touchmove against an earlier touchstart.
		if (allowNestedScroll) {
			window.addEventListener("touchstart", captureTouchStart, {
				passive: true,
			});
		}

		if (lockKeyboard) {
			window.addEventListener("keydown", preventKeyboard, { passive });
		}
	} else {
		// Strip every listener the locked branch could have attached, regardless of which prevent
		// function was used originally — the caller may have changed `allowNestedScroll` between calls.
		window.removeEventListener("wheel", preventDefaultSmart);
		window.removeEventListener("wheel", preventDefault);
		window.removeEventListener("touchmove", preventDefaultSmart);
		window.removeEventListener("touchmove", preventDefault);
		window.removeEventListener("touchstart", captureTouchStart);

		if (lockKeyboard) {
			window.removeEventListener("keydown", preventKeyboard);
		}
	}
};
