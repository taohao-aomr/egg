"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = void 0;
const tslib_1 = require("tslib");
const deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
const is_1 = require("../../utils/is");
function mergeConfig(...args) {
    /* istanbul ignore next */
    return deepmerge_1.default.all(args, {
        arrayMerge: (_, src) => src,
        clone: false,
        isMergeableObject: is_1.isPlainObject,
    });
}
exports.mergeConfig = mergeConfig;
