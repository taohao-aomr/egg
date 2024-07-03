import { LifecycleManager } from '../../lifecycle';
import { ManifestItem, Loader } from '../types';
declare class LifecycleLoader implements Loader {
    private container;
    constructor(container: any);
    get lifecycleManager(): LifecycleManager;
    load(item: ManifestItem): Promise<any[]>;
}
export default LifecycleLoader;
