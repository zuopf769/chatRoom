/**
 * @file api.js
 * @desc 和php端通信的接口列表
 * @date 2017.01.21
 * @author zuopengfei01
 */

module.exports = {
    checkToken: 'pgc/interface/checkToken',// token验证
    addDakaOnline: '/pgc/interface/addDakaOnline'// 建立长连接后用户入库
};