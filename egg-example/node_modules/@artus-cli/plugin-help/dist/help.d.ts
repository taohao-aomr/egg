import { Command, CommandContext, Program } from '@artus-cli/artus-cli';
export declare class HelpCommand extends Command {
    ctx: CommandContext;
    program: Program;
    command: string;
    run(): Promise<void>;
}
