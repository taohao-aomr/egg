"use strict";
var ConfigurationHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const merge_1 = require("../loader/utils/merge");
const compatible_require_1 = tslib_1.__importDefault(require("../utils/compatible_require"));
const decorator_1 = require("./decorator");
let ConfigurationHandler = ConfigurationHandler_1 = class ConfigurationHandler {
    constructor() {
        this.configStore = new Map();
        this.frameworks = new Map();
        this.packages = new Map();
    }
    static getEnvFromFilename(filename) {
        let [_, env, extname] = filename.split('.');
        if (!extname) {
            env = constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT;
        }
        return env;
    }
    getMergedConfig(env) {
        var _a, _b, _c;
        const currentEnv = (_a = env !== null && env !== void 0 ? env : process.env[constant_1.ARTUS_SERVER_ENV]) !== null && _a !== void 0 ? _a : constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEV;
        const defaultConfig = (_b = this.configStore.get(constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT)) !== null && _b !== void 0 ? _b : {};
        const envConfig = (_c = this.configStore.get(currentEnv)) !== null && _c !== void 0 ? _c : {};
        return (0, merge_1.mergeConfig)(defaultConfig, envConfig);
    }
    getAllConfig() {
        var _a;
        const defaultConfig = (_a = this.configStore.get(constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT)) !== null && _a !== void 0 ? _a : {};
        const keys = Array.from(this.configStore.keys()).filter(key => key !== constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT);
        return (0, merge_1.mergeConfig)(defaultConfig, ...keys.map(key => { var _a; return (_a = this.configStore.get(key)) !== null && _a !== void 0 ? _a : {}; }));
    }
    setConfig(env, config) {
        var _a;
        const storedConfig = (_a = this.configStore.get(env)) !== null && _a !== void 0 ? _a : {};
        this.configStore.set(env, (0, merge_1.mergeConfig)(storedConfig, config));
    }
    async setConfigByFile(fileItem) {
        const configContent = await (0, compatible_require_1.default)(fileItem.path);
        if (configContent) {
            const env = ConfigurationHandler_1.getEnvFromFilename(fileItem.filename);
            this.setConfig(env, configContent);
        }
    }
    getFrameworkConfig(env, key = 'app', frameworkMap = new Map()) {
        var _a, _b, _c;
        if (!this.frameworks.has(key)) {
            return frameworkMap;
        }
        const currentEnv = (_a = env !== null && env !== void 0 ? env : process.env[constant_1.ARTUS_SERVER_ENV]) !== null && _a !== void 0 ? _a : constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEV;
        const list = this.frameworks.get(key);
        const defaultConfig = (_b = list.filter(item => item.env === constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT)[0]) !== null && _b !== void 0 ? _b : {};
        const envConfig = (_c = list.filter(item => item.env === currentEnv)[0]) !== null && _c !== void 0 ? _c : {};
        const config = (0, merge_1.mergeConfig)(defaultConfig, envConfig);
        frameworkMap.set(key, config);
        if (config.path) {
            this.getFrameworkConfig(env, config.path, frameworkMap);
        }
        return frameworkMap;
    }
    addFramework(source, framework, options) {
        var _a;
        const key = options.unitName || source;
        const list = (_a = this.frameworks.get(key)) !== null && _a !== void 0 ? _a : [];
        framework.env = options.env;
        list.push(framework);
        this.frameworks.set(key, list);
    }
    getPackages() {
        return this.packages;
    }
    addPackage(source, pkg) {
        var _a;
        const list = (_a = this.packages.get(source)) !== null && _a !== void 0 ? _a : [];
        list.push(pkg);
        this.packages.set(source, list);
    }
};
tslib_1.__decorate([
    (0, decorator_1.DefineConfigHandle)('framework-config'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Map)
], ConfigurationHandler.prototype, "getFrameworkConfig", null);
ConfigurationHandler = ConfigurationHandler_1 = tslib_1.__decorate([
    (0, injection_1.Injectable)()
], ConfigurationHandler);
exports.default = ConfigurationHandler;
