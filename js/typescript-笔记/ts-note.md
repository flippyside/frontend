TypeScript 的核心就是一个静态类型系统，负责：

- 检查类型是否匹配；
- 推断变量类型；
- 在编译阶段发现类型错误。

## 数据类型

- js 中的数据类型：string、number、boolean、null、undefined、bigint、symbol、object
- any：没有类型检查。声明一个没有类型的变量，则默认是any类型
- unknown：未知类型，要后期才能确定
- never：通常用于限制函数返回值：不返回任何值，包括 undefined
- void：函数不返回任何值，但可以返回 undefined。返回值类型为 void 的函数，调用者不应依赖其返回值进行任何操作
- tuple：特殊的数组类型，可以存储固定数量的元素，并且每个元素的类型是已知的且可以不同。元组用于精确描述一组值的类型，?表示可选元素。
- enum：枚举。
- type：为任意类型创建别名
- interface：接口

### 类型声明

```ts
let a: string;
a = "hello";
```

```ts
function demo(x: number, y: number): number {
  return x + y;
}
```

### 类

super：是指向自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。

与 this 类似，super 相当于是指向当前对象的父类的引用，这样就可以用 super.xxx 来引用父类的成员。

类由三部分组成：构造函数、属性（实例属性、原型属性）、方法（实例方法、原型方法、访问器）

reaonly 在构造函数中可以随意修改（初始化） 在其他的地方就不能再次修改了。

### 枚举

枚举可以看做是自带类型的对象。枚举的值为数字时会自动根据第一个的值来递增 ，数字类型的枚举可以反举。

常量枚举： 如果不需要对象，只是使用值，可以使用常量枚举，否则用普通枚举

```ts
const enum USER_ROLE {
  USER,
  ADMIN,
  MANAGER,
}
console.log(USER_ROLE.USER);
```

### type

`type` 关键字可以用来自定义类型别名（type alias）

一、基本用法

```ts
type UserID = string;
let id: UserID = "abc123";
```

这里 `UserID` 就是一个类型别名，等价于 `string`。
 效果：让代码更语义化，比如你一眼就知道这是用户 ID，而不是普通字符串。

二、别名对象类型

```ts
type User = {
  name: string;
  age: number;
};
const user: User = { name: "Tom", age: 18 };
```

`User` 就是一个对象类型定义的别名，比直接在函数或变量里写内联对象结构更清晰。

三、联合类型（Union Types）

`type` 特别常用来定义“多个可能的类型”：

```ts
type Status = "success" | "fail" | "pending";
let s: Status = "success";
```

这个写法在配合前端状态机、接口返回状态码、枚举类状态时超常用。

四、交叉类型（Intersection Types）

可以把多个类型合并成一个：

```ts
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age;

const p: Person = { name: "Tom", age: 20 };
```

`&` 的作用是把两个对象类型合并，结果是既有 `name` 又有 `age` 的类型。

五、函数类型别名

```ts
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b;
```

这样定义比直接写函数签名要清爽得多，尤其是复用时。

 六、泛型 + type

你可以像接口一样在 `type` 里用泛型：

```ts
type ApiResponse<T> = {
  code: number;
  data: T;
  msg: string;
};

const res: ApiResponse<string> = {
  code: 200,
  data: "ok",
  msg: "success"
};
```

### null undefined never

严格模式下，null 和 undefined只能赋值给null和undefined

不能把其他类型赋值给 never。

never可以用于完整性保护。例如，一个函数接收1个有三种可能类型的参数，应该对这三种类型都有处理逻辑，如果缺失了一种，那么可以用将返回值赋给never的方法做校验。

```ts
function validate(type: never) {} // 报错：类型“boolean”的参数不能赋给类型“never”的参数。
function getResult(strOrNumOrBool: string | number | boolean) {
  if (typeof strOrNumOrBool === "string") {
    return strOrNumOrBool.split("");
  } else if (typeof strOrNumOrBool === "number") {
    return strOrNumOrBool.toFixed(2);
  }
  // 由于boolean处理逻辑缺失，无法通过下面的校验
  validate(strOrNumOrBool);
}

```

