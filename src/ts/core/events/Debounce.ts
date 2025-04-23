import type { IDebounce } from "../interfaces";

/**
 * Creates a debounced function that delays invoking `fn` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the input function
 *
 * @example
 * // Create a debounced function
 * const debouncedResize = debounce(handleResize, 200);
 *
 * // Use the debounced function
 * window.addEventListener('resize', debouncedResize);
 */
export const debounce: IDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): T => {
  let timeout: number | undefined;

  const debounced = function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => fn.apply(this, args), wait);
  } as unknown as T;

  return debounced;
};
