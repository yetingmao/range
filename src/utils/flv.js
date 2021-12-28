import flvjs from "flv.js";

export default function flvPlayer(url) {
    const _p= flvjs.createPlayer({
                type: 'flv',
                url: url,
                isLive: true,
                cors: true,
                config: {
                    enableWorker: true,
                    //  enableStashBuffer: false,
                    stashInitialSize: 128,
                },
               //load:false,
    });
    _p._load = false; //自定义属性
    return _p;
}