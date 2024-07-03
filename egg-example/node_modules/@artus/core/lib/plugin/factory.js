"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginFactory = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const common_1 = require("./common");
const impl_1 = require("./impl");
const fs_1 = require("../utils/fs");
class PluginFactory {
    static async create(name, item, opts) {
        const pluginInstance = new impl_1.Plugin(name, item, opts);
        await pluginInstance.init();
        return pluginInstance;
    }
    static async createFromConfig(config, opts) {
        const pluginInstanceMap = new Map();
        for (const [name, item] of Object.entries(config)) {
            const pluginInstance = await PluginFactory.create(name, item, opts);
            if (pluginInstance.enable) {
                pluginInstanceMap.set(name, pluginInstance);
            }
        }
        let pluginDepEdgeList = [];
        // Topological sort plugins
        for (const [_name, pluginInstance] of pluginInstanceMap) {
            pluginInstance.checkDepExisted(pluginInstanceMap);
            pluginDepEdgeList = pluginDepEdgeList.concat(pluginInstance.getDepEdgeList());
        }
        const pluginSortResult = (0, common_1.topologicalSort)(pluginInstanceMap, pluginDepEdgeList);
        if (pluginSortResult.length !== pluginInstanceMap.size) {
            const diffPlugin = [...pluginInstanceMap.keys()].filter(name => !pluginSortResult.includes(name));
            throw new Error(`There is a cycle in the dependencies, wrong plugin is ${diffPlugin.join(',')}.`);
        }
        return pluginSortResult.map(name => pluginInstanceMap.get(name));
    }
    static async formatPluginConfig(config, manifestItem) {
        var _a;
        const newConfig = {};
        const loaderState = manifestItem === null || manifestItem === void 0 ? void 0 : manifestItem.loaderState;
        for (const pluginName of Object.keys(config)) {
            const pluginConfigItem = config[pluginName];
            if (pluginConfigItem.package) {
                // convert package to path when load plugin config
                if (pluginConfigItem.path) {
                    throw new Error(`Plugin ${pluginName} config can't have both package and path at ${(_a = manifestItem === null || manifestItem === void 0 ? void 0 : manifestItem.path) !== null && _a !== void 0 ? _a : 'UNKNOWN_PATH'}`);
                }
                const requirePaths = (loaderState === null || loaderState === void 0 ? void 0 : loaderState.baseDir) ? [loaderState.baseDir] : undefined;
                pluginConfigItem.path = (0, common_1.getPackagePath)(pluginConfigItem.package, requirePaths);
                delete pluginConfigItem.package;
            }
            else if (pluginConfigItem.path && await (0, fs_1.exists)(path_1.default.resolve(pluginConfigItem.path, 'package.json'))) {
                // plugin path is a npm package, need resolve main file
                pluginConfigItem.path = await (0, common_1.getInlinePackageEntryPath)(pluginConfigItem.path);
            }
            newConfig[pluginName] = pluginConfigItem;
        }
        return newConfig;
    }
}
exports.PluginFactory = PluginFactory;
