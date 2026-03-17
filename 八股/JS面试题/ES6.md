### 谈谈你对 ES6 的理解

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

### let、const、var 的区别

- 块级作用域： 块作用域由 { }包裹，let 和 const 具有块级作用域，var 不存在块级作用域。块级作用域解决了 ES5 中的两个问题：
  - 内层变量可能覆盖外层变量
  - 用来计数的循环变量泄露为全局变量
- 变量提升： var 存在变量提升，let 和 const 不存在变量提升，即在变量只能在声明之后使用，否在会报错。
- 给全局添加属性： 浏览器的全局对象是 window，Node 的全局对象是 global。var 声明的变量为全局变量，并且会被添加为全局对象的属性，但是 let 和 const 不会。
- 重复声明： var 声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const 和 let 不允许重复声明变量。
- 初始值设置： 在变量声明时，var 和 let 可以不用设置初始值。而 const 声明变量必须设置初始值。
- 暂时性死区：在使用 let、const 命令声明变量之前，该变量都是不可用的。使用 var 声明的变量不存在暂时性死区

### 箭头函数与普通函数的区别

箭头函数：

- 是匿名函数，不能作为构造函数
- 没有 arguments
- 没有自己的 this 对象，this 指向箭头函数定义时所在的上层作用域中的 this（即，箭头函数的 this 是它所在的上下文）
- call()、applay()、bind()方法不能改变箭头函数中的 this 指向
- 没有 prototype
- 箭头函数不能用作 Generator 函数，不能使用 yeild 关键字

### Set、Map 的区别

Set 是没有重复元素的集合，类似数组，可以按照添加顺序来遍历。

Map 是键值对的集合，可以按照数据插入时的顺序遍历所有的元素。

### Object 和 Map 的比较

- 键的类型：Object 的键为字符串或 symbol，Map 的键可以是任意类型
- 必须手动计算 Object 的大小，但是可以很容易地获取 Map 的大小（size）
- 键值对的顺序：Map 中的键值对是按照插入的顺序存储的，而对象中的键值对则没有顺序
- Map 的遍历遵循元素的插入顺序。而 Object 需要手动遍历
- Object 有原型，所以映射中有一些缺省的键。

使用场景：

- 如果键在运行时才能知道，或者所有的键类型相同，所有的值类型相同，那就使用 Map。
- 如果需要将原始值存储为键，则使用 Map，因为 Object 将每个键视为字符串，不管它是一个数字值、布尔值还是任何其他原始值。
- 如果存在需要对个别元素进行操作的逻辑，使用 Object。

### weakMap 和 Map 的比较

- weakMap 的键只能是对象类型
- 键值关系的存储：
  - map 使用常规的引用来管理键和值之间的关系，因此即使键不再使用，map 仍然会保留该键的内存。
  - weakMap 使用弱引用来管理键和值之间的关系，因此如果键不再有其他引用，垃圾回收机制可以自动回收键值对。

### 你对 Promise 的理解

Promise 是异步编程的一种解决方案，避免了回调地狱

Promise 的三种状态：pending、fulfiling、rejected

两个凝固过程：

- pending->fulfiling：resolved 已完成
- pending->rejected：rejected 已拒绝

Promise 的构造函数接受一个回调函数，回调函数包含两个参数：resolve、reject

- resolve 在异步操作成功时调用，将结果返回，作为参数传递出去
- reject 在异步操作失败时调用，将错误信息返回，作为参数传递出去

Promise 的特点：

- 无法取消 promise，一旦新建便立即执行，无法中途取消
- 如果不设置处理错误的回调函数，promise 内部抛出的错误将不会反映到外部
- 处于 pending 状态时，无法得知目前进展到哪一个阶段

### promise 的常用方法

- .then()：异步操作成功时调用，对应 resolve 的处理
- .catch()：操作失败时调用，对应 reject 的处理
- Promise.resolve() 创建一个立即完成的 Promise
- Promise.reject() 创建一个立即拒绝的 Promise
- Promise.race([...]) 返回执行最快的 Promise（不考虑对错）
- Promise.allSettled([...]) 同时返回多个 Promise 的执行结果(无论成功或失败)
- Promise.all([...]) 传入多个 Promise 参数，返回多个 Promise 的执行结果组成的数组。其中若有一个 Promise 报错，就返回错误
- Promise.any([...]) 与 race 类似，但是它只会返回第一个**成功**的最快完成的的 Promise，如果所有的 Promise 都失败会返回一个错误信息。

### 比较 all 和 allsettled

两个方法都可以传入多个 Promise 参数

all：当所有 promise 成功时，返回多个 promise 返回值组成的数组，其中但凡有一个 promise 错误，就会返回错误

allsettled：返回多个 promise 返回值组成的数组，无论成功与否。

### async/await 对比 Promise 的优势

- 代码可读性高，Promise 虽然摆脱了回掉地狱，但自身的链式调用会影响可读性。
- 相对 Promise 更优雅，传值更方便。
- 对错误处理友好，可以通过 try/catch 捕获，Promise 的错误捕获⾮常冗余

### 介绍 ESM

ES6 新增了原生内置的模块支持，即 ECMAScript Modules(ESM)，可以在浏览器、Node.js 中使用 ES 模块

不使用 ESM 模块时，用 module.export()导出可供外部使用的 JS 对象

ESM 模块直接用 export 标识需要导出的函数，文件扩展名变为.mjs

ESM 默认使用严格模式，无需声明'use strict'

### ESM 和 CommonJS 的区别

两者都用于弥补 js 没有模块化统一标准的问题

CommonJS：

- 每个 js 文件都是一个单独的模块，称为 module
- exports、module.exports 用于对模块中的内容进行导出
- require 函数用于导入其他模块的方法
- 动态导入导出，难以提前确定模块是否被使用，从而难以优化

ES 模块：

- import、export 来导入、导出模块
- 所有模块的导入导出只能出现在模块的顶层。可以异步加载模块，按需加载模块，提高性能
- tree shaking：基于 ESM 规范，在打包过程中通过静态分析模块之间的依赖关系，确定哪些模块没有被使用，并将其删除
  - 原理：标记出没有被使用过的模块导出，然后删除
