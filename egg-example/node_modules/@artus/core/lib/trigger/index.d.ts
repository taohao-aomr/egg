import { Input, Context, MiddlewareInput, Output } from '@artus/pipeline';
import { TriggerType } from '../types';
export default class Trigger implements TriggerType {
    private pipeline;
    private app;
    constructor();
    use(middleware: MiddlewareInput): Promise<void>;
    initContext(input?: Input, output?: Output): Promise<Context>;
    startPipeline(ctx: Context): Promise<void>;
}
