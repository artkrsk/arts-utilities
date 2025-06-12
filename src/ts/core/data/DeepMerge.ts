import type { IDeepMerge, IDeepMergeAll } from '../interfaces'

/**
 * Deeply merges two objects together
 * @param target The target object to merge into
 * @param source The source object to merge from
 * @returns A new object with merged properties
 */
export const deepmerge: IDeepMerge = <T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U
): T & U => {
  const output = { ...target } as T & U

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return output
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key as keyof T]
    const sourceValue = source[key as keyof U]

    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === 'object' &&
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      // If both values are objects, merge them recursively
      output[key as keyof (T & U)] = deepmerge(targetValue, sourceValue)
    } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // If both are arrays, concatenate them
      output[key as keyof (T & U)] = [...targetValue, ...sourceValue] as any
    } else if (sourceValue !== undefined) {
      // Otherwise just take the source value
      output[key as keyof (T & U)] = sourceValue
    }
  })

  return output
}

/**
 * Deeply merges multiple objects together
 * @param objects Objects to merge
 * @returns A new object with all properties merged
 */
export const deepmergeAll: IDeepMergeAll = <T extends Record<string, any>[]>(
  ...objects: T
): Record<string, any> => {
  return objects.reduce((result, current) => {
    return deepmerge(result, current)
  }, {})
}
