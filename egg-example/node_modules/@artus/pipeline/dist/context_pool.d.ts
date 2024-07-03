import { BaseContext, BaseInput, BaseOutput } from "./types";
import type { ExecutionContainer } from "@artus/injection";
export declare class ContextPool {
    private pool;
    private contextFactory;
    constructor(max?: number, ctxFactory?: () => BaseContext);
    get(container: ExecutionContainer, input?: BaseInput, output?: BaseOutput): BaseContext;
    release(ctx: BaseContext): void;
}
