/**
 * Variant of `preventDefault` that lets nested scrollable elements absorb wheel/touch input
 * when they still have room to scroll. Falls back to a full prevent at the container's scroll boundary.
 */
export const preventDefaultSmart = (event: WheelEvent | TouchEvent): void => {
	const target = event.target as HTMLElement;

	if (!target) {
		event.preventDefault();
		return;
	}

	const scrollableParent = findScrollableParent(target);

	if (scrollableParent) {
		const canScroll = checkScrollCapability(scrollableParent, event);

		if (canScroll) {
			return;
		}
	}

	let stopPropagationError: Error | null = null;

	try {
		event.stopPropagation();
	} catch (error) {
		stopPropagationError = error as Error;
	}

	event.preventDefault();

	if (stopPropagationError) {
		throw stopPropagationError;
	}
};

/**
 * Walks ancestors until it finds one whose computed overflow allows scrolling
 * AND whose scrollable content exceeds its client size. Stops at `body` / `html`.
 */
const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
	let current: HTMLElement | null = element;

	while (
		current &&
		current !== document.body &&
		current !== document.documentElement
	) {
		const style = window.getComputedStyle(current);
		const overflowY = style.overflowY;
		const overflowX = style.overflowX;

		const hasVerticalScroll =
			(overflowY === "scroll" || overflowY === "auto") &&
			current.scrollHeight > current.clientHeight;
		const hasHorizontalScroll =
			(overflowX === "scroll" || overflowX === "auto") &&
			current.scrollWidth > current.clientWidth;

		if (hasVerticalScroll || hasHorizontalScroll) {
			return current;
		}

		current = current.parentElement;
	}

	return null;
};

const checkScrollCapability = (
	element: HTMLElement,
	event: WheelEvent | TouchEvent,
): boolean => {
	if (event instanceof WheelEvent) {
		return checkWheelScroll(element, event);
	} else {
		return checkTouchScroll(element, event);
	}
};

const checkWheelScroll = (element: HTMLElement, event: WheelEvent): boolean => {
	const deltaY = event.deltaY;
	const deltaX = event.deltaX;

	if (Math.abs(deltaY) > Math.abs(deltaX)) {
		if (deltaY < 0) {
			return element.scrollTop > 0;
		} else {
			const scrollBottom = element.scrollHeight - element.clientHeight;
			return element.scrollTop < scrollBottom;
		}
	}

	if (Math.abs(deltaX) > 0) {
		if (deltaX < 0) {
			return element.scrollLeft > 0;
		} else {
			const scrollRight = element.scrollWidth - element.clientWidth;
			return element.scrollLeft < scrollRight;
		}
	}

	return false;
};

// Touch direction requires the starting coordinates, so PageLock registers `captureTouchStart` on touchstart.
let touchStartY = 0;
let touchStartX = 0;

export const captureTouchStart = (event: TouchEvent): void => {
	const touch = event.touches[0];
	if (!touch) {
		return;
	}
	touchStartY = touch.clientY;
	touchStartX = touch.clientX;
};

const checkTouchScroll = (element: HTMLElement, event: TouchEvent): boolean => {
	const touch = event.touches[0];
	if (!touch) {
		return false;
	}

	const deltaY = touchStartY - touch.clientY;
	const deltaX = touchStartX - touch.clientX;

	if (Math.abs(deltaY) > Math.abs(deltaX)) {
		if (deltaY < 0) {
			return element.scrollTop > 0;
		} else {
			const scrollBottom = element.scrollHeight - element.clientHeight;
			return element.scrollTop < scrollBottom;
		}
	}

	if (Math.abs(deltaX) > 0) {
		if (deltaX < 0) {
			return element.scrollLeft > 0;
		} else {
			const scrollRight = element.scrollWidth - element.clientWidth;
			return element.scrollLeft < scrollRight;
		}
	}

	return false;
};
