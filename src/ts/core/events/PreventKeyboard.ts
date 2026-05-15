import type { IPreventKeyboard } from "../interfaces";

const NAVIGATION_KEYS = new Set([
	" ",
	"PageUp",
	"PageDown",
	"End",
	"Home",
	"ArrowLeft",
	"ArrowUp",
	"ArrowRight",
	"ArrowDown",
]);

// Keep numeric keyCodes for browsers/devices that don't expose `event.key` (e.g. some IMEs, very old WebViews).
const LEGACY_KEY_CODES = new Set([32, 33, 34, 35, 36, 37, 38, 39, 40]);

const isInputField = (element: Element | null): boolean => {
	if (!element) return false;

	const tagName = element.tagName.toLowerCase();

	if (tagName === "input") {
		const inputType = (element as HTMLInputElement).type.toLowerCase();
		return [
			"text",
			"password",
			"email",
			"search",
			"tel",
			"url",
			"number",
		].includes(inputType);
	}

	if (tagName === "textarea") {
		return true;
	}

	if (element.getAttribute("contenteditable") === "true") {
		return true;
	}

	return false;
};

export const preventKeyboard: IPreventKeyboard = (
	event: KeyboardEvent,
): void => {
	if (isInputField(event.target as Element)) {
		return;
	}

	const shouldPrevent =
		NAVIGATION_KEYS.has(event.key) || LEGACY_KEY_CODES.has(event.keyCode);

	if (shouldPrevent) {
		event.preventDefault();
	}
};
