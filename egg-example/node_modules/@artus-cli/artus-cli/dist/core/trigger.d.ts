import { Trigger } from '@artus/core';
import { Output } from '@artus/pipeline';
import { CommandContext, CommandInput } from './context';
import { ParsedCommand } from './parsed_command';
export declare class CommandTrigger extends Trigger {
    start(): Promise<void>;
    init(): Promise<void>;
    /** override artus context */
    initContext(input?: CommandInput, output?: Output): Promise<CommandContext>;
    /** start a pipeline and execute */
    executePipeline(input?: Partial<CommandInput['params']>): Promise<void>;
    /** execute command in pipeline */
    executeCommand(ctx: CommandContext, cmd: ParsedCommand): Promise<{
        result: any;
    }>;
}
