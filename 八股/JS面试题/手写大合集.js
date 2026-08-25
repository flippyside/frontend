// ========== 快排: 找个基准，左边放小的，右边放大的，然后递归==========
/// Hoare
/**
 * 1. 选择mid作为基准元素pivot
 * 2. 将大于pivot的元素放在右边，小于的放在左边
 * 3. 递归对左右子数组进行排序
 */
function quickSort(arr, l, r) {
  if (l >= r) return;
  let pivot = arr[Math.floor((l + r) / 2)];
  let i = l,
    j = r;
  while (i <= j) {
    while (i <= r && arr[i] < pivot) i++;
    while (j >= l && arr[j] > pivot) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }
  quickSort(arr, l, j);
  quickSort(arr, i, r);
}

// Lomuto
/**
 * 1. 基准选择第一个元素
 * 2. 分区
 * 3. 将基准值放在合适的位置上
 * 4. 基于基准值左右两侧子数组递归
 */
function quickSort(arr, l, r) {
  if (l >= r) return;
  const partition = (arr, low, high) => {
    let l = low,
      r = low + 1,
      pivot = low;
    while (r <= high) {
      if (arr[r] < arr[pivot]) {
        l++;
        [arr[l], arr[r]] = [arr[r], arr[l]];
      }
      r++;
    }
    [arr[l], arr[pivot]] = [arr[pivot], arr[l]];
    return l;
  };
  let pivot = partition(arr, l, r);
  quickSort(arr, l, pivot - 1);
  quickSort(arr, pivot + 1, r);
}

{
  const arr = [9, 4, 2, 6, 4, 3, 0];
  quickSort(arr, 0, 6);
  console.log(arr);
}

// ========== 发布订阅 ==========
/**
 * 发布-订阅模式定义了对象间的一种一对多的依赖关系，
 * 当一个对象的状态发生变化时，所有依赖它的对象都将得到通知。
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }
  /**
   * 将事件存入events中
   */
  on(eventName, cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(cb);
    return this;
  }

  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => cb(...args));
    }
    return this;
  }

  off(eventName, cb) {
    const cbs = this.events[eventName];
    if (cbs) {
      const index = cbs.indexOf(cb);
      if (index !== -1) {
        cbs.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * 被emit触发一次后立即用off移除监听
   */
  once(eventName, cb) {
    const func = (...args) => {
      this.off(eventName, func);
      cb(...args);
    };
    this.on(eventName, func);
    return this;
  }
}

const bus = new EventEmitter();

const handleHello = (name) => console.log(`Hello, ${name}!`);
const handleHi = (name) => console.log(`Hi, ${name}!`);
bus.on("greet", handleHello);
bus.on("greet", handleHi);
bus.emit("greet", "Alice");

// ========== 防抖 节流 ==========

/**
 * 防抖: 当一个函数连续触发，只执行最后一次。
 * @param {*} func
 * @param {*} delay
 * @returns
 */
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    // 只要触发就重新计时
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * 节流: n 秒内只运行一次，若在 n 秒内被重复触发，只有一次生效
 * 法一: 时间戳
 */
function throttle(func, delay) {
  // 上次执行时间
  let prev = 0;
  return function (...args) {
    let now = Date.now();
    // 当前时间与上次执行时间差大于了限制时间
    if (now - prev >= delay) {
      func.apply(this, args);
      prev = now;
    }
  };
}

/**
 * 法二: 定时器
 */
function throttle(func, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
/**
 * 法三: 时间戳 + 定时器
 */
function throttle(func, delay) {
  let timer = null;
  let prev = null;
  return function (...args) {
    let now = Date.now();
    let remaining = delay - (now - prev);
    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(this, args);
      prev = now;
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, remaining);
    }
  };
}

// ******** 使用例 *********
let submitBtn = document.querySelector(".submitBtn");

let submitOrder = () => {
  console.log("订单已提交");
};

// 防抖 1 秒，用户狂点只触发最后一次
submitBtn.addEventListener("click", debounce(submitOrder, 500));
// 节流 1 秒, 1 秒内只触发一次
submitBtn.addEventListener("click", throttle(submitOrder, 500));

// ========== 实现 instanceof ==========
/**
 * 检测构造函数的prototype是否出现在某个实例对象的原型链上
 * 即，target与origin的原型链能否交汇于一点
 * @param {Object} target 实例对象
 * @param {function} origin 构造函数
 * @returns
 */
const Instanceof = (target, origin) => {
  // origin是构造函数
  if (typeof origin !== "function") {
    throw new TypeError("Right-hand side of 'instanceof' should be a function");
  }
  // target是对象或者函数
  if (
    (typeof target !== "object" && typeof target !== "function") ||
    target === null
  ) {
    return false;
  }
  // 通过原型属性，沿着原型链不断向上，直到NUll
  // target.__proto__ 或者 Object.getPrototypeOf(target)
  let proto = Object.getPrototypeOf(target);
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};

// *****使用例*****

// 或者：function Person() {  }
class Person {
  constructor(parameters) {}
}
{
  let p = new Person();
  console.log(Instanceof(p, Person)); // true
  console.log(Instanceof(p, Object)); // true
  console.log(Instanceof(p, Function)); // false
  console.log(Instanceof(Person, Function)); // true
}

//  ========== 实现new ==========
/**
 * 创建新的对象，绑定原型链，调用构造函数，返回构造函数返回值
 * @param {Function} Constructor 构造函数
 * @param  {...any} args 构造函数的参数
 * @returns
 */
function New(Constructor, ...args) {
  // 1.创建新的空对象，原型__proto__指向构造函数原型对象prototype，以便使用上面的属性
  const obj = {};
  obj.__proto__ = Constructor.prototype;
  // 2.调用构建函数，this是新对象obj，给实例的私有属性赋值
  let res = Constructor.apply(obj, args);

  // 3.判断构造函数的返回值，如果构造函数返回null或undefined，则返回新创建的对象。
  return res !== null && res instanceof Object ? res : obj;
}

// tips: 构造函数可以不用new而直接调用，通过new.target是否为undefined来判断
function Person(name) {
  if (!new.target) {
    // 以普通函数的形式被调用
    return `名叫${name}的人`;
  }
  // 通过new被调用
  this.name = name;
}
{
  console.log(Person("haha")); // 名叫haha的人
  const p = New(Person, "haha"); // Person { name: 'haha' }
  console.log(p);
}

// *****使用例*****
function Person() {}
Person.prototype.eat = () => {
  console.log("eat");
};

let p1 = New(Person);
p1.__proto__.eat();
p1.eat();

function myShallowClonea(src) {
  let obj = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      obj[prop] = src[prop];
    }
  }
  return obj;
}

