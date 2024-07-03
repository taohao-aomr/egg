import { Constructable, Container } from '@artus/injection';
import { ManifestItem, Loader } from '../types';
declare class ModuleLoader implements Loader {
    protected container: Container;
    constructor(container: any);
    load(item: ManifestItem): Promise<Constructable[]>;
}
export default ModuleLoader;
