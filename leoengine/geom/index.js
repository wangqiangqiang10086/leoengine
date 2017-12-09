import 'babel-polyfill';
import Point from './Point';
import Rectangle from './Rectangle';
import Circle from './Circle';
import Matrix2D from './Matrix2D';
import tools from './tools';

let geom = Object.freeze({
    tools: tools,
    Point: Point,
    Rectangle: Rectangle,
    Circle: Circle,
    Matrix2D: Matrix2D
});

export default geom;