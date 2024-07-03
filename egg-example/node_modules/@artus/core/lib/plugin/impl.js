"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const load_meta_file_1 = require("../utils/load_meta_file");
const fs_1 = require("../utils/fs");
const constant_1 = require("../constant");
const common_1 = require("./common");
class Plugin {
    constructor(name, configItem, opts) {
        var _a, _b;
        this.importPath = '';
        this.metadata = {};
        this.metaFilePath = '';
        this.name = name;
        this.enable = (_a = configItem.enable) !== null && _a !== void 0 ? _a : false;
        if (this.enable) {
            let importPath = (_b = configItem.path) !== null && _b !== void 0 ? _b : '';
            if (configItem.package) {
                if (importPath) {
                    throw new Error(`plugin ${name} config error, package and path can't be set at the same time.`);
                }
                importPath = (0, common_1.getPackagePath)(configItem.package);
            }
            if (!importPath) {
                throw new Error(`Plugin ${name} need have path or package field`);
            }
            this.importPath = importPath;
        }
        this.logger = opts === null || opts === void 0 ? void 0 : opts.logger;
    }
    async init() {
        if (!this.enable) {
            return;
        }
        await this.checkAndLoadMetadata();
        if (!this.metadata) {
            throw new Error(`${this.name} is not have metadata.`);
        }
        if (this.metadata.name !== this.name) {
            throw new Error(`${this.name} metadata invalid, name is ${this.metadata.name}`);
        }
    }
    checkDepExisted(pluginMap) {
        var _a, _b;
        for (const { name: pluginName, optional } of (_a = this.metadata.dependencies) !== null && _a !== void 0 ? _a : []) {
            const instance = pluginMap.get(pluginName);
            if (!instance || !instance.enable) {
                if (optional) {
                    (_b = this.logger) === null || _b === void 0 ? void 0 : _b.warn(`Plugin ${this.name} need have optional dependence: ${pluginName}.`);
                }
                else {
                    throw new Error(`Plugin ${this.name} need have dependence: ${pluginName}.`);
                }
            }
        }
    }
    getDepEdgeList() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.metadata.dependencies) === null || _a === void 0 ? void 0 : _a.filter(({ optional }) => !optional)) === null || _b === void 0 ? void 0 : _b.map(({ name: depPluginName }) => [this.name, depPluginName])) !== null && _c !== void 0 ? _c : [];
    }
    async checkAndLoadMetadata() {
        // check import path
        if (!await (0, fs_1.exists)(this.importPath)) {
            throw new Error(`load plugin <${this.name}> import path ${this.importPath} is not exists.`);
        }
        const metaFilePath = path_1.default.resolve(this.importPath, constant_1.PLUGIN_META_FILENAME);
        try {
            if (!await (0, fs_1.exists)(metaFilePath)) {
                throw new Error(`load plugin <${this.name}> import path ${this.importPath} can't find meta file.`);
            }
            this.metadata = await (0, load_meta_file_1.loadMetaFile)(metaFilePath);
            this.metaFilePath = metaFilePath;
        }
        catch (e) {
            throw new Error(`load plugin <${this.name}> failed, err: ${e}`);
        }
    }
}
exports.Plugin = Plugin;
