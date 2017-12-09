import 'babel-polyfill';
import system from '../system';

/**
 * 运动对象
 * 
 *  速度x (pixel/ms)  pixed/s = m/s * pixel/m  5m/s * 50 pixel/m = 250 pixel 
 *  this._velocityX = 0.25;
 *  速度y (pixel/ms)
 *  this._velocityY = 0;
 *  最高速x (pixel/ms)
 *  this._velocityMaxX = 0.5;
 *  最高速y (pixel/ms)
 *  this._velocityMaxY = 0.5;
 *  加速度x (pixel/ms)
 *  this._accelerationX = 0;
 *  加速度y (pixel/ms) 重力 1 = 20 m/s2 = 0.00002 m/ms2
 *  this._accelerationY = 0.00002;
 * 
 * @class MontionObject
 */
class MontionObject {

    /**
     * Creates an instance of MontionObject.
     * @param {number} [vX=0] x轴速度 
     * @param {number} [vY=0] y轴速度
     * @param {number} [vMaxX=15] 最高x轴速度 (防止碰撞穿透 15 * (this._pixelPerMeter / 1000) * 17ms = 12.75 碰撞检测的 marginRange 要大于此值 )
     * @param {number} [vMaxY=15] 最高y轴速度 (防止碰撞穿透)
     * @memberof MontionObject
     */
    constructor(vX = 0, vY = 0, vMaxX = 15, vMaxY = 15) {
        //每像素对应现实长度 根据实际设置
        this._pixelPerMeter = system.stage.pixelPerMeter;

        this.setVX(vX);
        this.setVY(vY);
        this.setVMaxX(vMaxX);
        this.setVMaxY(vMaxY);
        this.setAX(0);
        this.setAY(system.environment.physics.gravity_force);

        //冻结
        this._freeze = true;
    }

    set freeze(value) {
        this._freeze = !!value;
    }
    get freeze() {
        return this._freeze;
    }

    getDirectionLeftRightTrend() {
        // 1 right, 0 notrend, -1 left
        if (this._velocityX > 0) {
            return 1;
        } else if (this._velocityX < 0) {
            return -1;
        } else {
            if (this._accelerationX > 0) {
                return 1;
            } else if (this._accelerationX < 0) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    getDirectionUpDownTrend() {
        // 1 down, 0 notrend, -1 up
        if (this._velocityY > 0) {
            return 1;
        } else if (this._velocityY < 0) {
            return -1;
        } else {
            if (this._accelerationY > 0) {
                return 1;
            } else if (this._accelerationY < 0) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    //设置速度x 单位 m/s
    setVX(value) {
        this._velocityX = value * this._pixelPerMeter / 1000;
    }
    //设置速度y 单位 m/s
    setVY(value) {
        this._velocityY = value * this._pixelPerMeter / 1000;
    }
    //设置最高速度x 单位 m/s
    setVMaxX(value) {
        this._velocityMaxX = value * this._pixelPerMeter / 1000;
    }
    //设置最高速度y 单位 m/s
    setVMaxY(value) {
        this._velocityMaxY = value * this._pixelPerMeter / 1000;
    }
    //设置加速度x 单位 m/s2
    setAX(value) {
        this._accelerationX = value * this._pixelPerMeter / 1000;
    }
    //设置加速度y 单位 m/s2
    setAY(value) {
        this._accelerationY = value * this._pixelPerMeter / 1000000;
    }

    stop() {
        this._velocityX = 0;
        this._velocityY = 0;
        this._velocityMaxX = 0;
        this._velocityMaxY = 0;
        this._accelerationX = 0;
        this._accelerationY = 0;
        this._freeze = false;
    }

    update(detlaTime) {
        if (this._freeze) return { dx: 0, dy: 0 };

        let vx0 = this._velocityX;
        let vy0 = this._velocityY;

        this._velocityX = vx0 + this._accelerationX * detlaTime;
        this._velocityY = vy0 + this._accelerationY * detlaTime;

        if(this._velocityX > this._velocityMaxX) this._velocityX = this._velocityMaxX;
        if(this._velocityY > this._velocityMaxY) this._velocityY = this._velocityMaxY;

        return { dx: (vx0 + this._velocityX) / 2 * detlaTime, dy: (vy0 + this._velocityY) / 2 * detlaTime };
    }
}

export default MontionObject;
