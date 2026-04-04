## Typescript 中 type 和 interface 的区别是什么？

type:
- 给类型起别名。例如`type UserID = string;`，这里 `UserID` 就是一个类型别名，等价于 `string`。
- 作用：让代码更易读
- 常用场景：
  - 对象类型别名
  - 联合类型别名
  - 交叉类型别名
  - 函数类型别名
  - 泛型 + type

```ts
// 常用场景举例

type User = {
  name: string;
  age: number;
}; // 对象

type Status = "success" | "fail" | "pending"; // 联合

type Name = { name: string };
type Age = { age: number };
type Person = Name & Age; // 交叉类型：需同时满足

type Add = (a: number, b: number) => number; // 函数

type ApiResponse<T> = {
  code: number;
  data: T;
  msg: string;
}; // 泛型 + type

const res: ApiResponse<string> = {
  code: 200,
  data: "ok",
  msg: "success"
};
```

interface：
- 用来描述数据形状的 （对象、类、函数、混合类型）
- 接口中的内容都是抽象的 （不能有具体的实现）
- 作用：约束函数的参数、返回值

例如，对象接口：
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
};
```

interface 与 type 的区别：

- 相同点：interface 和 type 都可以用于定义对象结构，在定义对象结构时两者可以互换。
- 不同点：
  - interface：更专注于定义**对象和类**的结构，支持extends扩展、合并
  - type：可以定义类型别名，例如联合类型、交叉类型等，但不支持extends和自动合并

## 讲讲 Typescript 中的泛型？

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

&，将多个类型合并为一个类型（交集，数学集合意义上的合并）：

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

## Typescript 如何实现一个函数的重载？

思路：
- 定义多个函数签名，然后再定义对应的函数实现
- 使用 `typeof` 判断参数的类型，根据类型执行对应的操作

```ts
// 定义函数签名
function add(a: number, b: number): number; // 函数签名 1
function add(a: string, b: string): string; // 函数签名 2

// 定义函数实现
function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b; // 函数实现 1
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a.concat(b); // 函数实现 2
  } else {
    throw new Error('参数类型不匹配'); // 参数类型不匹配时抛出错误
  }
}

// 调用函数
console.log(add(1, 2)); // 输出: 3
console.log(add('Hello', 'World')); // 输出: HelloWorld
```
