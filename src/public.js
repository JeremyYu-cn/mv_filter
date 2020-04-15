'use strict'

const childProcess  = require('child_process');
const path = require('path');

// 执行程序
class publicMv {
    execCommand(execStr) {
        return new Promise((resolve, reject) => {
            childProcess.exec(execStr, (err, stdout) => {
                if(err) {
                    reject(err);
                }
                resolve(stdout.toString());
            });
        })
    }

    /**
     * 图片合成视频
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {string} animate 动画效果
     * @param {number} t 时间s
     */
    async picToMovie(picPath, outPath, animate, t) {
        const execStr = `ffmpeg -loop 1 -i ${picPath} ${animate ? `-vf ${animate}` : ''} -t=${t} ${outPath}`;
        await this.execCommand(execStr)
    }

    /**
     * 多个视频合成一个
     * @param {Array} mvArr 视频路径数组
     * @param {string} outputName 输出目录
     * @param {boolean} isCancelAn 是否去掉音频
     * @param {number} voicePath 音频地址
     * @param {number} second 视频持续时间
     */
    async concatVideo(mvArr, outputName, isCancelAn, voicePath, second) {
        let fileCommand = mvArr.join('|');
        const timestamp = Date.now()
        const tmpName = `${timestamp}.ts`;
        const tmpPath = path.resolve(path.resolve(__dirname , '../tmp'), tmpName);
        const execStr = `ffmpeg -i 'concat:${fileCommand}' -c copy ${tmpPath}`;
        await this.execCommand(execStr); // s
        await this.execCommand(`ffmpeg -i ${tmpPath} ${voicePath ? `-i ${voicePath}` : ''} ${isCancelAn ? '-an' : ''} ${second ? `-t ${second}` : ''} -b:a 64k -b:v 1500k ${outputName}; rm ${tmpPath};`);
        return outputName;
    }
}

module.exports = publicMv;
