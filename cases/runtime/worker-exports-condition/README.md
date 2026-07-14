# worker-exports-condition

Reproduction for [webpack#17512](https://github.com/webpack/webpack/issues/17512).

`src/entry.js` imports `decode-named-character-reference` (vendored stub) and
spawns `src/worker.js`, which reaches the same package transitively through
`src/indirect.js` — mirroring the real-world worker → remark-stringify →
decode-named-character-reference chain from the issue. The package's `exports`
map picks `./index.dom.js` (marker `DOM_BUILD`, touches `document`) for the
`browser` condition and `./index.js` (marker `WORKER_SAFE_BUILD`) for the
`worker` condition.

Expected: the main chunk bundles `DOM_BUILD`, the worker chunk bundles
`WORKER_SAFE_BUILD`. Actual: every bundler that bundles the worker resolves
imports inside it with the `browser` condition, so the worker gets `DOM_BUILD`
and throws `ReferenceError: document is not defined` at runtime.

Check with:

```sh
node check.mjs
```

## Results (2026-07-14)

| Bundler                  | Worker bundled                       | Condition inside worker |
| ------------------------ | ------------------------------------ | ----------------------- |
| webpack 5.108.3 (fork)   | yes, separate chunk                  | `browser` → `DOM_BUILD` |
| rspack 2.0.6             | yes, separate chunk                  | `browser` → `DOM_BUILD` |
| turbopack (this repo)    | yes, separate chunk group            | `browser` → `DOM_BUILD` |
| esbuild 0.25             | no — `new URL(...)` left as-is       | n/a                     |
| rolldown 1.1.3           | no — `new URL(...)` left as-is       | n/a                     |

webpack's `byDependency.worker` resolve options (PR
[#20347](https://github.com/webpack/webpack/pull/20347)) only apply the
`worker` condition to the `new Worker(new URL(...))` request itself, not to
imports transitively reached from the worker module.

Note: turbopack needs `--root ../../..` (repo root) so it can reach the pnpm
store; its relative entry is resolved from `--root`, hence the long entry path.

## Layers workaround (webpack, works today)

`webpack.layers.config.cjs` (`pnpm run build:webpack:layers`) fixes the case
without core changes: a rule with `dependency: "worker"` puts the worker graph
root into a `worker` layer, the layer inherits transitively
(`NormalModuleFactory` falls back to `issuerLayer`), and an
`issuerLayer: "worker"` rule prepends the `worker` condition. Layer is part of
the module identifier, so shared modules duplicate per graph instead of racing.
Result: `entry.js` → `DOM_BUILD`, worker chunk → `WORKER_SAFE_BUILD`.

A rule-only variant (`dependency: "worker"` + `resolve`, without layers) is
not enough for this case: `Rule.resolve` becomes `module.resolveOptions` of
the matched module and only applies to its direct imports (one hop), so the
package reached via `src/indirect.js` falls back to the `browser` condition.
