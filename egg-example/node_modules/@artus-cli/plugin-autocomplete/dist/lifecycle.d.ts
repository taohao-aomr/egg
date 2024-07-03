import { ApplicationLifecycle } from '@artus-cli/artus-cli';
export default class TemplateLifecycle implements ApplicationLifecycle {
    private readonly program;
    private readonly parsedCommands;
    configDidLoad(): Promise<void>;
}
