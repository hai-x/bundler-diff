// webpack-cli resolves its own peer webpack from the pnpm store, bypassing the
// node_modules/webpack -> local fork symlink; require it from here instead.
const webpack = require("webpack");
const config = require("./webpack.config.cjs");

webpack(config, (err, stats) => {
  if (err) {
    console.error(err);
    process.exitCode = 1;
    return;
  }
  console.log(stats.toString({ colors: true }));
  if (stats.hasErrors()) process.exitCode = 1;
});
