// 反射元数据
// Object.defineProperty  Object.setPrototypeof ... 修改了js执行时，执行过程
// Reflect.defineProperty Reflect.setPrototypeof   proxy/reflect

// 反射的概念就是可以修改程序执行的时候的行为

// 元数据： 描述数据的数据
// 修改执行代码的行为 对数据进行描述  Reflect.defineMetadata

// import "reflect-metadata";

// class Eat {}
// @Reflect.metadata("Class", "class matedata")
// class Animal {
//   @Reflect.metadata("Class Property", "class property matedata")
//   static type = "animal";

//   @Reflect.metadata("Proto method", "eat metadata")
//   eat(val: Eat) {}
// }
/*
weakmap => {
    Animal:{
        undefined: {class:"class matedata"},
        type: {'Class Property':class property matedata}
    },
    Animal.prototype:{
        eat:{"Proto method":"eat metadata"}
    }
}
*/
// 命令式代码， 声明式
/*
Reflect.defineMetadata("Class", "class matedata", Animal);
Reflect.defineMetadata(
  "Class Property",
  "class property matedata",
  Animal,
  "type"
);
*/
// Reflect.defineMetadata("Proto method", "eat metadata", Animal.prototype, "eat");
// console.log(Reflect.getMetadata("Class", Animal));
// console.log(Reflect.getMetadata("Class Property", Animal, "type"));
// const animal = new Animal();
// console.log(Reflect.getMetadata("Proto method", animal, "eat"));

// ---------
import "reflect-metadata";

const REQUIRED_KEY = Symbol("REQUIRED_KEY");
function Required() {
  return function (target: any, key: string) {
    // 先看原型上是否有值
    const requireKeys = Reflect.getMetadata(REQUIRED_KEY, target) || [];
    // 如果有值添加 没值就定义
    Reflect.defineMetadata(REQUIRED_KEY, [...requireKeys, key], target);
  };
}

// 声明式
class Person {
  @Required()
  name!: string; //  sequlize

  @Required()
  age!: number;
}
const person = new Person();
person.name = "abc";
person.age = 18;

const existsProps = Reflect.ownKeys(person);
const requireKeys = Reflect.getMetadata(REQUIRED_KEY, person);

for (let key of requireKeys) {
  if (!existsProps.includes(key)) {
    throw new Error(key + " is required");
  }
}

export {};
