import 'babel-polyfill';
import EventPhase from './EventPhase';
import EventType from './EventType';

class EventDispatcher {
    constructor() {
        this._eventHandler = {};
        this._eventCaptureHandler = {};
    }

    addEventListener(type, listener, useCapture = false) {
        let eventHandler = useCapture ? this._eventCaptureHandler : this._eventHandler;
        let handers = eventHandler[type];
        if (handers === undefined) {
            handers = eventHandler[type] = [];
        }

        handers.push(listener);
    }

    dispatchEvent(event) {
        event._currentTarget = event._target = this;
        this._acceptEvent(event);
        return null;
    }

    _acceptEvent(event, capturePhase = false) {
        let eventHandler = capturePhase ? this._eventCaptureHandler : this._eventHandler;
        let handers = eventHandler[event.type];
        if (handers === undefined) return;

        let count = handers.length, itemHander;
        for (let i = 0; i < count; i++) {
            itemHander = handers[i];
            itemHander.call(this, event);
            if (event.isStopImmediatePropagation) break;
        }
    }

    removeEventListener(type, listener, useCapture = false) {
        let eventHandler = useCapture ? this._eventCaptureHandler : this._eventHandler;
        let handers = eventHandler[type];
        if (handers === undefined) return;

        let count = handers.length, item;
        for (let i = 0; i < count; i++) {
            item = handers[i];
            if (item == listener) {
                handers.splice(i, 1);
                return;
            }
        }
    }

    removeAllEventListener(type, useCapture = false) {
        let eventHandler = useCapture ? this._eventCaptureHandler : this._eventHandler;
        let handers = eventHandler[type];
        if (handers !== undefined) delete eventHandler[type];
    }

    hasEventListener(type) {
        return !!(this._eventCaptureHandler[type] || this._eventHandler[type]);
    }

    dispose() {
        this._eventHandler = null;
        this._eventCaptureHandler = null;
    }
}

export default EventDispatcher;