import 'babel-polyfill';
import system from '../system';
import tools from '../tools';
import events from '../events';
import geom from '../geom';
import Point from '../geom/Point';
import CGDisplayObjectContainer from './CGDisplayObjectContainer';

class ViewPort {
    constructor(x, y, width, height, stage) {
        this._stage = stage;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    set x(value) {
        this._stage.x = -value;
    }
    get x() {
        return -this._stage.x;
    }

    set y(value) {
        this._stage.y = -value;
    }
    get y() {
        return -this._stage.y;
    }

}


class CGStage extends CGDisplayObjectContainer {
    constructor(canvasObj, debugObj = null) {
        let canvasWidth = canvasObj.width, canvasHeight = canvasObj.height;

        super(canvasWidth, canvasWidth);
        this.name = 'CGStage';
        this.root = this;
        this._bounds.setTo(0, 0, system.stage.worldSize.width, system.stage.worldSize.height);
        this._viewPort = new ViewPort(system.stage.viewPortStart.x, system.stage.viewPortStart.y, canvasWidth, canvasHeight, this);

        let boundX1 = this._viewPort.width / 2;
        let boundX2 = system.stage.worldSize.width - boundX1;
        let boundY1 = this._viewPort.height / 2;
        let boundY2 = system.stage.worldSize.height - boundY1;
        this._followRect = {
            x1: boundX1,
            y1: boundY1,
            x2: boundX2,
            y2: boundY2
        };

        this._canvas = canvasObj;
        this._context = canvasObj.getContext('2d');        
        this._lastTime = null;
        this._debugObj = tools.extend({ onFps: function () { } }, debugObj);
        this._fps = 0;
        this._fpsLastTime = null;
        this._backgroundImage = null;
        this._middleImage = null;
    }

    get bounds() {
        return this._bounds;
    }

    setBackgroundImage(imageSource) {
        if (typeof (imageSource) === 'string') {
            let oImage = new Image();
            oImage.src = imageSource;
            oImage.onload = () => this._backgroundImage = oImage;
        } else {
            this._backgroundImage = imageSource;
        }
    }

    setMiddleImage(imageSource) {
        if (typeof (imageSource) === 'string') {
            let oImage = new Image();
            oImage.src = imageSource;
            oImage.onload = () => this._middleImage = oImage;
        } else {
            this._middleImage = imageSource;
        }
    }

    followRole(role) {
        let roleWidth = role.width, roleHeight = role.height;
        let rX = role.x + roleWidth, rY = role.y;

        if (rX >= this._followRect.x1 && rX <= this._followRect.x2) {
            //this.x = this._followRect.x1 - rX;
            this._viewPort.x = rX - this._followRect.x1;
        }
        if (rY >= this._followRect.y1 && rY <= this._followRect.y2) {
            //this.y = this._followRect.y1 - rY;
            this._viewPort.y = rY - this._followRect.y1;
        }
    }

    getViewPortSize() {
        return { width: this._viewPort.width, height: this._viewPort.height };
    }

    render() {
        let nowTime = Date.now();
        let offsetTime = 0;
        if (this._lastTime != null) {
            offsetTime = nowTime - this._lastTime;
        }
        this._lastTime = nowTime;

        if (system.debug && this._debugObj.onFps) {
            let fpsOffsetTime = nowTime - this._fpsLastTime;
            this._fps += 1;
            if (fpsOffsetTime >= 1000) {
                this._fpsLastTime += fpsOffsetTime;
                this._debugObj.onFps(this._fps);
                this._fps = 0;
            }
        }

        if (offsetTime > 17) offsetTime = 17;
        super.render(this._context, offsetTime);
        window.requestAnimationFrame(() => this.render());
    }

    rendering(parentCtx, offsetTime) {
        //stage 无视旋转缩放
        let viewPort = this._viewPort;
        let x = viewPort.x,
            y = viewPort.y,
            width = viewPort.width,
            height = viewPort.height;

        this._context.clearRect(x, y, width, height);
        if (this._backgroundImage != null) {
            this._context.drawImage(this._backgroundImage, x / 4, y / 4, width, height, x, y, width, height);
        }
        if (this._middleImage != null) {
            this._context.drawImage(this._middleImage, x / 2, y / 2, width, height, x, y, width, height);
        }

        super.rendering(this._context, offsetTime);
    }

    renderChildren(ctx, offsetTime) {
        let tempChildren = this._children.concat();
        let totalChild = tempChildren.length, child, childBounds;

        for (let i = 0; i < totalChild; i++) {
            child = tempChildren[i];
            //if (child !== undefined && child.visible) child.render(ctx, offsetTime);
            if (child.visible) {
                child.render(ctx, offsetTime);
                if (system.debug && child._showDebugBounds) drawDebugBounds(ctx, child);
            }
        }
    }

    /**
     * stage坐标转换为当前坐标
     * 
     * @param {number} stageX 
     * @param {number} stageY 
     * @param {number} [refPoint=null] 推荐传入,减少对象创建: 如传入引用Point对象，则赋值并返回此Point，否则返回new Point
     * @returns 
     * @memberof CGStage
     */
    globalToLocal(stageX, stageY, refPoint = null) {
        if (refPoint != null) {
            refPoint.setTo(stageX - this.x, stageY - this.y);
            return refPoint;
        }
        return new Point(stageX - this.x, stageY - this.y);
    }
}

function drawDebugBounds(ctx, child) {
    let childBounds = child.getConcatenatedBounds();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeRect(childBounds.x, childBounds.y, childBounds.width, childBounds.height);
    ctx.restore();
}

export default CGStage;