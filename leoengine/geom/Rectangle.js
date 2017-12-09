import 'babel-polyfill';

class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.setTo(x, y, width, height);
    }

    set x(value) {
        this._x = value;
        this._right = this._x + this._width;
    }
    get x() { return this._x; }

    set y(value) {
        this._y = value;
        this._bottom = this._y + this._height;
    }
    get y() { return this._y; }

    set width(value) {
        this._width = value;
        this._right = this._x + this._width;
    }
    get width() { return this._width; }

    set height(value) {
        this._height = value;
        this._bottom = this._y + this._height;
    }
    get height() { return this._height; }

    setTo(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._right = this._x + this._width;
        this._bottom = this._y + this._height;
    }

    get left() {
        return this._x;
    }
    get right() {
        return this._right;
    }
    get top() {
        return this._y;
    }
    get bottom() {
        return this._bottom;
    }

    contains(x, y) {

    }

    containsRect(rect) {

    }
}

export default Rectangle;