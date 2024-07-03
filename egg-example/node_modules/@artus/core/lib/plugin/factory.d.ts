import { ManifestItem } from '../loader';
import { PluginConfigItem, PluginCreateOptions, PluginType } from './types';
export declare class PluginFactory {
    static create(name: string, item: PluginConfigItem, opts?: PluginCreateOptions): Promise<PluginType>;
    static createFromConfig(config: Record<string, PluginConfigItem>, opts?: PluginCreateOptions): Promise<PluginType[]>;
    static formatPluginConfig(config: Record<string, PluginConfigItem>, manifestItem?: ManifestItem): Promise<Record<string, PluginConfigItem>>;
}
