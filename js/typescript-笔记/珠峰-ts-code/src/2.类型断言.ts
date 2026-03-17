
// 声明类型的时候 如果没有标识类型 他是什么类型？  
// 没有复制的变量默认值是undefined 但是类型是any

// const 是常量意味着定义的值不会修改所以他的类型是一个字面量类型 . const声明变量必须复制 
// let 声明变量 可以修改所以类型范围推到的结果会变大
const a1 = 1
let a2  = 1


// 断言的问题

let strOrNum :string | number; // 如果是联合类型在使用方法的时候 只能采用公共的方法来使用
// 还是从安全性考虑， 在使用联合类型的时候 我门通过会先定义值，在使用. 保证安全

// 1） 指定类型在使用
// strOrNum = '1'
// strOrNum.endsWith();
// strOrNum = 1
// strOrNum.toFixed()

// 2) 我门断言类型后在使用 as断言成某种类型（一定是联合类型中的某一个） ! (非空断言， 表示这个值一定不是空的)
// 不存在结果你自己承担， ts不管了，你认为的一定有值
(strOrNum! as string).charCodeAt(0);
(<number>strOrNum!).toFixed(3); 

// !TS语法  ?js语法 链判断运算符（如果值有再去取值）

let ele = document.getElementById('app');
// ele!.style.background = 'red';
(ele as HTMLElement).style.background = 'red';

// ? 表示的是取值操作，不能赋值  ， ！表示某个变量一定存在
// ele?.style.background
// ?? js语法 合并空值运算符， 三元表达式 但是 false || 取的结果 
// let val = 0 || 100 // 除了 null 和 undefiend 其他都是true

// 值  as xxx 或者 <xxx>值  一般用于联合类型. 将大范围的类型 断言成子类型

(strOrNum! as unknown as boolean); // 双重断言，一般不建议使用，但是还会用到，破坏原有的关系

// 类型别名将类型提取出来
type Direction = 'up'|'down'|'left'|'right'; // 快速构建一个可以复用的类型
let direction:Direction
let up:'down' = direction! as 'down'


export {}