import * as esbuild from "esbuild";

// Standalone: importing the base config would trigger its src/entry.js build.
// ESM output; top-level await is not allowed in cjs.
await esbuild.build({
	bundle: true,
	platform: "node",
	format: "esm",
	minify: false,
	sourcemap: false,
	entryPoints: { entry: "index.js" },
	outdir: "dist/esbuild",
});
