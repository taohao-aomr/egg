"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrameworkPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const utils_1 = require("./utils");
const initCwd = process.cwd();
/**
 * Find the framework directory, lookup order
 * - specify framework path
 * - get framework name from
 * - use egg by default
 * @param {Object} options - options
 * @param  {String} options.baseDir - the current directory of application
 * @param  {String} [options.framework] - the directory of framework
 * @return {String} frameworkPath
 */
function getFrameworkPath(options) {
    const { framework, baseDir } = options;
    const pkgPath = node_path_1.default.join(baseDir, 'package.json');
    (0, node_assert_1.default)((0, node_fs_1.existsSync)(pkgPath), `${pkgPath} should exist`);
    const moduleDir = node_path_1.default.join(baseDir, 'node_modules');
    // 1. pass framework or customEgg
    if (framework) {
        // 1.1 framework is an absolute path
        // framework: path.join(baseDir, 'node_modules/${frameworkName}')
        if (node_path_1.default.isAbsolute(framework)) {
            (0, node_assert_1.default)((0, node_fs_1.existsSync)(framework), `${framework} should exist`);
            return framework;
        }
        // 1.2 framework is a npm package that required by application
        // framework: 'frameworkName'
        return assertAndReturn(framework, moduleDir);
    }
    const pkg = (0, utils_1.readJSONSync)(pkgPath);
    // 2. framework is not specified
    // 2.1 use framework name from pkg.egg.framework
    if (pkg.egg?.framework) {
        return assertAndReturn(pkg.egg.framework, moduleDir);
    }
    // 2.2 use egg by default
    return assertAndReturn('egg', moduleDir);
}
exports.getFrameworkPath = getFrameworkPath;
function assertAndReturn(frameworkName, moduleDir) {
    const moduleDirs = new Set([
        moduleDir,
        // find framework from process.cwd, especially for test,
        // the application is in test/fixtures/app,
        // and framework is install in ${cwd}/node_modules
        node_path_1.default.join(process.cwd(), 'node_modules'),
        // prevent from mocking process.cwd
        node_path_1.default.join(initCwd, 'node_modules'),
    ]);
    try {
        // find framework from global, especially for monorepo
        let globalModuleDir;
        // if frameworkName is scoped package, like @ali/egg
        if (frameworkName.startsWith('@') && frameworkName.includes('/')) {
            globalModuleDir = node_path_1.default.join(require.resolve(`${frameworkName}/package.json`), '../../..');
        }
        else {
            globalModuleDir = node_path_1.default.join(require.resolve(`${frameworkName}/package.json`), '../..');
        }
        moduleDirs.add(globalModuleDir);
    }
    catch (err) {
        // ignore
    }
    for (const moduleDir of moduleDirs) {
        const frameworkPath = node_path_1.default.join(moduleDir, frameworkName);
        if ((0, node_fs_1.existsSync)(frameworkPath))
            return frameworkPath;
    }
    throw new Error(`${frameworkName} is not found in ${Array.from(moduleDirs)}`);
}
