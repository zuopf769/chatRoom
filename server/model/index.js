/**
 * @file index.js
 * @desc 和php端通信的接口
 * @date 2017.01.21
 * @author zuopengfei01
 */

var util = require('../lib/util.js');
var api = require('./api.js');

// 验证token
module.exports.checkToken = function (req, data) {
    return util.requestAPI(req, {
        path: api.checkToken,
        method: 'POST',
        data: data
    }, 'MISHI');
};

// 建立长连接后用户信息入库
module.exports.addDakaOnline = function (req, data) {
    return util.requestAPI(req, {
        path: api.addDakaOnline,
        method: 'POST',
        data: data
    }, 'MISHI');
};

// 用户上下线通知
module.exports.notifyCheckinOut = function (req, data) {
    return util.requestAPI(req, {
        path: api.getMapdata,
        data: data
    }, 'MISHI');
};


