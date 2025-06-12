import type { IDebounce } from '../interfaces'

/**
 * Creates a debounced function that delays execution until after a specified wait period
 * has elapsed since the last invocation. This is essential for performance optimization
 * when dealing with high-frequency events like scrolling, resizing, or typing.
 *
 * The debounced function will:
 * - Cancel any pending execution when called again within the wait period
 * - Preserve the original function's context (this) and arguments
 * - Execute only after the wait period has elapsed without new calls
 * - Return the same type as the original function
 *
 * @param fn - The function to debounce (any function with any arguments)
 * @param wait - The delay in milliseconds before the function executes
 * @returns A debounced version of the input function with identical signature
 *
 * @example
 * ```typescript
 * // Example 1: Debounce resize handler for performance
 * const handleResize = () => {
 *   console.log('Window resized!');
 *   recalculateLayout();
 * };
 *
 * const debouncedResize = debounce(handleResize, 250);
 * window.addEventListener('resize', debouncedResize);
 * // handleResize will only execute 250ms after the last resize event
 *
 * // Example 2: Debounce search input for API efficiency
 * const searchUsers = async (query: string) => {
 *   const response = await fetch(`/api/search?q=${query}`);
 *   return response.json();
 * };
 *
 * const debouncedSearch = debounce(searchUsers, 300);
 *
 * // In an input handler:
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 * // API call only happens 300ms after user stops typing
 *
 * // Example 3: Debounce expensive calculations
 * const calculateComplexData = (data: number[]) => {
 *   // Expensive operation
 *   return data.reduce((sum, val) => sum + Math.sqrt(val), 0);
 * };
 *
 * const debouncedCalculation = debounce(calculateComplexData, 100);
 *
 * // Rapid calls will be batched
 * debouncedCalculation([1, 2, 3]); // Cancelled
 * debouncedCalculation([4, 5, 6]); // Cancelled
 * debouncedCalculation([7, 8, 9]); // Executes after 100ms
 *
 * // Example 4: Debounce with preserved context
 * class DataProcessor {
 *   private data: any[] = [];
 *
 *   processData(newData: any[]) {
 *     this.data = [...this.data, ...newData];
 *     console.log('Processing', this.data.length, 'items');
 *   }
 *
 *   constructor() {
 *     // Context (this) is preserved in debounced method
 *     this.debouncedProcess = debounce(this.processData.bind(this), 500);
 *   }
 *
 *   debouncedProcess: (data: any[]) => void;
 * }
 * ```
 */
export const debounce: IDebounce = <T extends (...args: any[]) => any>(fn: T, wait: number): T => {
  let timeout: number | undefined

  const debounced = function (this: any, ...args: any[]) {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => fn.apply(this, args), wait)
  } as unknown as T

  return debounced
}
