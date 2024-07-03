import { Loader, ManifestItem } from './types';
export default class BaseLoader implements Loader {
    load(_item: ManifestItem): Promise<void>;
}
