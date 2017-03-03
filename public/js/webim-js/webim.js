/**
 * WebIM.js
 * 上层api, 供用户调用
 */

(function() {

    function WebIM(url, options ) {
        this.options = $.extend({}, options);
        this.url = url || '';
        this._init();
    }

    WK_IM_JSDK.ClassEvent.on(WebIM);

    WebIM.OFFLINE = 0;
    WebIM.ONLINE = 1;

    $.extend(WebIM.prototype, {
        state: WebIM.OFFLINE,
        // 初始化
        _init: function() {
            this._createConnect();
        },
        // 创建连接
        _createConnect: function() {
            var self = this;

            // 创建连接
            self.connection = new WK_IM_JSDK.SocketIO(self.url, self.options);

            self.connection.bind("connect", function() {// 连接成功
                debugger;
                // 当前用户加入房间成功
                self._online();
                self.trigger('connect');
            }).bind( "message", function(data) {// 服务器端发送过来的消息
                self.trigger('message', [data]);
            }).bind( "sys", function(data){// 系统信息
                self.trigger('sys', [data]);
            }).bind( "error", function(data){// 失败信息
                // 当前用户离开房间
                self._offline();
                self.trigger('error', [data]);
            }).bind( "close", function(data) {// 服务器断开连接
                // 当前用户离开房间
                self._offline();
                self.trigger('close', [data]);
            });
        },
        // 发送消息（广播和私聊）
        sendMessage: function(msg, callback) {
            var self = this;
            if (self.state === WebIM.OFFLINE ) {
                return;
            }
            self.connection.sendMessage(msg);
        },
        // 成功加入房间
        _online: function () {
            debugger;
            var self = this;
            if (self.state === WebIM.ONLINE ) {
                return;
            }
            self.state = WebIM.ONLINE;
        },
        // 退出房间
        _offline: function() {
            debugger;
            var self = this;
            if (self.state === WebIM.OFFLINE ) {
                return;
            }
            self.state = WebIM.OFFLINE;
        },
        // 用户主动（点击链接）加入房间
        joinRoom: function (userName) {
            var self = this;
            if (self.state === WebIM.ONLINE ) {
                return;
            }
            self.state = WebIM.ONLINE;
            self.connection.joinRoom(userName);
        },
        // 用户主动（点击链接）退出房间,不关闭连接，还可以继续加入房间
        leaveRoom: function () {
            var self = this;
            if (self.state === WebIM.OFFLINE ) {
                return;
            }
            self.state = WebIM.OFFLINE;
            self.connection.leaveRoom();
        }
    });

    window.WK_IM_JSDK.WebIM = WebIM;

})();
