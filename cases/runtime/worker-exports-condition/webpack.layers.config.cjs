const path = require("path");
const base = require("../../../configs/webpack.base.cjs");

// Layers workaround: mark the worker graph root via `dependency: "worker"`,
// let the layer inherit transitively, resolve that layer with `worker` first.
// A rule-only variant (`dependency: "worker"` + `resolve`, no layers) fixes
// direct imports only: `Rule.resolve` flows one hop, `layer` flows to depth.
module.exports = {
  ...base,
  target: "web",
  experiments: { layers: true },
  module: {
    rules: [
      {
        dependency: "worker",
        layer: "worker",
        resolve: { conditionNames: ["worker", "..."] },
      },
      {
        issuerLayer: "worker",
        resolve: { conditionNames: ["worker", "..."] },
      },
    ],
  },
  output: {
    ...base.output,
    path: path.resolve(process.cwd(), "dist/webpack-layers"),
  },
};
