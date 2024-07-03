"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLoader = exports.LoaderFactory = void 0;
const tslib_1 = require("tslib");
const factory_1 = require("./factory");
Object.defineProperty(exports, "LoaderFactory", { enumerable: true, get: function () { return factory_1.LoaderFactory; } });
const base_1 = tslib_1.__importDefault(require("./base"));
exports.BaseLoader = base_1.default;
// Import inner impls
const LoaderImpls = tslib_1.__importStar(require("./impl"));
// Register inner impls
for (const [_, impl] of Object.entries(LoaderImpls)) {
    factory_1.LoaderFactory.register(impl);
}
tslib_1.__exportStar(require("./types"), exports);
