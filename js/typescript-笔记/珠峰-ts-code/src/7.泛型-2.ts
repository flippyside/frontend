// 接口的返回值可能都是统一的  
// code, data, message
// 泛型的默认值来解决泛型的值默认情况
interface APIResponse<T = any> {
    error: number,
    data: T,
    message?: string
}
interface LoginInfo {
    username: string,
    token: string
}
function login(): APIResponse { // 请求方法
    return {
        error: 1,
        data: {
            username: '张三',
            token: 'xxxx'
        },
        message: '成功'
    }
}
let r = login()

//  在平时开发中我门想使用联合类型 
type IUnion<T = boolean> = T | string | number
type t1 = IUnion
type t2 = IUnion<string[] | number[]>

// 泛型是用户传递的类型（用户随便传？） 在使用泛型的时候 都要添加约束 泛型约束

// 我门在使用泛型的时候 不能直接做运算的 （无法保证泛型的结果 t + t = t?）


// 约束当前这个类型T 需要是 string | number 子类型
function getVal<T extends string | number>(val: T): T {
    return val
}
getVal('123')
getVal(123)
// getVal(true) 因为类型不满足string | number

function getLen<T extends { length: number }>(val: T) {
    return val.length
}
getLen('123')
getLen({ length: 123 })
// getLen(123) 约束是某种类型的子类型

// ts只是对类型做校验，对于真正的业务逻辑不关心
function getObjVal<T extends object, K extends keyof T>(target: T, key: K) {
    return target[key]
}
let person = { name: 'jw', age: 30 };
let animal = { name: 'tom', age: 18, address: 'china' };
getObjVal(animal, "address");


// 类中的泛型

class MyList<T extends string | number = number> {
    private arr: T[] = []
    add(val: T) {
        this.arr.push(val)
    }
    getMax(): T {
        let max = this.arr[0];
        for (let i = 1; i < this.arr.length; i++) {
            let cur = this.arr[i];
            cur > max ? (max = cur) : void 0
        }
        return max
    }
}
const list = new MyList<string>
list.add('1')
list.add('100');
list.add('200');

list.getMax(); // 200

// 求一个数组中的最大值
// 泛型可以使用的场景  函数（参数，返回值） 对象（坑位） 类、 泛型的默认值和 约束
export { }