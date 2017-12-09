import 'babel-polyfill';

export default function Spritesloader(imageObj, imgCoords) {
    return new Promise((resolve, reject) => {
        if (typeof (imageObj) === 'string') {
            let oImage = new Image();
            oImage.src = imageObj;
            oImage.onload = () => makeSprites(oImage, imgCoords, resolve);
        } else {
            makeSprites(imageObj, imgCoords, resolve);
        }
    });
}

function makeSprites(imageObj, imgCoords, resolve) {
    let i = 0, count = imgCoords.length, coord, promisePackage = [];
    for (; i < count; i++) {
        coord = imgCoords[i];
        promisePackage.push(createImageBitmap(imageObj, coord.x, coord.y, coord.width, coord.height));
    }

    Promise.all(promisePackage).then((imgs) => {
        resolve(imgs);
    });
}