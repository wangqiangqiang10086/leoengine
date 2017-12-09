import 'babel-polyfill';
import geom from '../geom';
import Point from '../geom/Point';
import Matrix2D from '../geom/Matrix2D';
import events from '../events';
import CGObject from './CGObject';

const TEMP_MATRIX2D = new geom.Matrix2D();
//let calcount = 0;
class CGDisplayObject extends events.EventDispatcher {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super();
        this._matrix = new Matrix2D(1, 0, 0, 1, x, y);
        this._concatenatedMatrix = new Matrix2D();
        this._invertConcatenatedMatrix = new Matrix2D();
        this._width = width;
        this._height = height;
        this._centerX = 0;
        this._centerY = 0;
        this._bounds = new geom.Rectangle(0, 0, width, height);
        this._concatenatedBounds = null;
        this._scaleX = 1;
        this._scaleY = 1;
        this._skewX = 0;
        this._skewY = 0;
        this._rotation = 0;
        this._index = index;
        this._visible = !!visible;
        this._name = null;
        this._root = null;
        this._parent = null;

        this._invalidMatrix = null;
        this._invalidConcatenatedMatrix = null;
        this._invalidInvertConcatenatedMatrix = null;
        this._invalidCache = null;
        this._invalidBounds = null;
        this._invalidConcatenatedBounds = null;

        this._useCache = false;
        this._context = null;
        this._canvas = null;

        this._showDebugBounds = false;
    }

    set name(value) { this._name = value; }
    get name() { return this._name; }

    set x(value) {
        value = value | 0;
        if (this._matrix.tx === value) return;

        this._matrix.tx = value;
        this.invalidMatrix();
    }
    get x() {
        return this._matrix.tx;
    }

    set y(value) {
        value = value | 0;
        if (this._matrix.ty === value) return;

        this._matrix.ty = value;
        this.invalidMatrix();
    }
    get y() {
        return this._matrix.ty;
    }

    set width(value) {
        this._width = value;
        this.invalidBounds();
    }
    get width() { return this._width; }

    set height(value) {
        this._height = value;
        this.invalidBounds();
    }
    get height() { return this._height; }

    set centerX(value) {
        value = value | 0;
        if (this._centerX === value) return;

        this._centerX = value;
        this.invalidMatrix();
    }
    get centerX() {
        return this._centerX;
    }

    set centerY(value) {
        value = value | 0;
        if (this._centerY === value) return;

        this._centerY = value;
        this.invalidMatrix();
    }
    get centerY() {
        return this._centerY;
    }

    set scaleX(value) {
        if (this._scaleX === value) return;

        this._scaleX = value;
        this.invalidMatrix();
    }
    get scaleX() {
        return this._scaleX;
    }

    set scaleY(value) {
        if (this._scaleY === value) return;

        this._scaleY = value;
        this.invalidMatrix();
    }
    get scaleY() {
        return this._scaleY;
    }

    set skewX(value) {
        if (this._skewX === value) return;

        this._skewX = value;
        this.invalidMatrix();
    }
    get skewX() {
        return this._skewX;
    }

    set skewY(value) {
        if (this._skewY === value) return;

        this._skewY = value;
        this.invalidMatrix();
    }
    get skewY() {
        return this._skewY;
    }

    get bounds() {
        if (this._invalidBounds != false) {
            this._bounds.setTo(0, 0, this.width, this.height);
            this._invalidBounds = false;
        }

        return this._bounds;
    }    

    set index(value) {
        this._index = value;
        if (this.parent != null) {
            this.parent.needSort = true;
        }
    }
    get index() { return this._index; }

    set visible(value) { this._visible = !!value; }
    get visible() { return this._visible; }

    set root(value) { this._root = value; }
    get root() { return this._root; }

    set parent(value) { this._parent = value; }
    get parent() { return this._parent; }

    set useCache(value) {
        this._useCache = !!value;
        if (this._useCache && (this._canvas == null || this._context == null)) {
            let tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = this.width;
            tmpCanvas.height = this.height;
            this._canvas = tmpCanvas;
            this._context = tmpCanvas.getContext('2d');
        }
    }
    get useCache() {
        return this._useCache;
    }

    invalidMatrix() {        
        if (this._invalidMatrix && this._invalidConcatenatedMatrix) return;

        this._invalidMatrix = true;        
        this.invalidConcatenatedMatrix();
        this.invalidCache();
    }
    invalidConcatenatedMatrix() {
        if (this._invalidConcatenatedMatrix) return;

        this._invalidConcatenatedMatrix = true;
        this._invalidConcatenatedBounds = true;
        this._invalidInvertConcatenatedMatrix = true;        
    }

    invalidCache() {
        if (this._invalidCache) return;

        this._invalidCache = true;
        if (this.parent != null) this.parent.invalidCache();
    }
    invalidBounds() {
        this._invalidBounds = true;
        this._invalidConcatenatedBounds = true;
    }


    setMatrix(other, updateProp = true) {
        this._matrix.copyFrom(other);
        if (updateProp) {
            this._scaleX = other.scaleX;
            this._scaleY = other.scaleY;
            this._skewX = other.skewX;
            this._skewY = other.skewY;
        }
        this.invalidMatrix();
    }
    getMatrix() {
        if (this._invalidMatrix != false) {
            //更新矩阵
            this._matrix.updateScaleAndRotation(this._scaleX, this._scaleY, this._skewX, this._skewY);
            this._invalidMatrix = false;
        }
        return this._matrix.clone();
    }
    getConcatenatedMatrix() {
        if (this._useCache) {
            return geom.Matrix2D.EmptyMarix;
        } else {
            return getConcatenatedMatrix(this);
        }
    }
    getInvertConcatenatedMatrix() {
        if (this._invalidInvertConcatenatedMatrix != false) {
            getConcatenatedMatrix(this).invertInto(this._invertConcatenatedMatrix);
            this._invalidInvertConcatenatedMatrix = false;
        }

        return this._invertConcatenatedMatrix;
    }
    getConcatenatedBounds() {
        if (this._concatenatedBounds == null) this._concatenatedBounds = new geom.Rectangle();

        if (this._invalidConcatenatedBounds != false) {
            this.getConcatenatedMatrix().transformBounds(this.bounds, this._concatenatedBounds);
            this._invalidConcatenatedBounds = false;
        }

        return this._concatenatedBounds;
    }

    render(parentCtx, offsetTime) {
        parentCtx.save();
        let maxtrix = getConcatenatedMatrix(this);
        parentCtx.setTransform(maxtrix.a, maxtrix.b, maxtrix.c, maxtrix.d, maxtrix.tx, maxtrix.ty);
        if (this._useCache) {
            //更新缓存
            if (this._invalidCache != false) {
                this._invalidCache = false;
                this._context.clearRect(0, 0, this.width, this.height);
                this.rendering(this._context, offsetTime);
            }
            parentCtx.drawImage(this._canvas, 0, 0, this.width, this.height);
        } else {
            this.rendering(parentCtx, offsetTime);
        }
        parentCtx.restore();
    }

    rendering(parentCtx, offsetTime) {
        return;
    }

    dispatchEvent(event) {
        if (!event.bubbles) return super.dispatchEvent(event);

        let list = getPropagationList(this);
        let targetIndex = list.length * 0.5;
        event._target = this;
        dispatchPropagationEvent(event, list, targetIndex);
        return null;
    }


    /**
     * stage坐标转换为当前坐标
     * 
     * @param {number} stageX 
     * @param {number} stageY 
     * @param {object} [refPoint=null] 推荐传入,减少对象创建: 如传入引用Point对象，则赋值并返回此Point，否则返回new Point
     * @returns 
     * @memberof CGDisplayObject
     */
    globalToLocal(stageX, stageY, refPoint = null) {
        let m = this.getInvertConcatenatedMatrix();
        return m.transformPoint(stageX, stageY, refPoint);
    }

    hitTest(stageX, stageY) {
        if (!this._visible) return null;

        let bounds = this.bounds;
        let m = this.getInvertConcatenatedMatrix();
        let localX = m.a * stageX + m.c * stageY + m.tx;
        let localY = m.b * stageX + m.d * stageY + m.ty;

        if (geom.tools.isPointInRect({ x: localX, y: localY }, bounds)) {
            return this;
        }
        return null;
    }    

    dispose() {
        this._context = null;
        this._canvas = null;
        this.root = null;
        this.parent = null;
        super.dispose();
    }
}

