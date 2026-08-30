// jsdom does not expose TextEncoder/TextDecoder as globals, but react-dom/server
// requires them at import time. draft-convert's convertToHTML pulls in
// react-dom/server, so every test touching src/modules/draftConversion.js — and
// anything importing editorConstructor — fails to load without this.
const { TextEncoder, TextDecoder } = require('util')

if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = TextDecoder
}
