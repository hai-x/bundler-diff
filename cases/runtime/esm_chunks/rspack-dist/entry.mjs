export const __rspack_esm_id = "entry";
export const __rspack_esm_ids = ["entry"];
export const __webpack_modules__ = {
"./src/entry.js"(__unused_rspack_module, __unused_rspack_exports, __webpack_require__) {
__webpack_require__.e(/* import() */ "src_async-message_js").then(__webpack_require__.bind(__webpack_require__, "./src/async-message.js")).then(({ formatAsyncMessage }) => {
  console.log(formatAsyncMessage("esm chunks case"));
});


},

};
import { __webpack_require__ } from './runtime.mjs';
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
import * as __rspack_chunk_1 from './entry.mjs';
__webpack_require__.C(__rspack_chunk_1);
var __webpack_exports__ = __webpack_exec__("./src/entry.js");