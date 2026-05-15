/**
 * Reliable replacement for `instanceof HTMLElement` that survives cross-iframe contexts
 * (Elementor's editor preview creates DOM nodes in a different window, so `instanceof` against
 * the parent's `HTMLElement` returns false).
 *
 * Walks the prototype chain looking for `constructor.name === typeName`.
 * When `typeName === "Element"`, also accepts any node whose `nodeType === 1`.
 */
export function isHTMLElement(
	subject: unknown,
	typeName = "Element",
): subject is HTMLElement {
	if (!subject || typeof subject !== "object") {
		return false;
	}

	let proto = Object.getPrototypeOf(subject);

	while (proto !== null) {
		if (proto.constructor && proto.constructor.name === typeName) {
			return true;
		}

		if (
			typeName === "Element" &&
			(subject as { nodeType?: number }).nodeType === 1
		) {
			return true;
		}

		proto = Object.getPrototypeOf(proto);
	}

	return false;
}
