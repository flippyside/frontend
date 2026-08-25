# axios

xhr：XMLHTTPRequest，浏览器提供的一个接口，使得js可以向服务器发送HTTP请求

```js
// axios函数，实际上是Axios.prototypr.request()
// 返回一个promise对象
const res = axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

上面的代码帮你实现了：

```js
// 伪代码
let xhr = new XMLHttpRequest();
xhr.open('POST', '/user/12345', true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({ firstName: 'Fred', lastName: 'Flintstone' }));
```

 ## 拦截器

在请求或响应被 then 或 catch 处理前拦截它们。

