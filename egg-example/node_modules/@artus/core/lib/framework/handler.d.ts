import { ConfigObject } from '../configuration';
import { ManifestItem } from '../loader/types';
export interface FrameworkConfig {
    path?: string;
    package?: string;
}
export declare class FrameworkHandler {
    static mergeConfig(env: string, frameworks: ManifestItem[], done: string[]): Promise<{
        config: ConfigObject;
        done: string[];
    }>;
    static handle(root: string, config: FrameworkConfig): Promise<string>;
}
