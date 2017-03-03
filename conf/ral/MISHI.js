module.exports.MISHI= {           // 声明服务名为MAPAPI
    // 请求协议与数据格式配置
    protocol: 'http',              // 使用http协议请求
    unpack: 'json',                // 约定服务端返回JSON数据
    encoding: 'utf-8',             // 服务器返回utf-8编码
    balance: 'roundrobin',         // 负载均衡策略
    timeout: 4000,                 // 请求最长超时时间4000ms
    // 后端地址配置
    server: [                      // 可以配置多个后端地址
        {
            host: 'xxx.xxx.com',
            port: 8080
        }
    ]
}