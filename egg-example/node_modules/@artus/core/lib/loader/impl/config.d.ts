import { Container } from '@artus/injection';
import ConfigurationHandler from '../../configuration';
import { ManifestItem, Loader, LoaderFindOptions } from '../types';
import { Application } from '../../types';
declare class ConfigLoader implements Loader {
    protected container: Container;
    constructor(container: any);
    protected get app(): Application;
    protected get configurationHandler(): ConfigurationHandler;
    static is(opts: LoaderFindOptions): Promise<boolean>;
    protected static isConfigDir(opts: LoaderFindOptions): boolean;
    load(item: ManifestItem): Promise<Record<string, any>>;
    protected loadConfigFile(item: ManifestItem): Promise<Record<string, any>>;
}
export default ConfigLoader;
