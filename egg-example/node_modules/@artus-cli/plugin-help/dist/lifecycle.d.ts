import { ApplicationLifecycle } from '@artus-cli/artus-cli';
export default class UsageLifecycle implements ApplicationLifecycle {
    private readonly program;
    configDidLoad(): Promise<void>;
}
