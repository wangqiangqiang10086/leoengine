import 'babel-polyfill';

const EventType = Object.freeze({
    ADDED_TO_STAGE: "addedToStage",
    REMOVED_FROM_STAGE: "removedFromStage",
    ADDED: "added",
    REMOVED: "removed",
    RENDER: "render",
    CHANGE: "change",
    CHANGING: "changing",
    LOOP_COMPLETE: "loopComplete",
    COMPLETE: "complete",
    ENDED: "ended",
    SOUND_COMPLETE: "soundComplete"
});

export default EventType;