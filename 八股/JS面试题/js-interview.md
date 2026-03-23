## 谈谈对 js 事件循环的理解？

任务分为：

- 同步任务：立即执行的任务，同步任务会进入到主线程中执行
- 异步任务：异步执行的任务，比如ajax网络请求、setTimeout，可能出现在任务队列中，直到可以执行了，该任务才会进入主线程执行。

JS 是单线程的，运行基于事件循环机制(event loop)：对于异步事件它会先加入到任务队列中挂起，等主线程空闲时会去执行事件队列中的事件。

- 调用栈（主线程）
  - 后进先出
  - 存储要执行的代码
- 任务队列
  - 先进先出
  - 存储将要执行的代码
  - 调用栈中的代码执行完毕后，才会将队列中的代码按顺序放入栈执行

任务队列分为：

- 宏任务队列 （大部分代码都去宏任务队列中去排队，例如script、I/O）
- 微任务队列 （Promise 的回调函数（then、catch、finally））
  - queueMicrotask() : 向微任务队列中添加一个任务

Promise 的执行原理

- Promise 在执行，then 就相当于给 Promise 了回调函数
  - 当 Promise 的状态从 pending 变为 fulfilled 时，then 的回调函数会被放入到任务队列中

流程：主线程任务 ——> 微任务 ——> 宏任务 


## js 的数据类型

八种：undefined、null、boolean、string、object、number

ES6 新增两种：symbol、bigint：

- symbol：创建独一无二且不可变的数据类型，作用是防止全局变量冲突
- bigint：存储任意精度格式的整数

可以分为原始数据类型、引用数据类型：

- 原始数据类型：存储在栈中
- 引用数据类型：存储在堆中，在栈中存放指向该数据的指针

## this

## 箭头函数与普通函数的区别

箭头函数：

- 是匿名函数，不能作为构造函数
- 没有 arguments
- 没有自己的 this 对象，this 指向箭头函数定义时所在的上层作用域中的 this（即，箭头函数的 this 是它所在的上下文）
- call()、applay()、bind()方法不能改变箭头函数中的 this 指向
- 没有 prototype
- 箭头函数不能用作 Generator 函数，不能使用 yeild 关键字

## 实现防抖节流

## 你对 Promise 的理解

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

## 柯里化

## js的垃圾回收

## undefined、null 的区别

undefined、null 都是基本数据类型，都只有唯一的值 undefined、null

- undefined：声明但未定义的变量
- null：表示空对象，通常用于尚未确定值的变量，typeof null 返回 object，所以用 === null 来测试 null

## instanceof 运算符的实现原理及实现

作用：用于检测构造函数的 prototype 是否出现在某个实例对象的原型链上

原理：obj instanceof Constructor 会在 obj 的原型链上查找 Constructor 的 prototype，直到查找到原型链的顶端

手写

```js
// 实现 instanceof
const myInstanceof = (target, origin) => {
  // 右侧必须是构造函数
  if (typeof origin !== "function") {
    throw new TypeError("Right-hand side of 'instanceof' should be a function");
  }
  if (
    //基本数据类型直接返回false
    (typeof target !== "object" && typeof target !== "function") ||
    target === null
  ) {
    return false;
  }
  let proto = Object.getPrototypeOf(target); // 等价于 target.__proto__
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
```

## typeof 和 instanceof 区别

- typeof 用于判断原始数据类型（null 除外），返回数据类型（例如 Number、String）
- instanceof 用于判断引用数据类型(对象)，返回 boolean

为什么 typeof null 为 object：这是 js 的一个历史遗留问题，用 32 位二进制数存储值，前 3 位表示类型，000 为对象，而 null 为全 0，所以判断为 object

## 为什么 0.1+0.2 ! == 0.3，如何让其相等

浮点数运算精度问题，计算机中，数据需要转换为二进制再运算，浮点数自身小数位数的限制而截断的二进制再转化为十进制，会比 0.3 稍大