### 联合类型

联合类型的变量没有赋值之前，只能调用公共的方法。赋值后则自动推断类型。

字面量联合类型：用type可以自定义类型

```ts
// 通常字面量类型与联合类型一同使用
type Direction = "Up" | "Down" | "Left" | "Right";
let direction: Direction = "Down";
```

对象联合类型：实现属性互斥

类型断言：as

交叉类型的符号是&，类似按位与。需同时满足类型。 （交集）

### 断言

非空断言：这个变量的值一定不为空

- !：用于声明未赋予初始值的变量。告诉ts该变量未来会被赋值，不必报错

```ts
ele!.style.background = "red"
```

可选链操作符号：

```
ele?.style.background
```

空值合并操作符号，除了null和undefined都会返回左边的值

```ts
false ?? 1
```

as断言：强制把某个类型断言成已经存在的某个类型

```
let ele: HTMLElement | null = document.getElementById("app")
(ele as HTMLElement).style.background = "red"
```

双重断言：先断言成any，再断言成某个类型

```ts
let str: string | number;
str! as any as boolean;
```

### 函数类型

描述函数的参数与返回值类型。

```ts
type Sum = (a1: string, b1: string) => string
let sum: Sum = (a: string, b: string) => {
	return a + b
}
```

### 接口 interface

- 用来描述数据形状的 （对象、类、函数、混合类型）
- 接口中的内容都是抽象的 （不能有具体的实现）

作用：

- 约束函数的参数、返回值

对象接口可以用来描述对象的形状结构：

```ts
interface IVegetables {
  // 类型
  color: string;
  taste: string;
  size: number;
}
let veg1: IVegetables = {
  // 定义
  color: "red",
  taste: "sweet",
  size: 10,
  a: 1, // 如何增添这个a属性呢？
};

```

如何定义一个对象，并添加一个对象接口中没有的属性：

- 方案 1：直接采用断言的方式指定为当前赋值的类型
- 方案 2：在类型中通过 `?`增添 a 属性为可选属性
- 方案 3：利用同名接口合并的特点
- 方案 4：通过接口继承的方式扩展属性
- 方案 5：通过任意类型来扩展。在接口中添加 `[key:string]:any;`
- 类型兼容性、交叉类型等

使用implements实现接口，接口中的所有内容必须被实现

interface 与 type 的区别：

- 相同点：interface 和 type 都可以用于定义对象结构，在定义对象结构时两者可以互换。
- 不同点：
  - interface：更专注于定义对象和类的结构，支持extends扩展、合并
  - type：可以定义类型别名、联合类型、交叉类型，但不支持extends和自动合并

interface 与 抽象类 的区别：

- 相同点：都能定义一个类的格式
- 不同点：
  - interface：只能描述结构，不能有任何实现代码。一个类可以实现多个接口
  - 抽象类：既可以包含抽象方法，也可以包含具体方法，一个类只能继承一个抽象类

泛型：允许我们在定义函数、类或接口时，使用类型参数来表示未指定的类型，这些参数在具体使用时，才被指定具体的类型，泛型能让同一段代码适用于多种类型，同时仍然保持类型的安全性

类型声明文件：是 TypeScript 中的一种特殊文件，通常以.d.ts 作为扩展名。它的主要作用是为现有的 JavaScript 代码提供类型信息，使得 TypeScript 能够在使用这些 JavaScript 库或模块时进行类型检查和提示

### 泛型

泛型：在使用的时候才确定类型

例如，根据提供的数据生成对应长度的数组：

```ts
function createArray<U>(len:number, val:U){
	let result = []
	for(let i = 0; i < len; i++){
		result.push(val)
	}
}
createArray(3, 'abc')
```

交换元组中的两个变量：

```ts
type ISwap = <T, K>(tuple:[T, K]) => [K, T]
let swap : ISwap = (tuple) => {
	  return [tuple[1], tuple[0]]
}
let res = swap(["abc", 123])
```

`<T>`的位置：

- `type Icallback<T> = (item: T, index: number) => void`：表示使用类型的时候传参
- `type Icallback = <T>(item: T, index: number) => void`：表示调用函数的时候传递参数

