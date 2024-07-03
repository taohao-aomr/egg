"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoaderEventEmitter {
    constructor() {
        this.listeners = {};
    }
    addListener(eventName, listener) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = { before: [], after: [], beforeEach: [], afterEach: [] };
        }
        if (listener.before) {
            this.listeners[eventName].before.push(listener.before);
        }
        if (listener.after) {
            this.listeners[eventName].after.push(listener.after);
        }
        if (listener.beforeEach) {
            this.listeners[eventName].beforeEach.push(listener.beforeEach);
        }
        if (listener.afterEach) {
            this.listeners[eventName].afterEach.push(listener.afterEach);
        }
    }
    removeListener(eventName, stage) {
        if (!this.listeners[eventName]) {
            return;
        }
        if (stage) {
            this.listeners[eventName][stage] = [];
            return;
        }
        delete this.listeners[eventName];
    }
    async emitBefore(eventName, ...args) {
        await this.emit(eventName, 'before', ...args);
    }
    async emitAfter(eventName, ...args) {
        await this.emit(eventName, 'after', ...args);
    }
    async emitBeforeEach(eventName, ...args) {
        await this.emit(eventName, 'beforeEach', ...args);
    }
    async emitAfterEach(eventName, ...args) {
        await this.emit(eventName, 'afterEach', ...args);
    }
    async emit(eventName, stage, ...args) {
        var _a;
        const stages = ((_a = this.listeners[eventName]) !== null && _a !== void 0 ? _a : {})[stage];
        if (!stages || stages.length === 0) {
            return;
        }
        for (const listener of stages) {
            await listener(...args);
        }
    }
}
exports.default = LoaderEventEmitter;
