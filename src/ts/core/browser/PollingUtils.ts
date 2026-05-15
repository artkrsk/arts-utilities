import type { IWaitForVariableOptions } from "../interfaces";

export const waitForVariable = async (
	variable: string,
	options: IWaitForVariableOptions = {},
): Promise<unknown> => {
	const { checkingInterval = 20, timeout = 10000 } = options;

	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof (window as any)[variable] !== "undefined") {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			resolve((window as any)[variable]);
			return;
		}

		const ticker = setInterval(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (typeof (window as any)[variable] !== "undefined") {
				clearInterval(ticker);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				resolve((window as any)[variable]);
			}
		}, checkingInterval);

		setTimeout(() => {
			clearInterval(ticker);
			reject(
				new Error(
					`Global variable "window.${variable}" is still not defined after ${timeout}ms.`,
				),
			);
		}, timeout);
	});
};
