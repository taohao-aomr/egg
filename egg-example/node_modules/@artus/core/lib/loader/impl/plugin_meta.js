"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("../decorator");
const load_meta_file_1 = require("../../utils/load_meta_file");
const constant_1 = require("../../constant");
const utils_1 = require("../../utils");
let PluginMetaLoader = class PluginMetaLoader {
    constructor(container) {
        this.container = container;
    }
    static async is(opts) {
        return (0, utils_1.isMatch)(opts.filename, constant_1.PLUGIN_META_FILENAME);
    }
    async load(item) {
        const pluginMeta = await (0, load_meta_file_1.loadMetaFile)(item.path);
        this.container.set({
            id: `pluginMeta_${pluginMeta.name}`,
            value: pluginMeta,
        });
        return pluginMeta;
    }
};
PluginMetaLoader = tslib_1.__decorate([
    (0, decorator_1.DefineLoader)('plugin-meta'),
    tslib_1.__metadata("design:paramtypes", [Object])
], PluginMetaLoader);
exports.default = PluginMetaLoader;
