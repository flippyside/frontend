// 类型体操！1

interface Person {
  name: string;
  age: number;
  address: string;
}

// ======================================================================================
// 1. 部分属性可选
// ======================================================================================

// 实现部分属性可选。
// Partial：将所有属性转化为可选
// Pick: 挑选属性
// Omit: 忽略属性
// 把需要变成可选的属性用Pick挑选出来，用Partial转化成可选，再使用Omit挑选出不需要变成可选的属性，两者用 & 合并
type PartialPropsOptional<T extends object, K extends keyof T> = Partial<
  Pick<T, K>
> &
  Omit<T, K>;

// 可视化
type Computed<T> = {
  [K in keyof T]: T[K];
};

type p1 = Computed<PartialPropsOptional<Person, "age" | "address">>; // 将"age"、"address"变为可选属性

// ======================================================================================
// 2. 根据值类型（挑选/忽略）对象类型的属性
// ======================================================================================

// =========================================
// 第一种实现（推荐）
// =========================================

type PickKeysByValue<T, U> = {
  // 直接忽略对象的属性
  // as: 键名重映射
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type p2 = PickKeysByValue<Person, string>;

// =========================================
// 第二种实现（较麻烦）
// =========================================

// // 判断两个类型是否相同。注意要禁用分发

// type isEqual<T, K, Success, Fail> = [T] extends [K]
//   ? [K] extends [T] // 两个类型必须完全一致，可以互相extends
//     ? Success
//     : Fail
//   : Fail;

// // 选出类型对应的键：
// // 将类型相同的进行映射
// // O：true为忽略，false为选择
// // string => "age" | "address"
// type ExtractKeys<T extends object, U, O = false> = {
//   [K in keyof T]: isEqual<
//     T[K],
//     U,
//     isEqual<O, true, never, K>,
//     isEqual<O, true, K, never>
//   >;
// }[keyof T];

// // Pick这些属性：Pick<Person, "age" | "address">

// type PickKeysByValue<T extends object, U> = Pick<T, ExtractKeys<T, U>>;

// // Omit这些属性
// type OmitKeysByValue<T extends object, U> = Pick<T, ExtractKeys<T, U, true>>;

// type p2 = PickKeysByValue<Person, string>;
// type p3 = OmitKeysByValue<Person, string>;

// ======================================================================================
// 3. 子类型互斥 XOR
// ======================================================================================

interface Man1 {
  fortune: string;
}

interface Man2 {
  funny: string;
}

interface Man3 {
  foreign: string;
}

// 实现 T - U:
// 把 T 有但 U 没有的属性全部标成 ?: never，目的是让这些属性一旦被写就报错
// Exclude：在T中排除掉U
type DiscardType<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };

// 思路：
// Man1 - Man2: Man1添加 never Man2 属性
// Man2 - Man1: Man2添加 never Man1 属性
// Man3同理
type OrType<T, U> = (DiscardType<T, U> & U) | (DiscardType<U, T> & T);

type ManType = OrType<Man3, OrType<Man1, Man2>>;

// 只能出现某一种类型，不能混着写
let man: ManType = {
  fortune: "abc",
  // funny: "aaa", // 不兼容
  // foreign: "bbb" // 不兼容
};

// ======================================================================================
// 4. 集合运算
// ======================================================================================

interface A {
  name: string;
  age: number;
  address: string;
}

interface B {
  name: string;
  age: boolean;
  job: string;
}

// =========================================
// 交集
// =========================================

type ObjectInter<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U>
>;

type R1 = ObjectInter<A, B>;

// =========================================
// 差集
// =========================================

// 属于T且不属于U
type ObjectDiff<T extends object, U extends object> = Pick<
  T,
  Exclude<keyof T, keyof U>
>;

type R2 = ObjectDiff<A, B>;

// =========================================
// 补集
// =========================================

// T并U，且不属于U的元素
type ObjectCom<T extends object, U extends object> = Pick<
  T,
  Exclude<keyof T, keyof U>
>;

type R3 = ObjectCom<A, B>;

// =========================================
// 重写 overwrite
// =========================================

// 用 U 的同名字段替换掉 T 的同名字段，其他字段保持不变
// ObjectDiff<T, U>：取 T 中独有的字段（不在 U 中的字段）
// ObjectInter<U, T>：取 U 中存在且 T 中也存在的字段（取交集），并且以 U 的类型为准
type OverWrite<T extends object, U extends object> = ObjectInter<U, T> &
  ObjectDiff<T, U>;

type R4 = Computed<OverWrite<A, B>>;

// ======================================================================================
// 5. 推断函数类型中参数的最后一个参数类型
// ======================================================================================

function sum(a: string, b: string, c: number) {}

// Parameters<T>取出T的参数们，用infer取出最后一个参数
type LastParameter<T extends (...args: any[]) => any> = Parameters<T> extends [
  ...infer X,
  infer Last
]
  ? Last
  : never;

type X = LastParameter<typeof sum>;
