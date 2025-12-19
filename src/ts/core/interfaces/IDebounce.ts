/**
 * Interface for debounce function that creates a debounced version of any function.
 * Debouncing delays function execution until after a specified wait period has elapsed
 * since the last time the debounced function was invoked. Essential for performance
 * optimization with high-frequency events.
 *
 * @example
 * ```typescript
 * // Example 1: Search input debouncing
 * const searchUsers = async (query: string) => {
 *   const response = await fetch(`/api/users?search=${query}`)
 *   return response.json()
 * }
 *
 * const debouncedSearch = debounce(searchUsers, 300)
 *
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value) // Only executes 300ms after user stops typing
 * })
 *
 * // Example 2: Window resize handling
 * const handleResize = () => {
 *   console.log('Resizing to:', window.innerWidth, window.innerHeight)
 *   recalculateLayout()
 * }
 *
 * const debouncedResize = debounce(handleResize, 250)
 * window.addEventListener('resize', debouncedResize)
 *
 * // Example 3: Form validation
 * const validateForm = (formData: FormData) => {
 *   // Expensive validation logic
 *   return validateFields(formData)
 * }
 *
 * const debouncedValidation = debounce(validateForm, 500)
 * form.addEventListener('input', () => {
 *   debouncedValidation(new FormData(form))
 * })
 * ```
 */
export interface IDebounce {
  /**
   * Creates a debounced function that delays invoking the provided function
   * until after 'wait' milliseconds have elapsed since the last invocation.
   *
   * The debounced function:
   * - Cancels any pending execution when called again within the wait period
   * - Preserves the original function's context (this) and arguments
   * - Returns the same type as the original function
   * - Executes only after the wait period has elapsed without new calls
   *
   * @param fn - Function to debounce (any function with any arguments)
   * @param wait - Number of milliseconds to delay execution
   * @returns Debounced function with identical signature to the original
   *
   * @example
   * ```typescript
   * // Basic debouncing
   * const expensiveOperation = (data: any[]) => {
   *   console.log('Processing', data.length, 'items')
   *   return data.map(processItem)
   * }
   *
   * const debouncedOperation = debounce(expensiveOperation, 200)
   *
   * // Rapid calls - only the last one executes
   * debouncedOperation([1, 2, 3]) // Cancelled
   * debouncedOperation([4, 5, 6]) // Cancelled
   * debouncedOperation([7, 8, 9]) // Executes after 200ms
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends (...args: any[]) => any>(fn: T, wait: number): T
}
