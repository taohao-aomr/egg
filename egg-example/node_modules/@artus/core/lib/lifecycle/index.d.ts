import { Constructable, Container } from '@artus/injection';
import { Application } from '../types';
export type HookFunction = <T = unknown>(hookProps: {
    app: Application;
    lifecycleManager: LifecycleManager;
    payload?: T;
}) => void | Promise<void>;
export declare class LifecycleManager {
    hookList: string[];
    hookFnMap: Map<string, HookFunction[]>;
    private app;
    private container;
    private hookUnitSet;
    constructor(app: Application, container: Container);
    insertHook(existHookName: string, newHookName: string): void;
    appendHook(newHookName: string): void;
    registerHook(hookName: string, hookFn: HookFunction): void;
    registerHookUnit(extClazz: Constructable<any>): void;
    emitHook<T = unknown>(hookName: string, payload?: T): Promise<void>;
}
