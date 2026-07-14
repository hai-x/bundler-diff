"use strict";

(global.__nestedChainOrder = global.__nestedChainOrder || []).push("b");

const { c, bump, readCount } = require("./c.mjs");

exports.b = function b() {
	return `b${c()}`;
};
exports.bump = bump;
exports.readCount = readCount;
