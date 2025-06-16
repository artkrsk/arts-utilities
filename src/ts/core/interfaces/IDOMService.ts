import type { TScope, TElement } from '../types'

/**
 * Interface for comprehensive DOM operations service providing type-safe element manipulation.
 * Abstracts common DOM operations with consistent error handling, null safety, and performance optimization.
 * Serves as a foundation for component libraries, frameworks, and utilities requiring reliable DOM access.
 *
 * @example
 * ```typescript
 * // Service initialization and basic usage
 * const dom: IDOMService = new DOMService();
 *
 * // Query operations
 * const header = dom.querySelector(document, '.site-header');
 * const navItems = dom.querySelectorAll(header, '.nav-item');
 *
 * // Class manipulation
 * navItems.forEach(item => {
 *   dom.addClass(item, 'nav-item--styled');
 * });
 *
 * // Conditional operations
 * const sidebar = dom.querySelector(document, '.sidebar');
 * if (sidebar && dom.matches(sidebar, '.sidebar--collapsible')) {
 *   dom.toggleClass(sidebar, 'sidebar--collapsed');
 * }
 * ```
 */
export interface IDOMService {
  /**
   * Finds a single element by CSS selector within the specified scope.
   * Provides null-safe element querying with consistent return types.
   *
   * @param scope - The scope to search within (Document, Element, or DocumentFragment)
   * @param selector - CSS selector string to match elements
   * @returns The first matching element or null if not found
   *
   * @example
   * ```typescript
   * // Document scope queries
   * const modal = dom.querySelector(document, '#modal');
   * const firstButton = dom.querySelector(document, 'button');
   *
   * // Element scope queries
   * const form = dom.querySelector(document, 'form');
   * const submitButton = dom.querySelector(form, 'button[type="submit"]');
   *
   * // Complex selectors
   * const activeTab = dom.querySelector(document, '.tabs .tab.active');
   * const lastChild = dom.querySelector(container, ':last-child');
   *
   * // Safe chaining with null checks
   * const container = dom.querySelector(document, '.container');
   * const nested = container ? dom.querySelector(container, '.nested') : null;
   * ```
   */
  querySelector: (scope: TScope, selector: string) => TElement | null

  /**
   * Finds multiple elements by CSS selector within the specified scope.
   * Returns an array of elements for consistent iteration and manipulation.
   *
   * @param scope - The scope to search within (Document, Element, or DocumentFragment)
   * @param selector - CSS selector string to match elements (optional for getting all children)
   * @returns Array of matching elements (empty array if none found)
   *
   * @example
   * ```typescript
   * // Get all elements of a type
   * const allImages = dom.querySelectorAll(document, 'img');
   * const allButtons = dom.querySelectorAll(form, 'button');
   *
   * // Class-based selections
   * const cards = dom.querySelectorAll(document, '.card');
   * const visibleCards = dom.querySelectorAll(document, '.card:not(.hidden)');
   *
   * // Attribute-based selections
   * const lazyImages = dom.querySelectorAll(document, 'img[data-src]');
   * const requiredFields = dom.querySelectorAll(form, 'input[required]');
   *
   * // Get all children (no selector)
   * const allChildren = dom.querySelectorAll(container);
   *
   * // Iteration with type safety
   * const menuItems = dom.querySelectorAll(nav, '.menu-item');
   * menuItems.forEach(item => {
   *   dom.addClass(item, 'processed');
   * });
   * ```
   */
  querySelectorAll: (scope: TScope, selector?: string) => TElement[]

  /**
   * Retrieves the value of a specified attribute from an element.
   * Provides safe attribute access with null handling.
   *
   * @param element - The element to get the attribute from
   * @param attributeName - Name of the attribute to retrieve (optional for getting all attributes)
   * @returns The attribute value as string, or null if not found
   *
   * @example
   * ```typescript
   * // Basic attribute retrieval
   * const link = dom.querySelector(document, 'a');
   * const href = dom.getAttribute(link, 'href');
   * const target = dom.getAttribute(link, 'target');
   *
   * // Data attributes
   * const element = dom.querySelector(document, '.widget');
   * const config = dom.getAttribute(element, 'data-config');
   * const id = dom.getAttribute(element, 'data-widget-id');
   *
   * // Form attributes
   * const input = dom.querySelector(form, 'input[name="email"]');
   * const value = dom.getAttribute(input, 'value');
   * const placeholder = dom.getAttribute(input, 'placeholder');
   *
   * // Conditional attribute handling
   * const img = dom.querySelector(document, 'img');
   * const alt = dom.getAttribute(img, 'alt') || 'No description';
   * const isLazy = dom.getAttribute(img, 'loading') === 'lazy';
   * ```
   */
  getAttribute: (element: TElement, attributeName?: string) => string | null

