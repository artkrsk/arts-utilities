import { build as esbuild } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build as vite } from "vite";

/**
 * Builds dist/: type declarations, ESM (one file per module), and the minified
 * CJS and UMD bundles. `--production` drops sourcemaps and console calls.
 */
const production = process.argv.includes("--production");

const entry = "src/ts/index.ts";
const globalName = "ArtsUtilities";

rmSync("dist", { recursive: true, force: true });

execFileSync(
	process.execPath,
	[
		fileURLToPath(import.meta.resolve("typescript/bin/tsc")),
		"--emitDeclarationOnly",
	],
	{ stdio: "inherit" },
);

await vite({
	configFile: false,
	mode: "production",
	build: {
		lib: { entry, formats: ["es"], fileName: () => "index.mjs" },
		sourcemap: !production,
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: production,
				passes: 2,
				pure_getters: true,
				unsafe: true,
				toplevel: true,
			},
			mangle: { module: true },
			format: { comments: false, ecma: 2020 },
		},
		emptyOutDir: false,
		rolldownOptions: {
			output: {
				minifyInternalExports: true,
				preserveModules: true,
				preserveModulesRoot: "src/ts",
				entryFileNames: ({ name }) => `${name.replace(/^src\/ts\//, "")}.mjs`,
			},
		},
	},
});

// The entry goes in through stdin: as a file, esbuild prefixes the CJS and UMD
// bundles with "use strict", which they have never had.
const bundle = {
	stdin: {
		contents: readFileSync(entry, "utf8"),
		loader: "ts",
		resolveDir: resolve(dirname(entry)),
	},
	bundle: true,
	sourcemap: !production,
	minify: true,
	legalComments: "none",
	target: "es2020",
	drop: production ? ["console"] : [],
};

await esbuild({ ...bundle, format: "cjs", outfile: "dist/index.cjs" });

await esbuild({
	...bundle,
	format: "iife",
	globalName,
	outfile: "dist/index.umd.js",
	banner: {
		js: `(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global=typeof globalThis!=='undefined'?globalThis:global||self,global.${globalName}=factory());})(this,function(){`,
	},
	footer: { js: "});" },
});
