## 谈谈你对 ES6 的理解

ES 是 js 的规范，js 是一门遵循了 ES 语言规范而设计的语言，ES6 是目前许多主流框架的基础。

新增了一些语法和 API：

- 新增变量 let 和 const
- 新增箭头函数
- 解构赋值，用于快速复制数组和对象
- 模版字符串
- 操作对象的新 API：Proxy、Reflect
- 模块化
- 面向对象
- 异步编程的一种解决方案：Promise

## ES6的块级作用域(let、const\)

作用域是一个变量或函数的可访问范围，作用域控制着变量或函数的可见性和生命周期。

局部作用域分为

- 函数作用域：函数内部的代码
- 块级作用域：`{}`包围的代码

全局作用域：`<script>`标签内部、js 文件

作用域链：

- 会优先在当前函数作用域中查找变量
- 查找不到，则依次逐级查找父级作用域直到全局作用域

在 ES6 之前，作用域只有 2 种：全局作用域和函数作用域。

JavaScript 的变量提升：

- 将 var 变量提升到当前作用域的最前面
- 只提升变量声明，不提升赋值
- 然后依次执行代码

ES6 引入了 `let` 和 `const` 关键字，JavaScript 也有了块级作用域。简单来讲，如果⼀种语⾔⽀持块级作⽤域，那么其代码块内部定义的变量在代码块外部是访问不到的，并且等该代码块中的代码执⾏完成之后，代码块中定义的变量会被销毁。

ES6的块级作用域解决了变量提升的问题：

* `let` 或者 `const` 声明的变量只在 `let` 或 `const` 命令所在的代码块内有效。
* 不存在变量提升：不同于 `var`，在 `let` 或 `const` 之前访问不到它们定义的变量，会报错（Uncaught ReferenceError: bar is not defined）。
* 块级作用域也可以在函数中创建（由{}包裹的代码都是块级作用域）

## 比较promise方法all、allsettled、race、any

`promise.all(promises: Iterable<Promise>)`：传入多个 Promise 参数，返回多个 Promise 的执行结果组成的数组
- 其中若有一个 Promise 报错，就返回错误

`Promise.allSettled(promises: Iterable<Promise>)`：同时返回多个 Promise 的执行结果(无论成功或失败)

`Promise.race(promises: Iterable<Promise>)`：返回执行最快的 Promise（不考虑对错）

`Promise.any([promises: Iterable<Promise>])` 与 race 类似，但是它只会返回第一个**成功**的最快完成的的 Promise，如果所有的 Promise 都失败会返回一个错误信息。

## async/await对比promise的优势


- promise的出现解决了传统callback函数导致的回调地狱问题，但是他的语法导致它纵向发展形成了一个回调链，遇到复杂的业务场景显然是不美观的； 
- Async/await 是 promise 之上的语法糖，基于Promise实现。它提供了一种更简洁的异步代码编写方法，使其更易于读取和编写。使用 Async/Await，您可以编写类似于同步代码的异步代码。
- 在 async/await 中， async声明异步函数。await 等待promise解析，然后再继续执行函数。关键字 await 只能在 async 函数中使用。

## ESM、CommonJS

两者都是模块化规范。

### CommonJS

node 中，默认支持的模块化规范叫做 CommonJS。

- 导入模块：使用require函数。文件扩展名可以省略，会自动补全
- 导出模块：module.exports

```js
const path = require("path");
```

```js
module.exports = {
  a: "哈哈",
  b: [1, 3, 5, 7],
  c: () => {
    console.log(111);
  },
};
```

原理：所有的 CommonJS 的模块都会被包装到一个函数中

```js
(function (exports, require, module, __filename, __dirname) {
  // 模块代码会被放到这里
});
```

### ESM

默认情况下，node 中的模块化标准是 CommonJS。要想使用 ES 模块化(ESM)，可以采用以下两种方案

1. 使用 mjs 作为扩展名
2. 修改 package.json 将模块化规范设置为 ES 模块：设置 `"type": "module"`，则当前项目下所有的 js 文件都默认为 es module 规范

ESM规范：

- 导入模块：使用 `import {...} from "...`。文件扩展名不能省略
  - 导入模块的默认导出时，没有中括号
- 导出模块：`export`
  - 设置默认导出：`export default`

通过 ES 模块化，导入的内容都是常量。es 模块都是运行在严格模式下的

## let、const、var 的区别

- 块级作用域： 块作用域由 { }包裹，let 和 const 具有块级作用域，var 不存在块级作用域。块级作用域解决了 ES5 中的两个问题：
  - 内层变量可能覆盖外层变量
  - 用来计数的循环变量泄露为全局变量
- 变量提升： var 存在变量提升，let 和 const 不存在变量提升，即在变量只能在声明之后使用，否在会报错。
- 给全局添加属性： 浏览器的全局对象是 window，Node 的全局对象是 global。var 声明的变量为全局变量，并且会被添加为全局对象的属性，但是 let 和 const 不会。
- 重复声明： var 声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const 和 let 不允许重复声明变量。
- 初始值设置： 在变量声明时，var 和 let 可以不用设置初始值。而 const 声明变量必须设置初始值。
- 暂时性死区：在使用 let、const 命令声明变量之前，该变量都是不可用的。使用 var 声明的变量不存在暂时性死区

## Set、Map 的区别

Set 是没有重复元素的集合，类似数组，可以按照添加顺序来遍历。

Map 是键值对的集合，可以按照数据插入时的顺序遍历所有的元素。

## Object 和 Map 的比较

- 键的类型：Object 的键为字符串或 symbol，Map 的键可以是任意类型
- 必须手动计算 Object 的大小，但是可以很容易地获取 Map 的大小（size）
- 键值对的顺序：Map 中的键值对是按照插入的顺序存储的，而对象中的键值对则没有顺序
- Map 的遍历遵循元素的插入顺序。而 Object 需要手动遍历
- Object 有原型，所以映射中有一些缺省的键。

使用场景：

- 如果键在运行时才能知道，或者所有的键类型相同，所有的值类型相同，那就使用 Map。
- 如果需要将原始值存储为键，则使用 Map，因为 Object 将每个键视为字符串，不管它是一个数字值、布尔值还是任何其他原始值。
- 如果存在需要对个别元素进行操作的逻辑，使用 Object。

## weakMap 和 Map 的比较

- weakMap 的键只能是对象类型
- 键值关系的存储：
  - map 使用常规的引用来管理键和值之间的关系，因此即使键不再使用，map 仍然会保留该键的内存。
  - weakMap 使用弱引用来管理键和值之间的关系，因此如果键不再有其他引用，垃圾回收机制可以自动回收键值对。## promise 的常用方法
