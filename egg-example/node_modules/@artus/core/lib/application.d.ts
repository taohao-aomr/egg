import 'reflect-metadata';
import { Container } from '@artus/injection';
import { ArtusStdError } from './exception';
import { HookFunction, LifecycleManager } from './lifecycle';
import { LoaderFactory, Manifest } from './loader';
import { Application, ApplicationInitOptions } from './types';
import ConfigurationHandler from './configuration';
import { LoggerType } from './logger';
export declare class ArtusApplication implements Application {
    manifest?: Manifest;
    container: Container;
    protected lifecycleManager: LifecycleManager;
    protected loaderFactory: LoaderFactory;
    constructor(opts?: ApplicationInitOptions);
    get config(): Record<string, any>;
    get frameworks(): Record<string, any>;
    get packages(): Record<string, any>;
    get configurationHandler(): ConfigurationHandler;
    get logger(): LoggerType;
    loadDefaultClass(): void;
    load(manifest: Manifest, root?: string): Promise<this>;
    run(): Promise<void>;
    registerHook(hookName: string, hookFn: HookFunction): void;
    close(exit?: boolean): Promise<void>;
    throwException(code: string): void;
    createException(code: string): ArtusStdError;
    protected addLoaderListener(): void;
}
