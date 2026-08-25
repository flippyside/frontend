// 1. 引入 express 模块
const express = require("express");

// 2. 创建 express 实例
const app = express();

// 3. 定义端口号
const PORT = 3000;

// 4. 定义基础路由
// 当用户访问根目录时，返回 'Hello World!'
app.get("/", (req, res) => {
  console.log(req);

  res.send("<h1>你好！这是你的第一个 Express 服务。</h1>");
});

// 5. 监听端口
app.listen(PORT, () => {
  console.log(`服务器已启动，访问地址：http://localhost:${PORT}`);
});
