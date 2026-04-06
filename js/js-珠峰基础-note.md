**你不知道的 JavaScript**

# javascript

## 执行上下文 Execution Context

- 函数运行时产生**执行上下文**
- 执行上下文中会创建对象，叫做**变量对象（Value Object）**
  - 基础数据类型直接放在变量对象中
  - 引用数据类型保存在堆中，变量对象中只存放地址

```js
function task() {
  var a = 1;
  var b = {
    name: "hello",
  };
  var c = [1, 2, 3];
}
```

```js
// 执行上下文
let taskExecutionContext = {
  // 变量对象，存储函数执行要使用到的参数、变量
  VO: {
    arguments: {},
    a: 1,
    b: `0x8000`,
    c: `0x8001`,
  },
};
```

![1775302674916](image/js-基础-note/1775302674916.png)

执行上下文分为：

- 全局上下文
- 函数上下文

全局上下文：

- 只有一个，由浏览器创建。
- 全局上下文的 VO，也被称为 GO（Global Object）全局对象，例如 window 对象
- 全局对象可以直接访问，例如存放在其中的 var 全局变量

函数上下文：每次函数执行，会产生一个执行上下文。函数上下文的 VO 不能被直接访问

**调用栈**管理这些执行上下文。

### 执行上下文的生命周期

一个新的执行上下文的生命周期有两个阶段：创建/编译、执行

- 创建/编译阶段：
  - 创建变量对象
    - 变量对象保存函数参数、函数定义、var 变量声明（var 不赋值）
    - 此时不处理 let 变量
  - 确定作用域链
  - 确定 this 指向
- 执行阶段：
  - 变量赋值
  - 函数赋值
  - 代码执行

### 活动对象

处于执行栈顶端的 VO，会成为活动对象（Activation Object）

活动对象的 this 将会指向 window

### 作用域

作用域就相当于一个个执行上下文。

作用域链在函数创建时就已经确定。

规律是：当变量有多个值时，离谁**近**，就取谁。

```js
function one() {
  var a = 1;
  function two() {
    console.log(a);
  }
  return two;
}

var a = 2;
var outer_two = one();
outer_two(); // 1
```

模拟一下上述代码执行后，执行上下文的变化：

```js
/**
 * 执行上下文有两个阶段：编译、执行
 */

// 编译：寻找var变量声明和函数声明，进行变量提升
var globalExecutionContextVO = {
    a: undefined
    outer_two: undefined
}

var globalExecutionContext = {
    VO = globalExecutionContextVO
}

// 执行
globalExecutionContext.VO.a = 2

// 编译one函数的执行上下文
var oneExecutionContextVO = {
    two: `() => {}`,
    a: undefined
}

var oneExecutionContext = {
    VO = oneExecutionContextVO
}

// 执行one函数的执行上下文
oneExecutionContext.VO.a = 1
globalExecutionContext.VO.outer_two = 'two'

// 编译two函数的执行上下文
var twoExecutionContextVO = { }
var twoExecutionContext = {
    VO = twoExecutionContextVO
    // 作用域链在编译时确定
    scopeChain: [twoExecutionContext, oneExecutionContext, globalExecutionContext]
}
// 执行two函数的执行上下文
// 访问变量a，沿着作用域链查找，首先在oneExecutionContext命中，值为1。
```

### 数据类型

js 数据类型：

- 基本：Number String Boolean Null Undefined (ES6: Symbol BigInt)
- 引用：Object

基本数据类型的赋值：直接拷贝一份对象，不会互相影响

```js
var a = 1;
var b = a;
b = 2;
console.log(a); // 1
```

引用数据类型的赋值：由于拷贝的是地址，会互相影响

```js
var m = { a: 1, b: 2 };
var n = m;
n.a = 10;
console.log(m.a); // 10
```

> tips: 栈中存放局部的、空间确定的数据，其余存储到堆中

基本类型不是对象，为什么可以使用对象的方法？是因为临时对它进行了包装，包装成对象

```js
let a = 1;
console.log(a.toString());
// 实际上被转换成：console.log(new Number(a).toString());
```

## 闭包

> MDN 定义：有一个作用域，包含了函数 fn，这个函数 fn 可以调用被这个作用域封闭的变量、函数等内容

即，当前的执行上下文是 A，该执行上下文中创建了函数 B，当函数 B 引用了当前执行上下文 A 的变量，就会产生闭包。

即，内层函数使用了外部变量。

本质是在函数外部保持内部变量的引用，从而阻止垃圾回收。

类似于，函数执行完后一部分后续还要使用的变量没有被销毁，而是被内层函数打包带走

以下是一个闭包和执行上下文的模拟：