  /**
   * Checks if an element matches a given CSS selector.
   * Useful for conditional logic and element classification.
   *
   * @param element - The element to test
   * @param selector - CSS selector to match against (optional for general element check)
   * @returns Boolean indicating if the element matches the selector
   *
   * @example
   * ```typescript
   * // Element type checking
   * const isButton = dom.matches(element, 'button');
   * const isInput = dom.matches(element, 'input, textarea, select');
   *
   * // Class checking
   * const isActive = dom.matches(tab, '.tab.active');
   * const isHidden = dom.matches(element, '.hidden, .invisible');
   *
   * // State checking
   * const isDisabled = dom.matches(button, ':disabled');
   * const isFocused = dom.matches(input, ':focus');
   *
   * // Event delegation
   * document.addEventListener('click', (event) => {
   *   const target = event.target as Element;
   *   if (dom.matches(target, '.delete-button')) {
   *     handleDelete(target);
   *   } else if (dom.matches(target, '.edit-button')) {
   *     handleEdit(target);
   *   }
   * });
   * ```
   */
  matches: (element: TElement, selector?: string) => boolean

  /**
   * Checks if a container element contains another element.
   * Useful for determining element relationships and event delegation.
   *
   * @param container - The potential container element
   * @param element - The element to check for containment
   * @returns Boolean indicating if container contains element
   *
   * @example
   * ```typescript
   * // Modal containment check
   * const modal = dom.querySelector(document, '.modal');
   * const clickedElement = event.target as Element;
   * const isInsideModal = dom.contains(modal, clickedElement);
   *
   * // Form validation scope
   * const form = dom.querySelector(document, '#user-form');
   * const field = dom.querySelector(document, '#email');
   * const isFormField = dom.contains(form, field);
   *
   * // Component boundary detection
   * const component = dom.querySelector(document, '.component');
   * const button = event.target as Element;
   * if (dom.contains(component, button)) {
   *   handleComponentClick(button);
   * }
   * ```
   */
  contains: (container: TElement, element: TElement) => boolean

  /**
   * Gets the document's root html element.
   * Provides consistent access to the document element across different contexts.
   *
   * @returns The document's html element
   *
   * @example
   * ```typescript
   * // Theme class management
   * const html = dom.getDocumentElement();
   * dom.addClass(html, 'dark-theme');
   *
   * // Language attribute access
   * const lang = dom.getAttribute(html, 'lang');
   *
   * // Document-level event handling
   * html.addEventListener('keydown', handleGlobalKeydown);
   * ```
   */
  getDocumentElement: () => HTMLElement

  /**
   * Gets the document object.
   * Provides consistent access to the global document object for DOM operations.
   *
   * @returns The global document object
   *
   */
  getDocument: () => Document

  /**
   * Gets the document's body element.
   * Provides consistent access to the body element for global operations.
   *
   * @returns The document's body element
   *
   * @example
   * ```typescript
   * // Global class management
   * const body = dom.getBodyElement();
   * dom.addClass(body, 'page-loaded');
   * dom.toggleClass(body, 'sidebar-open');
   *
   * // Scroll prevention
   * dom.addClass(body, 'no-scroll');
   *
   * // Loading states
   * dom.addClass(body, 'loading');
   * // ... after content loads
   * dom.removeClass(body, 'loading');
   * ```
   */
  getBodyElement: () => HTMLElement

  /**
   * Adds a CSS class to an element.
   * Provides safe class addition with duplicate prevention.
   *
   * @param element - The element to add the class to
   * @param className - The CSS class name to add
   *
   * @example
   * ```typescript
   * // State management
   * dom.addClass(button, 'loading');
   * dom.addClass(modal, 'visible');
   *
   * // Animation classes
   * dom.addClass(element, 'fade-in');
   * dom.addClass(card, 'slide-up');
   *
   * // Status indicators
   * dom.addClass(form, 'validated');
   * dom.addClass(field, 'error');
   * ```
   */
  addClass: (element: TElement, className: string) => void

