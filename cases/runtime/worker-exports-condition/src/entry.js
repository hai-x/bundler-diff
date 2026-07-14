import { decode } from "decode-named-character-reference";

// Main thread: `browser` condition is correct here.
console.log("main:", decode("amp"));

const worker = new Worker(new URL("./worker.js", import.meta.url), {
	type: "module",
});
worker.onmessage = (event) => console.log("from worker:", event.data);
