"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtusApplication = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const injection_1 = require("@artus/injection");
const constant_1 = require("./constant");
const exception_1 = require("./exception");
const lifecycle_1 = require("./lifecycle");
const loader_1 = require("./loader");
const trigger_1 = tslib_1.__importDefault(require("./trigger"));
const configuration_1 = tslib_1.__importDefault(require("./configuration"));
const logger_1 = require("./logger");
class ArtusApplication {
    constructor(opts) {
        var _a;
        this.container = new injection_1.Container((_a = opts === null || opts === void 0 ? void 0 : opts.containerName) !== null && _a !== void 0 ? _a : constant_1.ArtusInjectEnum.DefaultContainerName);
        this.lifecycleManager = new lifecycle_1.LifecycleManager(this, this.container);
        this.loaderFactory = loader_1.LoaderFactory.create(this.container);
        this.addLoaderListener();
        this.loadDefaultClass();
        process.on('SIGINT', () => this.close(true));
        process.on('SIGTERM', () => this.close(true));
    }
    get config() {
        return this.container.get(constant_1.ArtusInjectEnum.Config);
    }
    get frameworks() {
        return this.container.get(constant_1.ArtusInjectEnum.Frameworks);
    }
    get packages() {
        return this.container.get(constant_1.ArtusInjectEnum.Packages);
    }
    get configurationHandler() {
        return this.container.get(configuration_1.default);
    }
    get logger() {
        return this.container.get(logger_1.Logger);
    }
    loadDefaultClass() {
        // load Artus default clazz
        this.container.set({ id: injection_1.Container, value: this.container });
        this.container.set({ id: constant_1.ArtusInjectEnum.Application, value: this });
        this.container.set({ id: constant_1.ArtusInjectEnum.LifecycleManager, value: this.lifecycleManager });
        this.container.set({ type: configuration_1.default });
        this.container.set({ type: logger_1.Logger });
        this.container.set({ type: trigger_1.default });
    }
    async load(manifest, root = process.cwd()) {
        // Load user manifest
        this.manifest = manifest;
        await this.loaderFactory.loadManifest(manifest, manifest.relative ? root : undefined);
        await this.lifecycleManager.emitHook('didLoad');
        return this;
    }
    async run() {
        await this.lifecycleManager.emitHook('willReady'); // 通知协议实现层启动服务器
        await this.lifecycleManager.emitHook('didReady');
    }
    registerHook(hookName, hookFn) {
        this.lifecycleManager.registerHook(hookName, hookFn);
    }
    async close(exit = false) {
        try {
            await this.lifecycleManager.emitHook('beforeClose');
        }
        catch (e) {
            throw new Error(e);
        }
        if (exit) {
            process.exit(0);
        }
    }
    throwException(code) {
        throw new exception_1.ArtusStdError(code);
    }
    createException(code) {
        return new exception_1.ArtusStdError(code);
    }
    addLoaderListener() {
        this.loaderFactory
            .addLoaderListener('config', {
            before: () => this.lifecycleManager.emitHook('configWillLoad'),
            after: () => {
                this.container.set({
                    id: constant_1.ArtusInjectEnum.Config,
                    value: this.configurationHandler.getAllConfig(),
                });
                return this.lifecycleManager.emitHook('configDidLoad');
            },
        })
            .addLoaderListener('framework-config', {
            after: () => this.container.set({
                id: constant_1.ArtusInjectEnum.Frameworks,
                value: this.configurationHandler.getFrameworkConfig(),
            }),
        })
            .addLoaderListener('package-json', {
            after: () => this.container.set({
                id: constant_1.ArtusInjectEnum.Packages,
                value: this.configurationHandler.getPackages(),
            }),
        });
    }
}
exports.ArtusApplication = ArtusApplication;
