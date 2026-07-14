const base = require("../../../configs/webpack.base.cjs");

// Browser build so the `browser` exports condition applies (issue #17512).
module.exports = { ...base, target: "web" };
