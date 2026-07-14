import { createRolldownConfig } from "../../../configs/rolldown.base.mjs";

// Entry at case root.
export default createRolldownConfig({
  input: { entry: "index.js" },
  output: { dir: "dist/rolldown", format: "cjs", minify: false },
});
