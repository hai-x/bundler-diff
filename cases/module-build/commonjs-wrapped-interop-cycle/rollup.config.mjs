import { createRollupConfig } from "../../../configs/rollup.base.mjs";

// Entry at case root.
export default createRollupConfig({ input: { entry: "index.js" } });
