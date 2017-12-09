import 'babel-polyfill';
import ImagePreloader from './ImagePreloader';
import Spritesloader from './Spritesloader';

let assets = Object.freeze({
    ImagePreloader: ImagePreloader,
    Spritesloader: Spritesloader
});

export default assets;