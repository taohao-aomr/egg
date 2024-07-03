"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constant_1 = require("../../constant");
const decorator_1 = require("../decorator");
const compatible_require_1 = tslib_1.__importDefault(require("../../utils/compatible_require"));
let LifecycleLoader = class LifecycleLoader {
    constructor(container) {
        this.container = container;
    }
    get lifecycleManager() {
        return this.container.get(constant_1.ArtusInjectEnum.LifecycleManager);
    }
    async load(item) {
        const origin = await (0, compatible_require_1.default)(item.path, true);
        item.loaderState = Object.assign({ exportNames: ['default'] }, item.loaderState);
        const { loaderState: state } = item;
        const lifecycleClazzList = [];
        for (const name of state.exportNames) {
            const clazz = origin[name];
            this.container.set({ type: clazz });
            this.lifecycleManager.registerHookUnit(clazz);
        }
        return lifecycleClazzList;
    }
};
LifecycleLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('lifecycle-hook-unit'),
    tslib_1.__metadata("design:paramtypes", [Object])
], LifecycleLoader);
exports.default = LifecycleLoader;
