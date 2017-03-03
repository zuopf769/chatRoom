/**
 *  Socket.js
 *  对socket.io.js的包装
 */
(function() {

    function SocketIO(url, options ) {

        var self = this;
        var options = options || {};
        var url = url || '';

        // 默认配置
        var defaultOptions = {
            token: '',// token令牌
            // namespace: 'nsp_mishi',// 命名空间如: nsp_xxx, xxx为各产品线自己命名规则
            roomId: 'room_0',// 房间号
            userName: '游客'// 用户名
        };
        this.options = $.extend({}, defaultOptions, options);

        // 命名空间、隔离各产品线
        // var ws = self.ws = io(url + '/' + self.options.namespace, {query: 'token='+ self.options.token + '&roomId=' + self.options.roomId});
        var ws = self.ws = io(url, {query: 'token='+ self.options.token + '&roomId=' + self.options.roomId});

        //-------连接成功---------
        // 连接成功后加入房间
        ws.on('connect', function () {

            // 连接成功后加入指定的房间
            self.joinRoom(self.options.userName);
            // 通知给上层连接成功
            self.trigger('connect');

            // 接收到服务器端的消息
            ws.on('message', function (msg) {
                debugger;
               self.trigger('message', msg);
            });

            // 监听到服务器端的系统消息
            ws.on('sys', function (sysMsg) {
               self.trigger('sys', sysMsg);
            });
        });

        //-------消息服务器挂掉了----------
        // 服务器断开连接
        ws.on('disconnect', function (e) {
            console.log('disconnect');
            self.trigger('close', ['disconnect']);
        });

        //-------重连---------------------
        // 重新连接
        ws.on('reconnect', function (e) {
            // 重连次数
            self.reconnectNum ++;
            var data = {
                type: 'reconnect',
                num: self.reconnectNum,
                content: '重新连接'
            };
            self.trigger('reconnect', [data] );
        });

        //-------错误----------
        // 连接失败
        ws.on('connect_error', function (e) {
            var data = {
                type: 'error',
                subType: 'connect_error',
                content: '连接失败'
            };
            self.trigger('error', [data]);
        });

        // 连接超时
        ws.on('connect_timeout', function (e) {
            var data = {
                e: e,
                type: 'error',
                subType: 'connect_timeout',
                content: '连接超时'
            };
            self.trigger('error', [data]);
        });

        // 连接失败
        ws.on('error', function (e) {
            console.log('error');
            var data = {
                e: e,
                type: 'error',
                subType: 'error',
                content: '连接超时'
            };
            self.trigger('error', 'error' );
        });

        // 重连错误
        ws.on('reconnect_error', function (e) {
            var data = {
                e: e,
                type: 'error',
                subType: 'reconnect_error',
                content: '重连错误'
            };
            self.trigger('error', [data]);
        });

        // 重连失败
        ws.on('reconnect_failed', function (e) {
            var data = {
                e: e,
                type: 'error',
                subType: 'reconnect_failed',
                content: '重连错误'
            };
            self.trigger('error', [data]);
        });

    };


    SocketIO.prototype = {
        reconnectNum: 0,// 重连次数
        // 发送消息
        sendMessage: function (msg) {
            this.ws.emit('message', msg);
        },
        // 加入房间
        joinRoom: function () {
            var self = this;
            this.ws.emit('join', self.options.userName);
        },
        // 离开房间
        leaveRoom: function () {
            this.ws.emit('leave');
        },
        // 关闭连接
        close: function () {
            this.ws.close();
        }
    };

    //Make the class work with custom events
    WK_IM_JSDK.ClassEvent.on(SocketIO);

    window.WK_IM_JSDK.SocketIO = SocketIO;
})();
