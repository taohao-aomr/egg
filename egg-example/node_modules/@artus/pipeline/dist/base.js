"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.Storage = exports.Output = exports.Input = void 0;
const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');
class Input {
    constructor() {
        this.params = new Map();
    }
}
exports.Input = Input;
class Output {
    constructor() {
        this.data = new Map();
    }
}
exports.Output = Output;
class Storage {
    constructor() {
        this.storageMap = new Map();
    }
    get(key) {
        key !== null && key !== void 0 ? key : (key = ContextStorageSymbol);
        return this.storageMap.get(key);
    }
    set(value, key) {
        key !== null && key !== void 0 ? key : (key = ContextStorageSymbol);
        this.storageMap.set(key, value);
    }
}
exports.Storage = Storage;
class Context {
    constructor(input, output) {
        this.input = new Input();
        this.output = new Output();
        this.storageMap = new Map();
        this.input = input !== null && input !== void 0 ? input : this.input;
        this.output = output !== null && output !== void 0 ? output : this.output;
    }
    get container() {
        return this._container;
    }
    set container(container) {
        this._container = container;
    }
    namespace(namespace) {
        let storage = this.storageMap.get(namespace);
        if (!storage) {
            storage = new Storage();
            this.storageMap.set(namespace, storage);
        }
        return storage;
    }
    restore() {
        this.storageMap.clear();
        this.input.params.clear();
        this.output.data.clear();
        this.container = null;
    }
}
exports.Context = Context;
//# sourceMappingURL=base.js.map