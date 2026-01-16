/**
 * Smart preventDefault that allows nested scrolling elements while preventing page scroll.
 *
 * This function checks if the event target is inside a scrollable container and whether
 * that container can still scroll in the intended direction. If so, it allows the scroll.
 * Otherwise, it prevents the event to block page-level scrolling.
 *
 * @param event - The wheel or touch event to potentially prevent
 *
 * @example
 * ```typescript
 * // Allow nested scrolling in modals
 * window.addEventListener('wheel', preventDefaultSmart, { passive: false });
 *
 * // Modal with scrollable content will work
 * <div class="modal" style="overflow-y: scroll;">
 *   <div class="content">Long content...</div>
 * </div>
 * ```
 */
export const preventDefaultSmart = (event: WheelEvent | TouchEvent): void => {
  const target = event.target as HTMLElement

  if (!target) {
    event.preventDefault()
    return
  }

  // Find the nearest scrollable ancestor
  const scrollableParent = findScrollableParent(target)

  if (scrollableParent) {
    // Check if the scrollable parent can still scroll in the intended direction
    const canScroll = checkScrollCapability(scrollableParent, event)

    if (canScroll) {
      // Allow the scroll - don't prevent
      return
    }
  }

  // No scrollable parent or at scroll boundary - prevent to block page scroll
  let stopPropagationError: Error | null = null

  try {
    event.stopPropagation()
  } catch (error) {
    stopPropagationError = error as Error
  }

  event.preventDefault()

  if (stopPropagationError) {
    throw stopPropagationError
  }
}

/**
 * Finds the nearest scrollable ancestor element.
 *
 * Walks up the DOM tree from the target element to find the first element
 * that has overflow scrolling enabled and has scrollable content.
 *
 * @param element - The starting element to search from
 * @returns The scrollable parent element, or null if none found
 */
const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
  let current: HTMLElement | null = element

  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    const overflowX = style.overflowX

    // Check if element has scrollable overflow
    const hasVerticalScroll = (overflowY === 'scroll' || overflowY === 'auto') && current.scrollHeight > current.clientHeight
    const hasHorizontalScroll = (overflowX === 'scroll' || overflowX === 'auto') && current.scrollWidth > current.clientWidth

    if (hasVerticalScroll || hasHorizontalScroll) {
      return current
    }

    current = current.parentElement
  }

  return null
}

/**
 * Checks if a scrollable element can still scroll in the intended direction.
 *
 * Determines the scroll direction from the event and checks if the element
 * has remaining scroll space in that direction.
 *
 * @param element - The scrollable element to check
 * @param event - The wheel or touch event indicating scroll direction
 * @returns True if the element can scroll in the intended direction
 */
const checkScrollCapability = (element: HTMLElement, event: WheelEvent | TouchEvent): boolean => {
  if (event instanceof WheelEvent) {
    return checkWheelScroll(element, event)
  } else {
    return checkTouchScroll(element, event)
  }
}

/**
 * Checks scroll capability for wheel events.
 *
 * @param element - The scrollable element
 * @param event - The wheel event
 * @returns True if element can scroll in the wheel direction
 */
const checkWheelScroll = (element: HTMLElement, event: WheelEvent): boolean => {
  const deltaY = event.deltaY
  const deltaX = event.deltaX

  // Vertical scrolling
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY < 0) {
      // Scrolling up - check if not at top
      return element.scrollTop > 0
    } else {
      // Scrolling down - check if not at bottom
      const scrollBottom = element.scrollHeight - element.clientHeight
      return element.scrollTop < scrollBottom
    }
  }

  // Horizontal scrolling
  if (Math.abs(deltaX) > 0) {
    if (deltaX < 0) {
      // Scrolling left - check if not at left edge
      return element.scrollLeft > 0
    } else {
      // Scrolling right - check if not at right edge
      const scrollRight = element.scrollWidth - element.clientWidth
      return element.scrollLeft < scrollRight
    }
  }

  return false
}

/**
 * Tracks touch start position for calculating scroll direction.
 */
let touchStartY = 0
let touchStartX = 0

/**
 * Stores the touch start position.
 * Should be called in a touchstart event listener.
 *
 * @param event - The touch start event
 */
export const captureTouchStart = (event: TouchEvent): void => {
  const touch = event.touches[0]
  if (!touch) {
    return
  }
  touchStartY = touch.clientY
  touchStartX = touch.clientX
}

/**
 * Checks scroll capability for touch events.
 *
 * @param element - The scrollable element
 * @param event - The touch event
 * @returns True if element can scroll in the touch direction
 */
const checkTouchScroll = (element: HTMLElement, event: TouchEvent): boolean => {
  const touch = event.touches[0]
  if (!touch) {
    return false
  }

  const deltaY = touchStartY - touch.clientY
  const deltaX = touchStartX - touch.clientX

  // Vertical scrolling
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY < 0) {
      // Scrolling up - check if not at top
      return element.scrollTop > 0
    } else {
      // Scrolling down - check if not at bottom
      const scrollBottom = element.scrollHeight - element.clientHeight
      return element.scrollTop < scrollBottom
    }
  }

  // Horizontal scrolling
  if (Math.abs(deltaX) > 0) {
    if (deltaX < 0) {
      // Scrolling left - check if not at left edge
      return element.scrollLeft > 0
    } else {
      // Scrolling right - check if not at right edge
      const scrollRight = element.scrollWidth - element.clientWidth
      return element.scrollLeft < scrollRight
    }
  }

  return false
}
