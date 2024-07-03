"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
/**
 * compatible esModule require
 * @param path
 */
async function compatibleRequire(path, origin = false) {
    const requiredModule = await (_a = path, Promise.resolve().then(() => tslib_1.__importStar(require(_a))));
    (0, assert_1.default)(requiredModule, `module '${path}' exports is undefined`);
    return origin ? requiredModule : (requiredModule.default || requiredModule);
}
exports.default = compatibleRequire;
