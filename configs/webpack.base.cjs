const path = require("path");

// Shared webpack defaults for runtime cases.
const sharedOptimization = {
  minimize: false,
  moduleIds: "named",
};

function createWebpackConfig({
  context = process.cwd(),
  entry = { entry: "./src/entry.js" },
  output = {},
  optimization = {},
  ...rest
} = {}) {
  return {
    mode: "production",
    target: "node",
    entry,
    output: {
      pathinfo: "verbose",
      path: path.resolve(context, "dist/webpack"),
      filename: "[name].js",
      clean: true,
      ...output,
    },
    optimization: {
      ...sharedOptimization,
      ...optimization,
    },
    ...rest,
  };
}

module.exports = createWebpackConfig();
