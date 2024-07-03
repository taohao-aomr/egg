"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configuration_1 = tslib_1.__importDefault(require("../../configuration"));
const decorator_1 = require("../decorator");
const compatible_require_1 = tslib_1.__importDefault(require("../../utils/compatible_require"));
const constant_1 = require("../../constant");
const utils_1 = require("../../utils");
let PackageLoader = class PackageLoader {
    constructor(container) {
        this.container = container;
    }
    static async is(opts) {
        return (0, utils_1.isMatch)(opts.filename, constant_1.PACKAGE_JSON);
    }
    async load(item) {
        const originConfigObj = await (0, compatible_require_1.default)(item.path);
        const configHandler = this.container.get(configuration_1.default);
        configHandler.addPackage(item.source || 'app', originConfigObj);
        return originConfigObj;
    }
};
PackageLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('package-json'),
    tslib_1.__metadata("design:paramtypes", [Object])
], PackageLoader);
exports.default = PackageLoader;
