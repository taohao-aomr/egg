import { Constructable, Container } from '@artus/injection';
import { ExceptionFilterType } from './types';
export declare const matchExceptionFilterClazz: (err: Error, container: Container) => Constructable<ExceptionFilterType> | null;
export declare const matchExceptionFilter: (err: Error, container: Container) => ExceptionFilterType | null;