//  ========== 浅拷贝 ==========
// 拷贝原对象的「第一层属性」
// hasOwnProperty：是否是自有属性，即直接在对象上定义的属性，不是通过原型链继承的属性
function myShallowClone(src) {
  const obj = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      obj[prop] = src[prop];
    }
  }
  return obj;
}

//  ========== 深拷贝 ==========

// 1. lodash：cloneDeep
const obj = _.cloneDeep(src);

// 2. jQuery.extend()
const obj1 = $.extend(true, {}, src);

// 3. JSON序列化再反序列
const obj2 = JSON.parse(JSON.stringify(src));

// 4. 循环+递归
/**
 *
 * 判断传入值的类型，分情况处理。
 * 基本类型，直接返回
 * 引用类型（对象、数组、Date、RegExp），递归地创建新实例，并复制所有可枚举属性。
 */
function deepClone(obj) {
  if (obj == null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  let o = new obj.constructor(); // 调用原对象的构造函数，创建相同类型的新对象
  for (let key in obj) {
    // 只拷贝对象自身的属性，而跳过继承的属性。(继承的属性应当通过原型链访问，而不是复制一份到实例上)
    if (Object.hasOwn(obj, key)) {
      o[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
    }
  }
  return o;
}

// 5. 【进一步】处理循环引用

/**
 * 【获取对象类型】
 * 当调用 Object.prototype.toString 时，它会返回一个 "[object Type]" 格式的字符串，
 * 其中 Type 是对象的内部 [[Class]] 属性（ES5 及之前）或由 Symbol.toStringTag 决定的类型标签（ES6+）。
 * Type 可能是：
    - 内置类型："Array", "Date", "RegExp", "Promise" "Object" 等
    - 基本类型的包装对象："Number", "String", "Boolean"
    - 特殊值："Null", "Undefined"
    - 自定义类：若类定义了 Symbol.toStringTag，则返回该标签。
 */
const getType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

function deepClone(obj, weakMap = new WeakMap()) {
  // 已经拷贝过，返回【避免循环引用无限递归】
  if (weakMap.has(obj)) return weakMap.get(obj);
  // 获取要拷贝的对象的类型
  const type = getType(obj);
  let newObj;
  switch (type) {
    case "Object":
    case "Array":
      newObj = type === "Array" ? [] : {};
      weakMap.set(obj, newObj);
      // Reflect.ownKeys：获取所有自身属性，包括可枚举、不可枚举以及 Symbol 属性
      const allKeys = Reflect.ownKeys(obj);
      for (let key of allKeys) {
        newObj[key] = deepClone(obj[key], weakMap);
      }
      return newObj;
    case "Date":
      return new Date(obj);
    case "RegExp":
      return new RegExp(obj.source, obj.flags);
    case "Set":
      newObj = new Set();
      weakMap.set(obj, newObj);
      obj.forEach((value) => {
        newObj.add(deepClone(value, weakMap));
      });
      return newObj;
    case "Map":
      newObj = new Map();
      weakMap.set(obj, newObj);
      obj.forEach((value, key) => {
        newObj.set(deepClone(key, weakMap), deepClone(value, weakMap));
      });
      return newObj;
    // 普通类型
    default:
      return obj;
  }
}

/**
 * 细节：为什么不使用Map，而是WeakMap？
在深拷贝的场景中，当你使用 Map 时，可能会导致整个拷贝的对象及其子对象都无法被垃圾回收，因为 Map 对键的引用是强引用。
而 WeakMap 是弱引用，当不再存在对原对象的引用时，对应的键值对就可以被垃圾回收，不会造成内存泄漏。

强引用（Strong Reference）
- 一个变量直接持有对象的内存地址。
- 只要强引用存在，垃圾回收器永远不会回收该对象。
- 这是 JavaScript 中最常见的引用类型（普通赋值、Map 的键/值、数组元素等都是强引用）。

弱引用（Weak Reference）
- 引用的存在不会阻止对象被垃圾回收。
- 一旦对象没有任何强引用，即使弱引用还在，对象也会被清除，并且弱引用会自动返回 undefined（或从弱容器中消失）。
- 在 JS 中，WeakMap 和 WeakSet 提供弱引用能力。
 */

deepClone([1, 2, 3]);
deepClone({ name: "1" });
console.log(getType({ name: "1" }));

// ==========  手写 Object.create ==========

/**
 * 以一个现有对象作为原型，创建一个新对象。
 * @param {*} proto 新对象的原型对象
 * @returns 以传入对象为原型的新对象
 */
function create(proto) {
  // 创建空构造函数
  var tmp = function () {};
  // 原型指向原型对象
  tmp.prototype = proto;
  // 创建实例并返回
  return new tmp();
}

/**
 * 以一个现有对象作为原型，创建一个新对象, 可传入属性。
 * @param {*} proto 新对象的原型对象
 * @param {*} propertiesObject 新对象的属性
 * @returns 以传入对象为原型的新对象
 */
function create(proto, propertiesObject) {
  // 异常: proto 既不是 null，也不是 Object
  if (
    typeof proto !== "object" &&
    typeof proto != "function" &&
    proto !== null
  ) {
    throw new TypeError("Object prototype may only be an Object or null");
  }
  // 创建空对象
  const obj = {};
  // 设置原型
  Object.setPrototypeOf(obj, proto);
  // 定义属性
  if (propertiesObject) {
    Object.defineProperties(obj, propertiesObject);
  }

  return obj;
}

// ==========  实现继承：6种 ==========

// 一、 class extends 关键字(ES6)

// ES6继承语法：
class Child extends Parent {
  constructor(name, age) {
    super(name); //构造继承，可以继承Parent构造函数上的属性
    this.age = age;
  }
}

// 具体实现：寄生组合继承

// 核心：寄生继承：继承Father的static属性、Father原型上的属性
function _extends(Child, Father) {
  // 1. 静态继承：让Child继承Father的static属性
  Child.__proto__ = Father;
  // 2. 让Child继承Father原型上的属性，即让Child实例对象的__proto__指向Father.prototype
  Child.prototype = Object.create(Father.prototype);
  // 3. 修复constructor
  Child.prototype.constructor = Child;
}

var Child = (function (_super) {
  // _super = father
  _extends(Child, _super);
  function Child(name) {
    // 核心：构造继承：继承Father的私有属性：对Child的实例 执行Father构造函数
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

// 二、 原型链继承：【子类的.prototype=new 父类()】

function Parent(name) {
  this.name = name;
}

function Child() {}
// 1. 子类的原型指向父类的实例
Child.prototype = new Parent("abc");
// 目前实例对象 Child 没有 constructor 属性,
// 会沿着原型链找到 Parent.prototype.constructor，即 Parent 函数

// 2. 添加构造函数
Child.prototype.constructor = Child;

// // 测试
// var child = new Child()
// console.log(child instanceof Parent); // true

// 三、构造继承 【通过对子类调用父类构造函数，把父对象的所有属性方法，拷贝进子对象】

function Child(name) {
  Parent.call(this, name);
}

// 四、组合继承（原型链继承 + 构造继承）

function Child(name) {
  Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 五、拷贝继承

function Child(name) {
  let parent = new Parent(name);
  for (let key in parent) {
    Child.prototype[key] = parent[key];
  }
}

// 六、寄生继承 Object.create

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 七、寄生组合继承（构造继承 + 寄生继承）

function Child(name) {
  // 1. 调用父类构造函数
  Parent.call(this, name);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

//  ========== 判断对象是否相同 ==========

// 相同：地址引用相同 or 只是字段相同
// 1. 地址引用相同( === 或 Object.is(obj1, obj2))
// 特殊情况：±0： Object.is(+0, -0) 返回 false ，而 === 运算符返回 true 。
{
  const obj1 = { a: 1 };
  const obj2 = { a: 1 };
  const obj3 = obj1;

  console.log(obj1 === obj2); // false 虽然内容一样，但地址不同
  console.log(obj1 === obj3); // true
}
// 2. 只是字段相同
// 2.1 浅层相同：用Object.keys拿到属性，依次比较
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 != "object" ||
    obj1 == null ||
    typeof obj2 != "object" ||
    obj2 == null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}
// 2.2 深层相同（递归）
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 != "object" ||
    obj1 == null ||
    typeof obj2 != "object" ||
    obj2 == null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}
// 3. JSON.stringify，适用于对象中只包含简单类型（数字、字符串、布尔值和 null）以及其他对象或数组
// 问题：必须字段顺序相同，且Date会被直接转化为字符串；NaN变为null；undefined、function、symbol会直接忽略
JSON.stringify(obj1) === JSON.stringify(obj2);
// 问题1：无法区分 Date 对象和内容相同的 String
{
  const obj1 = { time: new Date("2026-01-01") };
  const obj2 = { time: "2026-01-01T00:00:00.000Z" };
  console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // true，不符合逻辑
}
// 问题2：无法区分 NaN 和真正的 null
{
  const obj1 = { score: NaN };
  const obj2 = { score: null };
  console.log(JSON.stringify(obj1)); // '{"score":null}'
  console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // true，不符合逻辑
}
// 问题3：undefined、Function、symbol被忽略，RegExp一律变为{}空对象
{
  let x = Symbol(1);
  let r1 = new RegExp();
  let pattern = "world";
  let r2 = new RegExp(pattern, "g");
  const dataA = {
    val: NaN,
    date: new Date("2026-04-30"),
    secret: undefined, // undefined 在 JSON 中会被直接剔除
    sym: x,
    func: function (param) {},
    reg: r1,
  };
  const dataB = {
    val: null,
    date: "2026-04-30T00:00:00.000Z",
    // secret、sym、func 缺失
    reg: r2,
  };

  console.log(JSON.stringify(dataA) === JSON.stringify(dataB)); // true，不符合逻辑
}

// 4. Lodash.isEqual()

//  ========== 数组/对象拍平 ==========

/**
 * flat会返回一个新数组
 * 1. 不传参数时，默认拍平一层
 * 2. 传入一个整数参数，整数即“拉平”的层数
 * 3. Infinity 作为参数时，全部拍平
 * 4. 传入 <=0 的整数，直接返回原数组，不拍平
 * 5. 如果原数组有空位，flat()方法会跳过空位
 */
function flat(arr, depth = 1) {
  const res = [];
  (function flat_helper(arr, depth) {
    // forEach 遍历数组会自动跳过空元素
    arr.forEach((item) => {
      if (Array.isArray(item) && depth > 0) {
        flat_helper(item, depth - 1);
      } else {
        res.push(item);
      }
    });
  })(arr, depth);
  return res;
}
{
  const arr = [1, [2, 3], [4, [5, [6]], 7]];
  console.log(arr);
  console.log(flat(arr, 0));
  console.log(flat(arr));
  console.log(flat(arr, 2));
  console.log(flat(arr, 3)); // [1, 2, 3, 4, 5, 6, 7]
  console.log(flat(arr, Infinity)); // [1, 2, 3, 4, 5, 6, 7]
}

// reduce实现：
const flat = (arr, deep = 1) => {
  if (deep <= 0) return arr;
  return arr.reduce(
    (res, curr) =>
      // concat() ：合并两个或多个数组。此方法返回一个新数组。
      res.concat(Array.isArray(curr) ? flat(curr, deep - 1) : curr),
    [],
  );
};

//  ========== 数组/对象数组去重 ==========

// 普通数组：forEach + includes
// includes可以去重NaN，而indexOf无法识别NaN
// 但includes无法去掉 {} 空对象
function unique(arr) {
  const res = [];
  arr.forEach((item) => {
    if (!res.includes(item)) res.push(item);
  });
  return res;
}

// 普通数组：Set O(N)
function unique(arr) {
  // Set可以去重NaN, 无法去掉 {} 空对象
  return [...new Set(arr)];
}

// hasOwnProperty：用”数据类型+数据“作为对象属性，维护属性不重复
// 对普通数组中所有数据类型的去重效果都比较好
function unique(arr) {
  let obj = {};
  return arr.filter(function (item, index, arr) {
    return obj.hasOwnProperty(typeof item + item)
      ? false
      : (obj[typeof item + item] = true);
  });
}

// 对象数组：对单个属性key去重
// 哈希：map数据结构去重 + filter过滤
function unique(arr, key) {
  const map = new Map();
  return arr.filter((item) => {
    const val = item[key];
    if (!map.has(val)) {
      map.set(val, true);
      return true;
    }
    return false;
  });
}

// 对象数组：全属性去重，需要每个字段都对应（包括位置）才算重复
// JSON.stringify转换为字符串 + 哈希 + filter
function unique(arr) {
  const strs = new Set();
  return arr.filter((item) => {
    const str = JSON.stringify(item);
    return strs.has(str) ? false : strs.add(str);
  });
}

//  ========== 实现call bind apply ==========

// 思路：谁调用的，this就是谁，那么只需让obj调用这个方法
Function.prototype.call = function (obj, ...args) {
  // 1. 在目标执行对象上添加方法
  const context = obj === null || obj === undefined ? window : Object(obj);
  const fn = Symbol();
  context[fn] = this;
  // 2. 执行方法
  const result = context[fn](...args);
  delete context[fn];
  // 3. 返回结果
  return result;
};

// 判断是否为类数组对象
function isArrayLike(o) {
  if (
    o && // o 不是null、undefined等
    typeof o === "object" && // o是对象
    o !== window && // 排除 window 对象
    isFinite(o.length) && // o.length是有限数值
    o.length >= 0 && // o.length为非负值
    o.length === Math.floor(o.length) && // o.length是整数
    o.length < Number.MAX_SAFE_INTEGER
  ) {
    return true;
  }
  return false;
}

Function.prototype.apply = function (obj, args) {
  const context = obj === null || obj === undefined ? window : Object(obj);
  if (!Array.isArray(args) && !isArrayLike(args)) {
    throw new Error("error"); // 第二个参数不为数组且不为类对象数组
  }
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

/**
 * 返回一个新函数，函数内的this指向thisArg，可以作为构造函数使用
 */
Function.prototype.myBind = function (thisArg, ...outerArgs) {
  const fn = this;
  if (typeof fn !== "function") {
    throw new TypeError("Bind must be called on a function");
  }
  const fnbind = function (...args) {
    // 如果是通过 new 调用的，this 会指向实例对象（符合 new 绑定规则）
    // 此时我们应该使用实例作为 this，而不是最初传进来的 thisArg
    const isNew = this instanceof fnbind;
    return fn.call(isNew ? this : thisArg, ...outerArgs, ...args);
  };
  // 保证 fnbind 构造出来的实例能够访问原函数的 prototype 上的属性
  if (fn.prototype) fnbind.prototype = Object.create(fn.prototype);
  return fnbind;
};

// **测试**

{
  const obj1 = { x: 1 };

  function test() {
    console.log(this.x); // 1
  }

  const bindFn = test.myBind(obj1);

  bindFn();

  function Person(name, age) {
    this.name = name;
    this.age = age;
  }

  const BindPerson = Person.myBind(null, "Mandrax");

  BindPerson(20);

  const obj = new BindPerson(20);
  console.log(obj.name); // "Mandrax"
  console.log(obj.age); // 20
}

// ==========  实现reduce ==========

Array.prototype.reduce = function (fn, prev) {
  // this是数组
  for (let i = 0; i < this.length; i++) {
    if (typeof prev === "undefined") {
      prev = fn(this[i], this[i + 1], i + 1, this);
      i++;
    } else {
      prev = fn(prev, this[i], i, this);
    }
    return prev;
  }
};

// 使用例
let res = [1, 2, 3, 4, 5].reduce((prev, next, curIndex, arr) => {
  if (curIndex == arr.length - 1) return (prev + next) / arr.length;
  return prev + next;
});
console.log(res); // 3

//  ========== 实现forEach ==========

Array.prototype.forEach = function (fn) {
  for (let i = 0; i < this.length; i++) {
    fn(this[i], i);
  }
};

[1, 2, 3].forEach((item, idx) => {
  console.log(item, idx);
});

//  ========== 实现map ==========
Array.prototype.map = function (fn, thisArg) {
  // 类型检查
  if (this == null) {
    throw new TypeError("this is null or not defined");
  }
  if (typeof fn !== "function") {
    throw new TypeError(`${fn} should be a function`);
  }
  // 将 this 转换为对象
  const obj = Object(this);
  const len = obj.length >>> 0; // 将 length 转换为无符号 32 位整数
  const res = new Array(len);
  for (let i = 0; i < len; i++) {
    // 检查索引是否存在（处理稀疏数组），跳过空槽
    if (i in obj) {
      // 传入当前值、索引、原对象
      res[i] = fn.call(thisArg, obj[i], i, obj);
    }
  }
  return res;
};

// --- 测试代码 ---
// 注意，如果用户传给 map 的是一个箭头函数，那么 它会捕获定义时所在上下文的 this，thisArg 会被忽略
const arr = [1, 2, 3, , 5]; // 稀疏数组
const doubled = arr.map(function (item) {
  return item * 2;
});
console.log(doubled); // [2, 4, 6, <1 empty item>, 10]

//  ========== 实现filter ==========
Array.prototype.filter = function (fn) {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (fn(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
};

let arr1 = [1, 2, 3];
console.log(
  arr1.filter((item) => {
    return item > 2;
  }),
);

//  ========== 手写isType ==========
function isType(type) {
  // Object.prototype.toString 是所有对象继承的原始方法
  // 未被重写时会读取值的内部属性 [[Class]]
  // 返回形如 "[object Type]" 的字符串。
  // 截取第8个字符到倒数第1个字符，即为Type
  return function (target) {
    return Object.prototype.toString.call(target).slice(8, -1) === type;
  };
}

let isString = isType("String");
console.log(isString("abc"));

//  ========== 手写iterator/for of ==========

arr[Symbol.iterator] = function () {
  let self = this,
    index = 0;
  return {
    next() {
      if (index > self.length - 1) {
        return {
          value: self[index++],
          done: true,
        };
      }
      return {
        value: self[index++],
        done: false,
      };
    },
  };
};

let obj3 = {
  name: "abc",
  age: 11,
};

obj3[Symbol.iterator] = function () {
  let self = this,
    keys = Reflect.ownKeys(self),
    index = 0; // 返回一个由self对象自身的属性键组成的数组
  return {
    next() {
      if (index >= keys.length) {
        return {
          value: undefined,
          done: true,
        };
      }
      return {
        value: self[keys[index++]],
        done: false,
      };
    },
  };
};
for (let value of obj3) {
  console.log(value);
}

//  ========== 洗牌算法 ==========
// 倒叙遍历数组，每次将当前元素i与[0,i]的任一元素交换位置
function shuffle(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
const cards = [1, 2, 3, 4, 5];
console.log(shuffle(cards));

//  ========== URL解析 ==========

// URL构造器使用举例
const baseUrl = "https://api.example.com";
const userId = 12345;
const url = new URL(`/users/${userId}`, baseUrl);
console.log(url.href); // "https://api.example.com/users/12345"
url.searchParams.append("name", "张三"); // 添加参数
url.searchParams.append("age", 11);
console.log(url.href); // https://api.example.com/users/12345?name=%E5%BC%A0%E4%B8%89&age=11
{
  const baseUrl = "https://api.example.com";
  const url = new URL(baseUrl);
  const arrayParam = ["value1", "value2", "value3"];
  url.searchParams.set("name", arrayParam.join(",")); // 设置参数
  console.log(url.href); // https://api.example.com/?name=value1%2Cvalue2%2Cvalue3

  const params = url.searchParams.get("name"); // 查找参数
  const decodeParams = params ? params.split(",") : [];
  console.log(decodeParams);
}

/**
 *  解析查询参数,并返回一个对象
 * @param {string} urlStr 需要解析的URL
 * @returns {Object} 包含查询参数的对象
 */
function getURLParams(urlStr) {
  const url = new URL(urlStr);
  // 获取查询参数键值对
  const params = new URLSearchParams(url.search); // url.search：？及后面的字符串
  const res = {};
  for (const [key, value] of params) {
    if (Object.prototype.hasOwnProperty.call(res, key)) {
      // 已有该键，追加
      res[key] = [].concat(res[key], value);
    } else {
      res[key] = value;
    }
  }
  return res;
}

console.log(
  getURLParams(
    "http://www.baidu.com?name=%E5%90%8D%E5%AD%97&age=20&hobby=看书&hobby=画画&sex=undefined#hash",
  ),
);

/**
 * 设置URL的查询参数，支持对象和数组
 * 思路：URLSearchParams新建查询参数对象，用append添加参数。如果参数是数组，就依次遍历添加，否则直接添加。
 *      忽略所有的 undefined 和 NaN
 * @param {string} urlStr - 基础URL字符串
 * @param {Object} params - 需要设置的查询参数对象
 * @returns {string} - 带有查询参数的URL字符串
 */
function setURLParams(urlStr, params) {
  const url = new URL(urlStr);
  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== undefined && !Number.isNaN(val)) {
            searchParams.append(key, val);
          } else {
            console.warn(
              `Warning: The value of "${key}" is ${val}, which is invalid and will be ignored.`,
            );
          }
        });
      } else if (value !== undefined && !Number.isNaN(value)) {
        searchParams.append(key, value);
      } else {
        console.warn(
          `Warning: The value of "${key}" is ${value}, which is invalid and will be ignored.`,
        );
      }
    }
  }
  url.search = searchParams.toString();
  return url.href;
}

const params = {
  p1: "value1",
  p2: ["value2", "value3"],
  p3: undefined,
  p4: NaN,
  p5: "value5",
  p6: 0,
  p7: null,
};

const newUrl = setURLParams("https://example.com", params);
console.log(newUrl); // https://example.com/?p1=value1&p2=value2&p2=value3&p5=value5&p6=0&p7=null

// 【不使用URL api】 解析查询参数,并返回一个对象
const getURLParams = (url) => {
  const res = {};
  // 提取 ? 到 # 之间的部分
  // decodeURIComponent：解码
  let query = decodeURIComponent(url).split("?")[1];
  if (!query) return;
  query = query.split("#")[0];
  query = query.split("&");

  for (const str of query) {
    if (!str) return;
    let [key, value = ""] = str.split("=");
    if (Object.prototype.hasOwnProperty.call(res, key)) {
      // 已有该键，追加
      res[key] = [].concat(res[key], value);
    } else {
      res[key] = value;
    }
  }
  return res;
};
{
  const url =
    "http://www.baidu.com?name=%E5%90%8D%E5%AD%97&age=20&hobby=看书&hobby=画画&sex=undefined#hash";
  console.log(getURLParams(url));
}

//  ========== 手写函数柯里化 ==========

/**
 * 柯里化
 * 将接收多个参数的函数转化为接收单个参数的函数
 * 应用场景：参数复用、延迟执行
 * @param {Function} fn 要柯里化的函数
 */
function curry(fn) {
  let argLen = fn.length; // 获取原函数期望的参数个数
  return function curried(...args) {
    if (args.length >= argLen) {
      // 参数足够了，直接调用原函数
      return fn.apply(this, args);
    } else {
      // 参数还不够，返回一个新函数继续收集参数
      return function (...nextArgs) {
        // 将已收集 args 和新传入 nextArgs 合并，递归调用 curried
        return curried.apply(this, [...args, ...nextArgs]);
      };
    }
  };
}

function add(x, y, z) {
  return x + y + z;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2, 3));

// 反柯里化
/**
 * 将柯里化函数转换为接受多个参数的普通函数 / 让一个只能被特定对象调用的方法，变成一个可以接受任何对象作为第一个参数的通用函数
 * 应用场景：泛型编程
 * @param {Function} fn
 */
function uncurry(fn) {
  return function (context, ...args) {
    return fn.call(context, ...args);
  };
}
{
  const push = uncurry(Array.prototype.push);
  const obj = { length: 0 };
  push(obj, 1, 2, 3);
  console.log(obj); // { '0': 1, '1': 2, '2': 3, length: 3 }
}

//  ========== compose+pipe ==========

// compose：从右往左，用reduceRight
// pipe：从左往右，用reduceRight
// 应用场景：1. 数据处理管道：当数据需要经过一系列的转换步骤时，将多个小而纯粹的函数，组合成一个完整的处理流程
//          2. 中间件组合：例如Redux库（react）

/**
 * 返回一个新函数，从右往左执行一系列函数
 * @param  {...any} args 函数们
 */
function compose(...args) {
  return function (x) {
    // 从右到左执行args中的函数，并将返回值作为下一个函数的参数
    return args.reduceRight((res, fn) => fn(res), x);
  };
}
{
  const f1 = (x) => x + "1";
  const f2 = (x) => x + "2";
  const f3 = (x) => x + "3";
  let res = compose(f1, f2, f3)("0");
  console.log(res); // 0321
}

/**
 * 返回一个新函数，从左往右执行一系列函数
 * @param  {...any} args 函数们
 * @returns
 */
function pipe(...args) {
  return function (x) {
    return args.reduce((res, fn) => fn(res), x);
  };
}
{
  const f1 = (x) => x + "1";
  const f2 = (x) => x + "2";
  const f3 = (x) => x + "3";
  let res = pipe(f1, f2, f3)("0");
  console.log(res); // 0123
}

//  ========== 手写Promise：单独文件 ==========

//  ==================== 异步调度器  ====================

//  ========== 实现一个AsyncScheduler类，它可以添加异步任务并按顺序执行(即并发数 = 1 的任务调度器) ==========
class AsyncSchedule {
  constructor() {
    this.queue = [];
    this.running = false;
  }
  add(cb) {
    this.queue.push(cb);
    this.run();
  }
  async run() {
    if (this.running || !this.queue.length) return;
    this.running = true;
    while (this.queue.length) {
      try {
        await this.queue.shift()();
      } catch (error) {
        console.log(error);
      }
    }
    this.running = false;
  }
}
//  ========== 可以指定并发数的异步任务调度器) ==========
/**
 * 需要有一个数组 queue，模拟队列（先进先出），依次进行异步请求处理。
    add 方法用来添加异步请求；根据当前正在 running 的个数，判断添加异步请求是执行 run 还是将其放入到队列中。
    run 方法真正执行异步请求
 */

class AsyncSchedule {
  constructor(max) {
    this.running = 0;
    this.max = max;
    this.queue = [];
  }
  add(cb) {
    this.queue.push(cb);
    this.run();
  }

  async run() {
    if (this.running >= this.max || this.queue.length <= 0) return;
    this.running++;
    try {
      await this.queue.shift()();
    } catch (error) {
      console.log(error);
    }
    this.running--;
    this.run()
  }
}

// 添加start


// 变式：多一个 start 函数控制什么时候开始触发请求

class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.limit = limit;
    this.running = 0;
    this.started = false;
  }
  add(fn) {
    return new Promise((resolve) => {
      fn.resolve = resolve;
      if (this.started) {
        run(fn);
      } else {
        this.queue.push(fn);
      }
    });
  }
  start() {
    if (this.started) return;
    this.started = true;
    for (let i = 0; i < this.limit; i++) {
      this.run(this.queue.shift());
    }
  }
  async run(fn) {
    if (fn && typeof fn === "function") {
      this.running++;
      await fn();
      fn.resolve();
      this.running--;
      fn = this.queue.shift();
      this.run(fn);
    }
  }
}

