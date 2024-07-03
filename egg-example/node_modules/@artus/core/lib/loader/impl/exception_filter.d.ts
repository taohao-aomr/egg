import { ManifestItem } from '../types';
import ModuleLoader from './module';
import { Constructable } from '@artus/injection';
import { ExceptionFilterType } from '../../exception/types';
declare class ExceptionFilterLoader extends ModuleLoader {
    load(item: ManifestItem): Promise<Constructable<ExceptionFilterType>[]>;
}
export default ExceptionFilterLoader;
