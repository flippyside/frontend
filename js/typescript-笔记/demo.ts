type Constructor = new (...args: any[]) => {};

// interface Person {
//   getTime(): Date;
//   log(): void;
// }

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

const p1 = new Person("abc", 11);
