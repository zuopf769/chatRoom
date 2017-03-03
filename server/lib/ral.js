/**
 * @file ral.js
 * @desc ral初始化
 * @date 2017.01.21
 * @author zuopengfei01
 */

var ral = require('node-ral').RAL;
var path = require('path');

// 初始化RAL，只需在程序入口运行一次
ral.init({
    // 指定RAL配置目录
    confDir : path.join(global.ROOT_PATH, '/conf/ral'),
    logger : {
        "log_path" : path.join(global.ROOT_PATH + '/log'),
        "app" : "ral"
    }
});

module.exports = ral;