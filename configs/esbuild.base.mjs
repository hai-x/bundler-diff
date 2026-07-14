import { pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

// Shared esbuild defaults for runtime cases.
const sharedDefaults = {
  bundle: true,
  platform: "node",
  minify: false,
  sourcemap: false,
  entryPoints: { entry: "src/entry.js" },
  outdir: "dist/esbuild",
  format: "cjs",
};

export function createEsbuildConfig(overrides = {}) {
  return { ...sharedDefaults, ...overrides };
}

export function buildEsbuild(overrides = {}) {
  return esbuild.build(createEsbuildConfig(overrides));
}

// run the default build only as the entry point, so a case config can import
// the helpers without triggering it
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await buildEsbuild();
}
