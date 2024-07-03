import { ManifestItem, Loader, LoaderFindOptions } from '../types';
import { ExceptionItem } from '../../exception/types';
declare class ExceptionLoader implements Loader {
    static is(opts: LoaderFindOptions): Promise<boolean>;
    load(item: ManifestItem): Promise<Record<string, ExceptionItem>>;
}
export default ExceptionLoader;
