import { Middlewares, MiddlewareInput, PipelineLike } from './base';
import { BaseContext } from './types';
export declare class Pipeline implements PipelineLike {
    middlewares: Middlewares;
    use(middleware: MiddlewareInput): void;
    dispatch(i: number, ctx: BaseContext, execution?: {
        index: number;
    }): Promise<any>;
    run(ctx: BaseContext): Promise<any>;
}
