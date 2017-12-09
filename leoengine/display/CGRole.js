import 'babel-polyfill';
import CGSprite from './CGSprite';
import CGSequenceFrame from './CGSequenceFrame';

class CGRole extends CGSprite {
    constructor(width = 0, height = 0, x = 0, y = 0, index = 0, visible = true) {
        super(width, height, x, y, index, visible);
        this._sequenceContainer = {};
        this._currentSeq = null;
        this._currentDirectionCode = 0;
        this._currentAction = "stand";
        this._onActionDo = false;
        this._currentStep = 5;
        this._currentStep2 = (5 / 1.414) | 0;
    }

    initFrames(imgs) {
        for (let i = 0; i < 8; i++) {
            this._sequenceContainer["stand" + i] = CGSequenceFrame.createFromImgs(imgs.slice((0 + (23 * i)), (3 + (23 * i))));
            this._sequenceContainer["run" + i] = CGSequenceFrame.createFromImgs(imgs.slice((3 + (23 * i)), (9 + (23 * i))));
            this._sequenceContainer["attack0-" + i] = CGSequenceFrame.createFromImgs(imgs.slice((9 + (23 * i)), (13 + (23 * i))));
            this._sequenceContainer["attack1-" + i] = CGSequenceFrame.createFromImgs(imgs.slice((13 + (23 * i)), (20 + (23 * i))));
            this._sequenceContainer["fall" + i] = CGSequenceFrame.createFromImgs(imgs.slice((20 + (23 * i)), (23 + (23 * i))));
        }
        this.action_stand(2);
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

        if (this._currentSeq) this._currentSeq.removeEventListener("loopend");
        this._currentAction = action;
        this._currentDirectionCode = directionCode;
        this._currentSeq = this._sequenceContainer[action + directionCode];
    }

    action_do(action, directionCode) {
        let tmpDirectionCode = directionCode || this._currentDirectionCode;
        if (this._onActionDo || (action == this._currentAction && tmpDirectionCode == this._currentDirectionCode)) return;

        this._onActionDo = true;

        if (this._currentSeq) this._currentSeq.removeEventListener("loopend");
        this._currentAction = action;
        this._currentDirectionCode = tmpDirectionCode;
        this._currentSeq = this._sequenceContainer[action + tmpDirectionCode];
        this._currentSeq.addEventListener('loopend', (seq) => {
            this._onActionDo = false;
            this.action_stand(tmpDirectionCode);
        });
        this._currentSeq.gotoAndPlay(0, false);
    }

    renderSelf(selfCtx, offsetTime) {
        if (this._currentAction == "run") {

            switch (this._currentDirectionCode) {
                case 0:
                    this.y -= this._currentStep;
                    break;
                case 1:
                    this.y -= this._currentStep2;
                    this.x += this._currentStep2;
                    break;
                case 2:

                    this.x += this._currentStep;
                    break;
                case 3:
                    this.x += this._currentStep2;
                    this.y += this._currentStep2;
                    break;
                case 4:
                    this.y += this._currentStep;
                    break;
                case 5:
                    this.y += this._currentStep2;
                    this.x -= this._currentStep2;
                    break;
                case 6:
                    this.x -= this._currentStep;
                    break;
                case 7:
                    this.x -= this._currentStep2;
                    this.y -= this._currentStep2;
                    break;
            }
        }

        this._currentSeq.render(selfCtx, offsetTime);
    }

    dispose() {
        this._currentSeq = null;
        this._sequenceContainer = null;
        super.dispose();
    }
}

export default CGRole;