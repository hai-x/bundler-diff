const base = require("../../../configs/rspack.base.cjs");

// Entry lives at the case root instead of src/.
module.exports = {
  ...base,
  entry: { entry: "./index.js" },
  devtool: false,
  optimization: {
    ...base.optimization,
    concatenateModules: true,
    sideEffects: false,
    usedExports: true,
    chunkIds: "named",
  },
};
