const path = require("path");

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    entry: "./src/entry.js",
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "rspack-dist"),
    filename: "[name].mjs",
    chunkFilename: "[name].mjs",
    chunkFormat: "module",
    module: true,
    clean: true,
  },
  optimization: {
    minimize: false,
    runtimeChunk: "single",
  },
};
