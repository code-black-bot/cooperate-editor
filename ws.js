const http = require('http');
const WebSocket = require('ws');

// 配置端口（指定为 1234）
const WS_PORT = 1234;

// 创建 HTTP 服务器（WebSocket 需要基于 HTTP 升级）
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket Server Running on port ' + WS_PORT + '\n');
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// 监听连接事件
wss.on('connection', (ws) => {
  console.log('新客户端已连接');

  // 接收客户端消息
  ws.on('message', (data) => {
    console.log('收到消息:', data.toString());
    
    // 广播消息给所有连接的客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`服务器转发: ${data.toString()}`);
      }
    });
  });

  // 连接关闭事件
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });

  // 发送欢迎消息
  ws.send('已成功连接到 WebSocket 服务（端口 1234）');
});

// 启动服务器
server.listen(WS_PORT, () => {
  console.log(`WebSocket 服务已启动: ws://localhost:${WS_PORT}`);
});
