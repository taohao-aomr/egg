"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMetaFile = void 0;
const tslib_1 = require("tslib");
const compatible_require_1 = tslib_1.__importDefault(require("./compatible_require"));
const loadMetaFile = async (path) => {
    const metaObject = await (0, compatible_require_1.default)(path);
    if (!metaObject || typeof metaObject !== 'object') {
        throw new Error(`[loadMetaFile] ${path} is not a valid json file.`);
    }
    return metaObject;
};
exports.loadMetaFile = loadMetaFile;