泛型的默认值：在使用一些联合类型时，会使用泛型

```ts
type Union<T> = T | number | string
```

泛型约束：要求传递的参数必须符合要求。T extends B 表示 T必须是B的子类型。注意，对于对象而言，子的类型结构是**多于**父

```typescript
function handle<T extends string>(val: T): T {
  return val
}
```

### 交叉类型

&，将多个类型合并为一个类型（类型交集，是数学集合意义上的**合并**）：

```ts
interface Person1 {
  handsome: string;
}
interface Person2 {
  high: string;
}
type P1P2 = Person1 & Person2;
let p: P1P2 = { handsome: "帅", high: "高" };
```

### unknown

unknown是安全版的any，任何类型都可以赋值为 `unknown`类型，但 unknown 会进行类型检测。

> 不能访问 unknown 类型上的属性，不能作为函数、类来使用

使用 unknown 类型需要进行类型检查或类型断言后再进行使用。

区分unknown、any：

- unknown & string = string
- any  & string = any

`any`和 `unknown`的主要区别在于 **类型安全性** ：`any`跳过类型检查，允许任何操作（不安全），而 `unknown`保留类型检查，要求先做类型判断或断言（安全）。`any`是“我不在乎类型”，`unknown`是“我不知道类型”，后者常用于更严格的类型限制。


 **使用场景 (Usage)** **:**

- **`any`** **: 处理不确定类型、重构 JavaScript 旧代码、类型声明极其繁琐的场景。**

* **`unknown`** **: 接收 API 响应、类型不确定的动态数据，保证后续处理的类型安全性。**

### 条件类型

和泛型约束一起使用，类似三元运算符。

```ts
type ResStatusMessage<T extends number> = T extends 200 | 201 | 204
  ? "success"
  : "fail";
type Message = ResStatusMessage<300>; // fail
```

多条件类型:

```ts
type FormatReturnType<T> = T extends string // 可以编写多条件类型
  ? string
  : T extends number
  ? number
  : never;

function sum<T extends string | number>(x: T, y: T): FormatReturnType<T> {
  return x + (y as any); // 两个泛型做运算，其中一个必须转换为any，否则会报错
}
sum("abc", "abc"); // string
sum(123, 123); // number

```

## 条件类型与映射类型

### 条件类型分发

条件类型分发：当类型参数是联合类型时，条件类型会自动对联合类型的每个成员**分别**执行判断，然后再把结果联合起来。

触发条件：A extends B

- A类型是通过泛型传入的
- A是联合类型
- A是裸露的

下面的代码展示了条件类型分发，`Fish | Bird`将分别被判断是否 `extends Fish`。

```ts
type Conditional<T> = T extends Fish ? Water : Sky
type R1 = Conditional<Fish | Bird> // Water | Sky
```

禁用分发：有时我们希望将结果**运算后再比较**，就需要关闭这种默认的分发机制。思路是避免泛型的裸露。有两种方式：

- `T & {}` 返回一个新类型
- `[T] extends [U]`

```ts
type NoDistribute<T> = T & {}
type Conditional<T> = NoDistribute<T> extends U ? true : false
type R2 = Conditional<1 | 2, 1> // false
```

```ts
type Conditional<T> = [T] extends [U] ? true : false
```

注意：通过泛型传入的参数若为 never，则会直接返回 never。所以需要进行禁用分发：

```ts
type IsNever<T> = NoDistribute<T> extends never ? true : false
type R3 = IsNever<never>
```

在进行类型父子关系的比较时，都应该关闭分发。

### 运用条件类型分发实现的ts内置类型

1. `Extract`抽取类型(交集)

```ts
type Extract<T, U> = T extends U ? T : never;
type MyExtract = Extract<"1" | "2" | "3", "1" | "2">; // 1 | 2
```

2. `Exclude`排除类型(差集)

```ts
type Exclude<T, U> = T extends U ? never : T;
type MyExclude = Exclude<"1" | "2" | "3", "1" | "2">; // 3
```

实现补集：约束 U 是 T 的子集

