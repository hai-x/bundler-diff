import commonjs from "@rollup/plugin-commonjs";

export function createRollupConfig({ output = {}, plugins = [], ...rest } = {}) {
  return {
    input: { entry: "src/entry.js" },
    output: { dir: "dist/rollup", format: "cjs", ...output },
    plugins: [commonjs(), ...plugins],
    ...rest,
  };
}

export default createRollupConfig();
