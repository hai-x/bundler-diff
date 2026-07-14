import { side } from "./c-side.mjs";
import { bumpFromD, d, readCountFromD } from "./d.cjs";

(global.__nestedChainOrder = global.__nestedChainOrder || []).push("c");

export function c() {
	return `c${side()}${d()}`;
}

export { bumpFromD as bump, readCountFromD as readCount };
