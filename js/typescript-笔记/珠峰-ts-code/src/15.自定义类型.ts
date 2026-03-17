// 自己实现一些常用的类型

// 内置类型  基于条件类型的 Extract Exclude  集合类型
//          基于映射的类型 Partial Required Readonly  修饰
//          结构的  Pick Omit Record  结构处理
//          基于推断的类型 InstanceType  ReturnType  Paramters....   infer (模式匹配类型)
/*
type T1 = {
  name: "ac";
  age: number;
  address: string;
};
type T2 = {
  name: string;
  gender: number;
  address: number;
};
*/
// 1. （先找到name，和 address 排除掉）  和 （name，address 添加可选）
type Compute<T extends object> = {
  [K in keyof T]: T[K];
};
type PartialPropsOptional<T extends object, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
type PPO = Compute<PartialPropsOptional<T1, "name" | "address">>;

// 2.我期望 去t1 中 取出 值是string类型
/*
type isEqual<T, K, S, F> = T & {} extends K ? (K & {} extends T ? S : F) : F;

// {name:never, age:never, address:'address'}
type ExtractKeyByValue<T extends object, U> = {
  [K in keyof T]: isEqual<T[K], U, K, never>;
}[keyof T]; // string |

// 可索引接口
type PickKeysByValue<T extends object, K> = Pick<T, ExtractKeyByValue<T, K>>;
// 用户在使用类型的时候 希望的是简单， 内部复杂写
type ReturnPickKeysByValue = PickKeysByValue<T1, string>;
*/
// 3.我期望去掉string 类型

type isEqual<T, K, S, F> = T & {} extends K ? (K & {} extends T ? S : F) : F;

// {name:never, age:never, address:'address'}
/*
type ExtractKeyByValue<T extends object, U> = {
  [K in keyof T]: isEqual<T[K], U, K, never>;
}[keyof T]; // string |
*/
// {never:xxx,address:string,never:xxx}
type ExtractKeyByValue<T extends object, U> = {
  [K in keyof T as isEqual<T[K], U, K, never>]: T[K]; // 冲映射
}; // string |
// 可索引接口
// type PickKeysByValue<T extends object, K, O = true> = isEqual<
//   O,
//   true,
//   Omit<T, ExtractKeyByValue<T, K>>,
//   Pick<T, ExtractKeyByValue<T, K>>
// >;
// 用户在使用类型的时候 希望的是简单， 内部复杂写
type ReturnPickKeysByValue = ExtractKeyByValue<T1, string>;

type T1 = {
  name: "ac";
  age: number;
  address: string;
};
type T2 = {
  name: string;
  gender: number;
  address: number;
};
// 对象求交集
type ObjectInter<T extends object, K extends object> = Pick<
  T,
  keyof T & keyof K
>;
type X1 = ObjectInter<T1, T2>;

// 对象求差
// Omit + Extract ==  Pick exclude
type ObjectDiff<T extends object, K extends object> = Omit<T, keyof K>;
type X2 = ObjectDiff<T1, T2>;

// 两个类型合并在一起，如果都有的属性 用T2的 ？ {...T1,...T2}

// T1  - T2  + T2 - T1 + T2 & T1

type OverWrite<T extends object, K extends object> = ObjectDiff<T, K> &
  ObjectDiff<K, T> &
  ObjectInter<K, T>;
type X3 = Compute<OverWrite<T1, T2>>;

// merge 类型会合并在一起
type MergeType<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K];
};
// 求差集  + 其他的属性交集的部分联合在一起即可
type MergeWrite<T extends object, K extends object> = ObjectDiff<K, T> &
  MergeType<T, K>;
type X4 = Compute<MergeWrite<T1, T2>>;

// ------

// type O1 = { top: number; bottom?: never };
// type O2 = { bottom: number; top?: never };

// let o: O1 | O2 = {
//   bottom: 100,
// };

interface Man1 {
  fortune: string;
}
interface Man2 {
  funny: string;
}
interface Man3 {
  foreign: string;
}

type DiffType<T, U> = {
  [K in Exclude<keyof T, keyof U>]?: never;
};

// man1- man2 + man2
// man2 -man1 + man1
type OrType<T, K> = (DiffType<T, K> & K) | (DiffType<K, T> & T);

let man: OrType<Man3, OrType<Man1, Man2>> = {
  funny: "ed",
};

export {};