```js
function one() {
  var a = 1;
  function two() {
    var b = 2;
    function three() {
      var c = 3;
      return () => {
        var d = 4;
        console.log(a, b, c, d);
      };
    }
    return three();
  }
  return two();
}

var fn = one();
fn();

let globalEC = {
  this: globalThis,
  outer: null,
  VE: { one: () => {}, fn: undefined },
};

let oneEC = {
  outer: globalEC,
  VE: { a: 1, two: () => {} },
};

let twoEC = {
  outer: oneEC,
  VE: { b: 2, three: () => {} },
};

let threeEC = {
  outer: twoEC,
  VE: { c: 3 },
};

let fnEC = {
  outer: globalEC, // 注意，fn在全局声明
  VE: { d: 4 },
  closures: [{ c: 3 }, { b: 2 }, { a: 1 }], // 闭包
};

// 寻找变量的值的过程：先找自己的VE，再找闭包，最后找outer作用域链
function getValue(name, ec) {
  if (name in ec.VE) {
    return ec.VE[name];
  }

  for (let i = ec.closures.length - 1; i >= 0; i--) {
    if (name in ec.closures[i]) {
      return ec.closures[i][name];
    }
  }

  if (ec.outer) {
    return getValue(name, ec.outer);
  }
}

console.log(getValue("a", fnEC));
```

闭包会造成内存泄漏，因为闭包如果是全局声明的一个函数，其内部的`closures`的变量如同**全局变量**，在函数执行完后也不会被销毁。

可以将闭包置为 null 解决。

## var 和 let 的区别

var 的问题：

- 内层变量可能覆盖外层变量
- `for`中用来计数的 `i`是全局变量
- 变量提升：可以在声明之前使用

let：

- 块级作用域可以嵌套。外层不能读取内层的变量，内层可以定义与外层变量同名的变量而不覆盖
- 函数本身的作用域在其所在的块级作用域之内

### 全局变量

- ES5 声明变量只有两种方式：var 和 function
- ES6 有 let、const、import、class、var、function
- 浏览器环境中全局对象是 window，Node 中是 global
- ES5 中全局对象的属性等价于全局变量
- ES6 中 var、function 声明的全局变量，依然是全局对象的属性。但 let、const、class 声明的全局变量不属于全局对象。

var 和 function 声明函数的区别：

- 编译阶段，先扫描 function，再扫描 var
- function 会在 VO 上声明并直接赋值，var 只声明不赋值，值是 undefined，其赋值在执行阶段执行

## this

this：谁来调用，即，当前执行这个逻辑的主题是谁，亦即，`.`前是谁

如果没有 `.`调用：

- 非严格模式：默认 window 调用
- 严格模式：undefined

## call() 、bind（）、 apply()

目标：让某个对象能够执行一个不属于它的方法。

```js
function func() {
  console.log(this.name);
}

// 一种实现
let obj = { name: "hello" };
obj.func = func;
obj.func(); // hello
delete obj.func;
```

以上就是 call() 、bind（）、 apply() 的原理。

- 将函数加到目标对象上
- 调用函数
- 删除这个函数属性

```js
!(function (prototype) {
  function my_call(context) {
    context.func = this; // 相当于 obj.func = func
    context.func();
    delete context.func;
  }
  prototype.my_call = my_call;
})(Function.prototype);

func.my_call(obj);
```

完整实现：

```js
!(function (prototype) {
  function getDefaultContext(context) {
    // 如果没有传入context，默认为window
    context = context || window;

    // 包装成对象类型，以防传入的是基本数据类型
    context = Object(context);
    return context;
  }

  function my_call(context, ...args) {
    context = getDefaultContext(context);
    let symbol = Symbol("fn");
    context[symbol] = this;
    context[symbol](...args);
    delete context[symbol];
  }
  prototype.my_call = my_call;
})(Function.prototype);

func.my_call(obj);
func.my_call(obj, 10, "beijing");
```

apply 与 call 的实现一模一样，只不过传入参数是数组形式：

```js
function my_apply(context, ...args) {
  context = getDefaultContext(context);
  let symbol = Symbol("fn");
  context[symbol] = this;
  context[symbol](...args);
  delete context[symbol];
}

func.my_apply(obj, [10, "beijing"]);
```

而 bind 会返回一个新的函数：

```js
function my_bind(context, ...outerArgs) {
  return (...args) => {
    this.call(context, ...outerArgs, ...args);
  };
}
let bindedFunc = func.my_bind(obj, 10);
bindedFunc("beijing");
```

## 对象与原型链

- 除了基础数据类型之外，一切皆对象。函数是特殊的对象。
- js 里没有类，但有构造函数。
- 构造函数有 `__proto__`和 `prototype`。实例有 `__proto__`，没有 `prototype`
- `.`也是一个运算符，当调用了一个函数时，先查找对象自己有没有这个属性，如果没有再查找对象的 `__proto__`属性上有没有这个属性。

