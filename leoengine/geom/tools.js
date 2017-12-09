import 'babel-polyfill';


/**
 * 点在线段上
 * 
 * @param {{x:Number,y:Number}} p 点
 * @param {{x:Number,y:Number}} p1 线段端点起
 * @param {{x:Number,y:Number}} p2 线段端点终
 * @returns Boolean
 */
function isPointOnSegment(p, p1, p2) {
    //差积是否为0，判断是否在同一直线上    
    if ((p1.x - p.x) * (p2.y - p.y) - (p2.x - p.x) * (p1.y - p.y) != 0) {
        return false;
    }
    //判断是否在线段上
    if ((p.x > p1.x && p.x > p2.x) || (p.x < p1.x && p.x < p2.x)) {
        return false;
    }
    if ((p.y > p1.y && p.y > p2.y) || (p.y < p1.y && p.y < p2.y)) {
        return false;
    }
    return true;
}

/**
 * 计算两点间距离
 * 
 * @param {{x:Number,y:Number}} pointObj0 
 * @param {{x:Number,y:Number}} pointObj1 
 * @returns Number
 */
function calTwoPointDistance(pointObj0, pointObj1) {
    let xd = pointObj1.x - pointObj0.x,
        yd = pointObj1.y - pointObj1.y;

    return Math.pow((xd * xd, yd * yd), 0.5);
}

/**
 * 判断点是否在矩形内
 * 
 * @param {{x:Number,y:Number}} pointObj 点
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 矩形
 * @returns Boolean
 */
function isPointInRect(pointObj, rectObj) {
    let px = pointObj.x;
    let py = pointObj.y;

    let left = rectObj.x;
    let top = rectObj.y;
    let right = rectObj.x + rectObj.width;
    let bottom = rectObj.y + rectObj.height;

    if (py < top || px > right || py > bottom || px < left) {
        return false;
    } else {
        return true;
    }
}


/**
 * 判断点是否在圆内
 * 
 * @param {{x:Number,y:Number}} pointObj 点
 * @param {{x:Number,y:Number,radus:Number}} circleObj 圆
 * @returns Boolean
 */
function isPointInCircle(pointObj, circleObj) {
    return calTwoPointDistance(pointObj0, { x: circleObj.x, y: circleObj.y }) <= circleObj.radus;
}


/**
 * 判断两个矩形是否碰撞
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj0 矩形
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj1 矩形
 * @returns Boolean
 */
function hitTestRectToRect(rectObj0, rectObj1) {
    let left0 = rectObj0.x,
        top0 = rectObj0.y,
        right0 = rectObj0.x + rectObj0.width,
        bottom0 = rectObj0.y + rectObj0.height;

    let left1 = rectObj1.x,
        top1 = rectObj1.y,
        right1 = rectObj1.x + rectObj1.width,
        bottom1 = rectObj1.y + rectObj1.height;

    if (bottom0 < top1 || left0 > right1 || top0 > bottom1 || right0 < left1) {
        return false;
    } else {
        return true;
    }
}

/**
 * 判断rect是否在circle的某一象限
 * 
 * @param {{x:Number,y:Number}} circleCenter 圆心坐标
 * @param {{x:Number,y:Number}} leftTop 矩形左上角坐标
 * @param {{x:Number,y:Number}} rightBottom 矩形右下角坐标
 * @returns Boolean
 */
