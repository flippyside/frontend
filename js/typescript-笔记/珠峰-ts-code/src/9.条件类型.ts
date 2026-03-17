// 条件类型  if / else 三元表达式  (extends 左边 和 右边的关系)

// 子类型 extends 父类型 = true

type StatusCode<T> = T extends 200 | 201 | 204 | 304 ? "success" : "fail";
type IReturnMessage = StatusCode<200>;

type IObj<T> = T extends { name: "jw" } ? "ok" : "no ok";
type IPerson = IObj<{ name: "jw"; age: 30 }>;
type IPerson1 = IObj<{}>;
// 类型级别 1) 根据结构的角度来分析  2) 从类型角度来进行分析

//  never 是任何类型的子类型
//  字面量类型
//  基础类型
//  包装的类型
//  any unknown

type T1 = never extends "str" ? true : false;
type T2 = "str" extends string ? true : false;
type T3 = string extends String ? true : false;

// {} object Object   {} 和 object 可以看成字面量类型

type Temp1 = {} extends object ? true : false;
type Temp2 = object extends {} ? true : false;
type Temp3 = object extends Object ? true : false;
type Temp4 = Object extends object ? true : false; // 因为从结构角度出发
type Temp5 = Object extends {} ? true : false;
type Temp6 = object extends {} ? true : false;

// {}  object 可以看成结构， 和类型两部分

type T4 = string extends object ? true : false;

type T5 = string extends any ? true : false;
type T6 = string extends unknown ? true : false;

type T7 = any extends unknown ? true : false;
type T8 = unknown extends any ? true : false;

type T9 = any extends 1 ? true : false; // (条件类型 是有分发机制) 1 + 除了1的部分  true ｜ false

// any自带分发的机制
// never 如果通过泛型传入，此时只会返回never
type T10<T> = T extends string ? true : false;
type Temp7 = T10<never>;

// 联合类型的子类型 是联合类型中的某个类型
type T11 = 100 extends 100 | 200 ? true : false;

// 通过条件类型 来进行类型的区分，条件语句也可以实现约束的效果

interface Fish {
  name: "鱼";
}
interface Bird {
  name: "鸟";
}
interface Water {
  name: "水";
}
interface Sky {
  name: "天";
}

// T & {} 就可以解决分发问题
type GetType<T extends Fish | Bird> = T & {} extends Fish ? Water : Sky;
// 分发导致的问题： 什么时候会有分发
// 1.联合类型通过泛型传递
// 2.而且比较(extends)的时候会产生分发
// 3.类型需要是裸类型 (裸类型就是泛型 就自己没有和别人搭配)

type A1 = GetType<Fish | Bird>;

type NoDistribute<T> = T & {};

// 分发机制有的场景需要，有的场景需要禁用， 不能一概而论。
type UnionAssets<T, K> = NoDistribute<T> extends K ? true : false;
type U1 = UnionAssets<1 | 2, 1 | 2 | 3>;
type U2 = UnionAssets<1 | 2 | 3, 1 | 2>;

// 判断两个类型是否完全一致 ？   1|2    1|2

type isEqual<T, K, S, F> = NoDistribute<T> extends K
  ? NoDistribute<K> extends T
    ? S
    : F
  : F;
type A2 = isEqual<1 | 2, 1 | 2, true, false>;

type FormatVal<T> = T extends string
  ? string
  : T extends number
  ? number
  : never;

// 映射关系 可以考虑用泛型，参数个数不一致，类型和入参数无法，考虑重载
function sum<T extends string | number>(a: T, b: T): FormatVal<T> {
  return a + (b as any);
}
let r = sum(1, 2);

// 子类型  父类型

// 内置类型中有很多类型是基于条件类型的
// Extract Exclude , NonNullable...

type Extract<T, U> = T extends U ? T : never;
type ExtractRes = Extract<1 | 2 | 3 | 4, 1 | 2>;
type Exclude<T, U> = T extends U ? never : T;
type ExcludeRes = Exclude<1 | 2 | 3 | 4, 1 | 2>;

const ele = document.getElementById("app");
// type NonNullable<T> = T extends null | undefined ? never : T;
// type NonNullable<T> = T & {};
type Ele = NonNullable<typeof ele>;

export {};
