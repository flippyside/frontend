Rest

- REpresentational State Transfer
- 表示层状态的传输
- Rest 实际上就是一种服务器的设计风格
- 它的主要特点就是，服务器只返回数据
- 服务器和客户端传输数据时通常会使用 JSON 作为数据格式
- 请求的方法：
  - GET 加载数据
  - POST 新建或添加数据
  - PUT 添加或修改数据
  - PATCH 修改数据
  - DELETE 删除数据
  - OPTION 由浏览器自动发送，检查请求的一些权限
- API（接口）a.k.a Endpoint（端点）
  - GET /user
  - POST /user
  - DELETE /user/:id

## AJAX：异步的 js 和 xml

作用：通过 js 向服务器发送请求来加载数据

可以选择的方案：

- ① XMLHTTPRequest（xhr）
- ② Fetch
- ③ Axios

- CORS (跨域资源共享)
  - 跨域请求：协议、域名、端口号，三个只要有一个不同，就算跨域

例如

```
http://localhost:5000
http://127.0.0.1:5000
```

CORS 的解决方案

- 在服务器中设置一个允许跨域的头：Access-Control-Allow-Origin
- 允许那些客户端访问我们的服务器

## 使用 AJAX

```html
<script>
  const btn = document.querySelector("#btn");
  const root = document.getElementById("root");
  btn.onclick = () => {
    const xhr = new XMLHttpRequest(); // 请求信息

    xhr.responseType = "json";

    // 为xhr对象绑定load事件
    xhr.onload = function () {
      // console.log(xhr.response);
      if (xhr.status == 200) {
        const result = xhr.response;
        if (result.status === "ok") {
          const ul = document.createElement("ul");
          root.appendChild(ul);
          for (let stu of result.data) {
            root.insertAdjacentHTML(
              "beforeend",
              `<li>${stu.id} ${stu.name} ${stu.age} ${stu.gender}</li>`
            );
          }
        }
      }
    };

    // 向服务器发送请求
    xhr.open("get", "http://localhost:3000/students");
    xhr.send();
  };
</script>
```

## fetch

- fetch 是 xhr 的升级版，采用的是 Promise API
- 作用和 AJAX 是一样的，但是使用起来更加友好
- fetch 原生 js 就支持的一种 ajax 请求的方式

```js
btn2.onclick = () => {
  fetch("http://localhost:3000/students", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: "123",
      age: 13,
      gender: "female",
      address: "abc",
    }),
  });
};
```

```js
function loadData() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/students", {
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        // res.json() 可以用来读取json格式的数据
        return res.json();
      } else {
        throw new Error("加载失败！");
      }
    })
    .then((res) => {
      // 获取到数据后，将数据渲染到页面中
      // ...
    });
}
```

REST 风格的服务器是无状态的服务器

jsonwebtoken(jwt)：通过对 json 加密后，生成一个 web 中使用的令牌

### 取消 fetch()请求

fetch()请求发送以后，如果中途想要取消，需要使用 AbortController 对象。

```js
let controller = new AbortController();
let signal = controller.signal;

fetch(url, {
  signal: controller.signal
});

signal.addEventListener('abort',
  () => console.log('abort!')
);

controller.abort(); // 取消

console.log(signal.aborted); // true
上面示例中，首先新建 AbortController 实例，然后发送fetch()请求，配置对象的signal属性必须指定接收 AbortController 实例发送的信号controller.signal。

controller.abort()方法用于发出取消信号。这时会触发abort事件，这个事件可以监听，也可以通过controller.signal.aborted属性判断取消信号是否已经发出。
```

### token

登陆流程：

- 客户端登陆，服务器收到登陆请求，将用户名、密码等登录信息用 jwt 生成一个 token，然后返回 token 给客户端
- 客户端存好这个 token。下次请求服务时，把 token 附在请求中 发送给服务器(token 通过请求头发送)，服务器解析 token 并与用户信息比对，若正确则通行

## AXIOS

POST 操作：

```js
document.getElementById("btn1").onclick = () => {
  axios({
    method: "post",
    url: "http://localhost:3000/students",
    data: {
      name: "abc",
      age: 18,
      gender: "男",
      address: "123",
    },
  })
    .then((res) => {
      // 与fetch不同，axios自动转换JSON数据
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};
```

GET 操作：

```js
document.getElementById("btn2").onclick = () => {
  axios({
    method: "get",
    url: "http://localhost:3000/students",
  })
    .then((res) => {
      // 与fetch不同，axios默认只会在响应状态为2xx时才会执行then
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};
```

Axios 实例：相当于 axios 的一个副本。

默认配置在实例上也同样生效。但可以单独修改某个 axios 实例的默认配置

拦截器只对当前实例有效
