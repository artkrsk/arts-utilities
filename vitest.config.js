import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["__tests__/ts/setup.ts"],
		coverage: {
			include: ["src/ts/**/*.ts"],
			exclude: [
				"src/ts/**/interfaces/*.ts",
				"src/ts/**/types/*.ts",
				"src/ts/**/constants/*.ts",
				"src/ts/www/**/*",
				"**/index.ts", // Barrel files
			],
		},
	},
});
