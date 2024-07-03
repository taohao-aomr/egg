import type { ExecutionContainer } from '@artus/injection';
import { BaseContext, BaseInput, BaseOutput, ContextStorage, ParamsDictionary, Next } from './types';
export declare class Input implements BaseInput {
    params: ParamsDictionary;
}
export declare class Output implements BaseOutput {
    data: ParamsDictionary;
}
export declare class Storage implements ContextStorage<any> {
    private storageMap;
    get(key?: string | symbol): any;
    set(value: any, key?: string | symbol): void;
}
export declare class Context implements BaseContext {
    input: Input;
    output: Output;
    private _container;
    private storageMap;
    constructor(input?: Input, output?: Output);
    get container(): ExecutionContainer;
    set container(container: ExecutionContainer);
    namespace(namespace: string): ContextStorage<any>;
    restore(): void;
}
export type Middleware<T extends BaseContext = any> = (context: T, next: Next) => void;
export type Middlewares = Middleware[];
export type PipelineLike = {
    middlewares: Middlewares;
};
export type MiddlewareInput = Middleware | Middlewares | PipelineLike;
