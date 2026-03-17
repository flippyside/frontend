// 我门可以基于字符串类型 来创建新的类型  模板字符串

type name = "jw";
type handsomeName = `handsome ${name}`;

// 模板字符串 ，当我们传入一个联合类型时 也有分发机制

// css:margin-left、margin-right、margin-top

type MarginOrPading = "padding" | "margin";
type Direction = "left" | "top" | "right" | "bottom";

type Compose = `${MarginOrPading}-${Direction}`;

// 可以基于这种方式编写一些 固定的格式的类型 scss变量
// element-plus (red-100 red-200 red-300)
// 商品规格 棕色-20cm  红色-20cm 。。。

//  如果通过的是 & 的方式 保证类型是字符串类型， 否则使用约束更合理
type IColor<S extends string | number | bigint | boolean | null | undefined> =
  `red-${S}`;

// 可以传入字面量类型 ， 也可以传入基础类型
type I1 = IColor<100>;
type I2 = IColor<null | undefined>;
type I3 = IColor<string>; // 类似于正则

type I4 = I1 extends I3 ? true : false; // 可以通过这个方式来描述 对key 的限制

// 模板字符串有内置的泛型接口
// Capitalize
type A1 = Capitalize<I1>;
type A2 = Uncapitalize<A1>;
type A3 = Uppercase<A1>;
type A4 = Lowercase<A3>;

const person = {
  name: "jw",
  age: 30,
  address: "abc",
};
// 重映射 as  pickObjectByValue
type Person = typeof person; // Person -> {re_name:string,re_age:number,re_address:string}

type RePerson<T> = {
  [K in keyof T as `re_${K & string}`]: T[K]; // 模板字符串 + 冲映射可以直接做对象的格式映射
};
type Result = RePerson<Person>;

// 根据对象生成对应的getter方法  vue3  @xxx-> onXxxx   emit('xxx')

type PersonGetter<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
let personGetter!: PersonGetter<Person>;
let r3 = personGetter.getName();
let r2 = personGetter.getAge();
let r1 = personGetter.getAddress();

// 模版字符串可以用于 infer 关键字 来使用

export {};