solution：

- 先转换为整数再运算，结果再转换为小数
- 用 toFixed 保留结果的小数点

## 判断数组的方式

- 1. `Object.prototype.toString().call(obj).slice(8,-1)==='Array'`： Object.prototype.toString() 返回 "[object Type]"，这里的 Type 是对象的类型。
- 2. `obj instanceof Array` 或者 `obj.__proto__ === Array.prototype`：原型链
- 3. ES6 的 `Array.isArray(obj)`

## 什么是类数组对象？如何转换为数组

类数组对象就是伪数组，不能调用数组的方法。arguments、通过 document.getElement 获取到的内容都是伪数组。伪数组具有 length 属性

转换方法：

- Array.from(arrayLike)：不会改原对象
- [...arrayLike]：使用扩展运算符。不会改原对象
- Array.prototype.slice.call(arrayLike)：调用 arrayLike 的 slice 方法，由于 arrayLike 类型是对象，没有 slice 方法，JS 内部机制会把 arrayLike 转换为 Array
- Array.prototype.splice.call(arrayLike,0)：splice(0)会从索引 0 开始删除所有元素，返回被删除的元素数组，同时修改原对象的内容（即删除它的元素）。splice 会根据 arrayLike 的 length 去访问元素，把这些值复制到一个数组中返回
- Array.prototype.concat.apply([], arrayLike)

## 数组的原生方法

## substring 和 substr 的区别

- `substring(startIdx, endIdx)`：返回从 startIdx 到 endIdx 的子字符串
- `substr(startIdx, length)`：返回从 startIdx，长度为 length 的子字符串

## object.assign 和扩展运算符都是浅拷贝

- object.assign(tarObj, srcObj1, ...)：将所有源对象合并到目标对象中，返回修改后的目标对象。如果目标对象与源对象具有相同的键（属性名），则目标对象中的属性将被源对象中的属性覆盖，后面的源对象的属性将类似地覆盖前面的源对象的同名属性。会调用 ES6 的 setter
- [...]扩展运算符：数组或对象中的每一个值都会被拷贝到一个新的数组或对象中。它不复制继承的属性或类的属性，但是它会复制 ES6 的 symbols 属性。

## new

new 创建一个对象，将该对象绑定到构造函数的 this 上

执行过程：

- 基于构造函数的原型，创建新的对象（将新对象的原型指向构造函数原型对象）
- 通过 apply 执行构造函数（将构造函数的 this 指向新对象）
- 返回：
  - 如果构造函数没有返回值，直接返回新对象
  - 如果构造函数有返回值，并且是一个对象，则返回构造函数的返回值

手写

```js
function myNew(Func, ...args) {
  if (typeof Func !== "function") {
    throw new TypeError("First argument must be a function");
  }
  // 基于构造函数的原型，创建新的对象
  const obj = Object.create(Func.prototype);
  // 将构建函数的this指向新对象
  let result = Func.apply(obj, args);
  // 根据返回值判断
  return result !== null && result instanceof Object ? result : obj;
}
```

## for...in 和 for...of

- for...in：遍历对象的整个原型链，遍历获取的是对象的键名（key），主要用于遍历对象
- for...of：只遍历当前对象，遍历获取的是对象的键值（value），主要用于遍历数组、类数组对象、字符串、Set、Map
- 例如遍历数组，for...in 会返回数组中所有所有可枚举的属性（包括原型链上可枚举的属性），for...of 只返回数组的下标对应的属性值

可枚举属性：对于通过直接复制或属性初始化器创建的属性，默认为 true；Object.defineProperty 定义的属性，默认为 false。迭代方法(例如 for...in)只访问可枚举的属性

for...in 是如何遍历原型链的：

- 先枚举对象自身的可枚举属性
- 顺着原型链，枚举原型的可枚举属性

在 Object.prototype 上挂自定义属性，会污染所有 for...in 遍历。

如何避免遍历原型链？

