(() => {
"use strict";
var __webpack_modules__ = ({
"./src/fixtures/alpha.bin"(module, __unused_rspack_exports, __webpack_require__) {
module.exports = __webpack_require__.tb("YWxwaGEtYnl0ZXMK");

},
"./src/fixtures/beta.bin"(module, __unused_rspack_exports, __webpack_require__) {
module.exports = __webpack_require__.tb("YmV0YS1ieXRlcwo=");

},

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
// webpack/runtime/to_binary
(() => {
// define to binary helper
__webpack_require__.tb = 
  
    (base64) => (new Uint8Array(Buffer.from(base64, 'base64')))
  
  
  

})();
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* import */ var _fixtures_alpha_bin__rspack_import_0 = __webpack_require__("./src/fixtures/alpha.bin");
/* import */ var _fixtures_beta_bin__rspack_import_1 = __webpack_require__("./src/fixtures/beta.bin");



const decoder = new TextDecoder();

const alpha = decoder.decode(_fixtures_alpha_bin__rspack_import_0).trimEnd();
const beta = decoder.decode(_fixtures_beta_bin__rspack_import_1).trimEnd();
const totalBytes = _fixtures_alpha_bin__rspack_import_0.length + _fixtures_beta_bin__rspack_import_1.length;

console.log(`${alpha}|${beta}|${totalBytes}`);

})();

})()
;