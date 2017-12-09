import 'babel-polyfill';
import assets from '../assets';
import display from '../display';
import SeqRingPool from './SeqRingPool';
import system from '../system';
import geom from '../geom';
import Point from '../geom/Point';
import sound from '../sound';
import tools from '../tools';

let ringOnMouseDown = null;
let mouseDownCoord = new Point();
let mouseMoveCoord = new Point();


class RingManager {
    constructor(imageSource, soundKey, ringParent, onReady) {
        this._rings = [];
        this._ringPool = null;
        this._soundKey = soundKey;
        this._soundIndex = 0;
        this._soundPlay = tools.throttle(() => {
            this.playSound();
        }, 100, { leading: true });
        this._ringParent = ringParent;
        this._onReady = onReady;
        this.init(imageSource);

    }

    init(imageSource) {
        let ringImgloader = new assets.Spritesloader(imageSource, [
            { x: 0, y: 0, width: 32, height: 32 },
            { x: 32, y: 0, width: 32, height: 32 },
            { x: 64, y: 0, width: 32, height: 32 },
            { x: 96, y: 0, width: 32, height: 32 },
            { x: 0, y: 32, width: 32, height: 32 },
            { x: 32, y: 32, width: 32, height: 32 },
            { x: 64, y: 32, width: 32, height: 32 },
            { x: 96, y: 32, width: 32, height: 32 },
            { x: 0, y: 64, width: 32, height: 32 },
            { x: 32, y: 64, width: 32, height: 32 },
            { x: 64, y: 64, width: 32, height: 32 },
            { x: 96, y: 64, width: 32, height: 32 },
            { x: 0, y: 96, width: 32, height: 32 },
            { x: 32, y: 96, width: 32, height: 32 },
            { x: 64, y: 96, width: 32, height: 32 },
            { x: 96, y: 96, width: 32, height: 32 }
        ]);

        ringImgloader.then((imgs) => {
            this._ringPool = new SeqRingPool(imgs);
            this._onReady();
        });
    }

    loadStory0() {
        this._ringParent.addEventListener("mousedown", e => {
            e.stopImmediatePropagation();
            if (e.target instanceof display.CGSequenceFrame && e.target.name == "ring") {
                ringOnMouseDown = e.target;
                ringOnMouseDown.globalToLocal(e.data.stageX, e.data.stageY, mouseDownCoord);
                //console.log(e);
                //console.log(mouseDownCoord);
            }
        });

        this._ringParent.addEventListener("mousemove", e => {
            e.stopImmediatePropagation();
            if (ringOnMouseDown == null) return;

            ringOnMouseDown.globalToLocal(e.data.stageX, e.data.stageY, mouseMoveCoord);
            ringOnMouseDown.x += mouseMoveCoord.x - mouseDownCoord.x;
            ringOnMouseDown.y += mouseMoveCoord.y - mouseDownCoord.y;
        });

        this._ringParent.addEventListener("mouseup", e => {
            ringOnMouseDown = null;
        });

        this.addRing(300, 500);
        this.addRing(300, 500, 2, 2, 0.5, 0);
        this.addRing(350, 550);
        this.addRing(400, 600);
        this.addRing(450, 650);
        this.addRing(500, 700);
        this.addRing(550, 750);
        this.addRing(250, 450);

        this.addRing(550, 1000);
        this.addRing(600, 1000);
        this.addRing(650, 1000);
        this.addRing(700, 1000);
        this.addRing(750, 1000);
        this.addRing(800, 1000);
        this.addRing(850, 1000);
        this.addRing(900, 1000);
    }

    addRing(x, y, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0) {
        this._rings.push(this._ringParent.addChild(this._ringPool.getRing(x, y, scaleX, scaleY, skewX, skewY)));
    }

    check(demoRole) {
        let parent = this._ringParent,
            ringPool = this._ringPool,
            rings = this._rings,
            newRings = [],
            isHit = false,
            ring;

        for (let i = 0, count = rings.length; i < count; i++) {
            ring = rings[i];
            if (geom.tools.hitTestRectToRect(demoRole, ring)) {
                parent.removeChild(ring);
                ringPool.addObject(ring);
                isHit = true;
            } else {
                newRings.push(ring);
            }
        }

        this._rings = newRings;

        if (isHit) this._soundPlay();
    }

    playSound() {
        if (this._soundIndex > 2) {
            this._soundIndex = 0;
        }
        sound.play(this._soundKey + this._soundIndex);
        //this._soundIndex++;
    }
}

export default RingManager;