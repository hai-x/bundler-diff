import * as esbuild from "esbuild";

// Standalone: importing the base config would trigger its node-platform build.
await esbuild.build({
	bundle: true,
	platform: "browser",
	format: "esm",
	minify: false,
	sourcemap: false,
	entryPoints: { entry: "src/entry.js" },
	outdir: "dist/esbuild",
});
