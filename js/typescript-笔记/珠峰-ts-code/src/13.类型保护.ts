// 类型保护  基于js + ts （收窄）
// ts很多情况下 需要使用联合类型, 默认情况下只能使用公共的方法，识别类型 （针对某个类型进行处理）

// typeof(基础类型)  instanceof(类类型)  in(接口类型，可辨识类型)

function fn(a: string | number) {
  if (typeof a === "string") {
    a; // string
  } else {
    a; // number
  }
}
class Cat {
  cry() {}
}
class Dog {
  eat() {}
}
function getInstance(clazz: { new (...args: any[]): Cat | Dog }) {
  return new clazz();
}
const instance = getInstance(Cat);
if (instance instanceof Cat) {
  instance.cry;
} else {
  instance.eat;
}

// 可辨识类型  通过in来实现
/*
interface Bird {
  kind: "鸟";
  fly: string;
}
interface Fish {
  kind: "鱼";
  swim: string;
}

function getAimal(val: Bird | Fish) {
  // 基于差异化来辨别
  if ("fly" in val) {
    val;
  } else {
    val;
  }
  if (val.kind == "鸟") {
    val.fly;
  } else {
    val.swim;
  }
}*/
// 通过各种判断来缩小范围  生命周期 []
function ensureArray<T>(input: T | T[]) {
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
}
let r1 = ensureArray("abc");
let r2 = ensureArray(["abc"]);

// 函数的嵌套不识别的问题  ? ! if 都有缩小范围的用途 (基于上下文类型的推导，会因为作用域的变化 而产生问题)
// ! 一定存在的意思   ?取值

function addType(val?: number) {
  // 断言就是自己说的算，出错了自己承担
  val = val || 0;
  return function (type: string) {
    return type + (val as number).toFixed(); // ts 无法识别的时候 需要用断言
  };
}
addType(100)("$");

// is 语法 ts语法  主要在辅助的方法中用的比较多

interface Bird {
  kind: "鸟";
  fly: string;
}
interface Fish {
  kind: "鱼";
  swim: string;
}
function isBird(val: Bird | Fish): val is Bird {
  // ts的返回值类型
  // 函数的名字 和返回值是无关的
  // true是bird 还是false 是bird
  return "fly" in val;
}
function getAimal(val: Bird | Fish) {
  // 基于差异化来辨别
  if (isBird(val)) {
    val;
  } else {
    val;
  }
}

// 收缩范围

export {};
