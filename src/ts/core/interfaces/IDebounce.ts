/**
 * Interface for debounce function
 * Creates a function that delays invoking the provided function until after 'wait' milliseconds
 * have elapsed since the last time the debounced function was invoked
 */
export interface IDebounce {
  /**
   * Creates a debounced function
   * @param fn - Function to debounce
   * @param wait - Number of milliseconds to delay
   * @returns Debounced function
   */
  <T extends (...args: any[]) => any>(fn: T, wait: number): T
}
