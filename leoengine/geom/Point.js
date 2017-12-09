import 'babel-polyfill';

class Point {
    constructor(x = 0, y = 0) {
        this.setTo(x, y);
    }

    set x(value) { this._x = value; }
    get x() { return this._x; }

    set y(value) { this._y = value; }
    get y() { return this._y; }

    setTo(x, y) {
        this._x = x;
        this._y = y;
    }
}

export default Point;