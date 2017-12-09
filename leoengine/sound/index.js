import 'babel-polyfill';

let howler = require('howler');

let soundMap = {};
let sound = {};

/*
sound.register = (key, src) => {
    let audio = document.createElement("audio");
    audio.src = src;
    soundMap[key] = audio;
};

sound.play = (key) => {
    let audio = soundMap[key];
    if(audio === undefined) return;

    audio.pause();
    audio.currentTime = 0.0;
    audio.play();        
};*/

sound.register = (key, src) => {
    soundMap[key] = new Howl({
        src: [src]
    });
};

sound.play = (key) => {
    let sound = soundMap[key];
    if (sound === undefined) return;

    sound.play();
};


export default sound;