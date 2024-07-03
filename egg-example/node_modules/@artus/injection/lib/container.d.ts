import { ContainerType, Identifier, InjectableMetadata, InjectableDefinition, ReflectMetadataType, HandlerFunction } from './types';
export default class Container implements ContainerType {
    private registry;
    private tags;
    protected name: string;
    protected handlerMap: Map<string | symbol, HandlerFunction>;
    constructor(name: string);
    get<T = unknown>(id: Identifier<T>, options?: {
        noThrow?: boolean;
        defaultValue?: any;
    }): T;
    set(options: Partial<InjectableDefinition>): this;
    getDefinition<T = unknown>(id: Identifier<T>): InjectableMetadata<T> | undefined;
    getInjectableByTag(tag: string): any[];
    getByTag(tag: string): unknown[];
    registerHandler(name: string | symbol, handler: HandlerFunction): void;
    getHandler(name: string | symbol): CallableFunction | undefined;
    hasValue(options: Partial<InjectableDefinition>): boolean;
    getValueByMetadata(md: ReflectMetadataType): any;
    protected getValue(md: InjectableMetadata): any;
    private getDefinedMetaData;
    private resolveParams;
    private resolveProps;
    private handleTag;
    private resolveHandler;
    /**
     * check rule
     * The first column is the class scope and the first row is the property scope
     * ----------------------------------------
     *          |singleton|execution |transient
     * ----------------------------------------
     * singleton|✅        |❌        |✅
     * ----------------------------------------
     * execution|✅        |✅        |✅
     * ----------------------------------------
     * transient|✅        |❓        |✅
     * ----------------------------------------
     */
    private checkScope;
}
