// 我门在学习ts的过程中主要学习的是ts如何写类型 （ts关注的是类型，不是业务逻辑） 
// 类型的分类： 基础类型、高级类型、内置类型、自定义类型、类型体操
// TS的类型都是在变量后面来写 ：后面是类型 = 后面是值 (ts语法，不是js对象)
// ts的特点，如何来学习？

// 1).ts的目的是什么？从安全角度来考虑使用 (考虑我在赋予结果的时候 是否会发生错误)  error lens
// 2).ts是用来检测类型的，只是提示作用，不是在运行的时候发生的 (运行的时候和ts无关，“代码没有被执行”)
// 3).编译ts之后 类型就消失了，不存在类型了（写的都是空气） 最终生生产环境下 可以增添.d.ts 来对js文件增加类型声明

// ts的特点：在编写代码的时候 并不是所有的变量都要添加类型。 （ts中支持类型推导，根据赋的值来猜测他的类型） 如果猜测的类型是对的不用给类型, 如果猜测的不对，或者类型无法正确的推导 自己写类型

// 1） string number boolean
const name: string = 'jw';
const age: number = 30;
const gender: boolean = true;


// 基础类型， 包装类型  规范 小写的类型一般用于描述基本类型 大写的用来描述的是实例类型
let s1: string = 'abc';
// let s2:string = new String('abc')
let s3: String = '1'; // 在赋予值的时候 子集可以赋予给父级
let s4: String = new String('1'); // 类的类型，类类型，用来描述实例的

// 我们在使用基本类型的时候 需要采用的时候 小写类型来标识
// 数组的概念：用于存储多个类型相同的集合

// 类型[]  Array<类型> 都可以用于声明数组
let arr1: number[] = [1, 2, 3, 4, 5];
let arr2: Array<number> = [1, 2, 3, 4, 5];
let arr3: (number | string)[] = [1, 2, 3, 'a', 'b', 'c'];

// 数组要求的是存储的格式按照特定类型来存储，不关心位置  
// 元组  tuple

// 你赋予的值要求得符合这个结构和顺序, 元组在新增内容的时候 不能增加额外的类型的值，只能是已有的，而且增加后无法访问
let tuple: [string, number, string, number] = ['1', 1, '1', 1]

// 已经约定好没有第四个，后续增加的不算，访问的时候不能访问后增加，安全问题
let item: string = tuple[2]

// 枚举： 自带类型的对象（自己有类型，就是一个对象）
// 约定一组格式我们会用枚举  状态码 权限 数据格式 标志位

// 维护一组常量的时候 可以采用枚举

const enum STATUS { // 常量枚举 不会额外编译成对象， 所以更节约
    'OK' = 'ok',
    'NO_OK' = 100,
    'NOT_FOUND'
}
// 类型可以进行反举 （值是数字的时候 可以反过来枚举）, 枚举没有值会根据上面的索引来自动累加
// 异构枚举 就是枚举中不光有数字 还有字符串. 异构枚举上一个是字符串下一个无法推导
const r = STATUS['OK'];
console.log(r)

// null  undefined  基本类型 ，正常情况下只能赋予给null 和 undefined 

const u: undefined = undefined
const n: null = null
// 如果禁用非严格null检测，null和undefiend 可以赋予给任何类型 （null,undefiend任何类型的子类型）

// void 类型代表的是空类型    undefiend   void  这个void一般值表示函数的返回值
// unefiend 可以赋予给void， 都代表空 (undefiend 是 void的子类型)
function a(): void {
    return undefined
}

// never 永远不，永远达到不了的地方就是never

// 函数无法执行完毕
function whileTrue(): never {
    while (true) { }; // 函数无法达到执行完毕的状态
}

function throwError(): never {
    throw Error(); // 出错函数无法执行完毕
}

// 如果if/else 条件都走完了， 没有遗漏的 后面的类型就是never (完整性保护)

// 111  [1,1,1]
// '111' ['1','1','1']
// true ['t','r','u','e']
function validateCheck(v:never){}
function toArray(val:number | string | boolean) {
    if(typeof val === 'number'){
        return val.toString().split('').map(Number) // [1,1,1]
    }
    if(typeof val === 'string'){
        return val.split('')// [1,1,1]
    }
    if(typeof val === 'boolean'){
        return val.toString().split('') // [1,1,1]
    }
    // never类型 只能被never类型来赋予值
    validateCheck(val); // 代码的完整性保护
}
toArray('abc')
// ...

// any 任何类型 能不写any 就不要用any ， any会导致类型丧失检测  anyScript(如果我们的项目是采用ts编写的，一般情况下any的出现场景不多) 放弃检测，出错就怨自己。 没有ts的加持

// let a1:any = 1;
// a1 = '1';
// a2 = function(){}
// object 引用类型

function create(val:object){ // {} object Object的区别

}
create({})
create(function(){})
create([])

const symbol:symbol = Symbol()
const bigint:bigint = BigInt(Number.MAX_SAFE_INTEGER + 1)
// symbol bigInt
// 非严格模式在关闭的时候 null可以赋予给undefiend
// string number boolean 数组  元组 枚举  null undefiend void never any objectr symbol bigInt 

export { } // 这是一个独立的模块，不好影响其他人
