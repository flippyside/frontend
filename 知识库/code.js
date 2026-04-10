// // function add(a, b) {
// //     console.log("processing...");
// //     return a + b;
// // }

// // const resovler = (...args) => JSON.stringify(args);
// // function memorize(func, resovler) {
// //     let cache = {};
// //     let memorized = (...args) => {
// //         const key = resovler(...args);
// //         if (cache[key]) {
// //             return cache[key]
// //         }
// //         else {
// //             return cache[key] = func(...args)
// //         }
// //     }
// //     return memorized
// // }

// // const memoAdd = memorize(add, resovler)
// // console.log(memoAdd(1, 2)); // processing...  3
// // console.log(memoAdd(1, 2)); // 3
// // console.log(memoAdd(1, 2)); // 3

// // function add(a, b, c) {
// //     return a + b + c
// // }

// // function curry(func) {
// //     let argsLength = func.length // 函数期望的参数个数
// //     let curried = (...args) => {
// //         if (args.length < argsLength) { // 返回函数
// //             return (...rest) => curried(...args, ...rest)
// //         }
// //         // 参数齐了，直接返回结果
// //         return func(...args)
// //     }
// //     return curried
// // }

// // let curriedAdd = curry(add)
// // console.log(curriedAdd(1)(2, 3)); // 6

// function add1(str) {
//     return str + 1
// }

// function add2(str) {
//     return str + 2
// }

// function add3(str) {
//     return str + 3
// }

// // // reduceRight：从右向左，对累加器和数组的每个值应用一个函数，计算出一个值
// // // 第一次执行：a, b = add1, add2, 返回值：(...args) => add1(add2(...args))
// // // 第二次执行：a, b = (...args) => add1(add2(...args)), add3, 返回值：(...args) => add1(add2(add3(...args)))
// // function flow(...fns) {
// //     if (fns.length == 1) return fns[0]
// //     return fns.reduceRight((a, b) => (...args) => a(b(...args)))
// // }

// function flow(...fns) {
//     if (fns.length == 1) return fns[0]
//     return fns.reduce((a, b) => (...args) => a(b(...args)))
// }
// let flowed = flow(add3, add2, add1)
// let r1 = flowed('a')

// console.log(r1); // a321

let _ = require('lodash')
let str = 'click button'
let r1 = _.split(str, ' ')
console.log(r1);
let r2 = _.toUpper(r1)
console.log(r2);
let r3 = _.split(r2, ',')
console.log(r3);
let r4 = _.join(r3, '_')
console.log(r4);

/**
 * 函子
 */
class Functor{
    constructor(value){
        this.value = value
    }
    // 用于生产实例
    static of(value){
        return new Functor(value)
    }
    // 接收函数，返回同类型的对象
    map(fn){
        return new Functor(fn(this.value))
    }
}
let functor = Functor.of(1)
                     .map(x=>x+1)
                     .map(x=>x+2)
                     .map(x=>x+3)
console.log(functor); // Functor { value: 7 }
