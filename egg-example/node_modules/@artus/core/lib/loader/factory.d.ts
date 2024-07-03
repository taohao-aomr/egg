import { Container } from '@artus/injection';
import { Manifest, ManifestItem, LoaderConstructor, Loader, LoaderFindOptions, LoaderFindResult } from './types';
import ConfigurationHandler from '../configuration';
import { LifecycleManager } from '../lifecycle';
import { LoaderEventListener } from './loader_event';
export declare class LoaderFactory {
    private container;
    private static loaderClazzMap;
    private loaderEmitter;
    static register(clazz: LoaderConstructor): void;
    constructor(container: Container);
    static create(container: Container): LoaderFactory;
    get lifecycleManager(): LifecycleManager;
    get configurationHandler(): ConfigurationHandler;
    addLoaderListener(eventName: string, listener: LoaderEventListener): this;
    removeLoaderListener(eventName: string, stage?: 'before' | 'after'): this;
    getLoader(loaderName: string): Loader;
    loadManifest(manifest: Manifest, root?: string): Promise<void>;
    loadItemList(itemList?: ManifestItem[], root?: string): Promise<void>;
    loadItem(item: ManifestItem): Promise<any>;
    findLoader(opts: LoaderFindOptions): Promise<LoaderFindResult | null>;
    findLoaderName(opts: LoaderFindOptions): Promise<{
        loader: string | null;
        exportNames: string[];
    }>;
}
