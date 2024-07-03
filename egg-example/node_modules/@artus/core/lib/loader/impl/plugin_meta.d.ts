import { ManifestItem, Loader, LoaderFindOptions } from '../types';
import { PluginMetadata } from '../../plugin/types';
declare class PluginMetaLoader implements Loader {
    private container;
    constructor(container: any);
    static is(opts: LoaderFindOptions): Promise<boolean>;
    load(item: ManifestItem): Promise<PluginMetadata>;
}
export default PluginMetaLoader;
