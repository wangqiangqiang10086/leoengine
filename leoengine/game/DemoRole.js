import 'babel-polyfill';
import system from '../system';
import events from '../events';
import display from '../display';
import physics from '../physics';
import geom from '../geom';

class DemoRole extends display.CGDisplayObjectContainer {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);
        this._sequenceContainer = {};
        this._currentSeq = null;
        this._currentDirectionCode = 0;
        this._currentAction = "stand";
        this._onActionDo = false;
        this._currentVX = 5;
        this._montionObj = new physics.MontionObject(0, 0, 15, 15);
        this._onJump = false;
        this._envList = [];
        
        this.name = "DemoRole";
        this._showDebugBounds = true;
    }

    initFrames(imgs) {
        let stand, run, attack0, attack1, fall;
        for (let i = 0; i < 8; i++) {
            stand = display.CGSequenceFrame.createFromImgs(imgs.slice((0 + (23 * i)), (3 + (23 * i))));
            stand.visible = false;
            this.addChild(stand);
            run = display.CGSequenceFrame.createFromImgs(imgs.slice((3 + (23 * i)), (9 + (23 * i))));
            run.visible = false;
            this.addChild(run);
            attack0 = display.CGSequenceFrame.createFromImgs(imgs.slice((9 + (23 * i)), (13 + (23 * i))));
            attack0.visible = false;
            this.addChild(attack0);
            attack1 = display.CGSequenceFrame.createFromImgs(imgs.slice((13 + (23 * i)), (20 + (23 * i))));
            attack1.visible = false;
            this.addChild(attack1);
            fall = display.CGSequenceFrame.createFromImgs(imgs.slice((20 + (23 * i)), (23 + (23 * i))));
            fall.visible = false;
            this.addChild(fall);
            
            this._sequenceContainer["stand" + i] = stand;
            this._sequenceContainer["run" + i] = run;
            this._sequenceContainer["attack0-" + i] = attack0;
            this._sequenceContainer["attack1-" + i] = attack1;
            this._sequenceContainer["fall" + i] = fall;
        }
        this.action_stand(2);
    }

    setEnvList(list) {
        this._envList = list;
    }

    get MontionObj() {
        return this._montionObj;
    }

    action_stand(directionCode) {
        this.action_go("stand", directionCode);
    }

    action_run(directionCode) {
        this.action_go("run", directionCode);
    }

    action_attack0(directionCode = null) {
        this.action_do("attack0-", directionCode);
    }

    action_attack1(directionCode = null) {
        this.action_do("attack1-", directionCode);
    }

    action_fall(directionCode = null) {
        this.action_do("fall", directionCode);
    }

    action_go(action, directionCode) {
        if (this._onActionDo || (action == this._currentAction && directionCode == this._currentDirectionCode)) return;

        if (this._currentSeq) {
            this._currentSeq.visible = false;
            this._currentSeq.removeAllEventListener(events.EventType.LOOP_COMPLETE);
        }
        this._currentAction = action;
        this._currentDirectionCode = directionCode;        
        this._currentSeq = this._sequenceContainer[action + directionCode];
        this._currentSeq.visible = true;
        this._montionObj.freeze = false;
    }

    action_do(action, directionCode) {
        let tmpDirectionCode = directionCode || this._currentDirectionCode;
        if (this._onActionDo || (action == this._currentAction && tmpDirectionCode == this._currentDirectionCode)) return;

        this._onActionDo = true;

        if (this._currentSeq) {
            this._currentSeq.visible = false;
            this._currentSeq.removeAllEventListener(events.EventType.LOOP_COMPLETE);
        }

        this._currentAction = action;
        this._currentDirectionCode = tmpDirectionCode;
        this._currentSeq = this._sequenceContainer[action + tmpDirectionCode];
        this._currentSeq.visible = true;
        this._currentSeq.addEventListener(events.EventType.LOOP_COMPLETE, (seq) => {
            this._onActionDo = false;
            this.action_stand(tmpDirectionCode);
        });        
        this._currentSeq.gotoAndPlay(0, false);
    }

    Jump(speed) {
        if (this._onJump) return;

        this._onJump = true;
        this._montionObj.setVY(-12);
        this._montionObj.setAY(20);
        this._montionObj.freeze = false;
    }

    renderSelf(selfCtx, offsetTime) {
        if (this._onJump && this._currentAction == "run") {
            switch (this._currentDirectionCode) {
                case 2:
                    this._montionObj.setVX(2.5);
                    break;
                case 6:
                    this._montionObj.setVX(-2.5);
                    break;
            }
        }
        else {
            if (this._currentAction == "run") {
                switch (this._currentDirectionCode) {
                    case 2:
                        this._montionObj.setVX(5);
                        break;
                    case 6:
                        this._montionObj.setVX(-5);
                        break;
                }
            } else {
                this._montionObj.setVX(0);
            }
        }

        let envObj;
        for (let envi = 0, envLength = this._envList.length; envi < envLength; envi++) {
            envObj = this._envList[envi];
            envObj.check(this);
        }

        let dObj = this._montionObj.update(offsetTime);

        if (dObj) {
            this.x += dObj.dx;
            this.y += dObj.dy;
        }

        // if (system.debug) {            
        //     selfCtx.strokeRect(0, 0, this._width, this._height);            
        // }
        
        let renderLoadCompleteEvent = events.Event.create(events.EventType.RENDER);
        this.dispatchEvent(renderLoadCompleteEvent);
        events.Event.release(renderLoadCompleteEvent);
    }

    dispose() {
        this._currentSeq = null;
        this._sequenceContainer = null;
        super.dispose();
    }
}

export default DemoRole;