{
  const timeout = (time) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    });

  const scheduler = new Scheduler(2);
  const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order));
  };
  addTask(1000, "1");
  addTask(500, "2");
  addTask(300, "3");
  addTask(400, "4");
  console.log("start");
  scheduler.start();
}
//  ========== 手写控制并发 简易版==========

// 场景：有 100 条数据，我们的带宽为10，要求跑满带宽
/**
 * 思路：使用数组管理待处理任务的参数，通过一个计数器（或当前活跃任务数）限制同时执行的任务数量
 * @param {() => Promise<any>} fn 任务，一个返回Promise的函数
 * @param {*} arr 参数列表
 * @param {*} limit 最大并发数
 */
function asyncPool(fn, arr, limit) {
  let args = [...arr];
  let running = 0;
  let resIdx = 0;
  let resCnt = 0;
  let res = [];
  return new Promise((resolve) => {
    (function run() {
      while (running < limit && args.length > 0) {
        running++;
        let i = resIdx++;
        let arg = args.shift();
        fn(arg)
          .then((value) => (res[i] = value))
          .catch((reason) => {
            reject(reason);
          })
          .finally(() => {
            running--;
            resCnt++;
            if (resCnt === arr.length) {
              resolve(res);
            } else {
              run();
            }
          });
      }
    })();
  });
}

