"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("../decorator");
const constant_1 = require("../../constant");
const config_1 = tslib_1.__importDefault(require("./config"));
const utils_1 = require("../../utils");
const config_file_meta_1 = require("../utils/config_file_meta");
let FrameworkConfigLoader = class FrameworkConfigLoader extends config_1.default {
    static async is(opts) {
        if (this.isConfigDir(opts)) {
            return (0, utils_1.isMatch)(opts.filename, constant_1.FRAMEWORK_PATTERN);
        }
        return false;
    }
    async load(item) {
        const { env } = (0, config_file_meta_1.getConfigMetaFromFilename)(item.filename);
        const configObj = (await this.loadConfigFile(item));
        this.configurationHandler.addFramework(item.source || 'app', configObj, {
            env,
            unitName: item.unitName || '',
        });
        return configObj;
    }
};
FrameworkConfigLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('framework-config')
], FrameworkConfigLoader);
exports.default = FrameworkConfigLoader;
