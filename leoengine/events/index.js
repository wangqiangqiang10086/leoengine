import 'babel-polyfill';
import EventPhase from './EventPhase';
import EventType from './EventType';
import Event from './Event';
import EventDispatcher from './EventDispatcher';

let events = Object.freeze({
    EventPhase: EventPhase,
    EventType: EventType,
    Event: Event,
    EventDispatcher: EventDispatcher
});

export default events;