import { ApplicationLifecycle } from '@artus-cli/artus-cli';
export default class VersionLifecycle implements ApplicationLifecycle {
    private readonly program;
    configDidLoad(): Promise<void>;
}