function getWeather(city) {
  console.log(`开始获取${city}的天气`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(city);
    }, 1000);
  }).then((v) => v);
}

let citys = [
  "北京",
  "上海",
  "杭州",
  "成都",
  "武汉",
  "天津",
  "深圳",
  "广州",
  "合肥",
  "郑州",
];
asyncPool(getWeather, citys, 3).then((results) => console.log(results));

//  ========== 控制并发：手写p-limit ==========

/**
 * 返回一个函数，用于控制并发
 * @param {*} limit 最大并发数
 * @returns
 */
const pLimit = (limit) => {
  const queue = [];
  let running = 0;

  const generator = (fn, ...args) =>
    new Promise((resolve, reject) => {
      enqueue(fn, resolve, ...args);
    });

  const enqueue = (fn, resolve, ...args) => {
    // 用 bind 封装成一个待执行的函数
    queue.push(run.bind(null, fn, resolve, ...args));
    if (running < limit && queue.length > 0) {
      // 执行一个任务
      queue.shift()();
    }
  };
  const run = async (fn, resolve, ...args) => {
    running++;
    // 用户传进来的 fn 可能是普通函数，也可能是异步函数。使用 async 包装来确保 result 是 Promise
    const result = (async () => fn(...args))();
    resolve(result);
    // 容错处理
    try {
      await result;
    } catch {}
    next();
  };
  const next = () => {
    running--;
    if (queue.length > 0) {
      queue.shift()();
    }
  };
  return generator;
};

