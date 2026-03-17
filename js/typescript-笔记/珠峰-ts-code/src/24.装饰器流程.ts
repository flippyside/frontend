// 洋葱模型

function Echo(val: string) {
  console.log(val);
  return function (
    target: any,
    value?: any,
    descriptor?: PropertyDescriptor | number
  ) {
    console.log(val);
  };
}
@Echo("类的装饰器3")
@Echo("类的装饰器2")
@Echo("类的装饰器1")
class Flow {
  constructor(@Echo("构造函数参数装饰器") val: string) {}
  @Echo("静态属性装饰器")
  static type = "flow";
  @Echo("静态方法装饰器")
  static getType() {
    return this.type;
  }

  @Echo("原型方法装饰器")
  flowFn(@Echo("原型方法参数装饰器") val: string) {}

  @Echo("属性访问器装饰器")
  get value() {
    return "abc";
  }
  @Echo("实例属性装饰器")
  private name = "abc";
}
// 对于实例来说的装饰器 ， 先走参数 ，在走方法
// 属性访问器装饰器
// 原型方法参数装饰器
// 原型方法装饰器
// 实例属性装饰器

// 静态属性装饰器
// 静态方法装饰器
// 构造函数参数装饰器
// 类的装饰器

// 先实例 -》 在静态的 -》 构造函数 -》 （类最后执行）

// 装饰器的使用 切片 -》 类装饰器是最后执行的

export {};
