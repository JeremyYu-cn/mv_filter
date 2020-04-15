'use strict'


const PublicMv = require('./public');
const path = require('path');

class Filter extends PublicMv {

    /**
     * 渐入
     * start 开始帧数
     * end 结束帧数
     */
    async fade(inPath, start, end, outPath) {
        return await this.execCommand(`ffmpeg -i ${inPath} -vf fade=${start}:${end} ${outPath}`)
    }
    
    /**
     * 黑白
     */
    async lutyuv(inPath, outPath) {
        return await this.execCommand(`ffmpeg -i ${inPath} -vf lutyuv="u=128:v=128" ${outPath}`);
    }

    /**
     * 锐化/反锐化
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {number} luma_msize_x 设置亮度矩阵水平尺寸。它必须是3-63的奇数值，默认5
     * @param {number} luma_msize_y 设置亮度矩阵垂直尺寸，它必须是3-63的奇数值，默认5
     * @param {number} luma_amount 设置亮度效果强度，合理值为-1.5 - 1.5的浮点数（可超出前范围）。
     * @param {number} chroma_msize_x 设置色度矩阵水平尺寸。它必须是3-63的奇数值，默认5
     * @param {number} chroma_msize_y 设置色度矩阵垂直尺寸。它必须是3-63的奇数值，默认5.
     * @param {number} chroma_amount 设置色度效果强度，合理值为-1.5 - 1.5的浮点数（可超出前范围）。
     * @param {number} opencl 如果为1，指定采用OpenCL能力, 要求编译时启用了--enable-opencl，默认0.
     */
    async unsharp(inPath, outPath, luma_msize_x = 5, luma_msize_y = 5, luma_amount = 1, chroma_msize_x = 5, chroma_msize_y = 5, chroma_amount = 0, opencl = 0) {
        const execStr = `ffmpeg -i ${inPath} -vf unsharp=luma_msize_x=${luma_msize_x}:luma_msize_y=${luma_msize_y}:luma_amount=${luma_amount}:chroma_msize_x=${chroma_msize_x}:chroma_msize_y=${chroma_msize_y}:chroma_amount=${chroma_amount}:opencl=${opencl} ${outPath}`;
        return await this.execCommand(execStr); 
    }

    /**
     * 扭转自然渐晕效应
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {string} vignetteVal 值
     * @param {string} evals 设置表达式计算模式
     */
    async vignette(inPath, outPath, vignetteVal = 'PI/4', evals = 'init') {
        this.execCommand(`ffmpeg -i ${inPath} -vf vignette='${vignetteVal}':eval=${evals} ${outPath}`)
    }

    /**
     * 裁剪输入
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {*} in_w 输出视频的宽，默认为iw
     * @param {*} in_h 输出视频的高，默认为ih
     * @param {*} x 输入的水平坐标，默认为(in_w-out_w)/2，每帧都计算
     * @param {*} y 输入的垂直坐标，默认为(in_h-out_h)/2，每帧都计算
     * @param {*} keep_aspect 如果设置为1，则强制输出采样输入一样的长宽比例
     */
    async crop(inPath, outPath, in_w = 'iw', in_h = 'ih', x = '(in_w-out_w)/2', y = '(in_h-out_h)/2', keep_aspect = 0) {
        const execStr = `ffmpeg -i ${inPath} -vf crop="${in_w}:${in_h}:${x}:${y}:${keep_aspect}" ${outPath}`;
        return await this.execCommand(execStr);
    }

    /**
     * 编辑或者设定颜色的饱和度
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {string} hueConfig
     * h 指定色度角的度数，接受表达式，默认为0
     * s 指定饱和度，范围[-10,10]，接受表达式，默认为”1”.
     * H 指定色调角的弧度，接受表达式，默认为”0”
     * b 指定亮度，范围[-10,10]。接受表达式，默认为”0”
     */
    async hue(inPath, outPath, hueConfig) {
        const execStr = `ffmpeg -i ${inPath} -vf hue='${hueConfig}' ${outPath}`;
        return await this.execCommand(execStr);
    }

