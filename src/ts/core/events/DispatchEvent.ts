import type { IDispatchEvent, IDispatchEventOptions } from "../interfaces";

export const dispatchEvent: IDispatchEvent = <T = unknown>(
	name: string,
	options: IDispatchEventOptions<T> = {},
	target: EventTarget | null = null,
): boolean => {
	if (
		typeof window === "undefined" ||
		typeof window.CustomEvent === "undefined"
	) {
		return false;
	}

	const eventTarget = target || document;

	if (!eventTarget) {
		return false;
	}

	const {
		detail,
		bubbles = true,
		cancelable = true,
		composed = false,
	} = options;

	try {
		const eventInit: CustomEventInit<T> = {
			bubbles,
			cancelable,
			composed,
		};

		// Omit `detail` when undefined so we stay compatible with exactOptionalPropertyTypes.
		if (detail !== undefined) {
			eventInit.detail = detail;
		}

		const customEvent = new window.CustomEvent(name, eventInit);

		return eventTarget.dispatchEvent(customEvent);
	} catch (error) {
		return false;
	}
};
