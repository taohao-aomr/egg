import 'reflect-metadata';
import { Manifest } from '../loader';
import { ScannerOptions } from './types';
export declare class Scanner {
    private moduleExtensions;
    private options;
    private itemMap;
    private tmpConfigStore;
    private configHandle;
    private app;
    constructor(options?: Partial<ScannerOptions>);
    private initItemMap;
    private scanEnvList;
    scan(root: string): Promise<Record<string, Manifest>>;
    private scanManifestByEnv;
    private walk;
    private setPluginMeta;
    private getAllConfig;
    private getConfigDir;
    private getFrameworkDirs;
    private formatWalkOptions;
    private getItemsFromMap;
    private writeFile;
}
