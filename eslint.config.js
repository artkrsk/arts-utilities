import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * ESLint configuration for @arts/utilities
 */
export default defineConfig([
	globalIgnores([
		"dist/",
		"coverage/",
		"coverage-report/",
		"__tests__/",
		"vendor/",
		"src/ts/www", // Dev demo page
	]),
	eslint.configs.recommended,
	tseslint.configs.recommended,
	{
		// Node scripts and tool configs at the repository root
		files: ["*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				console: "readonly",
				process: "readonly",
			},
		},
		rules: {
			"no-console": "off",
		},
	},
	{
		files: ["**/*.ts"],
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-non-null-assertion": "error",
		},
	},
]);
