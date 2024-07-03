"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderFactory = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const injection_1 = require("@artus/injection");
const constant_1 = require("../constant");
const configuration_1 = tslib_1.__importDefault(require("../configuration"));
const compatible_require_1 = tslib_1.__importDefault(require("../utils/compatible_require"));
const loader_event_1 = tslib_1.__importDefault(require("./loader_event"));
const is_1 = require("../utils/is");
class LoaderFactory {
    static register(clazz) {
        const loaderName = Reflect.getMetadata(constant_1.LOADER_NAME_META, clazz);
        this.loaderClazzMap.set(loaderName, clazz);
    }
    constructor(container) {
        this.container = container;
        this.loaderEmitter = new loader_event_1.default();
    }
    static create(container) {
        return new LoaderFactory(container);
    }
    get lifecycleManager() {
        return this.container.get(constant_1.ArtusInjectEnum.LifecycleManager);
    }
    get configurationHandler() {
        return this.container.get(configuration_1.default);
    }
    addLoaderListener(eventName, listener) {
        this.loaderEmitter.addListener(eventName, listener);
        return this;
    }
    removeLoaderListener(eventName, stage) {
        this.loaderEmitter.removeListener(eventName, stage);
        return this;
    }
    getLoader(loaderName) {
        const LoaderClazz = LoaderFactory.loaderClazzMap.get(loaderName);
        if (!LoaderClazz) {
            throw new Error(`Cannot find loader '${loaderName}'`);
        }
        return new LoaderClazz(this.container);
    }
    async loadManifest(manifest, root) {
        await this.loadItemList(manifest.items, root);
    }
    async loadItemList(itemList = [], root) {
        var _a;
        const itemMap = new Map(constant_1.DEFAULT_LOADER_LIST_WITH_ORDER.map(loaderName => [loaderName, []]));
        // group by loader names
        for (const item of itemList) {
            if (!itemMap.has(item.loader)) {
                // compatible for custom loader
                itemMap.set(item.loader, []);
            }
            itemMap.get(item.loader).push(Object.assign(Object.assign({}, item), { path: root ? path.join(root, item.path) : item.path, loader: (_a = item.loader) !== null && _a !== void 0 ? _a : constant_1.DEFAULT_LOADER }));
        }
        // trigger loader
        for (const [loaderName, itemList] of itemMap) {
            await this.loaderEmitter.emitBefore(loaderName);
            for (const item of itemList) {
                const curLoader = item.loader;
                await this.loaderEmitter.emitBeforeEach(curLoader, item);
                const result = await this.loadItem(item);
                await this.loaderEmitter.emitAfterEach(curLoader, item, result);
            }
            await this.loaderEmitter.emitAfter(loaderName);
        }
    }
    loadItem(item) {
        const loaderName = item.loader || constant_1.DEFAULT_LOADER;
        const loader = this.getLoader(loaderName);
        loader.state = item.loaderState;
        return loader.load(item);
    }
    async findLoader(opts) {
        const { loader: loaderName, exportNames } = await this.findLoaderName(opts);
        if (!loaderName) {
            return null;
        }
        const loaderClazz = LoaderFactory.loaderClazzMap.get(loaderName);
        if (!loaderClazz) {
            throw new Error(`Cannot find loader '${loaderName}'`);
        }
        const result = {
            loaderName,
            loaderState: { exportNames },
        };
        if (loaderClazz.onFind) {
            result.loaderState = await loaderClazz.onFind(opts);
        }
        return result;
    }
    async findLoaderName(opts) {
        var _a, _b;
        for (const [loaderName, LoaderClazz] of LoaderFactory.loaderClazzMap.entries()) {
            if (await ((_a = LoaderClazz.is) === null || _a === void 0 ? void 0 : _a.call(LoaderClazz, opts))) {
                return { loader: loaderName, exportNames: [] };
            }
        }
        const { root, filename, policy = constant_1.ScanPolicy.All } = opts;
        // require file for find loader
        const allExport = await (0, compatible_require_1.default)(path.join(root, filename), true);
        const exportNames = [];
        let loaders = Object.entries(allExport)
            .map(([name, targetClazz]) => {
            if (!(0, is_1.isClass)(targetClazz)) {
                // The file is not export with default class
                return null;
            }
            if (policy === constant_1.ScanPolicy.NamedExport && name === 'default') {
                return null;
            }
            if (policy === constant_1.ScanPolicy.DefaultExport && name !== 'default') {
                return null;
            }
            // get loader from reflect metadata
            const loaderMd = Reflect.getMetadata(constant_1.HOOK_FILE_LOADER, targetClazz);
            if (loaderMd === null || loaderMd === void 0 ? void 0 : loaderMd.loader) {
                exportNames.push(name);
                return loaderMd.loader;
            }
            // default loder with @Injectable
            const injectableMd = (0, injection_1.isInjectable)(targetClazz);
            if (injectableMd) {
                exportNames.push(name);
                return constant_1.DEFAULT_LOADER;
            }
        })
            .filter(v => v);
        loaders = Array.from(new Set(loaders));
        if (loaders.length > 1) {
            throw new Error(`Not support multiple loaders for ${path.join(root, filename)}`);
        }
        return { loader: (_b = loaders[0]) !== null && _b !== void 0 ? _b : null, exportNames };
    }
}
exports.LoaderFactory = LoaderFactory;
LoaderFactory.loaderClazzMap = new Map();
