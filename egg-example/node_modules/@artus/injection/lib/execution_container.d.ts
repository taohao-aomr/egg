import Container from './container';
import { ContainerType, HandlerFunction, Identifier, InjectableMetadata } from './types';
export default class ExecutionContainer extends Container {
    private parent;
    private ctx;
    constructor(ctx: any, parent: ContainerType);
    get<T = unknown>(id: Identifier<T>, options?: {
        noThrow?: boolean;
        defaultValue?: any;
    }): T;
    getDefinition<T = unknown>(id: Identifier<T>): InjectableMetadata<T> | undefined;
    getInjectableByTag(tag: string): any[];
    getCtx(): any;
    getHandler(name: string | symbol): HandlerFunction | undefined;
    private setValue;
}
