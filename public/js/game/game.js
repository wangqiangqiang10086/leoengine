(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _DemoRole = require('./role/DemoRole');

var _DemoRole2 = _interopRequireDefault(_DemoRole);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ImagePreloader(images) {
    var basePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return new Promise(function (resolve, reject) {
        var total = images.length,
            success = 0,
            failure = 0,
            abort = 0,
            totalImages = [];

        var i = 0,
            oImage = void 0,
            imgPath = void 0;
        for (; i < total; i++) {
            oImage = new Image();
            imgPath = images[i];

            oImage.onload = onload;
            oImage.onerror = onerror;
            oImage.onabort = onabort;
            oImage.src = basePath + imgPath;
            totalImages.push(oImage);
        }

        function onload() {
            success++;
            checkLoad();
        }
        function onerror() {
            failure++;
            checkLoad();
        }
        function onabort() {
            abort++;
            checkLoad();
        }

        function checkLoad() {
            if (total - success - failure - abort == 0) {
                resolve({ total: total, success: success, failure: failure, abort: abort, totalImages: totalImages });
            }
        }
    });
}
(function () {
    var CG_DIC_KEYCODE = {
        UP: 87,
        RIGHT: 68,
        DOWN: 83,
        LEFT: 65,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        ARROW_LEFT: 37,
        SPACE: 32,
        KEYJ: 74,
        KEYK: 75
    };

    var imgsMagicSrc = [];
    for (var i = 0; i < 10; i++) {
        imgsMagicSrc.push('magic/2/0-' + i + '.png');
    }
    new ImagePreloader(imgsMagicSrc, 'images/').then(function (res) {
        var imgMagicSource = res.totalImages;

        var imgsSrc = [];
        for (var _i = 0; _i < 8; _i++) {
            for (var j = 0; j < 23; j++) {
                imgsSrc.push('role/body/0/' + _i + '-' + j + '.png');
            }
        }

        new ImagePreloader(imgsSrc, 'images/').then(function (res) {
            var imgSources = res.totalImages;
            var elementFps = document.getElementById("fps");

            var stage = new leoEngine.display.CGStage('canvas', true, {
                onFps: function onFps(fps) {
                    elementFps.innerText = "fps:" + fps;
                }
            });

            var role0 = new _DemoRole2.default(100, 100, 100, 200);
            role0.initFrames(imgSources);

            stage.addChild(role0);

            var seqMagic = leoEngine.display.CGSequenceFrame.createFromImgs(imgMagicSource);
            seqMagic.play();
            stage.addChild(seqMagic);

            stage.render();

            var keyDirectionStack = [];
            var KeyDirectionArray = [CG_DIC_KEYCODE.UP, CG_DIC_KEYCODE.ARROW_UP, CG_DIC_KEYCODE.RIGHT, CG_DIC_KEYCODE.ARROW_RIGHT, CG_DIC_KEYCODE.DOWN, CG_DIC_KEYCODE.ARROW_DOWN, CG_DIC_KEYCODE.LEFT, CG_DIC_KEYCODE.ARROW_LEFT];
            document.addEventListener('keydown', function (e) {
                //console.log(e)
                var keyCode = e.keyCode;
                if (KeyDirectionArray.indexOf(keyCode) > -1) {
                    var lastKeyCode = _.last(keyDirectionStack);
                    if (!e.repeat) {
                        switch (keyCode) {
                            case CG_DIC_KEYCODE.UP:
                            case CG_DIC_KEYCODE.ARROW_UP:
                                //pushKeyDirectionStack(0);
                                break;
                            case CG_DIC_KEYCODE.RIGHT:
                            case CG_DIC_KEYCODE.ARROW_RIGHT:
                                pushKeyDirectionStack(2);
                                break;
                            case CG_DIC_KEYCODE.DOWN:
                            case CG_DIC_KEYCODE.ARROW_DOWN:
                                //pushKeyDirectionStack(4);
                                break;
                            case CG_DIC_KEYCODE.LEFT:
                            case CG_DIC_KEYCODE.ARROW_LEFT:
                                pushKeyDirectionStack(6);
                                break;
                        }
                    }

                    actionRun();
                } else {
                    if (!e.repeat) {
                        switch (keyCode) {
                            case CG_DIC_KEYCODE.KEYJ:
                                role0.action_attack0();
                                break;
                            case CG_DIC_KEYCODE.KEYK:
                                //role0.action_attack1();
                                role0.Jump();

                                break;
                        }
                    }
                }

                function pushKeyDirectionStack(code) {
                    if (keyDirectionStack.indexOf(code) == -1) {
                        keyDirectionStack.push(code);
                    }
                }

                function actionRun() {
                    var _$takeRight$sort = _.takeRight(keyDirectionStack, 2).sort(),
                        _$takeRight$sort2 = _slicedToArray(_$takeRight$sort, 2),
                        code0 = _$takeRight$sort2[0],
                        code1 = _$takeRight$sort2[1];

                    if (code0 == undefined) return;

                    if (code1 == undefined) {
                        role0.action_run(code0);
                    } else {
                        var dCode = code0 + "" + code1;
                        switch (dCode) {
                            case "02":
                                role0.action_run(1);
                                break;
                            case "24":
                                role0.action_run(3);
                                break;
                            case "46":
                                role0.action_run(5);
                                break;
                            case "06":
                                role0.action_run(7);
                                break;
                        }
                    }
                }
            });
            document.addEventListener('keyup', function (e) {
                //console.log(e)
                var keyCode = e.keyCode;
                var directionCode = null;

                switch (keyCode) {
                    case CG_DIC_KEYCODE.UP:
                    case CG_DIC_KEYCODE.ARROW_UP:
                        directionCode = 0;
                        break;
                    case CG_DIC_KEYCODE.RIGHT:
                    case CG_DIC_KEYCODE.ARROW_RIGHT:
                        directionCode = 2;
                        break;
                    case CG_DIC_KEYCODE.DOWN:
                    case CG_DIC_KEYCODE.ARROW_DOWN:
                        directionCode = 4;
                        break;
                    case CG_DIC_KEYCODE.LEFT:
                    case CG_DIC_KEYCODE.ARROW_LEFT:
                        directionCode = 6;
                        break;
                }

                if (directionCode != null) {
                    _.pull(keyDirectionStack, directionCode);
                    if (keyDirectionStack.length == 0) {
                        role0.action_stand(directionCode);
                    }
                }
            });
        });
    });
})();

},{"./role/DemoRole":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DemoRole = function (_leoEngine$CGSprite) {
    _inherits(DemoRole, _leoEngine$CGSprite);

    function DemoRole() {
        var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var visible = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

        _classCallCheck(this, DemoRole);

        var _this = _possibleConstructorReturn(this, (DemoRole.__proto__ || Object.getPrototypeOf(DemoRole)).call(this, width, height, x, y, index, visible));

        _this._sequenceContainer = {};
        _this._currentSeq = null;
        _this._currentDirectionCode = 0;
        _this._currentAction = "stand";
        _this._onActionDo = false;
        _this._currentVX = 5;
        _this._montionObj = leoEngine.physics.MontionObject();
        _this._onJump = false;
        return _this;
    }

    _createClass(DemoRole, [{
        key: "initFrames",
        value: function initFrames(imgs) {
            for (var i = 0; i < 8; i++) {
                this._sequenceContainer["stand" + i] = CGSequenceFrame.createFromImgs(imgs.slice(0 + 23 * i, 3 + 23 * i));
                this._sequenceContainer["run" + i] = CGSequenceFrame.createFromImgs(imgs.slice(3 + 23 * i, 9 + 23 * i));
                this._sequenceContainer["attack0-" + i] = CGSequenceFrame.createFromImgs(imgs.slice(9 + 23 * i, 13 + 23 * i));
                this._sequenceContainer["attack1-" + i] = CGSequenceFrame.createFromImgs(imgs.slice(13 + 23 * i, 20 + 23 * i));
                this._sequenceContainer["fall" + i] = CGSequenceFrame.createFromImgs(imgs.slice(20 + 23 * i, 23 + 23 * i));
            }
            this.action_stand(2);
        }
    }, {
        key: "action_stand",
        value: function action_stand(directionCode) {
            this.action_go("stand", directionCode);
        }
    }, {
        key: "action_run",
        value: function action_run(directionCode) {
            this.action_go("run", directionCode);
        }
    }, {
        key: "action_attack0",
        value: function action_attack0() {
            var directionCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.action_do("attack0-", directionCode);
        }
    }, {
        key: "action_attack1",
        value: function action_attack1() {
            var directionCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.action_do("attack1-", directionCode);
        }
    }, {
        key: "action_fall",
        value: function action_fall() {
            var directionCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.action_do("fall", directionCode);
        }
    }, {
        key: "action_go",
        value: function action_go(action, directionCode) {
            if (this._onActionDo || action == this._currentAction && directionCode == this._currentDirectionCode) return;

            if (this._currentSeq) this._currentSeq.removeEventListener("loopend");
            this._currentAction = action;
            this._currentDirectionCode = directionCode;
            this._currentSeq = this._sequenceContainer[action + directionCode];
        }
    }, {
        key: "action_do",
        value: function action_do(action, directionCode) {
            var _this2 = this;

            var tmpDirectionCode = directionCode || this._currentDirectionCode;
            if (this._onActionDo || action == this._currentAction && tmpDirectionCode == this._currentDirectionCode) return;

            this._onActionDo = true;

            if (this._currentSeq) this._currentSeq.removeEventListener("loopend");
            this._currentAction = action;
            this._currentDirectionCode = tmpDirectionCode;
            this._currentSeq = this._sequenceContainer[action + tmpDirectionCode];
            this._currentSeq.addEventListener('loopend', function (seq) {
                _this2._onActionDo = false;
                _this2.action_stand(tmpDirectionCode);
            });
            this._currentSeq.gotoAndPlay(0, false);
        }
    }, {
        key: "Jump",
        value: function Jump(speed) {
            if (this._onJump) return;

            this._onJump = true;
            this._montionObj.setVY(-10);
        }
    }, {
        key: "renderSelf",
        value: function renderSelf(selfCtx, offsetTime) {
            if (this._currentAction == "run") {
                switch (this._currentDirectionCode) {
                    case 2:
                        this._montionObj.setVX = 5;
                        break;
                    case 6:
                        this._montionObj.setVX = -5;
                        break;
                }
            }

            var dObj = this._montionObj.update(offsetTime);
            this.x += dObj.dx;
            this.y += dObj.dy;
            //console.log(dObj.dy);

            if (this._onJump && this.y >= 540) {
                this._onJump = false;
                this.y = 540;
                this._montionObj.setVY(0);
                this._montionObj.setAY(0);
            }

            this._currentSeq.render(selfCtx, offsetTime);
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this._currentSeq = null;
            this._sequenceContainer = null;
            _get(DemoRole.prototype.__proto__ || Object.getPrototypeOf(DemoRole.prototype), "dispose", this).call(this);
        }
    }]);

    return DemoRole;
}(leoEngine.CGSprite);

exports.default = DemoRole;

},{}]},{},[1])


//# sourceMappingURL=game.js.map
