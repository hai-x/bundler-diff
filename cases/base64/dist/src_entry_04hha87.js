module.exports = [
63, ((__turbopack_context__) => {
"use strict";

// MERGED MODULE: [project]/src/entry.js [client] (ecmascript)
;
// MERGED MODULE: [project]/src/fixtures/alpha.bin.[bytes].mjs [client] (ecmascript)
;
// MERGED MODULE: [turbopack]/shared/base64.ts [client] (ecmascript)
;
// Evaluate the ES2024 feature check once at module load time.
const _fromBase64 = typeof Uint8Array.fromBase64 === 'function' ? Uint8Array.fromBase64 : null;
function base64Decode(base64) {
    if (_fromBase64 !== null) {
        return _fromBase64(base64);
    }
    const binaryString = atob(base64);
    const buffer = new Uint8Array(binaryString.length);
    for(let i = 0; i < binaryString.length; i++){
        buffer[i] = binaryString.charCodeAt(i);
    }
    return buffer;
}
"use turbopack no side effects";
;
const __TURBOPACK__default__export__ = base64Decode("YWxwaGEtYnl0ZXMK");
// MERGED MODULE: [project]/src/fixtures/beta.bin.[bytes].mjs [client] (ecmascript)
;
"use turbopack no side effects";
;
const __TURBOPACK__default__export__1 = base64Decode("YmV0YS1ieXRlcwo");
;
;
const decoder = new TextDecoder();
const alpha = decoder.decode(__TURBOPACK__default__export__).trimEnd();
const beta = decoder.decode(__TURBOPACK__default__export__1).trimEnd();
const totalBytes = __TURBOPACK__default__export__.length + __TURBOPACK__default__export__1.length;
console.log(`${alpha}|${beta}|${totalBytes}`);
__turbopack_context__.s([], 63);
}),
];

//# sourceMappingURL=src_entry_04hha87.js.map