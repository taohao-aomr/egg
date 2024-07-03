"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reusify = void 0;
const next = Symbol('next');
class Reusify {
    constructor(options) {
        this.factory = options.factory;
        this.max = options.max;
        this.count = 0;
        this.head = this.getInstance();
        this.tail = this.head;
    }
    get() {
        const current = this.head;
        if (current[next]) {
            this.head = current[next];
        }
        else {
            this.head = this.getInstance();
            this.tail = this.head;
        }
        current[next] = null;
        this.count--;
        return current;
    }
    release(obj) {
        if (this.count >= this.max) {
            return;
        }
        this.tail[next] = obj;
        this.tail = obj;
        this.count++;
    }
    getInstance() {
        this.count++;
        return this.factory();
    }
}
exports.Reusify = Reusify;
//# sourceMappingURL=reusify.js.map