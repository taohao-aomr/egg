interface LoaderOptions {
    framework: string;
    baseDir: string;
    env?: string;
}
interface Plugin {
    name: string;
    version?: string;
    enable: boolean;
    implicitEnable: boolean;
    path: string;
    dependencies: string[];
    optionalDependencies: string[];
    env: string[];
    from: string;
}
/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/mixin/plugin.js#L203
 */
export declare function getPlugins(options: LoaderOptions): Record<string, Plugin>;
interface Unit {
    type: 'plugin' | 'framework' | 'app';
    path: string;
}
/**
 * @see https://github.com/eggjs/egg-core/blob/2920f6eade07959d25f5c4f96b154d3fbae877db/lib/loader/egg_loader.js#L348
 */
export declare function getLoadUnits(options: LoaderOptions): Unit[];
export declare function getConfig(options: LoaderOptions): Record<string, any>;
export {};
