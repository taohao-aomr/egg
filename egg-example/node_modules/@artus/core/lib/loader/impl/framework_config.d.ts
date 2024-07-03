import { FrameworkObject } from '../../configuration';
import { ManifestItem, Loader, LoaderFindOptions } from '../types';
import ConfigLoader from './config';
declare class FrameworkConfigLoader extends ConfigLoader implements Loader {
    static is(opts: LoaderFindOptions): Promise<boolean>;
    load(item: ManifestItem): Promise<FrameworkObject>;
}
export default FrameworkConfigLoader;
