
// 泛型可以用于 函数、接口、类、type
// 如果在使用的时候 无法确定当时的类型，可以采用泛形来定义
const createArr = <T>(times: number, val: T): T[] => {
    const arr = []
    for (let i = 0; i < times; i++) {
        arr.push(val)
    }
    return arr
    // return Array.from({length:times}).fill(val)  as  T[]
}
console.log(createArr(3, 'abc'))
console.log(createArr(3, 123))

// 写辅助函数的函数的时候可以写 多个泛型用于保存值
// 值的交换
// function swap<T,K>(tuple:[T,K]):[K,T]{
//     return [tuple[1],tuple[0]]
// }
// const r = swap(['jw',true])


// IForEach<T> 表示使用接口的时候确定类型
// <T>():void 在使用这个函数的函数传入类型
// interface IForEach {
//     <T>(arr: T[],callback:(val:T)=>void): void
// }


// type ICallback = <T>(val: T) => void  //  错误写法 泛型的使用需要能正常推到，但是内部的callback没有真正的执行，还是认为arr:T[]
// type IForEach = <T>(arr: T[], callback: ICallback) => void
// const forEach: IForEach = (arr, callback) => {
//     for (let i = 0; i < arr.length; i++) {
//         // ts 并没有真正的执行内部的callback(arr[i])
//         callback(arr[i])
//     }
// }
type ICallback<T> = (val: T) => void  // 2
type IForEach = <T>(arr: T[], callback: ICallback<T>) => void
const forEach: IForEach = (arr, callback) => {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i])
    }
}
// 使用forEach才传递的类型，而不是定义接口的时候 传递类型

// string | number | {}
forEach(['A', 2, 3,{}], function (val) {
    console.log(val)
})
export { }