```ts
type Complement<T, U extends T> = T extends U ? never : T;
type MyComplement = Complement<"1" | "2" | "3", "1" | "2">; // 补集
```

3. `NoNullable` 非空检测

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
type NonNullable<T> = T & {}; // 保留联合类型中非空的值
type MyNone = NonNullable<"a" | null | undefined>;
```

### infer 类型推断

ts内置类型：基于infer实现

- 1.`ReturnType `返回值类型
- 2.`Parameters` 参数类型
- 3.`ConstructorParameters `构造函数参数类型
- 4.`InstanceType` 实例类型

infer可以在条件类型中提取类型的某一个部分，在使用时想获取什么类型，就将它写在什么"地方"加一个变量可以自动推导，类型推导都是基于位置的

手写ts内置类型：

1. `ReturnType`获取函数返回值类型：

```ts
function getObj(name: string, age: number){
  return {name,age}
}

type ReturnType<T> = T extends(...args: any[]) => infer R ? R : never
type MyReturn = ReturnType<typeof getObj>
```

2. `Parameters` 获取函数的参数类型

```ts
type Parameters<T> = T extends(...args: infer P) => any ? P : any
type MyParams = Parameters<typeof getObj>
```

3. `ConstructorParameters `获取构造函数的参数类型

```ts
class Person {
	constructor(name: string, age: number){}
}
type ConstructorParameters<T> = T extends{ new(...args: infer R): any} ? R : never
type MyConstructorParam = ConstructorParameters<typeof Person>
```

4. `InstanceType` 获取实例类型

```ts
type InstanceType<T> = T extends{ new(...args: any): infer R} ? R : any
type MyInstance = InstanceType<typeof Person>
```

一些使用infer的其他场景：

Swap:

```ts
type Swap<T> = T extends [infer A1, infer A2]  ? [A2, A1] : never
type R = Swap<["abc", 30]> // [30, "abc"]
```

头尾交换：

```ts
type SwapHeadTail<T> = T extends [infer H, ... infer N, infer T] ? [T, ...N, H] : never
type R = SwapHeadTail<[1,2,3,4,5]> // 5,1,2,3,4
```

递归推断：判断嵌套Promise的最终返回值

- `T extends Promise<infer P>`：检查 `T` 是否是一个 `Promise`；
- `infer P`：从 `Promise<...>` 中推断出它包裹的类型；
- 递归：如果是 `Promise`，就继续递归调用 `PromiseReturnValue<P>`；
- 如果不是 `Promise`（即递归到底），返回原始类型 `T`。

```ts
type PromiseReturnValue<T> = T extends Promise<infer P> ? PromiseReturnValue<P> : T
type R = PromiseReturnValue<Promise<Promise<Promise<100>>>> // 100
```

将数组类型转化为联合类型：3种方法

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;
type TupleToUnion = ElementOf<[string, number, boolean]>;
type TupleToUnion = [string, number, boolean][number];
// 结果都是 string | number | boolean
```

### 映射类型

类似于map，基于key映射到value的类型

- Partial：将所有属性转化为可选（后面加一个 `?`）
  - DeepPartial: 递归转化，适用于有嵌套属性的情况
- Required：将所有属性转化为必填
- Readonly：将所有属性转化为只读

手写：

```ts
type Partial<T> = {
  [K in keyof T]?: T[K]
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

```ts
type Required<T> = {
  [K in keyof T]-?: T[K]
}
```

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

### 结构类型

- Pick: 挑选属性

  - ```ts
    type PickPerson = Pick<Person, "name" | "age">;
    ```
- Omit: 忽略属性

  - `type OmitAddress = Omit<typeof person, "address">;`
- Record：记录类型。表示键值对

  - 通常用来代替 object
    - `let person: Record<string, any> = {name:"abc", age:20}`
  - 实现 map 方法时，我们经常用 record 类型表示映射类型

手写：

```ts
type Pick<T, K extends keyof T> = {
  [Key in K]: T[key]
}

// 用pick挑选出不需要的类型，再exclude
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

