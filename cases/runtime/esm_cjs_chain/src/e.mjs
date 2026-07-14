import { eInner } from "./e-inner.mjs";
import { eSide } from "./e-side.mjs";
import { bump, count, f } from "./f.cjs";

(global.__nestedChainOrder = global.__nestedChainOrder || []).push("e");

export function e() {
	return `e${eSide()}${eInner()}${f()}`;
}

export function readCount() {
	return count();
}

export { bump };
