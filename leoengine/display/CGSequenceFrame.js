import 'babel-polyfill';
import assets from '../assets';
import events from '../events';
import CGDisplayObject from './CGDisplayObject';

class CGSequenceFrame extends CGDisplayObject {
    constructor(fps = 12, width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);
        this._isPlaying = false;
        this._autoLoop = false;
        this._currentFrame = 0;
        this._totalFrames = 0;
        this._frames = [];
        this._fps = fps;
        this._intervalTime = (1000 / fps) | 0;
        this._currntIntervalTime = 0;
    }


    /**
     * 从图片数组创建序列帧
     * 
     * @static
     * @param {any} imgs 
     * @returns CGSequenceFrame
     * @memberof CGSequenceFrame
     */
    static createFromImgs(imgs) {
        let sep = new CGSequenceFrame(12, imgs[0].width, imgs[0].height);
        sep.frames = imgs;
        sep.play();
        return sep;
    }


    /**
     * 从图片或图片地址创建序列帧,返回Promise
     * 
     * @static
     * @param {any} imageObj 
     * @param {{x:number,y:number,width:number,height:number}} imgCoords 
     * @returns Promise
     * @memberof CGSequenceFrame
     */
    static createFromImage(imageObj, imgCoords) {
        return new Promise((resolve, reject) => {
            assets.Spritesloader(imageObj, imgCoords).then(imgs => resolve(CGSequenceFrame.createFromImgs(imgs)));
        });
    }

    get isPlaying() {
        return this._isPlaying;
    }

    get currentFrame() {
        return this._currentFrame;
    }

    get totalFrames() {
        return this._totalFrames;
    }

    set frames(value) {
        this._frames = value;
        this._totalFrames = this._frames.length;
    }
    get frames() {
        return this._frames;
    }

    play(loop = true) {
        this._isPlaying = true;
        this._autoLoop = loop;
        this._currntIntervalTime = this._intervalTime;
    }

    stop() {
        this._isPlaying = false;
    }

    gotoAndPlay(index = 0, loop = true) {
        if (index <= this._totalFrames - 1) {
            this._currentFrame = index;
        }
        this.play(loop);
    }

    gotoAndStop() {
        if (index <= this._totalFrames - 1) {
            this._currentFrame = index;
        }
        this.stop();
    }

    rendering(parentCtx, offsetTime) {        
        //不使用离屏canvas
        parentCtx.drawImage(this._frames[this._currentFrame], 0, 0);
        if (this._isPlaying) {
            if (this._currntIntervalTime <= 0) {
                this._currentFrame++;
                if (this._currentFrame > this._totalFrames - 1) {
                    this._currentFrame = 0;

                    let loadCompleteEvent = events.Event.create(events.EventType.LOOP_COMPLETE);
                    this.dispatchEvent(loadCompleteEvent);
                    events.Event.release(loadCompleteEvent);

                    if (!this._autoLoop) this._isPlaying = false;
                }
                this._currntIntervalTime = this._intervalTime;
            } else {
                this._currntIntervalTime -= offsetTime;
            }
        }
    }

    dispose() {
        this.stop();
        this.frames = null;
        super.dispose();
    }
}


export default CGSequenceFrame;