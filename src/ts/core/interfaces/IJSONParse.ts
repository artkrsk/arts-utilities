/**
 * Interface for JSON parsing utility
 */
export interface IJSONParse {
  (text: string): Record<string, any>;
}