    /**
     * 对输入视频应用边缘虚化
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录 
     * @param {*} luma_radius 
     * @param {*} luma_power 
     * @param {*} chroma_radius 
     * @param {*} chroma_power 
     * @param {*} alpha_radius 
     * @param {*} alpha_power 
     */
    async boxblur(inPath, outPath, luma_radius = 2, luma_power = 2, chroma_radius = 2, chroma_power = 2, alpha_radius = 2, alpha_power = 2) {
        const execStr = `ffmpeg -i ${inPath} -vf boxblur='luma_radius=${luma_radius}:luma_power=${luma_power}:chroma_radius=${chroma_radius}:chroma_power=${chroma_power}:alpha_radius=${alpha_radius}:alpha_power=${alpha_power}' ${outPath}`;
        return await this.execCommand(execStr);
    }

    // 镜像反转
    async mirrorFlip(inPath, outPath) {
        const execStr = `ffmpeg -i ${inPath} -vf crop=iw/2:ih:0:0,split[left][tmp];[tmp]hflip[right];[left]pad=iw*2[a];[a][right]overlay=w ${outPath}`;
        return await this.execCommand(execStr);
    }

    // 水平反转
    async horizontalFlip(inPath, outPath) {
        const execStr = `ffmpeg -i ${inPath} -vf geq='p(W-X\\\,Y)' ${outPath}`;
        return await this.execCommand(execStr);
    }

    /**
     * 垂直反转
     * @param {*} inPath 
     * @param {*} outPath 
     */
    async verticalFlip(inPath, outPath) {
        const execStr = `ffmpeg -i ${inPath} -vf vflip ${outPath}`;
        return await this.execCommand(execStr);
    }

    /**
     * 画边框
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录 
     * @param {number} x 输出x轴
     * @param {number} y 输出y轴
     * @param {number} width 边框宽度
     * @param {number} height 边框高度
     * @param {string} color 颜色
     * @param {number} opacity 透明度
     */
    async drawbox(inPath, outPath, x = 10, y = 10, width = 100, height = 100, color = 'red', opacity = 0.5, t = 2) {
        const execStr = `ffmpeg -i ${inPath} -vf drawbox='x=${x}:y=${y}:width=${width}:height=${height}:color=${color}@${opacity}:t=${t}' ${outPath}`;
        return await this.execCommand(execStr);
    }

    /**
     * 浮雕效果
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录 
     */
    async relief(inPath, outPath) {
        const timeStamp = Date.now();
        const tmpFilePath = path.resolve(outPath, `${timeStamp}.ts`);
        const resultPath = path.resolve(outPath, `${timeStamp}.mp4`);
        const execStr = `ffmpeg -i ${inPath} -vf format=gray,geq=lum_expr='(p(X\\\,Y)+(256-p(X-4\\\,Y-4)))/2' ${tmpFilePath}`;
        await this.execCommand(execStr);
        await this.execCommand(`ffmpeg -i ${tmpFilePath} ${resultPath}; rm ${tmpFilePath};`);
        return resultPath;
    }

    /**
     * 描边｜混合创建动画效果
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录 
     * @param {number} low 设置检测算法边缘探测的低和高的阀值
     * @param {number} high 设置检测算法边缘探测的低和高的阀值
     * @param {'wires' | 'colormix'} mode 
     */
    async line(inPath, outPath, low = 0.1, high = 0.4, mode = 'wires') {
        const timeStamp = Date.now();
        const tmpFilePath = path.resolve(outPath, `${timeStamp}.ts`);
        const resultPath = path.resolve(outPath, `${timeStamp}.mp4`);
        const execStr = `ffmpeg -i ${inPath} -vf edgedetect=low=${low}:high=${high}:mode=${mode} ${tmpFilePath}`;
        await this.execCommand(execStr);
        await this.execCommand(`ffmpeg -i ${tmpFilePath} ${resultPath}; rm ${tmpFilePath};`);
        return resultPath;
    }
    
    /**
     * 自定义滤镜
     * @param {string} inPath 目标视频
     * @param {string} outPath 输出目录
     * @param {str} config 
     */
    async custom(inPath, outPath, config) {
        const execStr = `ffmpeg -i ${inPath} -vf ${config} ${outPath}`;
        return await this.execCommand(execStr);
    }
}

module.exports = Filter;