type Record<K extends keyof any, V> = { [P in K]: V}
```

- keyof：取key
- typeof：取类型
- `[ ]`: 索引查询
- in：循环的
- extends：条件
- `K extends keyof any`：所有可以用来当作key的类型，即 `string | number | symbol`。这是因为在 JS 中，对象的键名（包括数组下标、Symbol）只能是这三种类型

实现mixin：

- `Omit<T, keyof K>` : 把 `T` 中那些跟 `K` 键名重复的属性删掉。（如果 `T` 和 `K` 有同名属性，就用 `K` 的类型覆盖 `T` 的。）
- `& K `: 和 `K` 的类型做交叉（合并）。

```ts
function mixin<T, K>(a: T, b: K): Omit<T, keyof K> & K {
  return {...a, ...b}
}
let x = mixin(
  {name:"abc", c: 3},
  {name:123, b: 2},
)
type R = typeof x // {name: number, b: number, c: number}
```

## 类型系统

TypeScript 的类型系统特性：结构化类型系统(鸭子类型检测：“当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。” 在鸭子类型中，关注点在于对象的行为，能做什么；而不是关注对象所属的类型。)。

即，TypeScript 比较两个类型不是通过类型的名称，而是比较这两个类型上的属性与方法。

### 类型兼容性

1. 基本数据类型的兼容性

```ts
let obj: {
  toString(): string;
};
let str: string = "jw";
obj = str; // 字符串中具备toString()方法，所以可以进行兼容
```

2. 接口兼容性

```ts
interface IAnimal {
  name: string;
  age: number;
}
interface IPerson {
  name: string;
  age: number;
  address: string;
}
let animal: IAnimal;
let person: IPerson = {
  name: "jw",
  age: 30,
  address: "回龙观",
};
animal = person;
```

3. 函数的兼容性

主要是比较参数和返回值。

参数：赋值时，参数“少”的函数可以赋值给参数“多”的函数

```ts
let f1 = (a: number, b: number) => void;
let f2 = (a: number) => void;
f1 = f2; // OK
```

以实现forEach为例

```ts
type Func<T> = (item: T, index: number) => void
function forEach<T>(arr: T[], cb: Func<T>) {
  for(let i = 0; i < arr.length; i++){
    cb(arr[i], i)
  }
}
// 用户调用：
forEach([1,2,3], (item)=>{  console.log(item); })
```

返回值：赋值函数的返回值类型 >= 被赋值函数的返回值

```ts
type sum1 = () => string | number;
type sum2 = () => string;

let fn1: sum1;
let fn2!: sum2;
fn1 = fn2;
```

逆变与协变：

- 函数参数少可以兼容多，是逆变的
- 函数返回值多可以兼容少，是协变的
- 对象属性多可以兼容少，是协变的

根据上述规则，可以实现下面的推导公式：

```ts
type Arg<T> = (arg: T) => void
type Return<T> = (arg: any) => T
type ArgType = Arg<Parent> extends Arg<Child> ? true : false // 逆变
type ReturnType = Return<Grandson> extends Return<Child> ? true : false // 协变
```

逆变带来的问题:

```ts
interface Array<T> {
  // concat: (...args: T[]) => T[]; // 严格参数逆变检测：Child 无法 赋予给 Parent
  concat(...args: T[]): T[]; // 不进行参数逆变检测
  [key: number]: T;
}
let parentArr!: Array<Parent>;
let childArr!: Array<Child>;

parentArr = childArr; // 子应该可以赋予给父的~~~
```

4. 类的兼容性：子类可以赋给父类

```ts
class ClassA {
  name: string = "jw";
  age: number = 30;
}
class ClassB {
  name: string = "jw";
  age: number = 30;
  address: string = "回龙观";
}
let parent: ClassA = new ClassB(); // 可以看成ClassB是继承于ClassA的子类，子类赋予给父类兼容
```

注意，只要有 private 或者 protected 关键字，两个类就无法兼容

5. 泛型

```ts
interface IT<T> {}
let obj1: IT<string>;
let obj2!: IT<number>;
obj1 = obj2;
```

6. 枚举：没有兼容性

#### 标称类型

ts中没有标称类型（标称类型：根据名称来区分类型），但可以自己实现：

```ts
type Nominal<T, U extends string> = T & { __tag: U };
type BTC = Nominal<number, "btc">;
type USDT = Nominal<number, "usdt">; // 标称类型

