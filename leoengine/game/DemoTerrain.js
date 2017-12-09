import 'babel-polyfill';
import system from '../system';
import display from '../display';
import physics from '../physics';
import geom from '../geom';

class DemoTerrain extends display.CGDisplayObject {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);
        this.name = "DemoTerrain";
        this._rectHit = new geom.Rectangle(0, 0, width, height);
    }

    rendering(parentCtx, offsetTime) {
        parentCtx.fillRect(this._rectHit.x, this._rectHit.y, this._rectHit.width, this._rectHit.height);
    }

    check(demoRole) {
        let montionObj = demoRole.MontionObj,
            directionUpDownTrend = demoRole.MontionObj.getDirectionUpDownTrend(),
            directionLeftRightTrend = demoRole.MontionObj.getDirectionLeftRightTrend();
        if (directionUpDownTrend == -1) {
            if (geom.tools.isHRectUpAtHSegment(demoRole, { x1: this.x, x2: this.x + this.width, y1: this.y + this.height }, 15)) {
                montionObj.setVY(0);
                demoRole.y = this.y + this.height;
            }
        } else if (directionUpDownTrend == 1) {
            if (geom.tools.isHRectDownAtHSegment(demoRole, { x1: this.x, x2: this.x + this.width, y1: this.y }, 15)) {
                montionObj.setVY(0);
                montionObj.setAY(0);
                demoRole.y = this.y - demoRole.height;
                demoRole._onJump = false;
            }
        } else {
            montionObj.setAY(20);
        }

        if (directionLeftRightTrend == -1) {
            if (geom.tools.isHRectLeftAtVSegment(demoRole, { x1: this.x + this.width, y1: this.y, y2: this.y + this.height }, 15)) {
                montionObj.setVX(0);
                montionObj.setAX(0);
                demoRole.x = this.x + this.width;
            }
        } else if (directionLeftRightTrend == 1) {
            if (geom.tools.isHRectRightAtVSegment(demoRole, { x1: this.x, y1: this.y, y2: this.y + this.height }, 15)) {
                montionObj.setVX(0);
                montionObj.setAX(0);
                demoRole.x = this.x - demoRole.width;
            }
        }
    }
}

export default DemoTerrain;