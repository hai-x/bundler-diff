const path = require("path");

// Shared rspack defaults for runtime cases.
const sharedOptimization = {
  minimize: false,
  moduleIds: "named",
};

function createRspackConfig({
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
      path: path.resolve(context, "dist/rspack"),
      filename: "[name].js",
      clean: true,
      ...output,
    },
    optimization: {
      ...sharedOptimization,
      ...optimization,
    },
    ...rest,
    cache: {
      type: "persistent",
    },
  };
}

module.exports = createRspackConfig();
