import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { minify } from "terser";

// One minifier over every bundler's output, so the sizes compare the bundling
// rather than each tool's own minifier. Writes `<name>.min.js` next to each
// `<name>.js` under dist/<bundler>/ of the current case.
const terserOptions = {
  module: false,
  toplevel: true,
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
};

// `node terser.mjs esbuild rolldown` limits the run to those output dirs
const only = new Set(process.argv.slice(2));
const distDir = join(process.cwd(), "dist");
const rows = [];
for (const bundler of readdirSync(distDir).sort()) {
  const dir = join(distDir, bundler);
  if (!statSync(dir).isDirectory()) continue;
  if (only.size > 0 && !only.has(bundler)) continue;
  let raw = 0;
  let minified = 0;
  let gzip = 0;
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".js") || file.endsWith(".min.js")) continue;
    const code = readFileSync(join(dir, file), "utf8");
    const result = await minify(code, terserOptions);
    writeFileSync(join(dir, file.replace(/\.js$/, ".min.js")), result.code);
    raw += Buffer.byteLength(code);
    minified += Buffer.byteLength(result.code);
    gzip += gzipSync(result.code, { level: 9 }).length;
  }
  rows.push({ bundler, raw, minified, gzip });
}

const pad = (value, width) => String(value).padStart(width);
console.log(`${"bundler".padEnd(12)} ${pad("raw", 7)} ${pad("terser", 7)} ${pad("gzip", 6)}`);
for (const { bundler, raw, minified, gzip } of rows) {
  console.log(`${bundler.padEnd(12)} ${pad(raw, 7)} ${pad(minified, 7)} ${pad(gzip, 6)}`);
}
