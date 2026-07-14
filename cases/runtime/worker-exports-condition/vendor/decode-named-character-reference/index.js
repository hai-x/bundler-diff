// Worker-safe build: no DOM access. Marker: WORKER_SAFE_BUILD
export function decode(value) {
	return `WORKER_SAFE_BUILD:${value}`;
}
