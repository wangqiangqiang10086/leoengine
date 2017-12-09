import 'babel-polyfill';
import events from '../events';

class WebEventHandler {
    constructor(stage) {
        this._stage = stage;
        this._canvas = stage._canvas;
        this.updateScaleMode();

        bindEvents(this);
    }

    updateScaleMode() {
        let scaleObj = getScale(this._canvas);
        this._scaleX = scaleObj.scaleX;
        this._scaleY = scaleObj.scaleY;
    }
}

function bindEvents(thisObj) {
    let stage = thisObj._stage,
        canvas = thisObj._canvas;

    let eventsArray = ["mousedown", "mousemove", "mouseup", "click"];
    //let eventsArray = ["click"];    

    eventsArray.forEach((eventType) => {        
        canvas.addEventListener(eventType, e => {
            e.preventDefault();

            let offsetX = e.offsetX * thisObj._scaleX;
            let offsetY = e.offsetY * thisObj._scaleY;
            let hitObj = stage.hitTest(offsetX, offsetY);            
            if (!hitObj) hitObj = stage;

            let clickEvent = events.Event.create(eventType, true);
            clickEvent.data = { stageX: offsetX, stageY: offsetY };
            hitObj.dispatchEvent(clickEvent);
            events.Event.release(clickEvent);
        });
    });



    window.addEventListener("resize", e => {
        thisObj.updateScaleMode();
    });
}

function getOffset(domCanvas) {
    var canvasRect = domCanvas.getBoundingClientRect();
    var win = domCanvas.ownerDocument.defaultView;
    return {
        top: canvasRect.top + win.pageYOffset,
        left: canvasRect.left + win.pageXOffset
    };
}

function getScale(domCanvas) {
    var canvasRect = domCanvas.getBoundingClientRect();
    return { scaleX: domCanvas.width / canvasRect.width, scaleY: domCanvas.height / canvasRect.height };
}

export default WebEventHandler;