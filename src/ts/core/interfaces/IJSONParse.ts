/**
 * Parses a JSON string with tolerance for unquoted keys and single quotes.
 * Tries `JSON.parse` first; on failure, falls back to a relaxed parser that handles
 * the loose formats commonly seen in HTML `data-*` attributes. Returns `{}` on total failure rather than throwing.
 */
export interface IJSONParse {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(text: string): Record<string, any>;
}
