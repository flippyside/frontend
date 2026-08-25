```js
// 引入 Node.js 内置的 readline 模块，并创建一个 Interface 实例 rl。
// 从标准输入流（stdin）读取数据
const rl = require("readline").createInterface({ input: process.stdin });
// 可迭代对象
var iter = rl[Symbol.asyncIterator]();
// 每次调用 readline() 就能拿到下一行数据
const readline = async () => (await iter.next()).value;

void (async function () {
  // Write your code here
  while ((line = await readline())) {
    let tokens = line.split(" ");
    let a = parseInt(tokens[0]);
    let b = parseInt(tokens[1]);
    console.log(a + b);
  }
})();
```

读取标准输入流的数组：map(Number)将字符转为数字

```js
const nums = (await readline()).split(" ").map(Number);
```
