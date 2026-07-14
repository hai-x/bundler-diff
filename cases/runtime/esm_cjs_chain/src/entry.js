// entry.mjs -> b.cjs -> c.mjs (+ c-side.mjs) -> d.cjs -> e.mjs (+ e-inner.mjs, e-side.mjs) -> f.cjs
// e-side.mjs is also imported here; p1.cjs -> p2.mjs -> p3.cjs -> p4.mjs alternates
// with nothing but CommonJS below each ESM module
import { eSide } from "./e-side.mjs";
import { b, bump, readCount } from "./b.cjs";
import { p } from "./p1.cjs";

console.log(b(), p(), eSide());
console.log(readCount(), bump(), readCount());
console.log(global.__nestedChainOrder.join(","));
