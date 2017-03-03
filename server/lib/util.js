/**
 * @file util.js
 * @desc 
 * @date 2017.01.21
 * @author zuopengfei01
 */

var _ = require('underscore');
var ralP = require('node-ral').RALPromise; // 使用Ral的Promise版接口

function requestAPI(req, obj, server) {
    var serviceName = server || 'MISHI';

    obj = _.isObject(obj) ? obj : {};
    req = _.isObject(req) ? req : {};

    var objheaders = _.isObject(obj.headers) ? obj.headers : {};
    var reqheaders = _.isObject(req.headers) ? req.headers : {};

    // 设置请求数据的打包格式
    var method = (typeof obj.method == 'string' ? obj.method.toUpperCase() : 'GET');
    if (method === 'POST') {
        obj.pack = 'formdata';
    }

    var reqData = {
        path: obj.path || '/',
        method: obj.method || 'GET',
        data: obj.data || {},
        pack: obj.pack || 'querystring',
        unpack: obj.unpack || 'json',
        headers: _.extend({}, reqheaders, objheaders)
    };
    
    return ralP(serviceName, reqData).then(function (data) {
        return data;
    }).catch(function (err) {
        console.log(err);
        // 打印日志
        throw err;
    });
}

function path(req, path, params) {
    var search = [];

    if (params) {
        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                search.push(i + '=' + params[i]);
            }
        }
        path += '?';
        path += search.join('&');
    }

    return path;
}

module.exports = {
    requestAPI: requestAPI,
    path: path
};
