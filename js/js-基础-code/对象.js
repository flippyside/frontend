// 为了加快生产对象的速度，就有了函数，函数可以用来批量生产对象
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 把对象共有的属性放在构造函数的原型上
Person.prototype.eat = () => { console.log("吃饭"); }


/**
 * 
 * @param {*} clazz 构造函数
 * @param  {...any} args 参数
 * @returns 对象
 */
function my_new(clazz, ...args) {
    let obj = {};
    // 关联构造函数的原型
    // 也就是给obj添加一个属性（名叫__proto__），指向构造函数的原型，后续可以通过obj.__proto__.eat()调用
    obj.__proto__ = clazz.prototype
    clazz.call(obj, ...args); // 将this指向obj，调用函数Person，给实例的私有属性赋值
    return obj;
}

let abc = my_new(Person, 'abc', 11)

console.log(abc);

abc.__proto__.eat()
// __proto__也叫隐式原型，可以省略
/**
 * `.`也是一个运算符
 * 当调用了一个函数时，先查找对象自己有没有这个属性
 * 如果没有再查找对象的`__proto__`属性上有没有这个属性。
 */
abc.eat()

let obj1 = { name: '123' }
let obj2 = new Object();

function add(a, b) {
    return a + b;
}
let add_ = new Function('a', 'b', 'return a + b')
console.log(add(1, 2), add_(1, 2));

let a = 1
console.log(a.toString());
console.log(new Number(a).toString());

