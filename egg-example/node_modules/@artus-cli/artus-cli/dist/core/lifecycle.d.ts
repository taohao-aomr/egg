import { ApplicationLifecycle } from '@artus/core';
export default class Lifecycle implements ApplicationLifecycle {
    private readonly trigger;
    configDidLoad(): Promise<void>;
    didReady(): Promise<void>;
}
