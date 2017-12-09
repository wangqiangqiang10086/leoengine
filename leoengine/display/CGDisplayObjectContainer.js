import 'babel-polyfill';
import events from '../events';
import CGDisplayObject from './CGDisplayObject';


class CGDisplayObjectContainer extends CGDisplayObject {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);
        this._children = [];
        this._needSort = false;
    }

    invalidMatrix() {
        if (this._invalidMatrix && this._invalidConcatenatedMatrix) return;

        this._invalidMatrix = true;
        this._invalidConcatenatedMatrix = true;        
        this._invalidConcatenatedBounds = true;
        let totalChild = this._children.length, child;
        for (let i = 0; i < totalChild; i++) {
            child = this._children[i];
            child.invalidConcatenatedMatrix();
        }
    }
    invalidConcatenatedMatrix() {
        if (this._invalidConcatenatedMatrix) return;

        this._invalidConcatenatedMatrix = true;
        this._invalidInvertConcatenatedMatrix = true;
        this._invalidConcatenatedBounds = true;
        let totalChild = this._children.length, child;
        for (let i = 0; i < totalChild; i++) {
            child = this._children[i];
            child.invalidConcatenatedMatrix();
        }
    }

    set needSort(value) { this._needSort = value; }
    get needSort() { return this._needSort; }

    get children() { return this._children; }

    addChild(child) {
        child.root = this.root;
        child.parent = this;
        this._children.push(child);
        this.needSort = true;
        return child;
    }

    removeChild(child) {
        let totalChild = this._children.length, tmpChild;
        for (let i = 0; i < totalChild; i++) {
            tmpChild = this._children[i];
            if (tmpChild === child) {
                this.removeChildAt(i);
                break;
            }
        }

        return child;
    }

    removeChildAt(index) {
        let tmpChild = this._children[index];
        tmpChild.parent = null;
        tmpChild.root = null;
        this._children.splice(index, 1);

        return tmpChild;
    }

    sortChildren() {
        this._children.sort((a, b) => a.index - b.index);
    }

    rendering(parentCtx, offsetTime) {
        this.renderSelf(parentCtx, offsetTime);
        this.renderChildren(parentCtx, offsetTime);
    }

    renderSelf(ctx, offsetTime) {
        return;
    }

    renderChildren(ctx, offsetTime) {
        let tempChildren = this._children.concat();
        let totalChild = tempChildren.length, child;
        for (let i = 0; i < totalChild; i++) {
            child = tempChildren[i];
            //if (child !== undefined && child.visible) child.render(ctx, offsetTime);
            if (child.visible) child.render(ctx, offsetTime);
        }
    }

    dispose() {
        let totalChild = this._children.length, child;
        for (let i = 0; i < totalChild; i++) {
            child = this._children[i];
            child.dispose();
        }
        this._children = null;
        super.dispose();
    }

    hitTest(stageX, stageY) {
        if (!this._visible) return null;
        let totalChild = this._children.length, child, tmpChild;
        for (let i = 0; i < totalChild; i++) {
            child = this._children[i];
            tmpChild = child.hitTest(stageX, stageY);
            if (tmpChild) {
                return tmpChild;
            }
        }

        return super.hitTest(stageX, stageY);
    }
}

export default CGDisplayObjectContainer;