// 测试

const limit = pLimit(2);

function asyncFun(value, delay) {
  return new Promise((resolve) => {
    console.log("start " + value);
    setTimeout(() => resolve(value), delay);
  });
}

(async function () {
  const arr = [
    limit(() => asyncFun("aaa", 2000)),
    limit(() => asyncFun("bbb", 3000)),
    limit(() => asyncFun("ccc", 1000)),
    limit(() => asyncFun("ccc", 1000)),
    limit(() => asyncFun("ccc", 1000)),
  ];

  const result = await Promise.all(arr);
  console.log(result);
})();

//  ========== 手写红绿灯实现 ==========

/**
 * 某个路口的红绿灯，会按照红灯亮5s，黄灯亮2s，绿灯亮3s这样的顺序无限循环。要求：每一秒打印当前在亮的灯。
 * 解法：setInterval+setTimeout+async await
 */

// 法一 用setInterval每秒打印当前亮的灯，用setTimeout来切换灯的颜色，切换颜色时关闭setInterval并开启一个新的setInterval
let timer = null;
(function main() {
  console.log("红灯");
  clearInterval(timer);
  timer = setInterval(() => {
    console.log("红灯");
  }, 1000);
  // 5秒后开始打印黄灯
  setTimeout(() => {
    console.log("黄灯");
    clearInterval(timer);
    timer = setInterval(() => {
      console.log("黄灯");
    }, 1000);
    // 2秒后开始打印绿灯
    setTimeout(() => {
      console.log("绿灯");
      clearInterval(timer);
      timer = setInterval(() => {
        console.log("绿灯");
      }, 1000);
      // 3秒后开始打印红灯（递归）
      setTimeout(() => {
        clearInterval(timer);
        fn();
      }, 3000);
    }, 2000);
  }, 5000);
})();