```cpp
// 为了加快生产对象的速度，就有了函数，函数可以用来批量生产对象
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 把对象共有的属性放在构造函数的原型上
Person.prototype.eat = () => { console.log("吃饭"); }


/**
 *
 * @param {*} clazz 构造函数
 * @param  {...any} args 参数
 * @returns 对象
 */
function my_new(clazz, ...args) {
    let obj = {};
    // 关联构造函数的原型
    // 也就是给obj添加一个属性（名叫__proto__），指向构造函数的原型，后续可以通过obj.__proto__.eat()调用
    obj.__proto__ = clazz.prototype
    clazz.call(obj, ...args); // 将this指向obj，调用函数Person，给实例的私有属性赋值
    return obj;
}

let abc = my_new(Person, 'abc', 11)

console.log(abc);

abc.__proto__.eat()
// __proto__也叫隐式原型，可以省略
/**
 * `.`也是一个运算符
 * 当调用了一个函数时，先查找对象自己有没有这个属性
 * 如果没有再查找对象的`__proto__`属性上有没有这个属性。
 */
abc.eat()

```

字面量创建对象其实是 `Object()`的语法糖。同样，我们常用的函数声明也是 `Function`的语法糖：

```js
let obj = { name: "123" };
let obj_ = new Object();

function add(a, b) {
  return a + b;
}
let add_ = new Function("a", "b", "return a + b");
```

Object 也是一个函数，是函数的实例：

```js
let Object = new Function();
Object.__proto__ = Function.prototype;
```

### instanceof

原型链：`__proto__`连接成的链条。

原型链的作用：实现属性和方法的共享。

`a instanceof b`：`a`的原型链与 `b`的原型链如果能交汇与一点，则为 True。

- 例如，`p1.__proto__ == Person.prototype`，则 `p1 instanceof Person`为 True
- 例如，`p1.__proto__.__proto__ == Object.prototype `，则 `p1 instanceof Object`为 True

### 继承

以下是 ts 中使用继承的一个例子：

```ts
class Father {
  static staticFatherName = "FatherName";
  static staticGetFatherName = function () {
    console.log(Father.staticFatherName);
  };
  constructor(public name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}

class Child extends Father {
  static staticChildName = "ChildName";
  static staticGetChildName = function () {
    console.log(Child.staticChildName);
  };
  constructor(public name, public age) {
    super(name);
    this.age = age;
  }
  getAge() {
    console.log(this.age);
  }
}
```

实现继承的步骤：

1. 静态继承：让 Child 继承 Father 的 static 属性
2. 让 Child 继承 Father 原型上的属性，即让 `new child()`实例对象的**proto**指向 `Father.prototype`，且不破坏 `constructor`
3. 继承 Father 的私有属性：对 Child 的实例 执行 Father 构造函数

```js
var Father = (function () {
  Father.staticFatherName = "FatherName";
  Father.staticGetFatherName = function () {
    console.log(Father.staticFatherName);
  };
  Father.prototype.getName = function () {
    console.log(this.name);
  };
  function Father(name) {
    this.name = name;
  }
  return Father;
})();

function _extends(Child, Father) {
  // 1. 静态继承：让Child继承Father的static属性
  Child.__proto__ = Father;
  // 2. 让Child继承Father原型上的属性，即让new child()实例对象的__proto__指向Father.prototype，且不破坏constructor
  function Temp() {
    // constructor指向Child的构造函数
    this.constructor = Child;
  }
  Temp.prototype = Father.prototype;
  Child.prototype = new Temp();
}

var Child = (function (_super) {
  // _super = father
  // 继承Father的static属性和Father原型上的属性
  _extends(Child, _super);
  function Child(name) {
    // 3. 继承Father的私有属性：对Child的实例 执行Father构造函数
    _super.call(this, name);
    this.age = age;
  }
  Child.staticChildName = "ChildName";
  Child.staticGetChildName = function () {
    console.log(Child.staticChildName);
  };
  Child.prototype.getAge = function () {
    console.log(this.age);
  };
  return Child;
})();
```

## ES6

ES6 新增：变量环境(VariableEnvironment)和词法环境(lexicalEnviroment)、let 和块级作用域

ES5 中，执行上下文存放有 this、VO、scopeChain

而在 ES6，执行上下文存放 this、VE(VariableEnvironment)、LE(lexicalEnviroment)、outer

- VE 存储 var 变量和 function
- LE 存储 let 变量
- outer 取代了 scopeChain，实现作用域链

下面模拟 ES6 中的执行上下文变化：

