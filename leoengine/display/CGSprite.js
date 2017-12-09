import 'babel-polyfill';
import geom from '../geom';
import CGDisplayObjectContainer from './CGDisplayObjectContainer';

class CGSprite extends CGDisplayObjectContainer {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);        
    }
    static create() {
        return new Sprite();
    }                

    dispose() {        
        super.dispose();
    }
}

export default CGSprite;