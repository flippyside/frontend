### 对 ajax 的理解，如何创建一个 ajax 请求

ajax 是通过 js 的异步通信，从服务器获取 XML 文档并从中获取数据，用于更新当前网页的对应部分，而无需刷新整个网页

创建一个 ajax 请求：

- 创建一个 XMLHttpRequest 对象，
- open 创建一个 HTTP 请求，传入参数为请求方法、请求地址、是否异步、用户认证信息
- 为请求添加头信息
- 设置状态监听函数
  - XMLHttpRequest 对象状态变化时会触发 onreadystatechange 事件。
    - 当 readyState 为 4 时，代表服务器返回的数据接收完成
    - 状态 status 变化为 2xx 代表返回正常，此时可通过 response 中的数据更新页面
- send 向服务器发送请求

```js
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", url, true);
// 设置状态监听函数
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function () {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);
```

### ajax axios fetch 的区别

ajax：

- 基于原生 XHR（XMLHttpRequest） 开发
- 针对 MVC 编程，与当前前端流行的 MVVM 不符
- 多个请求之间如果有先后关系的话，就会出现回调地狱（指的是在异步编程中，由于多次嵌套回调函数而导致代码变得复杂、难以维护的情况）
- 配置和调用方式非常混乱，而且基于事件的异步模型不友好

fetch：

- 浏览器原生的请求方式，作用与 AJAX 一致，但是使用起来更加友好
- 基于 Promise 实现，支持 async、await
- fetch 只对网络请求报错，而将 400、500 等都作为请求成功，需要额外处理
- 无法原生监测请求的进度

axios：

- 支持 Promise
- 从浏览器中创建 XMLHttpRequest
- 从 node.js 创建 http 请求
- 支持请求拦截与响应拦截
- 与 fetch 不同，axios 会自动转换 JSON 数据
- 支持预防 CSRF/XSRF

### axios 如何预防 CSRF 攻击

CSRF(cross site request forgery) 攻击：服务器无法区分正常请求和攻击请求，因为攻击者发送请求时携带了用户点击恶意链接所包含的 token 信息

预防措施：