```js
// 模拟ES6中的执行上下文变化

function fn() {
  var a = 1;
  let b = 2;
  {
    let b = 3;
    var c = 4;
    let d = 5;
    console.log(a, b, c, d);
  }
  {
    let b = 6;
    let d = 7;
    console.log(a, b, c, d);
  }
}
fn();

// 1. 全局下编译
let globalEC = {
  this: globalThis,
  outer: null, // outer: 外部执行上下文环境，相当于ScopeChain
  variableEnvironment: { fn() {} },
  lexicalEnviroment: {},
};
// 2. 编译fn
// 静态作用域
let fnEC = {
  this: globalThis,
  // fnEC.outer等于声明fn变量的执行上下文环境对象中的variableEnvironment
  outer: globalEC.variableEnvironment,
  variableEnvironment: { a: undefined, c: undefined },
  lexicalEnviroment: { b: undefined },
};

// 执行fn
fnEC.variableEnvironment.a = 1;
fnEC.variableEnvironment.b = 2;
// 进入第一个代码块
// 每当函数执行遇到了一个新的代码块，会创建一个新的词法环境对象
fnEC.lexicalEnviroment.push({ b: undefined, d: undefined });
fnEC.lexicalEnviroment[1].b = 3;
fnEC.variableEnvironment.c = 4;
fnEC.lexicalEnviroment[1].d = 5;
// 进入第二个代码块
fnEC.lexicalEnviroment.pop();
fnEC.lexicalEnviroment.push({
  b: undefined,
  d: undefined,
});
fnEC.lexicalEnviroment[1].b = 6;
fnEC.lexicalEnviroment[1].d = 7;

// 通过outer，沿着作用域链，寻找变量的值的过程：
function getValue(name, ec) {
  for (let i = ec.lexicalEnviroment.length - 1; i >= 0; i--) {
    if (name in ec.lexicalEnviroment[i]) {
      return ec.lexicalEnviroment[i][name];
    }
    if (name in ec.variableEnvironment) {
      return ec.variableEnvironment[name];
    }
  }
  if (ec.outer) {
    return getValue(name, ec.outer);
  }
}
```

## 事件和事件绑定

> 事件：事件是浏览器赋予元素的默认行为，也可以理解为元素天生具备的特性。

存在特性: 无论是否为其绑定方法，当相关行为触发时，事件都会被执行

例: 即使不写`document.body.onclick=function(){}`代码，点击 body 时仍然会触发点击事件行为，只是没有执行任何操作

比喻记忆: 就像被人打了一拳（触发事件），可以选择不反应（未绑定方法）或大喊一声（绑定方法）

> 事件绑定：给元素的默认事件行为绑定方法，使得行为触发时能执行指定方法

事件绑定，应表述为"给 body 的点击事件行为绑定方法"，而非"给 body 绑定点击事件"

分为：

- DOM 0 级事件绑定：
- DOM 2 级事件绑定：

DOM 0 级事件绑定：

- 语法：`[元素].on[事件]=[函数]`
  - 绑定：`document.body.onclick = function(){}`
  - 解绑：`document.body.onclick = null`
- 原理：本质是给 DOM 元素对象的**属性**赋值（每个 DOM 元素都是对象类型）
- 特点：
  - 只能给元素的某个事件绑定一个方法，多次绑定会覆盖前值
  - 没有的属性就无法绑定事件
  - 执行速度快，使用方便

DOM 2 级事件绑定：

- 语法：`[元素].addEventListener([事件],[方法],[捕获/冒泡])`
  - 绑定：`document.body.addEventListener('click', fn1, false)`
  - 移除：`document.body.removeEventListener('click', fn1, false)`
- 原理：
  - 每个 DOM 元素都会基于原型链的查找机制(`__proto__`)，查找到`EventTarget.prototype`的`addEventListener`等方法
  - 事件绑定采用事件池机制
- 特点：
  - 绑定时一般不使用匿名函数，否则无法移除
  - 凡是浏览器提供的事件行为，都可以绑定
  - 可以给某个事件类型绑定多个不同的方法。事件行为触发时，从事件池中按照绑定的顺序依次取出

DOM0 和 DOM2 区别：

- 支持范围：
  - DOM0 仅支持具有 onxxx 私有属性的事件
  - DOM2 支持所有浏览器提供的事件行为（如可用 window.addEventListener('DOMContentLoaded',func)）
- 方法绑定：
  - DOM0 同一事件只能绑定一个方法
  - DOM2 可绑定多个不同方法（按绑定顺序执行）
- 移除机制：
  - DOM0 通过赋 null 值移除
  - DOM2 必须使用匹配的 removeEventListener 移除
- 匿名函数处理：
  - DOM2 通常不使用匿名函数，以便后续移除
  - DOM0 可使用匿名函数，但移除时仍需引用

![alt text](assets/js-珠峰基础-note/image.png)
