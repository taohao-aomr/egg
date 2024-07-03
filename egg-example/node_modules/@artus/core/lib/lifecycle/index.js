"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleManager = void 0;
const constant_1 = require("../constant");
class LifecycleManager {
    constructor(app, container) {
        this.hookList = [
            'configWillLoad',
            'configDidLoad',
            'didLoad',
            'willReady',
            'didReady',
            'beforeClose', // 应用即将关闭
        ];
        this.hookFnMap = new Map();
        this.hookUnitSet = new Set();
        this.app = app;
        this.container = container;
    }
    insertHook(existHookName, newHookName) {
        const startIndex = this.hookList.findIndex(val => val === existHookName);
        this.hookList.splice(startIndex, 0, newHookName);
    }
    appendHook(newHookName) {
        this.hookList.push(newHookName);
    }
    registerHook(hookName, hookFn) {
        var _a;
        if (this.hookFnMap.has(hookName)) {
            (_a = this.hookFnMap.get(hookName)) === null || _a === void 0 ? void 0 : _a.push(hookFn);
        }
        else {
            this.hookFnMap.set(hookName, [
                hookFn,
            ]);
        }
    }
    registerHookUnit(extClazz) {
        if (this.hookUnitSet.has(extClazz)) {
            return;
        }
        this.hookUnitSet.add(extClazz);
        const fnMetaKeys = Reflect.getMetadataKeys(extClazz);
        const extClazzInstance = this.container.get(extClazz);
        for (const fnMetaKey of fnMetaKeys) {
            if (typeof fnMetaKey !== 'string' || !fnMetaKey.startsWith(constant_1.HOOK_NAME_META_PREFIX)) {
                continue;
            }
            const hookName = Reflect.getMetadata(fnMetaKey, extClazz);
            const propertyKey = fnMetaKey.slice(constant_1.HOOK_NAME_META_PREFIX.length);
            this.registerHook(hookName, extClazzInstance[propertyKey].bind(extClazzInstance));
        }
    }
    async emitHook(hookName, payload) {
        if (!this.hookFnMap.has(hookName)) {
            return;
        }
        const fnList = this.hookFnMap.get(hookName);
        if (!Array.isArray(fnList)) {
            return;
        }
        // lifecycle hook should only trigger one time
        this.hookFnMap.delete(hookName);
        for (const hookFn of fnList) {
            await hookFn({
                app: this.app,
                lifecycleManager: this,
                payload,
            });
        }
    }
}
exports.LifecycleManager = LifecycleManager;
