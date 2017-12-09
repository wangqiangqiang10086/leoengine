import 'babel-polyfill';
import ObjectPool from './ObjectPool';
import display from '../display';

class SeqRingPool extends ObjectPool {
    constructor(imgs) {
        super();
        this._ringImgs = imgs;
    }

    addObject(obj) {
        super.addObject(obj);
    }

    getObject() {
        if (this._pool.length > 0) return this._pool.pop();
        else return display.CGSequenceFrame.createFromImgs(this._ringImgs);
    }

    getRing(x, y, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0) {
        let ring = this.getObject();
        ring.x = x;
        ring.y = y;
        ring.centerX = 16;
        ring.centerY = 16;
        ring.scaleX = scaleX;
        ring.scaleY = scaleY;
        ring.skewX = skewX;
        ring.skewY = skewY;
        ring.name = "ring";
        ring._showDebugBounds = true;

        return ring;
    }

    dispose() {
        super.dispose();
        this._ringImgs = null;
    }

}

export default SeqRingPool;