- 用 hasOwnProperty() 过滤掉原型属性

for...of 可以遍历的数据内部都有一个遍历器 iterator 接口，普通对象内部没有，但可以通过给对象添加一个 Symbol.iterator 属性来指向一个迭代器

## forEach 和 map 方法有什么区别

都用于遍历数组，对数组的每个元素执行一次给定的函数

- forEach：直接改变原数组，无返回值
- map：不改变原数组，创建一个新数组用来存放原数组通过函数处理后的值，并返回

## 什么是尾调用，使用尾调用有什么好处

尾调用：在函数的最后一步调用函数。

作用：节省内存：在一个函数里调用另外一个函数会保留当前执行的上下文，但如果在函数尾部调用，就不会保留执行上下文，从而节省内存。

ES6 的尾调用只能在严格模式下开启

## 你用过哪些设计模式

- 单例模式：保证类只有一个实例，并提供一个访问它的全局访问点
- 工厂模式：用来创建对象，根据不同的参数返回不同的对象实例
- 策略模式：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换
- 装饰器模式：在不改变对象原型的基础上，对其进行包装扩展
- 观察者模式：定义了对象间一种一对多关系，当目标对象状态发生改变时，所有依赖它对对象都会得到通知
- 发布-订阅模式：
  - 发布者（消息的发送者）将发布的信息（事件）分为不同的类别，订阅者可以订阅其需要的信息（事件）；这样，当某个事件触发时，所有订阅该事件的对象将得到通知以及相关信息
  - 例如：DOM 操作中的 addEventListener、Vue 中的事件总线的概念、Node.js 中的 EventEmitter 以及内置库

![alt text](../assets/ajax/image.png)

## 如何实现深浅拷贝

实现深拷贝：

- `_.cloneDeep()`
- `jQuery.extend()`
- JSON.stringify()：将 js 对象用 JSON.stringify 序列化，再通过 JSON.parse 反序列
  - `const obj = JSON.parse(JSON.stringify(src));`
  - 会忽略对象中的函数、undefined、symbol ，
  - 如果有正则表达式、Error 对象等，会得到空对象
- 循环递归

```js
function myDeepClone(src) {
  if (src === null || typeof src !== "object") return src;
  const obj = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (typeof src == "object") obj[prop] = myDeepClone(src[prop]);
      else obj[prop] = src[prop];
    }
  }
  return obj;
}
```

- hasOwnProperty() ：返回一个布尔值，表示对象自有属性（而不是继承来的属性）中是否具有指定的属性。

实现浅拷贝：

```js
// 浅拷贝
function myShallowClone(src) {
  const obj = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      obj[prop] = src[prop];
    }
  }
  return obj;
}
```

存在浅拷贝的情况：

- Objec.assign() 拷贝对象
- Array 的 slice、concat 方法
- 使用 [...] 扩展运算符实现的复制

## 解释原型

- prototype：构造函数的 prototype 指向它的原型对象，原型对象包含了该构造函数所有实例共享的属性和方法
- **proto**：实例函数通过 proto 指向创建它的构造函数的 prototype（即原型对象），用于构造原型链
- constructor：原型对象的 constructor 指向它的构造函数

## 解释原型链

每个实例对象的**proto**指向它的构造函数的原型对象，这个原型对象也有**proto**指向它的原型对象，直到最顶层 null，这样就形成了一条原型链。

作用：访问一个对象的属性或方法时，如果当前对象没有，就沿着原型链逐级向上寻找，直到原型链的顶层原型 Object.prototype，如果这里没有就只指向 null

## 实现继承的传统方式

三种传统方式：原型链继承、借用构造函数继承、组合继承

1. 原型链继承：将子类的原型对象设置为父类

```js
function Parent() {
  this.name = "parent";
}
Parent.prototype.say = function () {};

function Child() {}
Child.prototype = new Parent();
```

问题：

- 所有子类实例共享父类实例的引用属性（比如数组、对象）；
- 传参困难。

