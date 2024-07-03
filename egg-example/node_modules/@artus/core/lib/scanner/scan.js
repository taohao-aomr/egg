"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs/promises"));
const deepmerge_1 = tslib_1.__importDefault(require("deepmerge"));
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const loader_1 = require("../loader");
const configuration_1 = tslib_1.__importDefault(require("../configuration"));
const framework_1 = require("../framework");
const plugin_1 = require("../plugin");
const utils_1 = require("./utils");
const fs_1 = require("../utils/fs");
const config_file_meta_1 = require("../loader/utils/config_file_meta");
const application_1 = require("../application");
class Scanner {
    constructor(options = {}) {
        var _a, _b, _c;
        this.moduleExtensions = ['.js', '.json', '.node'];
        this.itemMap = new Map();
        this.tmpConfigStore = new Map();
        this.configHandle = new configuration_1.default();
        this.options = Object.assign(Object.assign({ appName: 'app', needWriteFile: true, useRelativePath: true, configDir: constant_1.DEFAULT_CONFIG_DIR, loaderListGenerator: (defaultLoaderList) => defaultLoaderList, policy: constant_1.ScanPolicy.All }, options), { exclude: constant_1.DEFAULT_EXCLUDES.concat((_a = options.exclude) !== null && _a !== void 0 ? _a : []), extensions: [...new Set(this.moduleExtensions.concat((_b = options.extensions) !== null && _b !== void 0 ? _b : []))] });
        this.app = (_c = options.app) !== null && _c !== void 0 ? _c : new application_1.ArtusApplication();
    }
    async initItemMap() {
        this.itemMap = new Map(this.options.loaderListGenerator(constant_1.DEFAULT_LOADER_LIST_WITH_ORDER).map(loaderNameOrClazz => {
            if (typeof loaderNameOrClazz === 'string') {
                return [loaderNameOrClazz, []];
            }
            const loaderClazz = loaderNameOrClazz;
            const loaderName = Reflect.getMetadata(constant_1.LOADER_NAME_META, loaderClazz);
            if (!loaderName) {
                throw new Error(`Loader ${loaderClazz.name} must have a @DefineLoader() decorator.`);
            }
            return [loaderName, []];
        }));
    }
    async scanEnvList(root) {
        const { configDir, envs } = this.options;
        if (Array.isArray(envs) && envs.length) {
            return envs;
        }
        const absoluteConfigDir = path.resolve(root, configDir);
        const configFileList = (await (0, fs_1.exists)(absoluteConfigDir)) ? await fs.readdir(absoluteConfigDir) : [];
        const envSet = new Set([constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT]);
        for (const configFilename of configFileList) {
            if (configFilename.endsWith('.d.ts')) {
                continue;
            }
            const env = configuration_1.default.getEnvFromFilename(configFilename);
            envSet.add(env);
        }
        return [...envSet];
    }
    async scan(root) {
        if (!path.isAbsolute(root)) {
            // make sure the root path is absolute
            root = path.resolve(root);
        }
        const result = {};
        const envList = await this.scanEnvList(root);
        for (const env of envList) {
            result[env] = await this.scanManifestByEnv(root, env);
        }
        if (this.options.needWriteFile) {
            await this.writeFile(path.resolve(root, 'manifest.json'), JSON.stringify(result, null, 2));
        }
        return result;
    }
    async scanManifestByEnv(root, env) {
        var _a, _b;
        // 0. init clean itemMap
        await this.initItemMap();
        // 1. Pre-Scan all config files
        const config = await this.getAllConfig(root, env);
        // 2. scan all file in framework
        const frameworkConfig = (_a = config.framework) !== null && _a !== void 0 ? _a : this.options.framework;
        const frameworkDirs = await this.getFrameworkDirs(frameworkConfig, root, env);
        for (const frameworkDir of frameworkDirs) {
            await this.walk(frameworkDir, this.formatWalkOptions('framework', frameworkDir));
        }
        // 3. scan all file in plugin
        if (this.tmpConfigStore.has(env)) {
            const configList = (_b = this.tmpConfigStore.get(env)) !== null && _b !== void 0 ? _b : [];
            configList.forEach(config => this.configHandle.setConfig(env, config));
        }
        const { plugin } = this.configHandle.getMergedConfig(env);
        const pluginConfig = deepmerge_1.default.all([plugin || {}, this.options.plugin || {}]);
        const pluginSortedList = await plugin_1.PluginFactory.createFromConfig(pluginConfig, {
            logger: this.app.logger,
        });
        for (const plugin of pluginSortedList) {
            if (!plugin.enable)
                continue;
            this.setPluginMeta(plugin);
            await this.walk(plugin.importPath, this.formatWalkOptions('plugin', plugin.importPath, plugin.name, plugin.metadata));
        }
        // 4. scan all file in app
        await this.walk(root, this.formatWalkOptions('app', root, ''));
        const relative = this.options.useRelativePath;
        if (relative) {
            for (const [pluginName, pluginConfigItem] of Object.entries(pluginConfig)) {
                if (pluginConfigItem.path) {
                    pluginConfig[pluginName].path = path.relative(root, pluginConfigItem.path);
                }
            }
        }
        const result = {
            pluginConfig,
            items: this.getItemsFromMap(relative, root, env),
            relative,
        };
        return result;
    }
    async walk(root, options) {
        await utils_1.ScanUtils.walk(root, options);
    }
    setPluginMeta(plugin) {
        if (!this.itemMap.has('plugin-meta')) {
            this.itemMap.set('plugin-meta', []);
        }
        const metaList = this.itemMap.get('plugin-meta');
        metaList.push({
            path: plugin.metaFilePath,
            extname: path.extname(plugin.metaFilePath),
            filename: path.basename(plugin.metaFilePath),
            loader: 'plugin-meta',
            source: 'plugin',
            unitName: plugin.name,
        });
    }
    async getAllConfig(baseDir, env) {
        var _a;
        const configDir = this.getConfigDir(baseDir, this.options.configDir);
        if (!configDir) {
            return {};
        }
        const root = path.resolve(baseDir, configDir);
        const configFileList = (await (0, fs_1.exists)(root)) ? await fs.readdir(root) : [];
        const container = new injection_1.Container(constant_1.ArtusInjectEnum.DefaultContainerName);
        container.set({ type: configuration_1.default });
        container.set({
            id: constant_1.ArtusInjectEnum.Application,
            value: this.app,
        });
        const loaderFactory = loader_1.LoaderFactory.create(container);
        const configItemList = await Promise.all(configFileList.map(async (filename) => {
            const extname = path.extname(filename);
            if (utils_1.ScanUtils.isExclude(filename, extname, this.options.exclude, this.options.extensions)) {
                return null;
            }
            let { loader } = await loaderFactory.findLoaderName({
                filename,
                baseDir,
                root,
                configDir,
                policy: this.options.policy,
            });
            if (loader === 'framework-config') {
                // SEEME: framework-config is a special loader, cannot be used when scan, need refactor later
                loader = 'config';
            }
            return {
                path: path.resolve(root, filename),
                extname,
                filename,
                loader,
                source: 'config',
                loaderState: {
                    baseDir,
                },
            };
        }));
        await loaderFactory.loadItemList(configItemList.filter(v => v));
        const configurationHandler = container.get(configuration_1.default);
        const config = configurationHandler.getMergedConfig(env);
        let configList = [config];
        if (this.tmpConfigStore.has(env)) {
            // equal unshift config to configList
            configList = configList.concat((_a = this.tmpConfigStore.get(env)) !== null && _a !== void 0 ? _a : []);
        }
        this.tmpConfigStore.set(env, configList);
        return config;
    }
    getConfigDir(root, dir) {
        if (utils_1.ScanUtils.exist(root, [dir])) {
            return dir;
        }
        if (utils_1.ScanUtils.exist(root, [constant_1.DEFAULT_CONFIG_DIR])) {
            return constant_1.DEFAULT_CONFIG_DIR;
        }
        return '';
    }
    async getFrameworkDirs(config, root, env, dirs = []) {
        if (!config || (!config.path && !config.package)) {
            return dirs;
        }
        const frameworkBaseDir = await framework_1.FrameworkHandler.handle(root, config);
        dirs.unshift(frameworkBaseDir);
        // scan recurse
        const configInFramework = await this.getAllConfig(frameworkBaseDir, env);
        const frameworkDirs = await this.getFrameworkDirs(configInFramework.framework, frameworkBaseDir, env, dirs);
        return frameworkDirs;
    }
    formatWalkOptions(source, baseDir, unitName, metaInfo) {
        var _a, _b;
        const opts = {
            itemMap: this.itemMap,
            source,
            baseDir,
            unitName: unitName !== null && unitName !== void 0 ? unitName : baseDir,
            extensions: this.options.extensions,
            exclude: this.options.exclude,
            configDir: this.options.configDir,
            policy: this.options.policy,
        };
        if (source === 'plugin') {
            // TODO: Only support plugin meta now, need cover framework meta later
            opts.exclude = constant_1.DEFAULT_EXCLUDES.concat((_a = metaInfo.exclude) !== null && _a !== void 0 ? _a : []);
            opts.configDir = (_b = metaInfo.configDir) !== null && _b !== void 0 ? _b : this.options.configDir;
        }
        return opts;
    }
    getItemsFromMap(relative, appRoot, env) {
        let items = [];
        for (const [, unitItems] of this.itemMap) {
            items = items.concat(unitItems);
        }
        relative && items.forEach(item => (item.path = path.relative(appRoot, item.path)));
        return items.filter(item => {
            // remove other env config
            if (item.loader === 'config' || item.loader === 'framework-config') {
                const { env: filenameEnv } = (0, config_file_meta_1.getConfigMetaFromFilename)(item.filename);
                if (env !== filenameEnv && filenameEnv !== constant_1.ARTUS_DEFAULT_CONFIG_ENV.DEFAULT) {
                    return false;
                }
            }
            return true;
        });
    }
    async writeFile(filename = 'manifest.json', data) {
        await fs.writeFile(filename, data);
    }
}
exports.Scanner = Scanner;