  /**
   * Removes a CSS class from an element.
   * Provides safe class removal with non-existence handling.
   *
   * @param element - The element to remove the class from
   * @param className - The CSS class name to remove
   *
   * @example
   * ```typescript
   * // State cleanup
   * dom.removeClass(button, 'loading');
   * dom.removeClass(modal, 'visible');
   *
   * // Error state clearing
   * dom.removeClass(field, 'error');
   * dom.removeClass(form, 'invalid');
   *
   * // Animation cleanup
   * dom.removeClass(element, 'fade-in');
   * ```
   */
  removeClass: (element: TElement, className: string) => void

  /**
   * Toggles a CSS class on an element with optional force parameter.
   * Provides conditional class manipulation with explicit control.
   *
   * @param element - The element to toggle the class on
   * @param className - The CSS class name to toggle
   * @param force - Optional boolean to force add (true) or remove (false)
   * @returns Boolean indicating if the class is present after toggling
   *
   * @example
   * ```typescript
   * // Simple toggle
   * const isExpanded = dom.toggleClass(accordion, 'expanded');
   *
   * // Conditional toggle based on state
   * const isOpen = dom.toggleClass(menu, 'open', shouldOpen);
   *
   * // Toggle with return value usage
   * const isDarkMode = dom.toggleClass(body, 'dark-mode');
   * updateThemeIcon(isDarkMode);
   *
   * // Interactive elements
   * button.addEventListener('click', () => {
   *   const isActive = dom.toggleClass(button, 'active');
   *   button.setAttribute('aria-pressed', isActive.toString());
   * });
   * ```
   */
  toggleClass: (element: TElement, className: string, force?: boolean) => boolean

  /**
   * Toggles multiple CSS classes on an element with optional force parameter.
   * Enables efficient manipulation of multiple classes simultaneously.
   *
   * @param element - The element to toggle classes on
   * @param classNames - Space-separated string of class names to toggle
   * @param force - Optional boolean to force add (true) or remove (false) all classes
   * @returns Array of booleans indicating presence of each class after toggling
   *
   * @example
   * ```typescript
   * // Toggle multiple animation classes
   * const states = dom.toggleClasses(element, 'fade-in slide-up scale-up');
   * const [fadeIn, slideUp, scaleUp] = states;
   *
   * // Conditional multi-class toggle
   * const shouldActivate = userIsLoggedIn();
   * dom.toggleClasses(nav, 'user-logged-in premium-features', shouldActivate);
   *
   * // Interactive state management
   * const results = dom.toggleClasses(card, 'highlighted selected featured');
   * updateCardAppearance(results);
   *
   * // Theme switching with multiple classes
   * const [dark, contrast, large] = dom.toggleClasses(
   *   body,
   *   'dark-theme high-contrast large-text',
   *   userPreferences.accessibility
   * );
   * ```
   */
  toggleClasses: (element: TElement, classNames: string, force?: boolean) => boolean[]

  /**
   * Finds the closest ancestor element that matches the given selector.
   * Traverses up the DOM tree to find matching parent elements.
   *
   * @param element - The starting element to search from
   * @param selector - CSS selector to match ancestors against
   * @returns The closest matching ancestor element or null if not found
   *
   * @example
   * ```typescript
   * // Event delegation with closest
   * document.addEventListener('click', (event) => {
   *   const target = event.target as Element;
   *   const card = dom.closest(target, '.card');
   *   if (card) {
   *     handleCardClick(card);
   *   }
   * });
   *
   * // Form field validation
   * const field = event.target as Element;
   * const fieldGroup = dom.closest(field, '.field-group');
   * const form = dom.closest(field, 'form');
   *
   * // Component boundary detection
   * const button = dom.querySelector(document, '.action-button');
   * const component = dom.closest(button, '.component');
   * const section = dom.closest(button, '.section');
   *
   * // Navigation hierarchy
   * const link = event.target as Element;
   * const menuItem = dom.closest(link, '.menu-item');
   * const menu = dom.closest(link, '.menu');
   * ```
   */
  closest: (element: TElement, selector: string) => TElement | null
}
