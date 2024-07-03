import { ManifestItem } from './types';
export interface LoaderEventListener {
    before?: CallableFunction;
    after?: CallableFunction;
    beforeEach?: (item: ManifestItem) => void;
    afterEach?: (item: ManifestItem, loadContent: any) => void;
}
export default class LoaderEventEmitter {
    private listeners;
    addListener(eventName: any, listener: LoaderEventListener): void;
    removeListener(eventName: string, stage?: keyof LoaderEventListener): void;
    emitBefore(eventName: any, ...args: any[]): Promise<void>;
    emitAfter(eventName: any, ...args: any[]): Promise<void>;
    emitBeforeEach(eventName: any, ...args: any[]): Promise<void>;
    emitAfterEach(eventName: any, ...args: any[]): Promise<void>;
    emit(eventName: string, stage: string, ...args: any[]): Promise<void>;
}
