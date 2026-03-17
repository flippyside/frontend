// 类型体操！3 元组篇

// ======================================================================================
// 1. 计算元组类型的长度
// ======================================================================================

export type LengthOfTuple<T extends any[]> = T["length"];

type A = LengthOfTuple<["B", "F", "E"]>; // 3
type B = LengthOfTuple<[]>; // 0

// ======================================================================================
// 2. 得到元组类型中的第一个/最后一个元素
// ======================================================================================

export type FirstItem<T extends any[]> = T[0];

type A1 = FirstItem<[string, number, boolean]>; // string
type B1 = FirstItem<["B", "F", "E"]>; // 'B'

// ...any搭配infer取最后一项
export type LastItem<T extends any[]> = T extends [...any, infer R] ? R : never;

type A2 = LastItem<[string, number, boolean]>; // string
type B2 = LastItem<["B", "F", "E"]>; // 'B'

// ======================================================================================
// 3. 移除元组类型中的第一个元素
// ======================================================================================

export type Shift<T extends any[]> = T extends [infer L, ...infer R]
  ? R
  : never;

type A3 = Shift<[1, 2, 3]>; // [2,3]
type B3 = Shift<[1]>; // []
type C3 = Shift<[]>; // []

// ======================================================================================
// 4. push
// ======================================================================================

export type Push<T extends any[], C> = [...T, C];

type A4 = Push<[1, 2, 3], 4>; // [1,2,3,4]
type B4 = Push<[1], 2>; // [1, 2]

// ======================================================================================
// 5. 反转元组
// ======================================================================================

export type ReverseTuple<T extends any[], F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? ReverseTuple<R, [L, ...F]>
  : F;

type A5 = ReverseTuple<[string, number, boolean]>; // [boolean, number, string]
type B5 = ReverseTuple<[1, 2, 3]>; // [3,2,1]
type C5 = ReverseTuple<[]>; // []

// ======================================================================================
// 6. 拍平元组
// ======================================================================================

export type Flat<T extends any[]> = T extends [infer L, ...infer R]
  ? [...(L extends any[] ? Flat<L> : [L]), ...Flat<R>]
  : T;

type A6 = Flat<[1, 2, 3]>; // [1,2,3]
type B6 = Flat<[1, [2, 3], [4, [5, [6]]]]>; // [1,2,3,4,5,6]
type C6 = Flat<[]>; // []
type D6 = Flat<[1]>; // [1]

// ======================================================================================
// 7. 复制类型 T 为 C 个元素的元组类型
// ======================================================================================

export type Repeat<T, C, F extends any[] = []> = C extends F["length"]
  ? F
  : Repeat<T, C, [T, ...F]>;

type A7 = Repeat<number, 3>; // [number, number, number]
type B7 = Repeat<string, 2>; // [string, string]
type C7 = Repeat<1, 1>; // [1]
type D7 = Repeat<0, 0>; // []

// ======================================================================================
// 8. 保留元组类型 T 中的 A 类型
// ======================================================================================

export type Filter<T extends any[], A, F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? Filter<R, A, [L] extends [A] ? [...F, L] : F>
  : F;

type A8 = Filter<[1, "BFE", 2, true, "dev"], number>; // [1, 2]
type B8 = Filter<[1, "BFE", 2, true, "dev"], string>; // ['BFE', 'dev']
type C8 = Filter<[1, "BFE", 2, any, "dev"], string>; // ['BFE', any, 'dev']

// ======================================================================================
// 9. 找出 E 类型在元组类型 T 中的下标
// ======================================================================================

export type IsEqual<T, U, Success, Fail> = [T] extends [U]
  ? [U] extends [T]
    ? keyof T extends keyof U
      ? keyof U extends keyof T
        ? Success
        : Fail
      : Fail
    : Fail
  : Fail;

export type FindIndex<T extends any[], A, F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? IsEqual<L, A, F["length"], FindIndex<R, A, [...F, null]>>
  : never;

type a1 = [any, never, 1, "2", true];
type a2 = FindIndex<a1, 1>; // 2
type a3 = FindIndex<a1, 3>; // never

// ======================================================================================
// 10. 元组类型转换为枚举类型
// ======================================================================================

type TupleToEnum<T extends any[], C = false> = {
  [K in T[number]]: C extends true ? FindIndex<T, K> : K;
};

// 默认情况下，枚举对象中的值就是元素中某个类型的字面量类型
type a5 = TupleToEnum<["MacOS", "Windows", "Linux"]>;
// -> { readonly MacOS: "MacOS", readonly Windows: "Windows", readonly Linux: "Linux" }

// 如果传递了第二个参数为true，则枚举对象中值的类型就是元素类型中某个元素在元组中的index索引，也就是数字字面量类型
type a4 = TupleToEnum<["MacOS", "Windows", "Linux"], true>;
// -> { readonly MacOS: 0, readonly Windows: 1, readonly Linux: 2 }

// ======================================================================================
// 11. 截取元组中的部分元素
// ======================================================================================
