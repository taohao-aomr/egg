"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInlinePackageEntryPath = exports.getPackagePath = exports.topologicalSort = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const compatible_require_1 = tslib_1.__importDefault(require("../utils/compatible_require"));
// A utils function that toplogical sort plugins
function topologicalSort(pluginInstanceMap, pluginDepEdgeList) {
    var _a;
    const res = [];
    const indegree = new Map();
    pluginDepEdgeList.forEach(([to]) => {
        var _a;
        indegree.set(to, ((_a = indegree.get(to)) !== null && _a !== void 0 ? _a : 0) + 1);
    });
    const queue = [];
    for (const [name] of pluginInstanceMap) {
        if (!indegree.has(name)) {
            queue.push(name);
        }
    }
    while (queue.length) {
        const cur = queue.shift();
        res.push(cur);
        for (const [to, from] of pluginDepEdgeList) {
            if (from === cur) {
                indegree.set(to, ((_a = indegree.get(to)) !== null && _a !== void 0 ? _a : 0) - 1);
                if (indegree.get(to) === 0) {
                    queue.push(to);
                }
            }
        }
    }
    return res;
}
exports.topologicalSort = topologicalSort;
// A util function of get package path for plugin
function getPackagePath(packageName, paths) {
    const opts = paths ? { paths } : undefined;
    return path_1.default.resolve(require.resolve(packageName, opts), '..');
}
exports.getPackagePath = getPackagePath;
async function getInlinePackageEntryPath(packagePath) {
    var _a;
    const pkgJson = await (0, compatible_require_1.default)(`${packagePath}/package.json`);
    let entryFilePath = '';
    if (pkgJson.exports) {
        if (Array.isArray(pkgJson.exports)) {
            throw new Error(`inline package multi exports is not supported`);
        }
        else if (typeof pkgJson.exports === 'string') {
            entryFilePath = pkgJson.exports;
        }
        else if ((_a = pkgJson.exports) === null || _a === void 0 ? void 0 : _a['.']) {
            entryFilePath = pkgJson.exports['.'];
        }
    }
    if (!entryFilePath && pkgJson.main) {
        entryFilePath = pkgJson.main;
    }
    // will use package root path if no entry file found
    return entryFilePath ? path_1.default.resolve(packagePath, entryFilePath, '..') : packagePath;
}
exports.getInlinePackageEntryPath = getInlinePackageEntryPath;
