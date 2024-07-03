import { ReflectMetadataType } from './types';
export declare function getMetadata(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): ReflectMetadataType | ReflectMetadataType[];
export declare function setMetadata(metadataKey: string | symbol, value: ReflectMetadataType | ReflectMetadataType[], target: any, propertyKey?: string | symbol): void;
/**
 * recursive get class and super class metadata
 * @param metadataKey
 * @param target
 * @param propertyKey
 * @returns
 */
export declare function recursiveGetMetadata(metadataKey: any, target: any, propertyKey?: string | symbol): ReflectMetadataType[];
/**
 * get constructor parameter types
 * @param clazz
 * @returns
 */
export declare function getParamMetadata(clazz: any): any;
/**
 * get the property type
 * @param clazz
 * @param property
 * @returns
 */
export declare function getDesignTypeMetadata(clazz: any, property: string | symbol): any;
export declare function addTag(tag: string, target: any): void;
export declare function isInjectable(target: any): boolean;
export declare function isClass(clazz: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function isUndefined(value: any): boolean;
export declare function isObject(value: any): boolean;
export declare function isFunction(value: any): boolean;
export declare function isPrimitiveFunction(value: any): boolean;