2. 借用构造函数继承

```js
function Parent(name) {
  this.name = name;
}
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
```

- 方法都在构造函数里，每个实例都重新创建一份；
- 无法复用父类原型上的方法。

3. 组合继承

```js
function Parent() {
  this.name = "parent";
}
Parent.prototype.say = function () {};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

问题：

- 调用了两次父类构造函数，一次给实例，一次给原型
- 子类原型上有一份无用的 name 属性。

解决方案：寄生组合继承

## 实现寄生组合继承

Object.create() 静态方法：以一个现有对象作为原型，创建一个新对象。

- 子类执行父类构造函数：在子类的构造函数中，使用 call 创建父类型原型的一个副本
- 使用 Object.create()，将子类的原型指向父类（即，通过将新创建的中间对象赋给子类的原型，来继承父类原型。Object.create 只建立原型链关系，不会执行 Parent 构造函数，所以不会初始化属性。）
- 将子类的 constructor 重新指向子类自己的构造函数

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayName = function () {};

function Child(name, age) {
  // 执行父类构造函数
  Parent.call(this, name);
  this.age = age;
}

// 将子类的原型 指向父类
Child.prototype = Object.create(Parent.prototype);
// 此时的构造函数为父类的 需要指回自己
Child.prototype.constructor = Child;

Child.prototype.sayAge = function () {
  console.log(this.age);
};
var child1 = new Child("Tom", 18);
child1.sayName(); // 'Tom'
child1.sayAge(); // 18
```

优势：高效

- 只调用一次 Parent 构造函数
- 避免了在 Child.prototype 上面创建不必要的、多余的属性
- 子类能访问父类原型上的方法
- 原型链正确
- 是 ES6 class 继承的底层原理之一

## 理解闭包

闭包 closure：有权访问另一个函数作用域中变量的函数。创建闭包的最常见方式是在一个函数内创建另一个函数，这个函数可以访问到当前函数的局部变量

优点：

- 创建全局私有变量，避免变量全局污染
- 可以实现封装、缓存

缺点：

- 创建的变量不能被回收，消耗内存。若使用闭包后变量没有及时销毁，可能导致内存溢出
  - 解决：在不需要使用的时候把变量设为 null

使用场景：

- 创建私有变量
- 延长变量的生命周期
- 封装类和模块
- 科里化函数

## 对作用域、作用域链的理解

作用域是一个变量或函数的可访问范围，作用域控制着变量或函数的可见性和生命周期。

全局作用域：可以全局访问

- 最外层函数和最外层定义的变量拥有全局作用域
- window 上的对象属性方法拥有全局作用域
- 为定义直接复制的变量自动申明拥有全局作用域
- 过多的全局作用域变量会导致变量全局污染，命名冲突

函数作用域：只能在函数中访问使用哦

- 在函数中定义的变量，都只能在内部使用，外部无法访问
- 内层作用域可以访问外层，外层不能访问内存作用域

ES6 中的块级作用域：只在代码块中访问使用

- 使用 ES6 中新增的 let、const 什么的变量，具备块级作用域，块级作用域可以在函数中创建（由{}包裹的代码都是块级作用域）
- let、const 申明的变量不会变量提升，const 也不能重复申明
- 块级作用域主要用来解决由变量提升导致的变量覆盖问题

作用域链：变量在指定的作用域中没有找到，会依次向一层作用域进行查找，直到全局作用域。这个查找的过程被称为作用域链。

## bind

## call() 、bind（）、 apply() 的联系与区别

相同点：可以改变 this 指向

区别：

- 参数：call、bind 传入对象，apply 传入一个数组
- call、apply 改变 this 指向后会立即执行函数，bind 在改变 this 后返回一个函数，不会立即执行函数，需要手动调用。

连续多个 bind，最后 this 指向是什么：在 JavaScript 中，连续多次调用 bind 方法，最终函数的 this 上下文是由第一次调用 bind 方法的参数决定的
