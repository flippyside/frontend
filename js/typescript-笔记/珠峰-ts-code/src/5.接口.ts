// 接口： 抽象类（有抽象的也有非抽象）  接口必须都是抽象的（没有具体的实现）
// 接口的概念 就是描述数据的结构、或者形状的， 定义好结构，在去针对结构来进行实现

// type 和 interface 区别
// 一般情况下 描述对象,类 我门采用interface更多一些 ，interface无法声明联合类型
// type 可以快速声明类型 联合类型，工具类型只能采用type  , type不能重名
// type用的更多，能用type 就type 不能用interface. 复杂类型采用type


// 1) 接口可以描述对象结构 （子可以赋予给父）
// interface IPerson {
//     username: string // 类型，不是具体实现
//     age:number
// }
// // 子可以赋予给父亲。 我们需要把一个值赋予给另一个值。 如果是声明的必须必须一致
// let obj = {
//     username:'abc',
//     age:30,
//     address:'地址'
// }
// let person:IPerson = obj; // 赋值的时候 会产生兼容性  （儿子可以赋予给父亲）

// 2） 接口可以描述函数
// interface ICounter {
//     ():number
//     count:number
// }
// // const 标识此值不能修改  let 可以修改的 (如果给函数增加类型定义 函数不能被修改时只能用const)
// const counter:ICounter = () =>{
//     return counter.count++
// }
// counter.count = 0;


// 1）可以通过?表示接口的属性 可有可无
// interface IVeg {
//     name: string
//     taste: string;
//     size: number,
//     color?: string
// }
// 2）断言的方式来进行赋值, 用的最多 as IVeg
// 3）接口的合并 同名的会进行合并,自定义类型的时候 会使用。 自己的业务逻辑用的比较少
// 4) 可以扩展一个新类型 在来使用。 可以扩展属性
// 5）任意类型  随机的属性  描述数字索引的  (除了必有的属性之外 ，其他任意)
// 6）兼容性 
interface IVeg {
    readonly name: string // 只读属性
    taste: string;
    size: number,
}
interface IVegetable extends IVeg {
    color?: '红色',
    [prop: string]: any // 任意接口 key 随意，值随意
}
const veg: IVegetable = {
    name: '西红柿',
    taste: '甜',
    size: 50,
    color: '红色',
    'a': 1,
    'b': '2',
    [Symbol()]: 'ABC',
    0: 1
}
interface IArray { // 索引接口
    [key: number]: any
}
// let arr:IArray = [1,2,3]
let arr: IArray = { 0: 1, 1: 2, 2: 'abc', 3: true }

interface ResponseData {
    username: string,
    token: string
}
interface ReturnVal {
    code: number,
    data: ResponseData
}

// 通过索引访问符 来获取内部类型

type ICode = ReturnVal['code'];
type IUsername = ReturnVal['data']['username']; // 可以用于取值的类型
type IKeys = ReturnVal[keyof ReturnVal]; // 取值的类型, 可以采用这种方式


// 接口可以实现， 接口的实现都是通过类来实现 , 接口中一个类 可以实现多个接口
// 一个接口可以继承多个接口， 接口可以用于继承类


interface SpeakChinese {
    speakChinese(): void
}
interface SpeakEnglish {
    speakEnglish(): void
}
class Speak {
    public a!: string;
}
interface Speakable extends SpeakEnglish, SpeakChinese, Speak {
    speak(): void // 实现的是原型方法
    //  speak:()=>void // 实现的是实例方法
}
class Speaker implements Speakable {
    public a!: string;
    speakEnglish(): void {
        throw new Error("Method not implemented.");
    }
    speakChinese(): void {
        throw new Error("Method not implemented.");
    }
    speak() {
        return 100
    }
}


// 我门如何表示我要传入的是一个类


class Dog {
    constructor(public name: string) { } // new
}

class Cat {
    constructor(public name: string) { }
}
// 类类型， 不能藐视类本身，描述的是实例
// 类的类型 需要通过typeof 来取类型
// ts的校验规则  鸭子类型检测

// 描述构造函数 
// interface IClazz<T>{
//     new (name:string): T
// }
type IClazz<T> = new (name: string) => T
function createInstance<T>(clazz: IClazz<T>, name: string) {
    return new clazz(name)
}
const instance = createInstance(Cat, 'tom')
// 泛型： 泛型坑位 （函数的形式参数） 刚开始类型不确定，通过使用的时候 来确定类型


export { }