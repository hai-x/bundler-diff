import { createRolldownConfig } from "../../../configs/rolldown.base.mjs";

export default createRolldownConfig({
	platform: "browser",
	output: { dir: "dist/rolldown", format: "esm", minify: false },
});
