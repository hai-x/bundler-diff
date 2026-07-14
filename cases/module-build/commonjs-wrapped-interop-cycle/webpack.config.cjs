const base = require("../../../configs/webpack.base.cjs");

// Entry at case root; commonjs concatenation is the behaviour under test.
module.exports = {
  ...base,
  entry: { entry: "./index.js" },
  devtool: false,
  optimization: {
    ...base.optimization,
    concatenateModules: { commonjs: true },
    sideEffects: false,
    usedExports: true,
    chunkIds: "named",
  },
};
