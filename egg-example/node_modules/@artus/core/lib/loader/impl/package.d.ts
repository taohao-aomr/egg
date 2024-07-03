import { ManifestItem, Loader, LoaderFindOptions } from '../types';
declare class PackageLoader implements Loader {
    private container;
    constructor(container: any);
    static is(opts: LoaderFindOptions): Promise<boolean>;
    load(item: ManifestItem): Promise<any>;
}
export default PackageLoader;
