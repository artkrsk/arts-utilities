/**
 * Branded type utility for creating nominal types in TypeScript.
 * Branded types help prevent accidental substitution of one string/value for another.
 *
 * @template K - The base type to brand
 * @template T - The brand identifier (literal string type)
 *
 * @example
 * ```typescript
 * type UserId = TBrand<string, 'UserId'>
 * type ProductId = TBrand<string, 'ProductId'>
 *
 * const userId: UserId = 'user-123' as UserId
 * const productId: ProductId = 'prod-456' as ProductId
 *
 * // This would cause a TypeScript error:
 * // const mixedUp: UserId = productId // Error!
 * ```
 */
export type TBrand<K, T> = K & { __brand: T }

/**
 * Branded string type for URI/URL values.
 * Helps ensure URI strings are properly validated before use.
 *
 * @example
 * ```typescript
 * const apiEndpoint: TURI = 'https://api.example.com/v1' as TURI
 * const relativePath: TURI = '/users/profile' as TURI
 *
 * function fetchData(uri: TURI) {
 *   // Safe to use as URI since type guarantees it's been validated
 *   return fetch(uri)
 * }
 * ```
 */
export type TURI = TBrand<string, 'URI'>

/**
 * Branded string type for CSS selector values.
 * Ensures selector strings are properly formatted and validated.
 *
 * @example
 * ```typescript
 * const buttonSelector: TSelector = '.btn-primary' as TSelector
 * const idSelector: TSelector = '#main-content' as TSelector
 *
 * function selectElement(selector: TSelector): Element | null {
 *   // Safe to use as selector since type guarantees proper format
 *   return document.querySelector(selector)
 * }
 * ```
 */
export type TSelector = TBrand<string, 'Selector'>

/**
 * Branded string type for HTML attribute names.
 * Helps prevent typos and ensures attribute names are valid.
 *
 * @example
 * ```typescript
 * const dataAttr: TAttributeName = 'data-testid' as TAttributeName
 * const ariaAttr: TAttributeName = 'aria-label' as TAttributeName
 *
 * function getAttribute(element: Element, attr: TAttributeName): string | null {
 *   // Safe to use as attribute name since type guarantees validity
 *   return element.getAttribute(attr)
 * }
 *
 * function hasAttribute(element: Element, attr: TAttributeName): boolean {
 *   // Safe to use as attribute name since type guarantees validity
 *   return element.hasAttribute(attr)
 * }
 *
 * function setAttribute(element: Element, attr: TAttributeName, value: string): void {
 *   // Safe to use as attribute name since type guarantees validity
 *   element.setAttribute(attr, value)
 * }
 * ```
 */
export type TAttributeName = TBrand<string, 'AttributeName'>

/**
 * Union type representing valid DOM scopes for element queries.
 * Can be either a specific Element or the entire Document.
 *
 * @example
 * ```typescript
 * function findElements(scope: TScope, selector: string): Element[] {
 *   return Array.from(scope.querySelectorAll(selector))
 * }
 *
 * // Usage examples:
 * const inDocument = findElements(document, '.button')
 * const inContainer = findElements(containerElement, '.item')
 * ```
 */
export type TScope = Element | Document

/**
 * Union type for DOM elements that can be either HTMLElement or generic Element.
 * HTMLElement provides richer API surface, while Element covers SVG and other non-HTML elements.
 *
 * @example
 * ```typescript
 * function addClickHandler(element: TElement, handler: () => void): void {
 *   element.addEventListener('click', handler)
 * }
 *
 * // Works with both HTML and SVG elements:
 * const button = document.querySelector('button') // HTMLButtonElement
 * const svgRect = document.querySelector('rect') // SVGRectElement
 * addClickHandler(button, () => console.log('HTML button clicked'))
 * addClickHandler(svgRect, () => console.log('SVG rect clicked'))
 * ```
 */
export type TElement = HTMLElement | Element
