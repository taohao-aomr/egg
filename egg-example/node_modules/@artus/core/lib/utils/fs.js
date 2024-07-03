"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const tslib_1 = require("tslib");
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
async function exists(path) {
    try {
        await promises_1.default.access(path);
    }
    catch (_a) {
        return false;
    }
    return true;
}
exports.exists = exists;