// 法二：promise
timer = null;
/**
 * 开启一个interval timer打印content，返回一个在timeout秒后置为成功的promise
 * @param {*} timeout
 * @param {*} content
 * @returns
 */
function sleep(timeout, content) {
  return new Promise((resolve, reject) => {
    clearInterval(timer);
    console.log(content);
    timer = setInterval(() => {
      console.log(content);
    }, 1000);
    setTimeout(resolve, timeout);
  });
}
function main() {
  // 5秒后开始打印黄灯
  sleep(5000, "红灯")
    .then(() => {
      // 2秒后开始打印绿灯
      return sleep(2000, "黄灯");
    })
    .then(() => {
      // 3秒后开始打印红灯
      return sleep(3000, "绿灯");
    })
    .then(() => main())
    .catch((e) => console.log(e));
}
main();

// 法三：【优解】async await

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function light(content, duration) {
  console.log(content);
  const timer = setInterval(() => {
    console.log(content);
  }, 1000);
  await delay(duration);
  clearInterval(timer);
}

async function main(params) {
  while (1) {
    await light("红灯", 5000);
    await light("黄灯", 2000);
    await light("绿灯", 3000);
  }
}

main();

//  ========== 手写sleep ==========

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

await sleep(1000);

//  ========== 手写LRU ==========

