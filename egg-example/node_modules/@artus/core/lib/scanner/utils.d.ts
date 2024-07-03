import 'reflect-metadata';
import { LoaderFactory } from '../loader';
import { WalkOptions } from './types';
export declare class ScanUtils {
    static loaderFactory: LoaderFactory;
    static walk(root: string, options: WalkOptions): Promise<void>;
    static isExclude(filename: string, extname: string, exclude: string[], extensions: string[]): boolean;
    static exist(dir: string, filenames: string[]): boolean;
}
