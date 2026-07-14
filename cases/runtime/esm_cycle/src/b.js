// Evaluates first: entry -> a -> b, back edge b -> a is skipped.
import { fromA, shared } from "./a.js";

import c from "./c.cjs";
console.log("evaluate b");

console.log("c", c);

// Function declarations hoist across the cycle: works before a.js runs.
export const earlyCall = fromA();

// `shared` is a `let` still in its temporal dead zone while b evaluates.
function tryReadShared() {
  try {
    return shared;
  } catch (e) {
    return `threw ${e.constructor.name}`;
  }
}

export const duringCycle = tryReadShared();

// Live binding: reflects a.js reassignment after a.js evaluates.
export function readSharedFromB() {
  return tryReadShared();
}
