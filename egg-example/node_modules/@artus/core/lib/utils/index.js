"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatch = exports.getDefaultExtensions = void 0;
const tslib_1 = require("tslib");
const minimatch_1 = tslib_1.__importDefault(require("minimatch"));
function getDefaultExtensions() {
    return Object.keys(require.extensions);
}
exports.getDefaultExtensions = getDefaultExtensions;
function isMatch(filename, patterns) {
    if (!Array.isArray(patterns)) {
        patterns = [patterns];
    }
    return patterns.some(pattern => (0, minimatch_1.default)(filename, pattern));
}
exports.isMatch = isMatch;
