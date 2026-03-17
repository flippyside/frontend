// 联合类型（并集） ｜  按位或   交叉类型 （交集） & 按位与 
interface Person1 {
    handsome:string,
    gender:number
    meta:{
        n:number
    }
}
interface Person2 {
    high:string,
    gender:string
    meta:{
        n:string
    }
}
type Person3 = Person1 & Person2
type IGender = Person3['meta']['n']; // 如果两个类型不相同没有交集 &集后的结果是never
// let person:Person1 | Person2 = {
//     high:'高'
// }
// 交叉类型 同时是两个类型的子类型， 最终的结果可以赋予给任何的一个类型
// let person:Person1 & Person2 = {
//     handsome:'帅',
//     high:'高',
// }
// 子类型可以赋予给 父类型 （子类型的结构要包含父类型的结构）

// let person1:Person1 =person
// let person2:Person2 =person
// 快速扩展属性 
let obj = {name:'jw',age:30}
let person:{name:string,age:number,address:string} = obj as typeof obj & {address:string}
function merge<T extends object , K extends object>(o1:T,o2:K){
    return {...o1,...o2}
}
let result = merge({name:'abc'},{name:123})
// result.name
// 交叉类型和联合类型的区别， 平时我门使用的交叉类型场景还是很多的
export {}