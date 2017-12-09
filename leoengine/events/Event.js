import 'babel-polyfill';
import EventPhase from './EventPhase';

let eventPool = [];

class Event {
    constructor(type, bubbles = false, cancelable = false) {
        this._type = type;
        this._bubbles = !!bubbles;
        this._cancelable = !!cancelable;
        this._eventPhase = EventPhase.AT_TARGET;
        this._target = null;
        this._currentTarget = null;
        this._isStopPropagation = false;
        this._isStopImmediatePropagation = false;
        this._data = null;
    }

    
    /**
     * 以缓存事件池的方式创建事件
     * 
     * @static
     * @param {string} type 
     * @param {boolean} [bubbles=false] 
     * @param {boolean} [cancelable=false] 
     * @returns 
     * @memberof Event
     */
    static create(type, bubbles = false, cancelable = false) {
        if (eventPool.length) {
            let event = eventPool.pop();
            event._type = type;
            event._bubbles = !!bubbles;
            event._cancelable = !!cancelable;
            event._isStopPropagation = false;
            event._isStopImmediatePropagation = false;
            event._eventPhase = EventPhase.AT_TARGET;
            return event;
        }
        return new Event(type, bubbles, cancelable);
    }


    /**
     * 清理事件引用并缓存事件进事件对象池 
     * 
     * @static
     * @param {Event} event 
     * @memberof Event
     */
    static release(event) {
        event.clearQuote();
        eventPool.push(event);
    }

    clearQuote() {
        this._target = this._currentTarget = this._data = null;
    }

    get type() {
        return this._type;
    }

    get bubbles() {
        return this._bubbles;
    }

    get cancelable() {
        return this._cancelable;
    }

    get eventPhase() {
        return this._eventPhase;
    }

    get target() {
        return this._target;
    }

    get currentTarget() {
        return this._currentTarget;
    }

    set data(value) {
        this._data = value;
    }
    get data() {
        return this._data;
    }

    get isStopImmediatePropagation() {
        return this._isStopImmediatePropagation;
    }

    get isStopPropagation() {
        return this._isStopPropagation;
    }

    stopPropagation() {
        this._isStopPropagation = true;
    }

    stopImmediatePropagation() {
        this._isStopPropagation = true;
        this._isStopImmediatePropagation = true;
    }
}

export default Event;