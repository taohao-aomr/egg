import { PluginConfigItem, PluginCreateOptions, PluginMap, PluginMetadata, PluginType } from './types';
export declare class Plugin implements PluginType {
    name: string;
    enable: boolean;
    importPath: string;
    metadata: Partial<PluginMetadata>;
    metaFilePath: string;
    private logger?;
    constructor(name: string, configItem: PluginConfigItem, opts?: PluginCreateOptions);
    init(): Promise<void>;
    checkDepExisted(pluginMap: PluginMap): void;
    getDepEdgeList(): [string, string][];
    private checkAndLoadMetadata;
}
