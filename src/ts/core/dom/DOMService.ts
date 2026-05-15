import type { IDOMService } from "../interfaces";
import { parseClassNames } from "../strings/StringsUtils";
import type { TElement, TScope } from "../types";

class DOMServiceClass {
	public static querySelector(
		scope: TScope,
		selector: string,
	): TElement | null {
		if (!selector) {
			return null;
		}

		if (!(scope instanceof Element || scope instanceof Document)) {
			return null;
		}
		try {
			return scope.querySelector(selector) as TElement | null;
		} catch (_error) {
			return null;
		}
	}

	public static querySelectorAll(scope: TScope, selector?: string): TElement[] {
		if (!selector) {
			return [];
		}

		try {
			return Array.from(scope.querySelectorAll(selector)) as TElement[];
		} catch (_error) {
			return [];
		}
	}

	public static getAttribute(
		element: Element,
		attributeName?: string,
	): string | null {
		if (!attributeName) {
			return null;
		}

		try {
			return element.getAttribute(attributeName);
		} catch (_error) {
			return null;
		}
	}

	public static hasAttribute(
		element: Element,
		attributeName?: string,
	): boolean {
		if (!attributeName) {
			return false;
		}

		try {
			return element.hasAttribute(attributeName);
		} catch (_error) {
			return false;
		}
	}

	public static setAttribute(
		element: TElement,
		attributeName?: string,
		value?: string,
	): void {
		if (!element || !attributeName || value === undefined) {
			return;
		}

		try {
			element.setAttribute(attributeName, value);
		} catch (_error) {
			// no-op
		}
	}

	public static html(element: TElement, content?: string): string | void {
		if (!element) {
			return content === undefined ? "" : undefined;
		}

		try {
			if (content === undefined) {
				return element.innerHTML;
			} else {
				element.innerHTML = content;
				return undefined;
			}
		} catch (_error) {
			return content === undefined ? "" : undefined;
		}
	}

	public static matches(element: TElement, selector?: string): boolean {
		if (!selector) {
			return false;
		}

		try {
			return element.matches(selector);
		} catch (_error) {
			return false;
		}
	}

	public static contains(container: TElement, element: Element): boolean {
		if (!container || !element) {
			return false;
		}

		try {
			return container.contains(element);
		} catch (_error) {
			return false;
		}
	}

	public static getDocument(): Document {
		return document;
	}

	public static getDocumentElement(): HTMLElement {
		return document.documentElement;
	}

	public static getBodyElement(): HTMLElement {
		return document.body;
	}

	public static addClass(element: TElement, className: string): void {
		if (!element || !className) {
			return;
		}

		try {
			element.classList.add(className);
		} catch (_error) {
			// no-op
		}
	}

	public static removeClass(element: TElement, className: string): void {
		if (!element || !className) {
			return;
		}

		try {
			element.classList.remove(className);
		} catch (_error) {
			// no-op
		}
	}

	public static toggleClass(
		element: TElement,
		className: string,
		force?: boolean,
	): boolean {
		if (!element || !className) {
			return false;
		}

		try {
			return element.classList.toggle(className, force);
		} catch (_error) {
			return false;
		}
	}

	public static toggleClasses(
		element: TElement,
		classNames: string,
		force?: boolean,
	): boolean[] {
		if (!element || !classNames) {
			return [];
		}

		const classes = parseClassNames(classNames);
		const results: boolean[] = [];

		for (const className of classes) {
			try {
				const result = element.classList.toggle(className, force);
				results.push(result);
			} catch (_error) {
				results.push(false);
			}
		}

		return results;
	}

	public static closest(element: TElement, selector: string): TElement | null {
		if (!element || !selector) {
			return null;
		}

		try {
			return element.closest(selector) as TElement | null;
		} catch (_error) {
			return null;
		}
	}

	public static createElement(tagName: string): HTMLElement {
		if (!tagName) {
			throw new Error("Tag name is required");
		}

		try {
			return document.createElement(tagName);
		} catch (error) {
			throw new Error(`Failed to create element with tag name: ${tagName}`, {
				cause: error,
			});
		}
	}

	public static appendChild(parent: TElement, child: TElement): TElement {
		if (!parent || !child) {
			throw new Error("Both parent and child elements are required");
		}

		try {
			return parent.appendChild(child) as TElement;
		} catch (error) {
			throw new Error("Failed to append child element", { cause: error });
		}
	}
}

export const DOMService: IDOMService = {
	querySelector: DOMServiceClass.querySelector,
	querySelectorAll: DOMServiceClass.querySelectorAll,
	getAttribute: DOMServiceClass.getAttribute,
	hasAttribute: DOMServiceClass.hasAttribute,
	setAttribute: DOMServiceClass.setAttribute,
	html: DOMServiceClass.html,
	matches: DOMServiceClass.matches,
	contains: DOMServiceClass.contains,
	getDocument: DOMServiceClass.getDocument,
	getDocumentElement: DOMServiceClass.getDocumentElement,
	getBodyElement: DOMServiceClass.getBodyElement,
	addClass: DOMServiceClass.addClass,
	removeClass: DOMServiceClass.removeClass,
	toggleClass: DOMServiceClass.toggleClass,
	toggleClasses: DOMServiceClass.toggleClasses,
	closest: DOMServiceClass.closest,
	createElement: DOMServiceClass.createElement,
	appendChild: DOMServiceClass.appendChild,
};
