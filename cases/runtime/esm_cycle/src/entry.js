// Cycle: entry -> a -> b -> a (back edge).
// Spec evaluation order: b, a, entry.
import { readShared } from "./a.js";

console.log("evaluate entry");
console.log("entry sees shared:", readShared());
