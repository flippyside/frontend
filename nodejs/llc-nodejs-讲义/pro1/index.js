const express = require("express");
const path = require("path");
const app = express();

// 创建一个数组来存储用户信息
const USERS = [
  {
    username: "admin",
    password: "123123",
    nickname: "超级管理员",
  },
  {
    username: "sunwukong",
    password: "123456",
    nickname: "齐天大圣",
  },
];

app.listen(3000, () => {
  console.log("server start");
});
app.use(express.static(path.resolve(__dirname, "./public")));

app.get("/", (req, res) => {
  res.send("根目录");
});

app.get("/login", (req, res) => {
  req.query.username;
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const loginUser = USERS.find((item) => {
    return item.username == username && item.password == password;
  });
  if (loginUser) {
    res.send(`welcome, ${username}`);
  } else {
    res.send(`用户名/密码错误`);
  }
});

// get请求发送参数的第二种方式
// /hello/:id 表示当用户访问 /hello/xxx 时就会触发
// 在路径中以冒号命名的部分我们称为param，在get请求它可以被解析为请求参数
// param传参一般不会传递特别复杂的参数
// app.get("/hello/:name/:age/:gender", (req, res) => {
app.get("/hello/:name", (req, res) => {
  // 约定由于配置

  // 可以通过req.params属性来获取这些参数
  console.log(req.params);

  res.send("<h1>这是hello路由</h1>");
});
