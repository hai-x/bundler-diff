"use strict";

(global.__nestedChainOrder = global.__nestedChainOrder || []).push("d");

const { e, bump, readCount } = require("./e.mjs");

exports.d = function d() {
	return `d${e()}`;
};
exports.bumpFromD = bump;
exports.readCountFromD = readCount;
