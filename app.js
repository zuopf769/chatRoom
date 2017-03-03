// global数据, 系统根路径
global.ROOT_PATH = __dirname;

// Setup basic express server
var express = require('express');
var path = require('path');
// Setup Ral
require('./server/lib/ral.js');
var mishiModel = require('./server/model/index.js');

// server监听8086端口，提供长连接服务
/*************************start*******************************/
var app1 = express();
// 创建http server
var server1 = require('http').createServer(app1);
// 关联socket.io
var socketIO = require('socket.io')(server1, {
      pingTimeout: 1000 * 10, // default 1000 * 60 超时时间
      pingInterval: 1000 * 2, // default 1000 * 2.5 ping的频率
      transport: ['websocket', 'polling'] // first polling then websocket when allowed Upgrade
});
var port = process.env.PORT || 8033;

server1.listen(port, function () {
    var port = server1.address().port;
    console.log('Server1 listening at port %d', port);
});

// Routing
app1.use(express.static(__dirname + '/public'));
app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'hbs');


// 在握手阶段执行连接授权判定(拿token去php端去验证)
socketIO.use(function(socket, next) {

    var handshake = socket.handshake;
    var query = handshake.query;
    var token = query && query.token;

    var request = socket.request;
    // console.log(request);
    // console.log(request.headers);

    // 验证token
    mishiModel.checkToken(request, 
        {
          token: 'abc',
          show_id: '4924992373'
        }
    ).then(function(data) {

        //console.log(data);
    }).catch(function() {

    });

    if (1 === 1) {// 连接成功
      return next();
    }
    // 连接失败
    return next(new Error('Authentication error'));
});

// 建立连接
socketIO.on('connection', function (socket) {

  var handshake = socket.handshake;
  var query = handshake.query;
  var roomId = handshake.query.roomId;
  var socketId = socket.id;
  var request = socket.request;

  console.log('socket id .....');
  console.log(socket.id);

  // 客户端进入房间
  socket.on('join', function () {
      console.log('join current roomId: ' + roomId);

      // 加入房间
      socket.join(roomId, function() {
          console.log('joined' + roomId);
          // 用户信息入库
          mishiModel.addDakaOnline(request, {
              show_id: roomId,
              websocket_id: socketId
          }).then(function(data) {
              console.log(data);
              if (data.status && data.status.code === 0) {
                  socket.emit('joined');
              }
          });
      });
  });

  // 客户端主动退出房间
  socket.on('leave', function () {
      socket.emit('disconnect');
  });

  // 断开连接(客户端正常关闭页面断开连接)
  socket.on('disconnect', function () {
      console.log('leave current roomId: ' + roomId);
      // 退出房间
      socket.leave(roomId);
  });


  // 广播(接收用户消息,然后广播发送给相应的房间的所有人, 包括自己)
  socket.on('message', function (msg) {

    console.log(msg);
    console.log(roomId);
    // 发送给房间内的所有人, 包括自己
    socketIO.sockets.to(roomId).emit('message', msg);

  });
});


// room page
app1.get('/room/:roomId', function (req, res) {
  var roomId = req.params.roomId;

  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomId: roomId
  });
});
/*****************************end*******************************/


// server2监听8088端口，提供通过内网和php orp的通信
/***************************start*******************************/
var app2 = express();
var server2 = require('http').createServer(app2);

server2.listen(8034, function () {
    var port = server2.address().port;
    console.log('Server2 listening at port %d', port);
});

// php端收到客户端消息后广播给长连接服务集群的所有机器的广播消息
app2.get('/api/receiveBroadcastMsg', function (req, res) {

  var query = req.query;

  // 房间号
  var roomId = query && query.room_id;
  // 消息体
  var msg = query && query.message;

  // 广播给当前房间的所有用户
  socketIO.sockets.to(roomId).emit('message', msg);

  // 结束响应
  res.end('success');

});

// 私聊（给某个房间某个socketid的连接发送信息）
app2.get('/api/receivePrivateMsg', function (req, res) {

  var query = req.query;

  // roomId
  var roomId = query && query.room_id;
  // socket_id
  var socketId = query && query.websocket_id;
  // 消息体
  var msg = query && query.message;

  // 广播给指定namespace、roomid、socketid的连接用户
  socketIO.of('/').in(roomId).sockets[socketId].emit('message', msg)
  // 结束响应
  res.end('success');

});
/******************************start*******************************/