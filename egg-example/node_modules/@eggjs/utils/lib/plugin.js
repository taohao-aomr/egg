"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.getLoadUnits = exports.getPlugins = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_os_1 = __importDefault(require("node:os"));
const node_fs_1 = require("node:fs");
const tmpDir = node_os_1.default.tmpdir();
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }
const logger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
};
/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/mixin/plugin.js#L203
 */
function getPlugins(options) {
    const loader = getLoader(options);
    loader.loadPlugin();
    return loader.allPlugins;
}
exports.getPlugins = getPlugins;
/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/egg_loader.js#L348
 */
function getLoadUnits(options) {
    const loader = getLoader(options);
    loader.loadPlugin();
    return loader.getLoadUnits();
}
exports.getLoadUnits = getLoadUnits;
function getConfig(options) {
    const loader = getLoader(options);
    loader.loadPlugin();
    loader.loadConfig();
    return loader.config;
}
exports.getConfig = getConfig;
function getLoader(options) {
    let { framework, baseDir, env } = options;
    (0, node_assert_1.default)(framework, 'framework is required');
    (0, node_assert_1.default)((0, node_fs_1.existsSync)(framework), `${framework} should exist`);
    if (!(baseDir && (0, node_fs_1.existsSync)(baseDir))) {
        baseDir = node_path_1.default.join(tmpDir, String(Date.now()), 'tmpapp');
        (0, node_fs_1.mkdirSync)(baseDir, { recursive: true });
        (0, node_fs_1.writeFileSync)(node_path_1.default.join(baseDir, 'package.json'), JSON.stringify({ name: 'tmpapp' }));
    }
    const EggLoader = findEggCore({ baseDir, framework });
    const { Application } = require(framework);
    if (env)
        process.env.EGG_SERVER_ENV = env;
    return new EggLoader({
        baseDir,
        logger,
        app: Object.create(Application.prototype),
    });
}
function findEggCore({ baseDir, framework }) {
    const baseDirRealpath = (0, node_fs_1.realpathSync)(baseDir);
    const frameworkRealpath = (0, node_fs_1.realpathSync)(framework);
    // custom framework => egg => egg/lib/loader/index.js
    try {
        return require(require.resolve('egg/lib/loader', {
            paths: [frameworkRealpath, baseDirRealpath],
        })).EggLoader;
    }
    catch {
        // ignore
    }
    const name = 'egg-core';
    // egg => egg-core
    try {
        return require(require.resolve(name, {
            paths: [frameworkRealpath, baseDirRealpath],
        })).EggLoader;
    }
    catch {
        // ignore
    }
    try {
        return require(name).EggLoader;
    }
    catch {
        let eggCorePath = node_path_1.default.join(baseDir, `node_modules/${name}`);
        if (!(0, node_fs_1.existsSync)(eggCorePath)) {
            eggCorePath = node_path_1.default.join(framework, `node_modules/${name}`);
        }
        (0, node_assert_1.default)((0, node_fs_1.existsSync)(eggCorePath), `Can't find ${name} from ${baseDir} and ${framework}`);
        return require(eggCorePath).EggLoader;
    }
}
