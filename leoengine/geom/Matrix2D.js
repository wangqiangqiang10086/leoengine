import 'babel-polyfill';
import Point from './Point';
import MathEx from '../tools/MathEx';

let EmptyMarix;

/*
等 CanvasRenderingContext2D.currentTransform 标准定后 可不使用或重写此类
参考
    https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix (已废弃)
    https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix (规划标准)
    
*/

/**
 * 2d图形变换矩阵,形如
 * a,c,tx
 * b,d,ty
 * 0,0,1
 * 
 * 
 * @class Matrix2D
 */
class Matrix2D {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.setTo(a, b, c, d, tx, ty);
    }

    setTo(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    }

    static get EmptyMarix() {
        if (EmptyMarix == null) {
            EmptyMarix = Object.freeze(new Matrix2D());
        }
        return EmptyMarix;
    }

    /**
     * 位移
     * 
     * @param {number} x x轴位移 
     * @param {number} y y轴位移
     * @returns
     * @memberof Matrix2D
     */
    translate(x, y) {
        this.tx = this.a * x + this.c * y + this.tx;
        this.ty = this.b * x + this.d * y + this.ty;

        //this.concat(new Matrix2D(1, 0, 0, 1, x, y));
        return this;
    }

    /**
     * 旋转
     * 
     * @param {number} deg 旋转角度
     * @returns 
     * @memberof Matrix2D
     */
    rotate(deg) {
        let sin = MathEx.sin(deg);
        if (sin === 0) return;

        let cos = MathEx.cos(deg);
        let a = this.a,
            b = this.b,
            c = this.c,
            d = this.d;

        this.a = a * cos + c * sin;
        this.b = b * cos + d * sin;
        this.c = -a * sin + c * cos;
        this.d = -b * sin + d * cos;

        //this.concat(new Matrix2D(cos, sin, -sin, cos, 0, 0));
        return this;
    }

    /**
     * 缩放
     * 
     * @param {number} sx x轴倍率
     * @param {number} sy y轴倍率
     * @returns
     * @memberof Matrix2D
     */
    scale(sx, sy) {
        if (sx !== 1) {
            this.a *= sx;
            this.b *= sx;
        }
        if (sy !== 1) {
            this.c *= sy;
            this.d *= sy;
        }

        //this.concat(new Matrix2D(sx, 0, 0, sy, 0, 0));
        return this;
    }

    /**
     * 倾斜
     * 
     * @param {number} radX 弧度 斜角沿 y 轴的正切
     * @param {number} radY 弧度 斜角沿 x 轴的正切
     * @returns
     * @memberof Matrix2D
     */
    skew(radX, radY) {
        let tanX = Math.tan(radX),
            tanY = Math.tan(radY);

        let a = this.a,
            b = this.b,
            c = this.c,
            d = this.d;

        if (tanX !== 0) {
            this.a = a + c * tanX;
            this.b = b + d * tanX;
        }
        if (tanY !== 0) {
            this.c = a * tanY + c;
            this.d = b * tanY + d;
        }

        //this.concat(new Matrix2D(1, Math.tan(radX), Math.tan(radY), 1, 0, 0));
        return this;
    }

    get scaleX() {
        if (this.a == 1 && this.c == 0) {
            return 1;
        }
        let result = Math.sqrt(this.a * this.a + this.c * this.c);
        return this.getDeterminant() < 0 ? -result : result;
    }

    get scaleY() {
        if (this.b == 0 && this.d == 1) {
            return 1;
        }
        let result = Math.sqrt(this.b * this.b + this.d * this.d);
        return this.getDeterminant() < 0 ? -result : result;
    }

    get skewX() {
        return Math.atan2(this.d, this.b) - MathEx.HALF_PI;
    }

    get skewY() {
        return Math.atan2(this.c, this.a);
    }

    getDeterminant() {
        return this.a * this.d - this.b * this.c;
    }

    updateScaleAndRotation(scaleX, scaleY, skewX, skewY) {
        if ((skewX == 0 || skewX == MathEx.DOUBLE_PI) && (skewY == 0 || skewY == MathEx.DOUBLE_PI)) {
            this.a = scaleX;
            this.b = this.c = 0;
            this.d = scaleY;
            return;
        }
        skewX = MathEx.radToDeg(skewX);
        skewY = MathEx.radToDeg(skewY);
        let u = MathEx.cos(skewX);
        let v = MathEx.sin(skewX);
        if (skewX == skewY) {
            this.a = u * scaleX;
            this.c = v * scaleX;
        } else {
            this.a = MathEx.cos(skewY) * scaleX;
            this.c = MathEx.sin(skewY) * scaleX;
        }
        this.b = -v * scaleY;
        this.d = u * scaleY;

        return this;
    }

    /**
     * 坐标矩阵变换
     * 
     * @param {number} pointX 
     * @param {number} pointY 
     * @param {object} [refPoint=null] 推荐传入,减少对象创建: 如传入引用Point对象，则赋值并返回此Point，否则返回new Point
     * @returns 
     * @memberof Matrix2D
     */
    transformPoint(pointX, pointY, refPoint = null) {
        let localX = this.a * pointX + this.c * pointY + this.tx;
        let localY = this.b * pointX + this.d * pointY + this.ty;

        if (refPoint != null) {
            refPoint.setTo(localX, localY);
            return refPoint;
        }

        return new Point(localX, localY);
    }

    /**
     * source 矩阵变换为 target
     * 
     * @param {x,y,width,height} source 
     * @param {x,y,width,height} bounds 
     * @memberof Matrix2D
     */
    transformBounds(source, target) {
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let tx = this.tx;
        let ty = this.ty;

        let x = source.x;
        let y = source.y;
        let xMax = x + source.width;
        let yMax = y + source.height;

        let x0 = a * x + c * y + tx;
        let y0 = b * x + d * y + ty;
        let x1 = a * xMax + c * y + tx;
        let y1 = b * xMax + d * y + ty;
        let x2 = a * xMax + c * yMax + tx;
        let y2 = b * xMax + d * yMax + ty;
        let x3 = a * x + c * yMax + tx;
        let y3 = b * x + d * yMax + ty;

        let tmp = 0;

        if (x0 > x1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
        }
        if (x2 > x3) {
            tmp = x2;
            x2 = x3;
            x3 = tmp;
        }

        target.x = Math.floor(x0 < x2 ? x0 : x2);
        target.width = Math.ceil((x1 > x3 ? x1 : x3) - target.x);

        if (y0 > y1) {
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }
        if (y2 > y3) {
            tmp = y2;
            y2 = y3;
            y3 = tmp;
        }

        target.y = Math.floor(y0 < y2 ? y0 : y2);
        target.height = Math.ceil((y1 > y3 ? y1 : y3) - target.y);
    }


    /**
     * 矩阵相乘 后乘 this X other
     * 
     * @param {Matrix2D} other 另一个矩阵
     * @memberof Matrix2D
     */
    concat(other) {
        let a = this.a * other.a + this.c * other.b;
        let b = this.b * other.a + this.d * other.b;
        let c = this.a * other.c + this.c * other.d;
        let d = this.b * other.c + this.d * other.d;
        let tx = this.a * other.tx + this.c * other.ty + this.tx;
        let ty = this.b * other.tx + this.d * other.ty + this.ty;

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    }

    /**
     * 矩阵相乘 后乘并赋值 target
     * 
     * @param {any} other 
     * @param {any} target 
     * @memberof Matrix2D
     */
    concatInto(other, target) {
        let a = this.a * other.a + this.c * other.b;
        let b = this.b * other.a + this.d * other.b;
        let c = this.a * other.c + this.c * other.d;
        let d = this.b * other.c + this.d * other.d;
        let tx = this.a * other.tx + this.c * other.ty + this.tx;
        let ty = this.b * other.tx + this.d * other.ty + this.ty;

        target.a = a;
        target.b = b;
        target.c = c;
        target.d = d;
        target.tx = tx;
        target.ty = ty;
    }

    /**
     * 矩阵相乘 前乘   other X this
     * 
     * @param {Matrix2D} other 另一个矩阵
     * @memberof Matrix2D
     */
    preConcat(other) {
        let a = other.a * this.a + other.c * this.b;
        let b = other.b * this.a + other.d * this.b;
        let c = other.a * this.c + other.c * this.d;
        let d = other.b * this.c + other.d * this.d;
        let tx = other.a * this.tx + other.c * this.ty + other.tx;
        let ty = other.b * this.tx + other.d * this.ty + other.ty;

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    }

    /**
     * 矩阵相乘 前乘并赋值 target
     * 
     * @param {Matrix2D} other 
     * @param {Matrix2D} target 
     * @memberof Matrix2D
     */
    preConcatInto(other, target) {
        let a = other.a * this.a + other.c * this.b;
        let b = other.b * this.a + other.d * this.b;
        let c = other.a * this.c + other.c * this.d;
        let d = other.b * this.c + other.d * this.d;
        let tx = other.a * this.tx + other.c * this.ty + other.tx;
        let ty = other.b * this.tx + other.d * this.ty + other.ty;

        target.a = a;
        target.b = b;
        target.c = c;
        target.d = d;
        target.tx = tx;
        target.ty = ty;
    }

    /**
     * 求逆矩阵并赋值target
     * 
     * @param {Matrix2D} target 
     * @returns 
     * @memberof Matrix2D
     */
    invertInto(target) {
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let tx = this.tx;
        let ty = this.ty;
        if (b == 0 && c == 0) {
            target.b = target.c = 0;
            if (a == 0 || d == 0) {
                target.a = target.d = target.tx = target.ty = 0;
            }
            else {
                a = target.a = 1 / a;
                d = target.d = 1 / d;
                target.tx = -a * tx;
                target.ty = -d * ty;
            }

            return;
        }
        let determinant = a * d - b * c;
        if (determinant == 0) {
            //检测是否有逆矩阵
            target.identity();
            return;
        }
        determinant = 1 / determinant;
        let k = target.a = d * determinant;
        b = target.b = -b * determinant;
        c = target.c = -c * determinant;
        d = target.d = a * determinant;
        target.tx = -(k * tx + c * ty);
        target.ty = -(b * tx + d * ty);
    }

    /**
     * 从其它矩阵复制
     * 
     * @param {Matrix2D} other 另一个矩阵
     * @memberof Matrix2D
     */
    copyFrom(other) {
        this.a = other.a;
        this.b = other.b;
        this.c = other.c;
        this.d = other.d;
        this.tx = other.tx;
        this.ty = other.ty;
    }

    identity() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
    }

    clone() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
}

export default Matrix2D;