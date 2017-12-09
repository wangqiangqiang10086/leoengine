import 'babel-polyfill';
import DemoRole from './DemoRole';
import DemoTerrain from './DemoTerrain';
import ObjectPool from './ObjectPool';
import SeqRingPool from './SeqRingPool';
import RingManager from './RingManager';

let game = Object.freeze({
    DemoRole: DemoRole,
    DemoTerrain: DemoTerrain,
    ObjectPool: ObjectPool,
    SeqRingPool: SeqRingPool,
    RingManager: RingManager
});

export default game;