"use strict";

const { p2 } = require("./p2.mjs");

exports.p = function p() {
	return `1${p2()}`;
};
