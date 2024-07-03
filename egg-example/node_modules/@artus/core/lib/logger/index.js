"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const tslib_1 = require("tslib");
const impl_1 = tslib_1.__importDefault(require("./impl"));
exports.Logger = impl_1.default;
tslib_1.__exportStar(require("./level"), exports);
tslib_1.__exportStar(require("./types"), exports);
