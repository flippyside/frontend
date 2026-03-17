// 类型兼容性

// ts兼容性分成两种 子 extends 父   结构来考虑

let str: string = "abc"; // 类型层级
let obj!: { toString(): string };

obj = str; // 结构来考虑   extends object   extends {}

// 安全性 ts 主要考虑的就是安全， 安全就可以进行复制
// obj.toString

// 函数兼容性  （参数和返回值的兼容性）

let sum1 = (a: number, b: number): string | number => a + b;
let sum2 = (a: number): number => a;

type Sum1 = typeof sum1;
type Sum2 = typeof sum2;

type X = Sum2 extends Sum1 ? true : false;

// 对于函数而言他的兼容性， 少的可以赋予给多的， 参数少的是子类型
// 返回值要求安全, 返回值要求是子类型.
const forEach = <T>(
  arr: T[],
  callback: (val: T, key: number) => string | number
) => {
  for (let i = 0; i < arr.length; i++) {
    let r = callback(arr[i], i); // 调用函数的时候 会传递多个参数
  }
};
forEach(["A", 2, 3, {}], function (val) {
  return "abc";
});

// 类的兼容性 也是一样  比较的是实例
// class A {
//   private a = 1;
// }
// class B {
//   private a = 1;
// }
// const b: B = new A(); // 如果类中的属性 有private 或者protected则两个值不能互相复制

// ts 这种叫结构化类型，标称类型

// 希望给基本类型做区分，达到差异化的目的

type withType<T, K> = T & [K];
type BTC = withType<number, "BTC">;
type USDT = withType<number, "USDT">; // 基于内置类型来做构建

const c1 = 100 as BTC;
const c2 = 100 as USDT;
function money(val: BTC) {}
money(c1);

// 逆变（在函数参数可以标记儿子传父亲）和协变（可以标记父亲返回儿子）

class Parent {
  car() {}
}
class Child extends Parent {
  house() {}
}
class Grandson extends Child {
  sleep() {}
}
// 安全性考虑
// 1) 内部调用函数的时候 可以传递 Child 和 Grandson. 但是在使用属性时 只能认为最多就是child
// 2) 函数的返回值, 需要返回子类，因为内部代码在访问属性的时候要保证可以访问到
function fn(callback: (ctr: Child) => Child) {
  // 我交给回调的有房、有车
  let r = callback(new Child());
  r.house;
}
fn((child: Parent): Grandson => {
  return new Grandson();
});

type Arg<T> = (arg: T) => void;
type Return<T> = (arg: any) => T;
type ArgReturn = Arg<Parent> extends Arg<Child> ? true : false; // 基于函数参数的逆变
type ReturnReturn = Return<Grandson> extends Return<Child> ? true : false; // 返回值是协变的

// 逆变带来的问题（我们写业务的时候 还是要正常开启逆变）
interface MyArray<T> {
  //   concat: (...args: T[]) => T[];
  concat(...args: T[]): T[]; // 这种写法不进行逆变检测，所有在描述对象中的方法时全部采用这种方式
}
// parent: (...args: Parent[]) => Parent[];
// child:  (...args: Child[]) => Child[];
// 将child 赋予给parent   传父返儿子
let parentArr!: MyArray<Parent>;
let childArr!: MyArray<Child>;

// chilldArr 能不能赋予给 parentArr

// [{car(){}}] = [{car(){},house(){}}]

parentArr = childArr;
// childArr = parentArr;

// 其他的兼容性

enum E1 {
  a = 1,
}
enum E2 {
  a = 1,
}

let e1!: E1.a;
let e2!: E2.a;

// e2 = e1; //两个枚举之间 不能兼容

// 泛型兼容性， 如果生成的结果一致 类型就就兼容

type II<T> = { name?: T };

type X1 = II<string> extends II<string> ? true : false; // 生成结构一致即可

// 对象的兼容性， 多的属性可以赋予给少的
// 类型层级兼容性，never -> 字面量 -> 基础类型 -> 包装类型 -> any / unknown

// 子  extends  父  满足 即可赋值

// 类型推导的概念

// 1） 赋值推断 , 根据赋予的值来推断类型

let name = "jw";
let age = 30;

// 2) 函数时通过左边来推导右边, 基于上下文类型来进行自动的推导

// 3) 函数返回值编辑成void ，赋予一个函数的时候，意味着不关心返回值
// const sum: (a: string) => void = (a) => {
//   return a;
// };
// let r = sum("1");

function forEach1(arr: number[], callback: () => void) {
  // 这里的void 不关心返回值
  callback();
}
forEach1([1, 2, 3], function () {
  return [];
});

// 类型模板，类型保护，自己写类型
export {};
