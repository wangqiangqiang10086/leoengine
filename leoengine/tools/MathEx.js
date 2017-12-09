import 'babel-polyfill';

const PI = Math.PI;
const DOUBLE_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const RAD_PER_DEG = PI / 180;

let sin_map = [];
let cos_map = [];
(() => {
    let rad;
    for (let i = 0; i < 360; i++) {
        rad = i * RAD_PER_DEG;
        sin_map[i] = Math.sin(rad);
        cos_map[i] = Math.cos(rad);
    }

    sin_map[90] = 1;
    cos_map[90] = 0;
    sin_map[180] = 0;
    cos_map[180] = -1;
    sin_map[270] = -1;
    cos_map[270] = 0;
})();

/**
 * 角度转为弧度
 * 
 * @param {number} deg 
 * @returns 
 */
function degToRad(deg) {
    return deg * RAD_PER_DEG;
}

/**
 * 弧度转为角度
 * 
 * @param {number} rad 
 * @returns 
 */
function radToDeg(rad) {
    return rad / RAD_PER_DEG;
}

/**
 * 计算对应角度值的sin近似值
 * 
 * @param {number} value 角度值
 * @returns {number} sin值
 */
function sin(value) {
    let valueFloor = Math.floor(value);
    let resultFloor = sinInt(valueFloor);
    if (valueFloor === value) return resultFloor;

    let valueCeil = valueFloor + 1;
    let resultCeil = sinInt(valueCeil);

    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
}

function sinInt(value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    return sin_map[value];
}

/**
 * 计算对应角度值的cos近似值
 * 
 * @param {number} value 角度值
 * @returns {number} cos值
 */
function cos(value) {
    let valueFloor = Math.floor(value);
    let resultFloor = cosInt(valueFloor);
    if (valueFloor === value) return resultFloor;

    let valueCeil = valueFloor + 1;
    let resultCeil = cosInt(valueCeil);

    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
}

function cosInt(value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    return cos_map[value];
}

let MathEx = Object.freeze({
    PI: PI,
    HALF_PI: HALF_PI,
    DOUBLE_PI: DOUBLE_PI,
    degToRad: degToRad,
    radToDeg: radToDeg,
    sin: sin,
    cos: cos
});

export default MathEx;


