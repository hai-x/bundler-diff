const base = require("../../../configs/rspack.base.cjs");

// Entry lives at the case root instead of src/.
module.exports = { ...base, entry: { entry: "./index.js" } };
