import 'babel-polyfill';

let system = {
    debug: false,
    stage: {
        //视口坐标
        viewPortStart: { x: 0, y: 0 },
        //世界尺寸
        worldSize: { x: 0, y: 0, width: 1920, height: 1080 },
        //每像素对应现实长度 根据实际设置 (像素/米)
        pixelPerMeter: 50
    },
    environment: {
        physics: {
            //重力加速度 m/s2
            gravity_force: 20
        }
    },
    device: {
        isMobile: false,
        os: ""
    }
};

system.init = () => {
    let device = system.device;
    let ua = navigator.userAgent.toLowerCase();
    device.isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    if (device.isMobile) {
        if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
            device.os = "iOS";
        }
        else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
            device.os = "Android";
        }
        else if (ua.indexOf("windows") != -1) {
            device.os = "Windows Phone";
        }
    }
    else {
        if (ua.indexOf("windows nt") != -1) {
            device.os = "Windows PC";
        }
        else if (ua.indexOf("mac os") != -1) {
            device.os = "Mac OS";
        }
    }
};

export default system;