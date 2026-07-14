import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { createRollupConfig } from "../../../configs/rollup.base.mjs";

// stylesheets imported from JavaScript (antd-mobile) become empty modules
const ignoreCss = {
  name: "ignore-css",
  resolveId(id) {
    return id.endsWith(".css") ? `\0css:${id}` : null;
  },
  load(id) {
    return id.startsWith("\0css:") ? "export default {};" : null;
  },
};

export default createRollupConfig({
  plugins: [
    nodeResolve({ preferBuiltins: true, exportConditions: ["node"] }),
    // axios reaches mime-db's JSON table
    json(),
    ignoreCss,
  ],
});