let btc: BTC = 1000 as BTC;
let usdt: USDT = 1000 as USDT;
function getCount(count: BTC) {
  // 获取BTC的数量
  return count;
}
let count = getCount(usdt); // 报错：无法传入usdt
```

### 类型保护

即类型的收窄。

- typeof
- instanceof
- in
- 联合类型

自定义类型保护：

```ts
interface Fish {
  swiming: string;
}
interface Bird {
  fly: string;
  leg: number;
}
function isBird(animal: Fish | Bird): animal is Bird {
  return "swiming" in animal;
}
function getAniaml(animal: Fish | Bird) {
  if (isBird(animal)) {
    animal;
  } else {
    animal;
  }
}
```

注意，ts是静态类型检测，内部方法无法解析外层函数的默认值

### 自定义类型

### 模板字符串

与es6类似。

模板字符串也有分发能力：

```ts
type IR = "1.0" | "2.0" | "3.0"
type IL = 20 | 30 | 40
type IRL = `${IR}-${IL}`
```

通过泛型传入时，模板字符串中的变量类型必须约束：

```ts
type sayHello<T extends string | boolean | null | undefined | number | bigint> = `hello, ${T}`
```

也可以偷懒，但必须确保 T 传入的是字符串：

```ts
type sayHello<T> = `hello, ${T & string}`
```

所有基础类型的模板字符串都是字面量类型的父类型：

- ts中，字面量类型是基础类型的**子类型**。比如：`'abc'` 是 `string` 的子类型

```ts
type R2 = sayHello<20> // 字面量字符串类型
type R3 = sayHello<number> // string类型
type IFlag = R2 extends R3 ? true : false // true
```

用法：模板字符串进行变量的重命名操作

```ts
type Person = { name: string; age: number; address: string };
type RenamePerson<T> = {
  [K in keyof T as `re_$ {K & string}`]: T[K]; // K & string 保证K为string类型
}
let person: RenamePerson<Person> = {
  re_name: "jiang",
  re_age: 30,
  re_address: "回龙观",
}
```

模板字符串支持工具类型：Uppercase、Lowercase、Capitalize 、Uncapitalize

实现根据对象生成对应的getter方法（vue3  @xxx-> onXxxx   emit('xxx')）

```ts
type PersonGetter<T> = {
  [K in keyof T as `get$ {Capitalize<K & string>}`]: () => T[K];
};
let personGetter!: PersonGetter<Person>;
let r3 = personGetter.getName();
let r2 = personGetter.getAge();
let r1 = personGetter.getAddress();
```

模板字符串支持infer：

```ts
type GetNameFirstChar<T> = T extends `${infer F} ${infer X}` ? F : never
type FirstChar = GetNameFirstChar<"yu xin"> // yu
```

## 装饰器

ES6 提出了装饰器。

装饰器本质是一种特殊的函数，它可以对：类、属性、方法、参数进行扩展，同时能让代码更简洁

装饰器依然是实验性特性，需要开发者手动调整配置，来开启装饰器支持

装饰器有 5 种：

- 类装饰器
- 属性装饰器
- 方法装饰器
- 访问器装饰器
- 参数装饰器

### 类装饰器

类装饰器：应用在类声明上的函数，可以为类添加额外的功能，或添加额外的逻辑

- 参数
  - target：被装饰的类

```ts
function Demo(target: Function) {
  console.log(target); // 打印Person类
}
@Demo
class Person {}
```

返回值：

- 有返回值：返回的新类替换掉被装饰的类
- 无返回值：被装饰的类不会被替换

构造类型：

- new：表示该类型是可以用 new 操作符调用。
- ...args：表示构造器可以接受【任意数量】的参数。
- any[]：表示构造器可以接受【任意类型】的参数。
- {}：表示返回类型是对象(非 null、非 undefined 的对象)。

```ts
type Constructor = new (...args: any[]) => {};
```

应用：设计一个 LogTime 装饰器，可以给实例添加一个属性，用于记录实例对象的创建时间，再添加一个方法用于读取创建时间

```ts
type Constructor = new (...args: any[]) => {};

