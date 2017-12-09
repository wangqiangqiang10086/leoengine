import 'babel-polyfill';
import CGObject from './CGObject';
import CGDisplayObject from './CGDisplayObject';
import CGDisplayObjectContainer from './CGDisplayObjectContainer';
import CGSequenceFrame from './CGSequenceFrame';
import CGSprite from './CGSprite';
import CGRole from './CGRole';
import CGStage from './CGStage';

let display = Object.freeze({
    CGObject: CGObject,
    CGDisplayObject: CGDisplayObject,
    CGDisplayObjectContainer: CGDisplayObjectContainer,
    CGSequenceFrame: CGSequenceFrame,
    CGSprite: CGSprite,
    CGRole: CGRole,
    CGStage: CGStage
});

export default display;