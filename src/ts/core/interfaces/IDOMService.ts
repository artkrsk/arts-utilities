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
   * Checks if an element has a specified attribute.
   * Provides safe attribute existence checking with null handling.
   *
   * @param element - The element to check for the attribute
   * @param attributeName - Name of the attribute to check for
   * @returns Boolean indicating if the attribute exists on the element
   *
   * @example
   * ```typescript
   * // Basic attribute existence check
   * const link = dom.querySelector(document, 'a');
   * const hasHref = dom.hasAttribute(link, 'href');
   * const hasTarget = dom.hasAttribute(link, 'target');
   *
   * // Data attributes existence
   * const element = dom.querySelector(document, '.widget');
   * const hasConfig = dom.hasAttribute(element, 'data-config');
   * const hasId = dom.hasAttribute(element, 'data-widget-id');
   *
   * // Form attributes existence
   * const input = dom.querySelector(form, 'input');
   * const isRequired = dom.hasAttribute(input, 'required');
   * const isDisabled = dom.hasAttribute(input, 'disabled');
   *
   * // Conditional logic based on attribute presence
   * const img = dom.querySelector(document, 'img');
   * if (dom.hasAttribute(img, 'data-src')) {
   *   // Handle lazy loading
   *   const src = dom.getAttribute(img, 'data-src');
   *   img.src = src;
   * }
   *
   * // Validation before processing
   * if (dom.hasAttribute(element, 'aria-label')) {
   *   const label = dom.getAttribute(element, 'aria-label');
   *   updateAccessibilityInfo(label);
   * }
   * ```
   */
  hasAttribute: (element: TElement, attributeName?: string) => boolean

  /**
   * Sets the value of a specified attribute on an element.
   * Provides safe attribute setting with null handling and validation.
   *
   * @param element - The element to set the attribute on
   * @param attributeName - Name of the attribute to set
   * @param value - Value to set for the attribute
   *
   * @example
   * ```typescript
   * // Basic attribute setting
   * const link = dom.querySelector(document, 'a');
   * dom.setAttribute(link, 'href', 'https://example.com');
   * dom.setAttribute(link, 'target', '_blank');
   *
   * // Data attributes
   * const element = dom.querySelector(document, '.widget');
   * dom.setAttribute(element, 'data-config', '{"theme": "dark"}');
   * dom.setAttribute(element, 'data-widget-id', '12345');
   *
   * // Form attributes
   * const input = dom.querySelector(form, 'input[name="email"]');
   * dom.setAttribute(input, 'placeholder', 'Enter your email');
   * dom.setAttribute(input, 'required', '');
   * dom.setAttribute(input, 'aria-describedby', 'email-help');
   *
   * // Accessibility attributes
   * const button = dom.querySelector(document, '.toggle-button');
   * dom.setAttribute(button, 'aria-pressed', 'false');
   * dom.setAttribute(button, 'aria-label', 'Toggle navigation menu');
   *
   * // Dynamic attribute updates
   * const progressBar = dom.querySelector(document, '.progress');
   * dom.setAttribute(progressBar, 'aria-valuenow', progress.toString());
   * dom.setAttribute(progressBar, 'style', `width: ${progress}%`);
   *
   * // Media attributes
   * const img = dom.querySelector(document, 'img');
   * dom.setAttribute(img, 'src', imageUrl);
   * dom.setAttribute(img, 'alt', imageDescription);
   * dom.setAttribute(img, 'loading', 'lazy');
   *
   * // Boolean attributes (use empty string for presence)
   * const input = dom.querySelector(document, 'input');
   * dom.setAttribute(input, 'disabled', ''); // Adds disabled attribute
   * dom.setAttribute(input, 'checked', ''); // Adds checked attribute
   * ```
   */
  setAttribute: (element: TElement, attributeName?: string, value?: string) => void

  /**
   * Gets or sets the HTML content of an element.
   * Provides safe innerHTML manipulation with null handling and XSS protection considerations.
   * When content is provided, sets the innerHTML; when omitted, returns the current innerHTML.
   *
   * @param element - The element to get or set HTML content for
   * @param content - Optional HTML content to set (if omitted, returns current innerHTML)
   * @returns When setting: void; When getting: string content or empty string if element is null
   *
   * @example
   * ```typescript
   * // Getting HTML content
   * const container = dom.querySelector(document, '.content');
   * const currentHtml = dom.html(container);
   * console.log('Current content:', currentHtml);
   *
   * // Setting HTML content
   * const newsSection = dom.querySelector(document, '#news');
   * dom.html(newsSection, '<h2>Breaking News</h2><p>Latest updates...</p>');
   *
   * // Dynamic content updates
   * const messageDiv = dom.querySelector(document, '.message');
   * dom.html(messageDiv, `<span class="success">✓ Operation completed at ${new Date().toLocaleTimeString()}</span>`);
   *
   * // Clear content
   * const sidebar = dom.querySelector(document, '.sidebar');
   * dom.html(sidebar, ''); // Clears all content
   *
   * // Template rendering
   * const userCard = dom.querySelector(document, '.user-card');
   * const userTemplate = `
   *   <div class="user-avatar">
   *     <img src="${user.avatar}" alt="${user.name}">
   *   </div>
   *   <div class="user-info">
   *     <h3>${user.name}</h3>
   *     <p>${user.email}</p>
   *   </div>
   * `;
   * dom.html(userCard, userTemplate);
   *
   * // Conditional content
   * const statusIndicator = dom.querySelector(document, '.status');
   * if (isOnline) {
   *   dom.html(statusIndicator, '<span class="online">● Online</span>');
   * } else {
   *   dom.html(statusIndicator, '<span class="offline">● Offline</span>');
   * }
   *
   * // Note: Always sanitize user-provided content to prevent XSS attacks
   * const userInput = sanitizeHtml(rawUserInput);
   * dom.html(container, userInput);
   * ```
   */
  html: (element: TElement, content?: string) => string | void

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

  /**
   * Creates a new HTML element with the specified tag name.
   * Provides safe element creation with consistent return types.
   *
   * @param tagName - The tag name of the element to create
   * @returns New HTML element of the specified type
   *
   * @example
   * ```typescript
   * // Basic element creation
   * const div = dom.createElement('div');
   * const span = dom.createElement('span');
   * const button = dom.createElement('button');
   *
   * // Create elements with immediate configuration
   * const link = dom.createElement('a');
   * dom.setAttribute(link, 'href', 'https://example.com');
   * dom.setAttribute(link, 'target', '_blank');
   *
   * // Create form elements
   * const input = dom.createElement('input');
   * dom.setAttribute(input, 'type', 'email');
   * dom.setAttribute(input, 'name', 'email');
   * dom.setAttribute(input, 'required', '');
   *
   * // Create multimedia elements
   * const img = dom.createElement('img');
   * dom.setAttribute(img, 'src', 'image.jpg');
   * dom.setAttribute(img, 'alt', 'Description');
   *
   * // Create structured content
   * const article = dom.createElement('article');
   * const header = dom.createElement('header');
   * const title = dom.createElement('h1');
   *
   * dom.html(title, 'Article Title');
   * dom.appendChild(header, title);
   * dom.appendChild(article, header);
   *
   * // Create lists
   * const ul = dom.createElement('ul');
   * const li1 = dom.createElement('li');
   * const li2 = dom.createElement('li');
   *
   * dom.html(li1, 'First item');
   * dom.html(li2, 'Second item');
   * dom.appendChild(ul, li1);
   * dom.appendChild(ul, li2);
   * ```
   */
  createElement: (tagName: string) => HTMLElement

  /**
   * Appends a child element to a parent element.
   * Provides safe element appending with error handling.
   *
   * @param parent - The parent element to append to
   * @param child - The child element to append
   * @returns The appended child element
   *
   * @example
   * ```typescript
   * // Basic element appending
   * const container = dom.querySelector(document, '.container');
   * const newElement = dom.createElement('div');
   * dom.appendChild(container, newElement);
   *
   * // Build complex structures
   * const card = dom.createElement('div');
   * dom.addClass(card, 'card');
   *
   * const cardHeader = dom.createElement('div');
   * dom.addClass(cardHeader, 'card-header');
   * const title = dom.createElement('h3');
   * dom.html(title, 'Card Title');
   * dom.appendChild(cardHeader, title);
   *
   * const cardBody = dom.createElement('div');
   * dom.addClass(cardBody, 'card-body');
   * const content = dom.createElement('p');
   * dom.html(content, 'Card content goes here.');
   * dom.appendChild(cardBody, content);
   *
   * dom.appendChild(card, cardHeader);
   * dom.appendChild(card, cardBody);
   *
   * // Add to page
   * const main = dom.querySelector(document, 'main');
   * dom.appendChild(main, card);
   *
   * // Create forms dynamically
   * const form = dom.createElement('form');
   * const fieldset = dom.createElement('fieldset');
   * const legend = dom.createElement('legend');
   * dom.html(legend, 'User Information');
   * dom.appendChild(fieldset, legend);
   *
   * const emailField = dom.createElement('input');
   * dom.setAttribute(emailField, 'type', 'email');
   * dom.setAttribute(emailField, 'name', 'email');
   * dom.setAttribute(emailField, 'placeholder', 'Enter email');
   * dom.appendChild(fieldset, emailField);
   *
   * const submitBtn = dom.createElement('button');
   * dom.setAttribute(submitBtn, 'type', 'submit');
   * dom.html(submitBtn, 'Submit');
   * dom.appendChild(fieldset, submitBtn);
   *
   * dom.appendChild(form, fieldset);
   *
   * // Create navigation menus
   * const nav = dom.createElement('nav');
   * const ul = dom.createElement('ul');
   *
   * const menuItems = ['Home', 'About', 'Services', 'Contact'];
   * menuItems.forEach(item => {
   *   const li = dom.createElement('li');
   *   const link = dom.createElement('a');
   *   dom.setAttribute(link, 'href', `/${item.toLowerCase()}`);
   *   dom.html(link, item);
   *   dom.appendChild(li, link);
   *   dom.appendChild(ul, li);
   * });
   *
   * dom.appendChild(nav, ul);
   * ```
   */
  appendChild: (parent: TElement, child: TElement) => TElement
}
