// 函数中的类型 1）函数的声明方式 2） 函数的参数  3） 函数的返回值

// function关键字来声明的函数可以提升到当前作用域顶部

// 对于ts来说有区别： 函数关键字声明的函数 不能标注函数类型

// 通过表达式来声明的函数： 必须赋予的值要满足定义的类型 (要求有一个兼容性在里面)

// function sum(a,b){
//     return a+b
// }

// 1)函数类型的定义  (a: any, b: any) => any  ｜   (a: any, b: any) : any
// type ISum = {(a: any, b: any) : any}
// type ISum =  (a: any, b: any) => any
// const sum:ISum  = function(a:string,b:string){
//     return a+b
// }
// 如果标明函数的类型，在使用函数的时候以标明的为准


// 2)参数 可选参数 ? 可选参数 意味着可以不传 和 string | undefiend 必须得传。 可选参数只能在参数列表中的后面
// 默认值 = 
// type ISum =  (a: string, b?: string) => string
// const sum = function(a:string,b:string = 'abc'){
//     return a+b
// }
// // 这里如果是兼容处理 采用的是自己标识的  不是你复制的类型
// sum('1')

// 3) 参数this问题
// 尽量不采用this 来作为函数的上下文， this的缺陷就是类型推导问题
// 如果想限制this类型 那么需要手动指定this类型

function getValue(this: IPerson, key: IKeys) { // this不是行参 是标明this的类型
    return this[key];
}
// 我想根据值来获得类型  typeof， 配合type来声明新的类型
// keyof 可以获取对象中的类型 作为联合类型
const person = { name: 'jw', age: 30, address: '昌平霍营' }

type IPerson = typeof person; // 提取对象的类型为IPerson, type类型会提升到顶部
type IKeys = keyof IPerson;

// 可以将子类型赋予给父类型 
getValue.call(person, 'age')


// 函数中有arguments 但是我们不建议使用
// function sum(...args:number[]):number{ // （函数式编程 入参和返回值 组合式api） 函数 （不考虑使用this 和 arguments）
//     return args.reduce((memo,current)=>(memo += current,memo),0)
// }

// 参数的类型直接参数后面:标识  函数的返回值在 {}前面来标识
// const sum: (...args:any[])=> any = (...args:any[]) :any=> {
//     return 
// }

// ts 中函数有一个概念 叫重载(类型的重载)， 对于强类型语言可以一个函数写多遍（参数不同） js实现重载考的是arguments

// 入参是一个字符串 或者是数字  -》 【‘字符串’】  【‘数字’】


// string[] | number[]    (number|string)[]


function toArray(value: string): string[]// 具体的某一种方案
function toArray(value: number): number[];
// 上面的声明仅仅是类型上的重载
function toArray(value: string | number): string[] | number[] { // 所有的实现
    return []
}
let arr1 = toArray('abc')
let arr2 = toArray(123)

export { }