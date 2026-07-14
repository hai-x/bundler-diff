"use strict";

(global.__nestedChainOrder = global.__nestedChainOrder || []).push("f");

let counter = 0;

exports.f = function f() {
	return "f";
};
exports.bump = function bump() {
	counter += 1;
	return counter;
};
exports.count = function count() {
	return counter;
};
