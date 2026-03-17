// 条件内置类型Extract  Exclude  NonNullable
// 循环类型 Partial Required Readonly

type IPerson = {
  name: string;
  age: string;
  company: string;
};

type Readonly<T> = {
  +readonly [K in keyof T]: T[K];
};
type ReadonlyRes = Readonly<IPerson>;

// 不能修改就是readonly ， 却掉readonly
type Mutate<T> = {
  -readonly [K in keyof T]: T[K];
};
type MutateRes = Mutate<ReadonlyRes>;

// -? +?   -readonly +readonly

// Partial
// Omit Pick 对象来操作的
type Pick<T, K extends keyof T> = {
  [key in K]: T[key];
};
type PickRes = Pick<IPerson, "company" | "age">;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type OmitRes = Omit<IPerson, "name" | "age">;
// Pick和Omit用的比较多
// Record
// type Record<T extends keyof any, K> = {
//   [key in T]: K;
// };
// string:any 任意类型 索引类型
const obj: Record<string, any> = { b: 1, c: "2" };

// { name: "jw", age: 30 } -> { name: "jw" + 100, age: 30 + 100 }

// 推导出类型 (根据泛型的位置 来推导具体的类型)
function map<T extends keyof any, K, R>(
  obj: Record<T, K>,
  callback: (value: K, key: T) => R
) {
  let result = {} as Record<T, R>;
  for (let key in obj) {
    result[key] = callback(obj[key], key);
  }
  return result;
}
map({ name: "jw", age: 30 }, (value, key) => {
  return true;
});

// infer  inference 手动类型推导

function getPerson(a: string, b: number) {
  return { name: "jw", age: 30 };
}
// 类型推断 ， 因为infer 需要extends 关键字， 所以必须构建一个条件
// type ReturnType<T extends (...args: any[]) => any> = T extends (
//   ...args: any[]
// ) => infer R
//   ? R
//   : never;
// infer 关键字需要基于extends
type FnReturnType = ReturnType<typeof getPerson>;
// type Parameters<T extends (...args: any[]) => any> = T extends (
//   ...args: infer P
// ) => any
//   ? P
//   : false;
type FnParamaters = Parameters<typeof getPerson>;

class Person {
  constructor(a: string, b: string) {}
}
// type ConstructorParameters<T extends { new (...args: any[]): any }> =
//   T extends { new (...args: infer P): any } ? P : any;

type ClassConstructorParameters = ConstructorParameters<typeof Person>;

// type InstanceType<T extends { new (...args: any[]): any }> = T extends {
//   new (...args: any[]): infer R;
// }
//   ? R
//   : any;
type ClassInstanceType = InstanceType<typeof Person>;

// 如何讲一个元组转化成联合和类型

type ITumple = [string, number, boolean]; // string | number | boolean
// type TumpleToUniom = ITumple[number];

type ElementOf<T extends any[]> = T extends Array<infer R> ? R : never;
type TumpleToUniom = ElementOf<ITumple>;

// 对元组进行参数移动， 将元组头尾进行交换 . infer 要配合 extends
type SwapHeadTail<T extends any[]> = T extends [
  infer Head,
  ...infer Body,
  infer Tail
]
  ? [Tail, ...Body, Head]
  : never;

type Res = SwapHeadTail<["jw", 1, 2, 3, 4, 5, 30]>;

// function getVal(): Promise<Promise<200>> {
//   return new Promise((resolve, reject) => {
//     resolve(
//       new Promise((resolve, reject) => {
//         resolve(200);
//       }) as Promise<200>
//     );
//   });
// }

// infer 可以递归推断
type PromiseVal<T> = T extends Promise<infer R> ? PromiseVal<R> : T;
type PromiseReturnVal = PromiseVal<Promise<Promise<200>>>;

// class Cat {
//   constructor(public name: string) {}
// }
// class Dog {
//   constructor(public name: string) {}
// }
// function createInstance<T extends { new (...args: any[]): any }>(
//   clazz: T,
//   name: string
// ): InstanceType<T> {
//   let r = new clazz(name);
//   return r;
// }
// const instance = createInstance(Dog, "tom");
export {};
