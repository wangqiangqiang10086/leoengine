import 'babel-polyfill';

class Circle {
    constructor(x, y, radus) {
        this.setTo(x, y, radus);
    }

    set x(value) { this._x = value; }
    get x() { return this._x; }

    set y(value) { this._y = value; }
    get y() { return this._y; }

    set radus(value) { this._radus = value; }
    get radus() { return this._radus; }

    setTo(x, y, radus) {
        this._x = x;
        this._y = y;
        this._radus = radus;
    }
}

export default Circle;