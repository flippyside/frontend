// import export 外部模块，就是隔离多个不同的文件

// namespace 内部模块  隔离同一个文件的

// let obj = {
//   Zoo: function () {
//     class Dog {}
//     return Dog;
//   },
//   Home: function () {
//     class Dog {}
//     return Dog;
//   },
// };

// import { Zoo, Home } from "./module/dog";
// console.log(Zoo.Dog, Home.Dog, Zoo.a, Home.b, Zoo.House.Dog);
// 业务逻辑中使用不到

// 在声明文件中 可以通过namespace来进行一系列扩展 (不是自己写，一般都是生成)

// 扩展类 、 函数、 枚举 扩展的命名空间必须写在这些声明的下面

class Zoo {}
namespace Zoo {
  export let a = 1; // static a =1
}

function counter() {
  return counter.count++;
}
// counter.count = 0
namespace counter {
  export let count = 0;
}

enum Seson {} // Spring = "春";
namespace Seson {
  export let Spring = "春";
}
Seson.Spring;

// 声明文件、 装包、拆包 、 类型体操
// (keyof typeof)
// never 所有类型的子类型 （底端类型） 我不想要的就是never, 完整性保护
// 字面量类型
// 基础类型 （基础类型 string, number ,boolean null undefied void ）
// 数组、元组、枚举
// 非基础类型 object
// 包装类型
// any unknown
// 联合类型、 交叉类型  （断言） as ！?  双重断言

// 函数（签名）： 参数、返回值、可选的？ 默认值= 剩余参数... this的问题  函数的重载（类型重载）
// 逆变和协边 {concat():void} 而不熟  {concat:()void}   传父 返子

// 类 修饰符 private protected public readonly  (private constructor) 子类重写方法的问题
// 类型兼容 原型方法和实例方法的声明。  抽象类 , 类类型，构造函数类型

// 接口： 可选？  readonly 任意类型 ，可索引接口  extends implements
// type 和 interface的区别

// 泛型 （坑位）， 用的时候传递类型 （默认泛型，泛型约束）
// 条件类型 （子extend父） 映射类型  （子：子类型、子结构，父：父类型、父结构）
// 分发的问题 有好有坏 （需要禁用分发的时候  T & {}   [T]）

// extract exclude
// Partial Readonly...
// Pick Omit Record
// infer的作用

// 兼容性， 内置的类型推导 （右边复制可以推导类型，函数提供上下文可以推导类型， 返回值也可以推导）
// 类型保护 typeof instanceof in 可辨识类型、 is

// 重映射 + 自定义类型
