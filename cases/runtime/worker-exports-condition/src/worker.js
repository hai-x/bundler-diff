import { decode } from "./indirect.js";

// Worker thread: `browser` build throws `document is not defined` here.
self.postMessage(decode("amp"));