function isSameQuadrant(circleCenter, leftTop, rightBottom) {
    let coodX = circleCenter.x;
    let coodY = circleCenter.y;
    let xoA = leftTop.x,
        yoA = leftTop.y,
        xoB = rightBottom.x,
        yoB = rightBottom.y;

    if (xoA - coodX > 0 && xoB - coodX > 0) {
        if ((yoA - coodY > 0 && yoB - coodY > 0) || (yoA - coodY < 0 && yoB - coodY < 0)) {
            return true;
        }
        return false;
    } else if (xoA - coodX < 0 && xoB - coodX < 0) {
        if ((yoA - coodY > 0 && yoB - coodY > 0) || (yoA - coodY < 0 && yoB - coodY < 0)) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}


/**
 * 判断矩形与圆是否碰撞
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 矩形
 * @param {{x:Number,y:Number,radus:Number}} circleObj 圆
 * @returns Boolean
 */
function hitTestRectToCircle(rectObj, circleObj) {
    let rw = rectObj.width,
        rh = rectObj.height,
        ar = circleObj.radus,
        rx = rectObj.x,
        ry = rectObj.y,
        ax = circleObj.x,
        ay = circleObj.y;

    let rcx = rx + rw * 0.5, rcy = ry + rh * 0.5;
    let rltx = rx,
        rlty = ry,
        rlbx = rx,
        rlby = ry + rh,
        rrtx = rx + rw,
        rrty = ry,
        rrbx = rx + rw,
        rrby = ry + rh;

    if (isSameQuadrant({ x: ax, y: ay }, { x: rltx, y: rlty }, { x: rrbx, y: rrby })) {
        let dX1 = Math.abs(ax - rltx), dY1 = Math.abs(ay - rlty);
        let dX2 = Math.abs(ax - rlbx), dY2 = Math.abs(ay - rlby);
        let dX3 = Math.abs(ax - rrtx), dY3 = Math.abs(ay - rrty);
        let dX4 = Math.abs(ax - rrbx), dY4 = Math.abs(ay - rrby);

        if ((((dX1 * dX1) + (dY1 * dY1)) <= (ar * ar)) || (((dX2 * dX2) + (dY2 * dY2)) <= (ar * ar)) || (((dX3 * dX3) + (dY3 * dY3)) <= (ar * ar)) || (((dX4 * dX4) + (dY4 * dY4)) <= (ar * ar))) {
            return true;
        }
        return false;
    } else {
        let result = false;
        let squareX = ax,
            squareY = ay,
            squareW = ar * 2,
            squareH = squareW;
        if ((Math.abs(squareX - rcx) <= (squareW + rw) * 0.5) && (Math.abs(squareY - rcy) <= (squareH + rh) * 0.5)) {
            result = true;
        }
        return result;
    }
}


/**
 * 判断两圆是否碰撞
 * 
 * @param {{x:Number,y:Number,radus:Number}} circleObj0 
 * @param {{x:Number,y:Number,radus:Number}} circleObj1 
 * @returns Boolean
 */
function hitTestCircleToCircle(circleObj0, circleObj1) {
    return calTwoPointDistance({ x: circleObj0.x, y: circleObj0.y }, { x: circleObj1.x, y: circleObj1.y }) <= circleObj0.radus + circleObj1.radus;
}


/**
 * 判断水平矩形是否向下运动接触水平线段
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 
 * @param {{x1:Number,x2:Number,y1:Number,y2:Number}} segObj 
 * @param {Number} marginRange 
 * @returns 
 */
function isHRectDownAtHSegment(rectObj, segObj, marginRange) {
    let rectRight = rectObj.x + rectObj.width,
        rectWidth = rectObj.width,
        rectTop = rectObj.y,
        rectBottom = rectObj.y + rectObj.height;

    let segLeft = segObj.x1,
        segRight = segObj.x2,
        segY = segObj.y1;

    //矩形最右x >= 线段最左x && 矩形最右 <= 线段最右+矩形宽度 && 线段高度 <= 矩形底部 && 线段高度 >= 矩形底部-修正值(用于修正帧间误差)
    if (rectRight > segLeft && rectRight < segRight + rectWidth && segY <= rectBottom && segY > rectBottom - marginRange) {
        return true;
    }
    return false;
}


/**
 * 判断水平矩形是否向上运动接触水平线段
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 
 * @param {{x1:Number,x2:Number,y1:Number,y2:Number}} segObj 
 * @param {Number} marginRange 
 * @returns 
 */
function isHRectUpAtHSegment(rectObj, segObj, marginRange) {
    let rectRight = rectObj.x + rectObj.width,
        rectWidth = rectObj.width,
        rectTop = rectObj.y,
        rectBottom = rectObj.y + rectObj.height;

    let segLeft = segObj.x1,
        segRight = segObj.x2,
        segY = segObj.y1;

    //矩形最右x >= 线段最左x && 矩形最右 <= 线段最右+矩形宽度 && 线段高度 <= 矩形顶部 && 线段高度 >= 矩形顶部-修正值(用于修正帧间误差)
    if (rectRight > segLeft && rectRight < segRight + rectWidth && segY <= rectTop && segY > rectTop - marginRange) {
        return true;
    }
    return false;
}

/**
 * 判断水平矩形是否向左运动接触垂直线段
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 
 * @param {{x1:Number,x2:Number,y1:Number,y2:Number}} segObj 
 * @param {Number} marginRange 
 * @returns 
 */
function isHRectLeftAtVSegment(rectObj, segObj, marginRange) {
    let rectLeft = rectObj.x,
        rectRight = rectObj.x + rectObj.width,
        rectHeight = rectObj.height,
        rectBottom = rectObj.y + rectObj.height;

    let segTop = segObj.y1,
        segBottom = segObj.y2,
        segX = segObj.x1;

    //矩形底部 >= 线段最上 && 矩形底部 <= 线段最下+矩形高度 && 线段X坐标 <= 矩形左 && 线段X坐标 >= 矩形左-修正值(用于修正帧间误差)
    if (rectBottom > segTop && rectBottom < segBottom + rectHeight && segX <= rectLeft && segX > rectLeft - marginRange) {
        return true;
    }
    return false;
}


/**
 * 判断水平矩形是否向右运动接触垂直线段
 * 
 * @param {{x:Number,y:Number,width:Number,height:Number}} rectObj 
 * @param {{x1:Number,x2:Number,y1:Number,y2:Number}} segObj 
 * @param {Number} marginRange 
 * @returns 
 */
function isHRectRightAtVSegment(rectObj, segObj, marginRange) {
    let rectLeft = rectObj.x,
        rectRight = rectObj.x + rectObj.width,
        rectHeight = rectObj.height,
        rectBottom = rectObj.y + rectObj.height;

    let segTop = segObj.y1,
        segBottom = segObj.y2,
        segX = segObj.x1;

    //矩形底部 >= 线段最上 && 矩形底部 <= 线段最下+矩形高度 && 线段X坐标 <= 矩形右 && 线段X坐标 >= 矩形右-修正值(用于修正帧间误差)
    if (rectBottom > segTop && rectBottom < segBottom + rectHeight && segX <= rectRight && segX > rectRight - marginRange) {
        return true;
    }
    return false;
}


let tools = {
    isPointOnSegment: isPointOnSegment,
    isPointInRect: isPointInRect,
    isPointInCircle: isPointInCircle,
    isSameQuadrant: isSameQuadrant,
    calTwoPointDistance: calTwoPointDistance,
    hitTestRectToRect: hitTestRectToRect,
    hitTestRectToCircle: hitTestRectToCircle,
    hitTestCircleToCircle: hitTestCircleToCircle,
    isHRectDownAtHSegment: isHRectDownAtHSegment,
    isHRectUpAtHSegment: isHRectUpAtHSegment,
    isHRectLeftAtVSegment: isHRectLeftAtVSegment,
    isHRectRightAtVSegment: isHRectRightAtVSegment
};

export default tools;