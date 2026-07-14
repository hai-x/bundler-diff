// only a never-taken branch reaches "namespace-user", so nothing in the cycle
// may run before the root finishes initializing its own bindings
if (globalThis.__neverSet) {
  const user = require("./namespace-user");
  globalThis.__cycleRead = user.read();
}

export const rootValue = "root";

console.log("rootValue:", rootValue);
console.log("__cycleSaw:", globalThis.__cycleSaw);
