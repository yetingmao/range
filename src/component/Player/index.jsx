import React, { useState, useEffect, useImperativeHandle } from 'react';
// //样式文件注意要加上
import flvjs from "flv.js";
import html2canvas from 'html2canvas';
import { Icon } from 'antd';
import './style.less';
export default function Player(props) {
    const [videoNode, setVideoNode] = useState();
    const [screenshot, setscreenshot] = useState(true);
    const { playerRef, info } = props;
    const { flvPlayer, cameraName } = info;
    useEffect(() => {
        if (flvPlayer && videoNode && flvPlayer._load === false) {
            flvPlayer.attachMediaElement(videoNode);
            flvPlayer.load();
            flvPlayer._load = true;
            flvPlayer.play();
            flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                console.log(5555, errType, errDetail)
            })
        }
    })
    useImperativeHandle(playerRef, () => ({
        // changeVal 就是暴露给父组件的方法
        destroy: () => {
            flv_destroy();
        }
    }));
    return (
        <div className="video_body">
            <video
                ref={(node) => {
                    setVideoNode(node);
                }}
                controls
                autoPlay
                //muted
                style={{ width: "100%", height: "100%" }}
            >
                <p >您的浏览器不支持HTML5，请升级浏览器。</p>
            </video>
            <div className="body_name">
                {cameraName}
            </div>
            {screenshot ? <div className="body_screenshot">
                <Icon type="chrome" onClick={() => { toCanvas() }} />
            </div> : ""}
        </div>
    )
    /**
     * @description: 截图
     * @param {type}
     * @return:
     * @author: yetm
     */
    function toCanvas() {
        console.log("videoNode", videoNode)
        new html2canvas(videoNode, {
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            console.log("canvas", canvas)
            // canvas为转换后的Canvas对象
            const src = canvas.toDataURL();  // 导出图片
            const elem = document.createElement('a');
            elem.setAttribute('href', src);
            elem.setAttribute('download', `${new Date().getTime()}.jpg`);
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        });
    }
    function flv_destroy() {
        console.log("flv_destroy", flvPlayer)
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
    }
}
