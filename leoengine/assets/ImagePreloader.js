import 'babel-polyfill';

export default function ImagePreloader(images, basePath = '') {
    return new Promise((resolve, reject) => {                
        let total = images.length,
        success = 0,
        failure = 0,
        abort = 0,
        totalImages = [];

        let i = 0, oImage, imgPath;
        for (; i < total; i++) {
            oImage = new Image();
            imgPath = images[i];

            oImage.onload = onload;
            oImage.onerror = onerror;
            oImage.onabort = onabort;
            oImage.src = basePath + imgPath;
            totalImages.push(oImage);
        }

        function onload(){
            success++;
            checkLoad();
        }
        function onerror(){
            failure++;
            checkLoad();
        }
        function onabort(){
            abort++;
            checkLoad();
        }

        function checkLoad() {
            if (total - success - failure - abort == 0) {
                resolve({ total: total, success: success, failure: failure, abort: abort, totalImages: totalImages });
            }
        }       
    });
}