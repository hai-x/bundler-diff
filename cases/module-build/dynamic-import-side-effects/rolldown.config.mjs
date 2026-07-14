import { createRolldownConfig } from "../../../configs/rolldown.base.mjs";

// Entry at case root; esm output for top-level await.
export default createRolldownConfig({
	input: { entry: "index.js" },
	output: { dir: "dist/rolldown", format: "esm", minify: false },
});
