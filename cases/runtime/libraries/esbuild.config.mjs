import { buildEsbuild } from "../../../configs/esbuild.base.mjs";

// `platform: "node"` prefers the `main` field, which hands esbuild the CommonJS
// build of most UI libraries; the second build resolves `module` first so the
// size reflects pruning rather than field order
await buildEsbuild();
await buildEsbuild({
  outdir: "dist/esbuild-esm",
  mainFields: ["module", "main"],
});
