"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = exports.BaseGenerator = exports.TsHelper = exports.createTsHelperInstance = exports.getDefaultGeneratorConfig = exports.defaultConfig = void 0;
const assert_1 = __importDefault(require("assert"));
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const generator = __importStar(require("./generator"));
exports.generator = generator;
const dot_prop_1 = require("dot-prop");
const config_1 = require("./config");
const watcher_1 = __importDefault(require("./watcher"));
const base_1 = require("./generators/base");
Object.defineProperty(exports, "BaseGenerator", { enumerable: true, get: function () { return base_1.BaseGenerator; } });
const utils = __importStar(require("./utils"));
const globby_1 = __importDefault(require("globby"));
const isInUnitTest = process.env.NODE_ENV === 'test';
exports.defaultConfig = {
    cwd: utils.convertString(process.env.ETS_CWD, process.cwd()),
    framework: utils.convertString(process.env.ETS_FRAMEWORK, 'egg'),
    typings: utils.convertString(process.env.ETS_TYPINGS, './typings'),
    caseStyle: utils.convertString(process.env.ETS_CASE_STYLE, 'lower'),
    autoRemoveJs: utils.convertString(process.env.ETS_AUTO_REMOVE_JS, true),
    throttle: utils.convertString(process.env.ETS_THROTTLE, 500),
    watch: utils.convertString(process.env.ETS_WATCH, false),
    watchOptions: undefined,
    execAtInit: utils.convertString(process.env.ETS_EXEC_AT_INIT, false),
    silent: utils.convertString(process.env.ETS_SILENT, isInUnitTest),
    generatorConfig: {},
    configFile: utils.convertString(process.env.ETS_CONFIG_FILE, '') || ['./tshelper', './tsHelper'],
};
// default watch dir
function getDefaultGeneratorConfig(opt) {
    const baseConfig = {};
    // extend
    baseConfig.extend = {
        directory: 'app/extend',
        generator: 'extend',
    };
    // controller
    baseConfig.controller = {
        directory: 'app/controller',
        interface: config_1.declMapping.controller,
        generator: 'class',
    };
    // middleware
    baseConfig.middleware = {
        directory: 'app/middleware',
        interface: config_1.declMapping.middleware,
        generator: 'object',
    };
    // proxy
    baseConfig.proxy = {
        directory: 'app/proxy',
        interface: 'IProxy',
        generator: 'class',
        enabled: false,
    };
    // model
    baseConfig.model = {
        directory: 'app/model',
        generator: 'function',
        interface: 'IModel',
        caseStyle: 'upper',
        enabled: !(0, dot_prop_1.get)(opt?.eggInfo, 'config.customLoader.model'),
    };
    // config
    baseConfig.config = {
        directory: 'config',
        generator: 'config',
        trigger: ['add', 'unlink', 'change'],
    };
    // plugin
    baseConfig.plugin = {
        directory: 'config',
        generator: 'plugin',
        trigger: ['add', 'unlink', 'change'],
    };
    // service
    baseConfig.service = {
        directory: 'app/service',
        interface: config_1.declMapping.service,
        generator: 'auto',
    };
    // egg
    baseConfig.egg = {
        directory: 'app',
        generator: 'egg',
        watch: false,
    };
    // custom loader
    baseConfig.customLoader = {
        generator: 'custom',
        trigger: ['add', 'unlink', 'change'],
    };
    return baseConfig;
}
exports.getDefaultGeneratorConfig = getDefaultGeneratorConfig;
class TsHelper extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.watcherList = [];
        this.cacheDist = {};
        this.dtsFileList = [];
        // utils
        this.utils = utils;
        // configure ets
        this.configure(options);
        // init watcher
        this.initWatcher();
    }
    // build all watcher
    build() {
        // clean old files
        this.cleanFiles();
        this.watcherList.forEach(watcher => watcher.execute());
        return this;
    }
    // destroy
    destroy() {
        this.removeAllListeners();
        this.watcherList.forEach(item => item.destroy());
        this.watcherList.length = 0;
    }
    // log
    log(info, ignoreSilent) {
        if (!ignoreSilent && this.config.silent) {
            return;
        }
        utils.log(info);
    }
    warn(info) {
        this.log(chalk_1.default.yellow(info), !isInUnitTest);
    }
    // create oneForAll file
    createOneForAll(dist) {
        const config = this.config;
        const oneForAllDist = (typeof dist === 'string') ? dist : path_1.default.join(config.typings, './ets.d.ts');
        const oneForAllDistDir = path_1.default.dirname(oneForAllDist);
        // create d.ts includes all types.
        const distContent = config_1.dtsComment + this.dtsFileList
            .map(file => {
            const importUrl = path_1.default
                .relative(oneForAllDistDir, file.replace(/\.d\.ts$/, ''))
                .replace(/\/|\\/g, '/');
            return `import '${importUrl.startsWith('.') ? importUrl : `./${importUrl}`}';`;
        })
            .join('\n');
        this.emit('update', oneForAllDist);
        utils.writeFileSync(oneForAllDist, distContent);
    }
    // init watcher
    initWatcher() {
        Object.keys(this.config.generatorConfig).forEach(key => {
            this.registerWatcher(key, this.config.generatorConfig[key], false);
        });
    }
    // destroy watcher
    destroyWatcher(...refs) {
        this.watcherList = this.watcherList.filter(w => {
            if (refs.includes(w.ref)) {
                w.destroy();
                return false;
            }
            return true;
        });
    }
    // clean old files in startup
    cleanFiles() {
        const cwd = this.config.typings;
        globby_1.default.sync(['**/*.d.ts', '!**/node_modules'], { cwd })
            .forEach(file => {
            const fileUrl = path_1.default.resolve(cwd, file);
            const content = fs_1.default.readFileSync(fileUrl, 'utf-8');
            const isGeneratedByEts = content.match(config_1.dtsCommentRE);
            if (isGeneratedByEts)
                fs_1.default.unlinkSync(fileUrl);
        });
    }
    // register watcher
    registerWatcher(name, watchConfig, removeDuplicate = true) {
        if (removeDuplicate) {
            this.destroyWatcher(name);
        }
        if (watchConfig.hasOwnProperty('enabled') && !watchConfig.enabled) {
            return;
        }
        const directories = Array.isArray(watchConfig.directory)
            ? watchConfig.directory
            : [watchConfig.directory];
        // support array directory.
        return directories.map(dir => {
            const options = {
                name,
                ref: name,
                execAtInit: this.config.execAtInit,
                ...watchConfig,
            };
            if (dir) {
                options.directory = dir;
            }
            if (!this.config.watch) {
                options.watch = false;
            }
            const watcher = new watcher_1.default(this);
            watcher.on('update', this.generateTs.bind(this));
            watcher.init(options);
            this.watcherList.push(watcher);
            return watcher;
        });
    }
    loadWatcherConfig(config, options) {
        const configFile = options.configFile || config.configFile;
        const eggInfo = config.eggInfo;
        const getConfigFromPkg = pkg => (pkg.egg || {}).tsHelper;
        // read from enabled plugins
        if (eggInfo.plugins) {
            Object.keys(eggInfo.plugins)
                .forEach(k => {
                const pluginInfo = eggInfo.plugins[k];
                if (pluginInfo.enable && pluginInfo.path) {
                    this.mergeConfig(config, getConfigFromPkg(utils.getPkgInfo(pluginInfo.path)));
                }
            });
        }
        // read from eggPaths
        if (eggInfo.eggPaths) {
            eggInfo.eggPaths.forEach(p => {
                this.mergeConfig(config, getConfigFromPkg(utils.getPkgInfo(p)));
            });
        }
        // read from package.json
        this.mergeConfig(config, getConfigFromPkg(utils.getPkgInfo(config.cwd)));
        // read from local file( default to tshelper | tsHelper )
        (Array.isArray(configFile) ? configFile : [configFile]).forEach(f => {
            this.mergeConfig(config, utils.requireFile(path_1.default.resolve(config.cwd, f)));
        });
        // merge local config and options to config
        this.mergeConfig(config, options);
        // create extra config
        config.tsConfig = utils.loadTsConfig(path_1.default.resolve(config.cwd, './tsconfig.json'));
    }
    // configure
    // options > configFile > package.json
    configure(options) {
        if (options.cwd) {
            options.cwd = path_1.default.resolve(exports.defaultConfig.cwd, options.cwd);
        }
        // base config
        const config = { ...exports.defaultConfig };
        config.id = crypto_1.default.randomBytes(16).toString('base64');
        config.cwd = options.cwd || config.cwd;
        config.customLoader = config.customLoader || options.customLoader;
        // load egg info
        config.eggInfo = utils.getEggInfo({
            cwd: config.cwd,
            cacheIndex: config.id,
            customLoader: config.customLoader,
        });
        config.framework = options.framework || exports.defaultConfig.framework;
        config.generatorConfig = getDefaultGeneratorConfig(config);
        config.typings = path_1.default.resolve(config.cwd, config.typings);
        this.config = config;
        // load watcher config
        this.loadWatcherConfig(this.config, options);
        // deprecated framework when env.ETS_FRAMEWORK exists
        if (this.config.framework && this.config.framework !== exports.defaultConfig.framework && process.env.ETS_FRAMEWORK) {
            this.warn(`options.framework are deprecated, using default value(${exports.defaultConfig.framework}) instead`);
        }
    }
    generateTs(result, file, startTime) {
        const updateTs = (result, file) => {
            const config = this.config;
            const resultList = Array.isArray(result) ? result : [result];
            for (const item of resultList) {
                // check cache
                if (this.isCached(item.dist, item.content)) {
                    return;
                }
                if (item.content) {
                    // create file
                    const dtsContent = `${config_1.dtsComment}\nimport '${config.framework}';\n${item.content}`;
                    utils.writeFileSync(item.dist, dtsContent);
                    this.emit('update', item.dist, file);
                    this.log(`create ${path_1.default.relative(this.config.cwd, item.dist)} (${Date.now() - startTime}ms)`);
                    this.updateDistFiles(item.dist);
                }
                else {
                    if (!fs_1.default.existsSync(item.dist)) {
                        return;
                    }
                    // remove file
                    fs_1.default.unlinkSync(item.dist);
                    delete this.cacheDist[item.dist];
                    this.emit('remove', item.dist, file);
                    this.log(`delete ${path_1.default.relative(this.config.cwd, item.dist)} (${Date.now() - startTime}ms)`);
                    this.updateDistFiles(item.dist, true);
                }
            }
        };
        if (typeof result.then === 'function') {
            return result
                .then(r => updateTs(r, file))
                .catch(e => { this.log(e.message); });
        }
        updateTs(result, file);
    }
    updateDistFiles(fileUrl, isRemove) {
        const index = this.dtsFileList.indexOf(fileUrl);
        if (index >= 0) {
            if (isRemove) {
                this.dtsFileList.splice(index, 1);
            }
        }
        else {
            this.dtsFileList.push(fileUrl);
        }
    }
    isCached(fileUrl, content) {
        const cacheItem = this.cacheDist[fileUrl];
        if (content && cacheItem === content) {
            // no need to create file content is not changed.
            return true;
        }
        this.cacheDist[fileUrl] = content;
        return false;
    }
    // support dot prop config
    formatConfig(config) {
        const newConfig = {};
        Object.keys(config).forEach(key => (0, dot_prop_1.set)(newConfig, key, config[key]));
        return newConfig;
    }
    // merge ts helper options
    mergeConfig(base, ...args) {
        args.forEach(opt => {
            if (!opt)
                return;
            const config = this.formatConfig(opt);
            // compatitable for alias of generatorCofig
            if (config.watchDirs)
                config.generatorConfig = config.watchDirs;
            Object.keys(config).forEach(key => {
                if (key !== 'generatorConfig') {
                    base[key] = config[key] === undefined ? base[key] : config[key];
                    return;
                }
                const generatorConfig = config.generatorConfig || {};
                Object.keys(generatorConfig).forEach(k => {
                    const item = generatorConfig[k];
                    if (typeof item === 'boolean') {
                        if (base.generatorConfig[k])
                            base.generatorConfig[k].enabled = item;
                    }
                    else if (item) {
                        // check private generator
                        (0, assert_1.default)(!generator.isPrivateGenerator(item.generator), `${item.generator} is a private generator, can not configure in config file`);
                        // compatible for deprecated fields
                        [
                            ['path', 'directory'],
                        ].forEach(([oldValue, newValue]) => {
                            if (item[oldValue]) {
                                item[newValue] = item[oldValue];
                            }
                        });
                        if (base.generatorConfig[k]) {
                            Object.assign(base.generatorConfig[k], item);
                        }
                        else {
                            base.generatorConfig[k] = item;
                        }
                    }
                });
            });
        });
    }
}
exports.default = TsHelper;
exports.TsHelper = TsHelper;
function createTsHelperInstance(options) {
    return new TsHelper(options);
}
exports.createTsHelperInstance = createTsHelperInstance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esb0RBQTRCO0FBQzVCLG1DQUFzQztBQUN0Qyw0Q0FBb0I7QUFDcEIsb0RBQTRCO0FBQzVCLGtEQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsdURBQXlDO0FBc2VJLDhCQUFTO0FBcmV0RCx1Q0FBMEQ7QUFDMUQscUNBQWlFO0FBQ2pFLHdEQUErQztBQUMvQyw0Q0FBa0Q7QUFrZXBCLDhGQWxlckIsb0JBQWEsT0FrZXFCO0FBamUzQywrQ0FBaUM7QUFFakMsb0RBQTBCO0FBQzFCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztBQXVEeEMsUUFBQSxhQUFhLEdBQUc7SUFDM0IsR0FBRyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzVELFNBQVMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztJQUNoRSxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUM7SUFDbEUsU0FBUyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO0lBQ25FLFlBQVksRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDO0lBQ3ZFLFFBQVEsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQztJQUM1RCxL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