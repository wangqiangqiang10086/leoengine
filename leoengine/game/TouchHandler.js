import 'babel-polyfill';

class TouchHandler {
    constructor(stage) {
        this._maxTouches = 0;
        this._useTouchesCount = 0;
        this._stage = stage;
    }
}

export default TouchHandler;