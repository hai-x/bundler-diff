// Prints which package build (DOM_BUILD vs WORKER_SAFE_BUILD) each bundler
// put into each emitted chunk.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") ? [p] : [];
	});

for (const bundler of readdirSync("dist")) {
	console.log(`## ${bundler}`);
	for (const file of walk(join("dist", bundler))) {
		const src = readFileSync(file, "utf8");
		const markers = ["DOM_BUILD", "WORKER_SAFE_BUILD"].filter((m) =>
			src.includes(m),
		);
		if (markers.length > 0) console.log(`  ${file}: ${markers.join(", ")}`);
	}
}
