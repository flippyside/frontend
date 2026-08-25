ECMAScript 6.0 在 2015 发布，从此以后每年六月发布新的版本升级，ES6 一般是指 ES2015 标准，也可以泛指“下一代 JavaScript 语言”

Babel：ES6 转码器，可将 ES6 代码转为 ES5



### 解构赋值

数组解构：位置必须一一对应

对象解构：名字必须相同。如果名字与关键字冲突，可以起别名。

可以设置某个属性的默认值。

```js
let [,age] = ['abc', 1]
console.log(age) // 1

// 获取属性length
let {length} = ['abc', 1]
console.log(length) // 2

let {name, age, default:d} = {name:'abc', age:1, default:'xxx'}
console.log(d) // xxx
```

### 展开运算符：拍平

```js
function spread(x, ...args){
    sum(...args)
}
function sum(a,b,c,d){
    console.log(a,b,c,d)
}
spread('x', 1,2,3,4) // 1,2,3,4
```



### 模板字符串

功能：字符串拼接

```s
let str = `hello~${name}今年${age}岁了`
```

### 箭头函数

注意，箭头函数如果想直接返回对象，需要加括号。

```js
let a = c => d => ({sum : c + d});
console.log(a(1)(2)) // sum: 3
```

箭头函数没有自己的this和arguments。

```js
let fn = function(){
    console.log(arguments);
}
fn(1) // [1]

let fn1 = () => {
    console.log(arguments);
}
fn1(1) // Error

let fn2 = (x, ...args) => {
    console.log(args);
}
fn2('x', 1, 2, 3) // [1, 2, 3]
```



### this

普通函数的this：谁来调用，即，当前执行这个逻辑的主题是谁，亦即，`.`前是谁

如果没有 `.`调用：

- 非严格模式：默认 window 调用
- 严格模式：undefined

```js
let obj = {
    b:1,
    a:function(){
        console.log(this);
        setTimeout(function(){ // 没有.调用的普通函数，this指向window。如何让它指向obj？
            console.log(this);
        }, 1000);
    }
}
obj.a()  // 有.调用，所以 a 函数内部的 this 指向 obj。
// {b: 1, a: ƒ}
// Window
```

解决没有 `.`调用下this指向的问题：

- 箭头函数
- call、bind、apply手动绑定
- 闭包 额外变量保存this

**箭头函数它没有自己的 `this`，会沿着作用域链向外层查找，继承外层 `this`。本质也是闭包。**

```js
// 箭头函数
let obj = {
    b:1,
    a:function(){
        setTimeout(() => {
            console.log(this); // {b: 1, a: ƒ}
        }, 1000);
    }
}
// 闭包
let obj = {
    b:1,
    a:function(){
        let self = this;
        setTimeout(function(){
            console.log(self); // {b: 1, a: ƒ}
        }, 1000);
    }
}
// bind
let obj = {
    b:1,
    a:function(){
        setTimeout(function(){
            console.log(this); // {b: 1, a: ƒ}
        }.bind(this), 1000);
    }
}
```

注意，对象没有作用域，所以没有this：

```js
let a = 1
let obj = {
    a:2,
    b:()=>{
        console.log(this)        
        console.log(a)
    }
}
obj.b() // window  1
```

### 深浅拷贝

浅拷贝：

- 数组提供了多个浅拷贝 API，如`slice()`、`concat()`、`Array.from()`

- `Object.assign(target, src)`：将源对象的属性拷贝到目标对象，返回目标对象。

- 扩展运算符`...`，与`Object.assign()`效果一致。

- ##### 手写浅拷贝：遍历原对象第一层属性并赋值

实现深拷贝：

- 将对象先转为JSON字符串，再转为对象：`const newObj = JSON.parse(JSON.stringify(obj))`。
  - 不能拷贝`undefined`、`Symbol`、`BigInt`类型（会丢失）、函数（会丢失）、循环引用的对象（会报错）、原型链上的属性；
  - 日期对象会被转为字符串，正则对象会被转为空对象。
- 递归拷贝



### 可枚举属性和自有属性



可枚举属性：属性的enumerable属性为true则为可枚举属性

- 通过初始化创建的属性或简单赋值的属性都是可枚举的。
- 使用`Object.defineProperty`（enumerable设置为false，默认是false）来创建的属性是不可枚举的



自有属性：直接定义在对象本身上的属性。不包含从原型链继承的属性。

- `Object.getOwnPropertyNames(obj)`：获取obj的所有自有属性。包括不可枚举的。
- `Object.hasOwn(obj, prop)`：检查prop是否是obj的自有属性
- `Object.keys(obj)`：返回obj的所有可枚举自有属性。



**for...in**：遍历对象的所有**可枚举属性**，包括**继承属性**，返回的是 **key**；

**for...of** 用于遍历**可迭代对象的值**（数组、字符串、Map、Set 等），返回的是 **value**，依赖 `[Symbol.iterator]`。

### let 与 const

新增 let，let 声明的变量只在当前 let 所在代码块有效，不能重复声明同一个变量

for 循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域

变量提升：用 var 声明的变量可以在声明之前使用，值为 undefined

暂时性死区：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

块级作用域：外层代码块不受内层代码块的影响

顶层对象：window，var 声明的全局变量 都是 顶层对象的属性

const：变量的地址不能被修改，其他都可以

例如：`const a = {name:123};  a.name = 456; // OK  a = {name:456}; // Error`

let 声明的全局变量将不再是顶层对象的属性

如何获取顶层对象：

- 很难找到一种方法可以在所有情况写都取到顶层对象。
  - 全局环境中 this 返回顶层对象
  - ES6 模块: 在顶层作用域使用 this 时，它返回的是 undefined.
  - Node.js 模块：this 返回的是当前模块
  - 函数里面的 this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this 会指向顶层对象。但是，严格模式下，这时 this 会返回 undefined。
- ES2020 在语言标准的层面，引入 globalThis 作为顶层对象。也就是说，任何环境下，globalThis 都是存在的，都可以从它拿到顶层对象，指向全局环境下的 this

### 数组

reduce：函数的返回结果会作为下一次的prev。

例：求平均数：

```js
let res = [1,2,3,4,5].reduce((prev,next,curIndex,arr)=>{ 
    if(curIndex == arr.length - 1) return (prev+next)/arr.length;
    return prev+next; 
})
console.log(res) // 3
```

<img src="C:\Users\petunia\AppData\Roaming\Typora\typora-user-images\image-20260416234448216.png" alt="image-20260416234448216" style="zoom: 33%;" />

`reduce(..., num)`：设置第一次循环prev为num，next为第一个元素。可防止出现元素为对象时访问属性为undefine。

```js
let total = [{price: 10}, {price: 20}, {price: 30}].reduce((prev, next) => {
	return prev + next.price
}, 0)
console.log(total) // 60
```

find：返回查找的那一项

some：找到后返回true

`Array.from()`：将类数组转化为数组

- 常见的类数组：htmlCollection、arguments



### 严格模式

- 禁止隐式创建全局变量
- 禁止删除变量、函数
- 函数参数名不能重复
- this 不会自动绑定为全局对象
- 禁止修改只读属性、不可扩展对象
- 禁止在 eval 中创建变量泄露到外部
- 禁止使用 with
- delete 不能删除不可删除的属性
- 保留字不可用作变量名
