import type { ElementorEditor, ElementorFrontend } from "@arts/elementor-types";
import { afterAll, beforeAll, vi } from "vitest";

declare global {
	interface Window {
		elementorFrontend?: ElementorFrontend;
		elementor?: ElementorEditor;
	}
}

// Several utilities intentionally `console.warn`/`console.error` on degraded paths;
// silence them so test output only surfaces unexpected logs.
beforeAll(() => {
	vi.spyOn(console, "error").mockImplementation(() => {});
	vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
	vi.restoreAllMocks();
});
