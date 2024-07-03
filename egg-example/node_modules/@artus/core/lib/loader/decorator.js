"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineLoader = void 0;
const constant_1 = require("../constant");
const DefineLoader = (loaderName) => (target) => {
    Reflect.defineMetadata(constant_1.LOADER_NAME_META, loaderName, target);
};
exports.DefineLoader = DefineLoader;
