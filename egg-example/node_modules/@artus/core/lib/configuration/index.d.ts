import { ManifestItem } from '../loader';
export type ConfigObject = Record<string, any>;
export type FrameworkObject = {
    path: string;
    env: string;
};
export type PackageObject = ConfigObject;
export type FrameworkOptions = {
    env: string;
    unitName: string;
};
export default class ConfigurationHandler {
    static getEnvFromFilename(filename: string): string;
    private configStore;
    private frameworks;
    private packages;
    getMergedConfig(env?: string): ConfigObject;
    getAllConfig(): ConfigObject;
    setConfig(env: string, config: ConfigObject): void;
    setConfigByFile(fileItem: ManifestItem): Promise<void>;
    getFrameworkConfig(env?: string, key?: string, frameworkMap?: Map<string, FrameworkObject>): Map<string, FrameworkObject>;
    addFramework(source: string, framework: FrameworkObject, options: FrameworkOptions): void;
    getPackages(): Map<string, PackageObject[]>;
    addPackage(source: string, pkg: PackageObject): void;
}
