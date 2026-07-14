import * as esbuild from "esbuild";

// Standalone: importing the base config would trigger its src/entry.js build.
await esbuild.build({
  bundle: true,
  platform: "node",
  format: "cjs",
  minify: false,
  sourcemap: false,
  entryPoints: { entry: "index.js" },
  outdir: "dist/esbuild",
});