/**
 * 获取对象链接矩阵
 * 
 * @param {any} thisObject 
 * @returns 
 */
function getConcatenatedMatrix(thisObject) {
    let concatenatedMatrix = thisObject._concatenatedMatrix;
    if (thisObject._invalidConcatenatedMatrix != false) {
        //calcount++;
        //console.log(`${this.name}:${calcount}`);
        if (thisObject.parent) {            
            thisObject.parent.getConcatenatedMatrix().concatInto(thisObject.getMatrix(), concatenatedMatrix);
        } else {
            concatenatedMatrix.copyFrom(thisObject.getMatrix());
        }

        concatenatedMatrix.concat(TEMP_MATRIX2D.setTo(1, 0, 0, 1, -thisObject.centerX, -thisObject.centerY));

        thisObject._invalidConcatenatedMatrix = false;
    }

    return concatenatedMatrix;
}


/**
 * 获取事件流列表 捕获 -> 目标 -> 冒泡
 * 
 * @param {DisplayObject} thisObject 
 * @returns DisplayObject[]
 */
function getPropagationList(thisObject) {
    let list = [], displayObject = thisObject;

    while (displayObject) {
        list.push(displayObject);
        displayObject = displayObject._parent;
    }

    let captureList = list.concat();
    captureList.reverse();

    list = captureList.concat(list);
    return list;
}

function dispatchPropagationEvent(event, listDisplayObject, targetIndex) {
    let count = listDisplayObject.length,
        captureIndex = targetIndex - 1,
        phase = events.EventPhase,
        currentTarget;

    for (let i = 0; i < count; i++) {
        currentTarget = listDisplayObject[i];
        event._currentTarget = currentTarget;

        if (i < captureIndex) event._eventPhase = phase.CAPTURING_PHASE;
        else if (i == targetIndex || i == captureIndex) event._eventPhase = phase.AT_TARGET;
        else event._eventPhase = phase.BUBBLING_PHASE;

        currentTarget._acceptEvent(event, i < targetIndex);

        if (event.isStopPropagation) return;
    }
}

export default CGDisplayObject;