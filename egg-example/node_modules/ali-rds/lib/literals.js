"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Literal = void 0;
class Literal {
    #text;
    constructor(text) {
        this.#text = text;
    }
    toString() {
        return this.#text;
    }
}
exports.Literal = Literal;
exports.default = {
    now: new Literal('now()'),
    Literal,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl0ZXJhbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGl0ZXJhbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxPQUFPO0lBQ2xCLEtBQUssQ0FBUztJQUNkLFlBQVksSUFBWTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUFURCwwQkFTQztBQUVELGtCQUFlO0lBQ2IsR0FBRyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUN6QixPQUFPO0NBQ1IsQ0FBQyJ9