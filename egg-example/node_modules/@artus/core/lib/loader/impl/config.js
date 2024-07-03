"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const configuration_1 = tslib_1.__importDefault(require("../../configuration"));
const constant_1 = require("../../constant");
const decorator_1 = require("../decorator");
const compatible_require_1 = tslib_1.__importDefault(require("../../utils/compatible_require"));
const utils_1 = require("../../utils");
const config_file_meta_1 = require("../utils/config_file_meta");
const plugin_1 = require("../../plugin");
let ConfigLoader = class ConfigLoader {
    constructor(container) {
        this.container = container;
    }
    get app() {
        return this.container.get(constant_1.ArtusInjectEnum.Application);
    }
    get configurationHandler() {
        return this.container.get(configuration_1.default);
    }
    static async is(opts) {
        return (this.isConfigDir(opts) &&
            !(0, utils_1.isMatch)(opts.filename, constant_1.FRAMEWORK_PATTERN));
    }
    static isConfigDir(opts) {
        const { configDir, baseDir, root } = opts;
        return path.join(baseDir, configDir) === root;
    }
    async load(item) {
        const { namespace, env } = (0, config_file_meta_1.getConfigMetaFromFilename)(item.filename);
        let configObj = await this.loadConfigFile(item);
        if (namespace === 'plugin') {
            configObj = {
                plugin: await plugin_1.PluginFactory.formatPluginConfig(configObj, item),
            };
        }
        else if (namespace) {
            configObj = {
                [namespace]: configObj,
            };
        }
        this.configurationHandler.setConfig(env, configObj);
        return configObj;
    }
    async loadConfigFile(item) {
        const originConfigObj = await (0, compatible_require_1.default)(item.path);
        let configObj = originConfigObj;
        if (typeof originConfigObj === 'function') {
            const app = this.container.get(constant_1.ArtusInjectEnum.Application);
            configObj = originConfigObj(app);
        }
        return configObj;
    }
};
ConfigLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('config'),
    tslib_1.__metadata("design:paramtypes", [Object])
], ConfigLoader);
exports.default = ConfigLoader;
