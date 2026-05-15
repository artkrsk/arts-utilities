import type { TElement, TScope } from "../types";

/**
 * Null-safe wrappers over the native DOM API.
 *
 * Each method validates its inputs and traps native throws (e.g. invalid selectors),
 * returning safe defaults (`null`, `false`, `[]`, or no-op) rather than propagating errors.
 * `createElement` and `appendChild` are the exceptions — they throw when given missing arguments.
 */
export interface IDOMService {
	/** `null` when `selector` is empty, `scope` is not an Element/Document, or `querySelector` throws. */
	querySelector: (scope: TScope, selector: string) => TElement | null;

	/** Returns `[]` when `selector` is omitted or `querySelectorAll` throws. */
	querySelectorAll: (scope: TScope, selector?: string) => TElement[];

	/** Returns `null` when `attributeName` is omitted or `getAttribute` throws. */
	getAttribute: (element: TElement, attributeName?: string) => string | null;

	hasAttribute: (element: TElement, attributeName?: string) => boolean;

	/** No-op when `element`, `attributeName`, or `value` is missing. */
	setAttribute: (
		element: TElement,
		attributeName?: string,
		value?: string,
	) => void;

	/**
	 * Getter when `content` is omitted, setter otherwise.
	 * As a getter, returns `""` when the element is null or `innerHTML` throws.
	 */
	html: (element: TElement, content?: string) => string | void;

	matches: (element: TElement, selector?: string) => boolean;

	contains: (container: TElement, element: TElement) => boolean;

	getDocumentElement: () => HTMLElement;

	getDocument: () => Document;

	getBodyElement: () => HTMLElement;

	addClass: (element: TElement, className: string) => void;

	removeClass: (element: TElement, className: string) => void;

	/** Returns whether the class is present after the toggle, or `false` on failure. */
	toggleClass: (
		element: TElement,
		className: string,
		force?: boolean,
	) => boolean;

	/**
	 * Splits `classNames` on spaces (leading dots are stripped), then toggles each class.
	 * Returns one boolean per class, in input order.
	 */
	toggleClasses: (
		element: TElement,
		classNames: string,
		force?: boolean,
	) => boolean[];

	closest: (element: TElement, selector: string) => TElement | null;

	/** Throws when `tagName` is empty or `document.createElement` rejects the name. */
	createElement: (tagName: string) => HTMLElement;

	/** Throws when either argument is missing or `appendChild` throws. */
	appendChild: (parent: TElement, child: TElement) => TElement;
}
