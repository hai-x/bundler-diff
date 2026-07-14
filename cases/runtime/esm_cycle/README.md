# esm_cycle

Circular ESM imports: `entry -> a -> b -> a` (back edge). Exercises the four
observable cycle semantics under scope hoisting:

1. Evaluation order — spec order is `b`, `a`, `entry` (dependency-first, cycle
   broken at the back edge).
2. Function hoisting — `b` calls `a`'s exported function during its own
   evaluation, before `a` has run.
3. Temporal dead zone — `b` reads `a`'s `let shared` during its evaluation;
   spec requires a `ReferenceError`.
4. Live bindings — after `a` reassigns `shared`, every reader sees the new
   value.

Native baseline (`node` with `"type": "module"`):

```
evaluate b
evaluate a
b called hoisted fromA during its evaluation: from-a
b read `shared` during its evaluation: threw ReferenceError
live binding after reassign: reassigned-by-a
evaluate entry
entry sees shared: reassigned-by-a
```

Observed (2026-07-24): webpack, rspack and rolldown match the baseline —
scope hoisting emits modules in spec order with direct identifier references,
so JS hoisting/TDZ reproduce the semantics natively. esbuild diverges on (3):
it lowers `let shared` to `var shared`, so the in-cycle read prints
`undefined` instead of throwing.
