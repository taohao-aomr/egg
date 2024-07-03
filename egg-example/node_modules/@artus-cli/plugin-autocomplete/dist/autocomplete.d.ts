import { Command, Program } from '@artus-cli/artus-cli';
export declare class AutoCompleteCommand extends Command {
    program: Program;
    shell: string;
    run(): Promise<void>;
}