/**
 * @param {number} capacity
 */
class Node {
  constructor(key = undefined, val = undefined, prev = null, next = null) {
    this.key = key;
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}
/**
 * 维护双向链表（队伍），访问节点/插入节点时把它放到队伍最前面，每次队伍满时淘汰队尾节点
 */
class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.cur_cap = 0;
    this.head = new Node();
    this.head.next = this.head;
    this.head.prev = this.head;
    this.map = new Map();
  }
  get(key) {
    if (this.map.get(key)) {
      let x = this.map.get(key);
      this.move_to_head(this.head, x);
      return x.val;
    } else {
      return -1;
    }
  }
  put(key, keyue) {
    let x = this.map.get(key);
    if (x) {
      x.val = keyue;
      this.move_to_head(this.head, x);
    } else {
      if (this.cur_cap >= this.cap) {
        this.map.delete(this.head.prev.key);
        this.remove(this.head.prev);
        this.cur_cap--;
      }
      this.cur_cap++;
      let x = new Node(key, keyue);
      this.map.set(key, x);
      this.insert(this.head, x);
    }
  }
  // 在node后插入x
  insert(node, x) {
    x.next = node.next;
    x.prev = node;
    node.next.prev = x;
    node.next = x;
  }
  // 删除一个节点（抽出一本书）
  remove(x) {
    x.next.prev = x.prev;
    x.prev.next = x.next;
  }
  // 在链表头添加一个节点（把一本书放到最上面）
  move_to_head(head, x) {
    this.remove(x);
    this.insert(head, x);
  }
}

