import 'babel-polyfill';
import system from './system';
import tools from './tools';
import events from './events';
import sound from './sound';
import geom from './geom';
import display from './display';
import physics from './physics';
import assets from './assets';
import game from './game';
import web from './web';

let stage = null;
let WebEventHandler = null;

function init(canvasObj, options, onReady) {
    system.init();
    system.debug = !!options.debug;
    let thisStage = new display.CGStage(canvasObj, options.debugObj || {});    
    WebEventHandler = new web.WebEventHandler(thisStage);
    stage = thisStage;

    if (onReady && typeof (onReady) == "function") onReady(stage);
}

let leoEngine = Object.freeze({
    system: system,
    tools: tools,
    events: events,
    sound: sound,
    geom: geom,
    physics: physics,
    display: display,
    assets: assets,
    game: game,
    stage: stage,
    init: init
});

//export default leoEngine;
if (window) window.leoEngine = leoEngine;
export default leoEngine;