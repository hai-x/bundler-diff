// antd-mobile imports its stylesheets from JavaScript, which needs CSS support
module.exports = {
  ...require("../../../configs/rspack.base.cjs"),
  experiments: { css: true },
  module: { rules: [{ test: /\.css$/, type: "css" }] },
};
