"use strict";
/**
 * Getting plugin info in child_process to prevent effecting egg application( splitting scopes ).
 */
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const utils = __importStar(require("../utils"));
const cwd = process.cwd();
const eggInfo = {};
const startTime = Date.now();
if (utils.checkMaybeIsTsProj(cwd)) {
    // only require ts-node in ts project
    const tsconfigPath = path_1.default.resolve(cwd, './tsconfig.json');
    if (fs_1.default.existsSync(tsconfigPath)) {
        require('ts-node').register(utils.readJson5(tsconfigPath));
    }
    else {
        require('ts-node/register');
    }
}
// try to read postinstall script env.ETS_SCRIPT_FRAMEWORK, let egg-bin can auto set the default framework
const framework = (utils.getPkgInfo(cwd).egg || {}).framework || process.env.ETS_SCRIPT_FRAMEWORK || 'egg';
const loader = getLoader(cwd, framework);
if (loader) {
    try {
        loader.loadPlugin();
    }
    catch (e) {
        console.warn('[egg-ts-helper] WARN loader.loadPlugin() error: %s, cwd: %s, framework: %s', e, cwd, framework);
        // do nothing
    }
    // hack loadFile, ignore config file without customLoader for faster booting
    mockFn(loader, 'loadFile', filepath => {
        if (filepath && filepath.substring(filepath.lastIndexOf(path_1.default.sep) + 1).startsWith('config.')) {
            const fileContent = fs_1.default.readFileSync(filepath, 'utf-8');
            if (!fileContent.includes('customLoader'))
                return;
        }
        return true;
    });
    try {
        loader.loadConfig();
    }
    catch (e) {
        console.warn('[egg-ts-helper] WARN loader.loadConfig() error: %s, cwd: %s, framework: %s', e, cwd, framework);
        // do nothing
    }
    eggInfo.plugins = loader.allPlugins;
    eggInfo.config = loader.config;
    eggInfo.eggPaths = loader.eggPaths;
    eggInfo.timing = Date.now() - startTime;
}
utils.writeFileSync(config_1.eggInfoPath, JSON.stringify(eggInfo));
/* istanbul ignore next */
function noop() { }
function mockFn(obj, name, fn) {
    const oldFn = obj[name];
    obj[name] = (...args) => {
        const result = fn.apply(obj, args);
        if (result)
            return oldFn.apply(obj, args);
    };
}
function getLoader(baseDir, framework) {
    let frameworkPath = '';
    try {
        frameworkPath = require.resolve(framework, { paths: [baseDir] });
    }
    catch (_) {
        // ignore error
    }
    if (!frameworkPath) {
        frameworkPath = path_1.default.join(baseDir, 'node_modules', framework);
    }
    const eggCore = findEggCore(baseDir, frameworkPath);
    if (!eggCore) {
        console.warn('[egg-ts-helper] WARN cannot find egg core from frameworkPath: %s', frameworkPath);
        return;
    }
    const EggLoader = eggCore.EggLoader;
    const egg = utils.requireFile(frameworkPath) || utils.requireFile(framework);
    if (!egg || !egg.Application || !EggLoader)
        return;
    process.env.EGG_SERVER_ENV = 'local';
    return new EggLoader({
        baseDir,
        logger: {
            debug: noop,
            info: noop,
            warn: noop,
            error: noop,
        },
        app: Object.create(egg.Application.prototype),
    });
}
function findEggCore(baseDir, frameworkPath) {
    let eggCorePath = '';
    try {
        eggCorePath = require.resolve('egg-core', { paths: [frameworkPath] });
    }
    catch (_) {
        // ignore error
    }
    if (!eggCorePath) {
        eggCorePath = path_1.default.join(baseDir, 'node_modules/egg-core');
        if (!fs_1.default.existsSync(eggCorePath)) {
            eggCorePath = path_1.default.join(frameworkPath, 'node_modules/egg-core');
        }
    }
    // try to load egg-core in cwd
    const eggCore = utils.requireFile(eggCorePath);
    if (!eggCore) {
        // try to resolve egg-core
        return utils.requireFile('egg-core');
    }
    return eggCore;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWdnSW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JpcHRzL2VnZ0luZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixzQ0FBd0M7QUFDeEMsZ0RBQWtDO0FBRWxDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLE9BQU8sR0FBd0IsRUFBRSxDQUFDO0FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUU3QixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNqQyxxQ0FBcUM7SUFDckMsTUFBTSxZQUFZLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUMxRCxJQUFJLFlBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDL0IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDNUQ7U0FBTTtRQUNMLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzdCO0NBQ0Y7QUFFRCwwR0FBMEc7QUFDMUcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxLQUFLLENBQUM7QUFDM0csTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6QyxJQUFJLE1BQU0sRUFBRTtJQUNWLElBQUk7UUFDRixNQUFNLENBQUMsVUFBVSxFQUFF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