"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const injection_1 = require("@artus/injection");
const decorator_1 = require("../decorator");
const compatible_require_1 = tslib_1.__importDefault(require("../../utils/compatible_require"));
const constant_1 = require("../../constant");
let ModuleLoader = class ModuleLoader {
    constructor(container) {
        this.container = container;
    }
    async load(item) {
        const origin = await (0, compatible_require_1.default)(item.path, true);
        item.loaderState = Object.assign({ exportNames: ['default'] }, item.loaderState);
        const { loaderState: state } = item;
        const modules = [];
        for (const name of state.exportNames) {
            const moduleClazz = origin[name];
            if (typeof moduleClazz !== 'function') {
                continue;
            }
            const opts = {
                type: moduleClazz,
                scope: injection_1.ScopeEnum.EXECUTION, // The class used with @artus/core will have default scope EXECUTION, can be overwritten by Injectable decorator
            };
            if (item.id) {
                opts.id = item.id;
            }
            const shouldOverwriteValue = Reflect.getMetadata(constant_1.SHOULD_OVERWRITE_VALUE, moduleClazz);
            if (shouldOverwriteValue || !this.container.hasValue(opts)) {
                this.container.set(opts);
            }
            modules.push(moduleClazz);
        }
        return modules;
    }
};
ModuleLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('module'),
    tslib_1.__metadata("design:paramtypes", [Object])
], ModuleLoader);
exports.default = ModuleLoader;
