/**
 * Nominal-typing helper. The `__brand` phantom field prevents structurally-equivalent
 * values from being assigned to each other without an explicit cast.
 */
export type TBrand<K, T> = K & { __brand: T };

/** Branded string for URI/URL values. */
export type TURI = TBrand<string, "URI">;

/** Branded string for CSS selector values. */
export type TSelector = TBrand<string, "Selector">;

/** Branded string for HTML attribute names. */
export type TAttributeName = TBrand<string, "AttributeName">;

/** Accepted scope for DOM queries — anything with `querySelector`/`querySelectorAll`. */
export type TScope = Element | Document;

/**
 * DOM elements accepted by the DOM helpers. `Element` covers SVG and other non-HTML nodes;
 * `HTMLElement` is the richer subtype for ordinary HTML.
 */
export type TElement = HTMLElement | Element;
