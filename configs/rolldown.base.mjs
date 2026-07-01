import { defineConfig } from "rolldown";

export function createRolldownConfig({ output = {}, ...rest } = {}) {
  return defineConfig({
    input: { entry: "src/entry.js" },
    output: { dir: "dist/rolldown", format: "cjs", minify: false, ...output },
    ...rest,
    experimental: {
      lazyBarrel: true,
    },
  });
}

export default createRolldownConfig();