interface Person {
  getTime(): Date;
  log(): void;
}

function LogTime<T extends Constructor>(target: T) {
  return class extends target {
    createdTime: Date;
    constructor(...args: any[]) {
      super(...args);
      this.createdTime = new Date();
    }
    getTime() {
      return `创建时间: ${this.createdTime}`;
    }
  };
}

@LogTime
class Person {
  constructor(public name: string, public age: number) {}
}

const p1 = new Person("abc", 11);
console.log(p1.getTime());
```

### 装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，可以为装饰器添加参数，可以更灵活地控制装饰器的行为。

其实就是装饰器函数外面再包一层，以便传入更多参数

```ts
// 装饰器工厂
function LogInfo(n: number) {
  // 装饰器
  return function (target: Function) {
    target.prototype.introduce = function () {
      for (let i = 0; i < n; i++) {
        console.log("hihihi");
      }
    };
  };
}
@LogInfo(3)
class Person {
  constructor(public name: string, public age: number) {}
}
```

装饰器可以组合使用，执行顺序为：

- 先【由上到下】的执行所有的装饰器工厂，依次获取到装饰器
- 然后再【由下到上】执行所有的装饰器

### 属性装饰器

参数说明：

- target: 对于静态属性来说值是类，对于实例属性来说值是类的原型对象。
- propertyKey: 属性名

```ts
function Demo(target: object, propertyKey: string) {}

class Person {
  @Demo name: string;
  @Demo age: number;
  @Demo static school: string;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

属性遮蔽：

如下代码展示了：当构造器中的 this.age = age 试图在实例上赋值时，实际上是调用了原型上 age 属性的 set 方法

```ts
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

let value = 99;
// 使用defineProperty给Person原型添加age属性，并配置对应的get与set
Object.defineProperty(Person.prototype, "age", {
  get() {
    return value;
  },
  set(val) {
    value = val;
  },
});

const p1 = new Person("张三", 18);
console.log(p1.age); //18
console.log(Person.prototype.age); //18
```

应用：定义一个 State 属性装饰器，来监视属性的修改：

```ts
function State(target, propertyKey) {
  let key = `__${propertyKey}`;
  Object.defineProperty(target, propertyKey, {
    get() {
      return this[key];
    },
    set(newVal: string) {
      console.log(`${propertyKey}的最新值为：${newVal}`);
      this[key] = newVal;
    },
  });
}

class Person {
  name: string;
  @State age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

### 方法装饰器

### 访问器装饰器

### 参数装饰器

## 模块及命名空间使用

模块：

```ts
// a.ts导出
export default "jw";

// index.ts导入
import name from "./a";
```

### 命名空间

命名空间可以用于组织代码，避免文件内命名冲突（内部模块）。想要被外界使用也可以通过 export 导出命名空间。

命名空间可以嵌套使用。同名的命名空间会自动合并。

命名空间也可用于：扩展类、扩展方法、扩展枚举类型：

```ts
class A {
  static b = "hello b";
}
namespace A {
  export let a = "hello a"; // 给A添加一个a属性
}

function counter(): number {
  return counter.count++;
}
namespace counter {
  export let count = 0;
}

enum ROLE {
  user = 0,
}
namespace ROLE {
  export let admin = 1;
}
```

## 类型声明

用declare声明类型。

类型声明文件：一般情况下，我们会将 declare 声明的内容放置到类型声明文件中即 `.d.ts`中，这样不会影响核心代码，并且统一管理。默认项目编译时会查找所有以 `.d.ts`结尾的文件。

```ts
// global.d.ts
declare let age: number
```

### 第三方声明文件

`@types` 是一个约定的前缀，所有的第三方声明的类型库都会带有这样的前缀

```ts
npm install @types/jquery -S // 查找node_modules/@types/jquery/index.d.ts
```

三斜线指令就是声明文件中的导入语句，用于**声明当前的文件依赖的其他类型声明**。
