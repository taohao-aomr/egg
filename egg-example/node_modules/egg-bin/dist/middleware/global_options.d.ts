import { ApplicationLifecycle } from '@artus-cli/artus-cli';
export default class GlobalOptions implements ApplicationLifecycle {
    private readonly program;
    configDidLoad(): Promise<void>;
}
