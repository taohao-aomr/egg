import { ArtusApplication } from '@artus/core';
import { ArtusCliConfig } from '../types';
export interface BinInfoOption extends ArtusCliConfig {
    artusEnv: string;
    baseDir: string;
    pkgInfo: Record<string, any>;
}
export declare class BinInfo {
    name: string;
    version: string;
    /** artus env, default/dev/prod/... */
    artusEnv: string;
    /** bin name */
    binName: string;
    /** bin base dir */
    baseDir: string;
    /** author in package.json */
    author: any;
    /** description in package.json */
    description: string;
    /** pkg info */
    pkgInfo: Record<string, any>;
    strict: boolean;
    strictCommands: boolean;
    strictOptions: boolean;
    inheritMetadata: boolean;
    constructor(app: ArtusApplication);
}