//  ========== 手写vue3响应式原理 ==========

//  ===== 手写reactive =====

// 最外层的WeakMap，键是要监测的对象，值为响应式的 Map
const reactiveMap = new WeakMap();

// 注册一个副作用函数fn，并且立即执行它

// 用全局变量，告诉track当前激活的副作用函数是谁，便于收集
let activeEffect = null;
const effectStack = []; // 支持嵌套effect

function effect(fn) {
  const effectFn = () => {
    cleanUp(effectFn); // 清空旧依赖。目的：实现动态依赖追踪，避免残留的旧依赖造成冗余执行和内存泄漏。
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn(); // 重新执行原始函数，触发 get → track，重新收集依赖
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1]; // 设为当前激活的副作用
  };
  effectFn.deps = []; // 记录这个 effect 函数被放到了哪些 deps 集合里
  effectFn();
}

function cleanUp(effectFn) {
  // effectFn.deps 数组记录了被添加到的 deps 集合，从中删掉自己。
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// 收集依赖
function track(target, key) {
  let depsMap = reactiveMap.get(target);
  if (!depsMap) {
    reactiveMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 添加依赖
  deps.add(activeEffect);
  activeEffect.deps.push(deps); // 记录这个 effect 函数被放到了哪些 deps 集合里
}

// 触发更新
function trigger(target, key) {
  let depsMap = reactiveMap.get(target);
  if (!depsMap) return;
  let effects = depsMap.get(key);
  //   effects && effects.forEach((effect) => effect());
  const effectsTmp = new Set(effects);
  effectsTmp.forEach((effect) => effect());
}

function reactive(data) {
  return new Proxy(data, {
    get(target, key) {
      // 收集依赖
      track(target, key);
      return target[key];
    },
    set(target, key, newVal) {
      target[key] = newVal;
      // 触发更新
      trigger(target, key);
    },
  });
}

const obj3 = reactive({ a: 1, b: 2 });
obj3.a = 2;

//  ===== 手写ref =====

class RefImpl {
  constructor(value) {
    this._value = value;
    // 简单模拟追踪依赖（实际需调用track）
    this.dep = new Set();
  }

  get value() {
    // 收集依赖
    return this._value;
  }

  set value(newValue) {
    if (newValue !== this._value) {
      this._value = newValue;
      // 触发更新
      console.log("视图更新:", newValue);
    }
  }
}

function ref(value) {
  return new RefImpl(value);
}

/**
 * 【小于 K 的两数之和】解法与两数之和基本一模一样
给你一个整数数组 `A` 和一个整数 `K`，
请在该数组中找出两个元素，使它们的和小于 `K` 但尽可能地接近 `K`， 
返回这两个元素的和。
 */

function fn(arr, k) {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  let p1 = 0,
    p2 = n - 1;
  let ans = -Infinity;
  while (p1 < p2) {
    if (arr[p1] + arr[p2] >= k) {
      p2--;
    } else {
      ans = Math.max(ans, arr[p1] + arr[p2]);
      p1++;
    }
  }
  return ans === -Infinity ? -1 : ans;
}

console.log(fn([1, 3, 4, 5], 0));

//  ========== setTimeOut 实现 setInterval ==========
// setTimeout 允许我们将函数推迟到一段时间间隔之后再执行。
// setInterval 允许我们重复运行一个函数，从一段时间间隔之后开始运行，
//              之后以该时间间隔连续重复运行该函数。注意，时间间隔不会受函数执行时间影响
// setInterval 常见应用场景:倒计时、轮播图自动切换、实时数据轮询更新以及简单动画。

/**
 * 【为什么要用setTimeOut 实现 setInterval】：
 *      setInterval 不关心任务是否执行完成，只负责持续把任务加入队列；
 *      而递归 setTimeout 可以保证“当前任务结束后再开启下一轮”。
 */

/**
 * 链式递归：setTimeout 在其回调函数内再次调用自身，创建了一个链式调用，保证任务串行执行。
 * 避免积压：setInterval 无论前一次任务是否完成都会向任务队列添加新任务，
 *          而此方法只有在前一个回调执行完毕后才会设置下一个 setTimeout，防止大量未完成任务堆积。
 * 清除机制：利用闭包存储当前的 timerId，通过 clearTimeout 停止链式调用。
 */
const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
function setinterval(task, delay) {
  let timer = null;
  let cancel = false;
  // 本次task执行完成后，再等待delay秒执行下一次
  (function loop() {
    if (cancel) return;
    timer = setTimeout(async () => {
      await task();
      if (!cancel) {
        loop();
      }
    }, delay);
  })();
  return {
    clear: () => {
      cancel = true;
      clearTimeout(timer);
    },
  };
}
const task = async () => {
  await sleep(500);
  console.log("a");
};
let a = setinterval(task, 500);

setTimeout(() => {
  a.clear();
}, 5000);

// setInterval(() => {
//   task();
// }, 500);
