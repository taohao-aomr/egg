import { PluginType } from './types';
export declare function topologicalSort(pluginInstanceMap: Map<string, PluginType>, pluginDepEdgeList: [string, string][]): string[];
export declare function getPackagePath(packageName: string, paths?: string[]): string;
export declare function getInlinePackageEntryPath(packagePath: string): Promise<string>;
