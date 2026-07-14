"use strict";

const { p4 } = require("./p4.mjs");

exports.p3 = function p3() {
	return `3${p4()}`;
};
