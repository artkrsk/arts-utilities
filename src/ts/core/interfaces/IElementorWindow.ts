import type { ElementorEditor, ElementorFrontend } from "@artemsemkin/elementor-types";

/** Window carrying the Elementor globals; this package reads only `elementorFrontend` at runtime */
export interface IElementorWindow extends Window {
	elementorFrontend?: ElementorFrontend;
	elementor?: ElementorEditor;
}
