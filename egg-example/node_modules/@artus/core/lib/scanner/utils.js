"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanUtils = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs/promises"));
const fs_1 = require("fs");
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const loader_1 = require("../loader");
const utils_1 = require("../utils");
class ScanUtils {
    static async walk(root, options) {
        var _a;
        const { source, unitName, baseDir, configDir } = options;
        if (!(0, fs_1.existsSync)(root)) {
            // TODO: use artus logger instead
            console.warn(`[scan->walk] ${root} is not exists.`);
            return;
        }
        const stat = await fs.stat(root);
        if (!stat.isDirectory()) {
            return;
        }
        const items = await fs.readdir(root);
        for (const item of items) {
            const realPath = path.resolve(root, item);
            const extname = path.extname(realPath);
            if (this.isExclude(item, extname, options.exclude, options.extensions)) {
                continue;
            }
            const itemStat = await fs.stat(realPath);
            if (itemStat.isDirectory()) {
                // ignore plugin dir
                if (this.exist(realPath, [constant_1.PLUGIN_META_FILENAME])) {
                    continue;
                }
                await ScanUtils.walk(realPath, options);
                continue;
            }
            if (itemStat.isFile()) {
                if (!extname) {
                    // Exclude file without extname
                    continue;
                }
                const filename = path.basename(realPath);
                const filenameWithoutExt = path.basename(realPath, extname);
                const loaderFindResult = await ScanUtils.loaderFactory.findLoader({
                    filename,
                    root,
                    baseDir,
                    configDir,
                    policy: options.policy,
                });
                if (!loaderFindResult) {
                    continue;
                }
                const { loaderName, loaderState } = loaderFindResult;
                const item = {
                    path: options.extensions.includes(extname) ? path.resolve(root, filenameWithoutExt) : realPath,
                    extname,
                    filename,
                    loader: loaderName,
                    source,
                };
                if (loaderState) {
                    item.loaderState = loaderState;
                }
                unitName && (item.unitName = unitName);
                const itemList = options.itemMap.get((_a = item.loader) !== null && _a !== void 0 ? _a : constant_1.DEFAULT_LOADER);
                if (Array.isArray(itemList)) {
                    itemList.push(item);
                }
            }
        }
    }
    static isExclude(filename, extname, exclude, extensions) {
        let result = false;
        if (!result && exclude) {
            result = (0, utils_1.isMatch)(filename, exclude);
        }
        if (!result && extname) {
            result = !extensions.includes(extname);
        }
        return result;
    }
    static exist(dir, filenames) {
        return filenames.some(filename => {
            return (0, fs_1.existsSync)(path.resolve(dir, `${filename}`));
        });
    }
}
exports.ScanUtils = ScanUtils;
ScanUtils.loaderFactory = loader_1.LoaderFactory.create(new injection_1.Container(constant_1.ArtusInjectEnum.DefaultContainerName));
