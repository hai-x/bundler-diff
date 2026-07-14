import { createRolldownConfig } from "../../../configs/rolldown.base.mjs";

// rolldown no longer bundles CSS and classifies modules by extension, so
// stylesheets imported from JavaScript (antd-mobile) resolve to one empty
// JavaScript module
const EMPTY_STYLESHEET = "\0ignored-stylesheet.js";
const ignoreCss = {
  name: "ignore-css",
  resolveId(id) {
    return id.endsWith(".css") ? EMPTY_STYLESHEET : null;
  },
  load(id) {
    return id === EMPTY_STYLESHEET ? "export default {};" : null;
  },
};

export default [
  createRolldownConfig({ plugins: [ignoreCss] }),
  // the node platform prefers the `main` field, which hands rolldown the
  // CommonJS build of most UI libraries; this build resolves `module` first
  // so the size reflects pruning rather than field order
  createRolldownConfig({
    plugins: [ignoreCss],
    resolve: { mainFields: ["module", "main"] },
    output: { dir: "dist/rolldown-esm" },
  }),
];
