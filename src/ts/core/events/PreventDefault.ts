import type { IPreventDefault } from "../interfaces";

export const preventDefault: IPreventDefault = (event: {
	preventDefault(): void;
	stopPropagation(): void;
}): void => {
	let stopPropagationError: Error | null = null;

	try {
		event.stopPropagation();
	} catch (error) {
		stopPropagationError = error as Error;
	}

	event.preventDefault();

	// preventDefault still runs even when stopPropagation threw — surface the error afterwards.
	if (stopPropagationError) {
		throw stopPropagationError;
	}
};
