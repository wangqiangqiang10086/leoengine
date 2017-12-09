import 'babel-polyfill';

class ObjectPool {
    constructor() {
        this._pool = [];
    }

    addObject(obj) {
        this._pool.push(obj);
    }

    getObject(createNew) {
        if (this._pool.length > 0) return this._pool.pop();
        return createNew();
    }

    dispose() {
        this._pool = null;
    }

}

export default ObjectPool;