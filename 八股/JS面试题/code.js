// 实现 instanceof
const myInstanceof = (target, origin) => {
  if (typeof origin !== "function") {
    throw new TypeError("Right-hand side of 'instanceof' should be a function");
  }
  if (
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

function myNew(Func, ...args) {
  // 创建新的对象，新对象原型指向构造函数原型对象
  const obj = {};
  obj.__proto__ = Func.prototype;
  // 将构建函数的this指向新对象
  let res = Func.apply(obj, args);
  return res !== null && res instanceof Object ? res : obj;
}

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

// 深拷贝：4种

// 1. cloneDeep
const obj = _.cloneDeep(src);

// 2. jQuery.extend()
const obj1 = $.extend(true, {}, src);

// 3. JSON序列化再反序列
const obj2 = JSON.parse(JSON.stringify(src));

// 4. 循环+递归
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
