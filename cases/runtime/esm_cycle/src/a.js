// Evaluates second (after b.js, its own dependency via the back edge).
import { earlyCall, duringCycle, readSharedFromB } from "./b.js";

console.log("evaluate a");

// Hoisted: callable from b.js before a.js has evaluated.
export function fromA() {
  return "from-a";
}

export let shared = "initial";

export function readShared() {
  return readSharedFromB();
}

console.log("b called hoisted fromA during its evaluation:", earlyCall);
console.log("b read `shared` during its evaluation:", duringCycle);

shared = "reassigned-by-a";
console.log("live binding after reassign:", readSharedFromB());
