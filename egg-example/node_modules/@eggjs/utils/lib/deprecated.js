"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrameworkOrEggPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const utils_1 = require("./utils");
/**
 * Try to get framework dir path
 * If can't find any framework, try to find egg dir path
 *
 * @param {String} cwd - current work path
 * @param {Array} [eggNames] - egg names, default is ['egg']
 * @return {String} framework or egg dir path
 * @deprecated
 */
function getFrameworkOrEggPath(cwd, eggNames) {
    eggNames = eggNames || ['egg'];
    const moduleDir = node_path_1.default.join(cwd, 'node_modules');
    if (!(0, node_fs_1.existsSync)(moduleDir)) {
        return '';
    }
    // try to get framework
    // 1. try to read egg.framework property on package.json
    const pkgFile = node_path_1.default.join(cwd, 'package.json');
    if ((0, node_fs_1.existsSync)(pkgFile)) {
        const pkg = (0, utils_1.readJSONSync)(pkgFile);
        if (pkg.egg && pkg.egg.framework) {
            return node_path_1.default.join(moduleDir, pkg.egg.framework);
        }
    }
    // 2. try the module dependencies includes eggNames
    const names = (0, node_fs_1.readdirSync)(moduleDir);
    for (const name of names) {
        const pkgfile = node_path_1.default.join(moduleDir, name, 'package.json');
        if (!(0, node_fs_1.existsSync)(pkgfile)) {
            continue;
        }
        const pkg = (0, utils_1.readJSONSync)(pkgfile);
        if (pkg.dependencies) {
            for (const eggName of eggNames) {
                if (pkg.dependencies[eggName]) {
                    return node_path_1.default.join(moduleDir, name);
                }
            }
        }
    }
    // try to get egg
    for (const eggName of eggNames) {
        const pkgfile = node_path_1.default.join(moduleDir, eggName, 'package.json');
        if ((0, node_fs_1.existsSync)(pkgfile)) {
            return node_path_1.default.join(moduleDir, eggName);
        }
    }
    return '';
}
exports.getFrameworkOrEggPath = getFrameworkOrEggPath;
