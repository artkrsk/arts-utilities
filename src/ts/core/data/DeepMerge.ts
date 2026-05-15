import type { IDeepMerge, IDeepMergeAll } from "../interfaces";

export const deepmerge: IDeepMerge = <
	T extends Record<string, unknown>,
	U extends Record<string, unknown>,
>(
	target: T,
	source: U,
): T & U => {
	const output = { ...target } as T & U;

	if (!source || typeof source !== "object" || Array.isArray(source)) {
		return output;
	}

	Object.keys(source).forEach((key) => {
		const targetValue = target[key as keyof T];
		const sourceValue = source[key as keyof U];

		/* eslint-disable @typescript-eslint/no-explicit-any */
		if (
			targetValue &&
			sourceValue &&
			typeof targetValue === "object" &&
			typeof sourceValue === "object" &&
			!Array.isArray(targetValue) &&
			!Array.isArray(sourceValue)
		) {
			output[key as keyof (T & U)] = deepmerge(
				targetValue as any,
				sourceValue as any,
			) as any;
		} else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			output[key as keyof (T & U)] = [...targetValue, ...sourceValue] as any;
		} else if (sourceValue !== undefined) {
			output[key as keyof (T & U)] = sourceValue as any;
		}
		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	return output;
};

export const deepmergeAll: IDeepMergeAll = <
	T extends Record<string, unknown>[],
>(
	...objects: T
): Record<string, unknown> => {
	return objects.reduce((result, current) => {
		return deepmerge(result, current);
	}, {});
};
