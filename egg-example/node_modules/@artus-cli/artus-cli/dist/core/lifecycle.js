"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@artus/core");
const trigger_1 = require("./trigger");
let Lifecycle = class Lifecycle {
    async configDidLoad() {
        await this.trigger.init();
    }
    async didReady() {
        await this.trigger.start();
    }
};
tslib_1.__decorate([
    (0, core_1.Inject)(),
    tslib_1.__metadata("design:type", trigger_1.CommandTrigger)
], Lifecycle.prototype, "trigger", void 0);
tslib_1.__decorate([
    (0, core_1.LifecycleHook)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Lifecycle.prototype, "configDidLoad", null);
tslib_1.__decorate([
    (0, core_1.LifecycleHook)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Lifecycle.prototype, "didReady", null);
Lifecycle = tslib_1.__decorate([
    (0, core_1.LifecycleHookUnit)()
], Lifecycle);
exports.default = Lifecycle;
