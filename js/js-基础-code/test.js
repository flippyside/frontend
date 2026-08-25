let Promise = require("./手写promise.js");
// const promise = new Promise((resolve, reject) => {
//   resolve('成功');
// }).then(
//   (data) => {
//     console.log('success', data)
//   },
//   (err) => {
//     console.log('failed', err)
//   }
// // )
// Promise.resolve(456).finally(()=>{
//   return new Promise((resolve,reject)=>{
//     setTimeout(() => {
//         resolve(123)
//     }, 1000);
//   })
// }).then(data=>{
//   console.log(data,'success') // 456 success
// }).catch(err=>{
//   console.log(err,'error')
// })
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok1');
  },500);
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('ok2');
  }, 1000);
})

Promise.allSettled([p1,p2]).then(data => {
  console.log('resolve', data);
}, err => {
  console.log('reject', err);
})

// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject("haha");
//   }, 1000);
//   //   reject("失败");
// })
//   .then()
//   .then()
//   .then(
//     (data) => {
//       console.log(data);
//     },(reason) => {
//     throw new TypeError('error')
//   }
//   )
//   .catch((reason) => {
//     console.log("failed", reason);
//   });


// Promise.resolve(1).then((data) => {
//   console.log(data, "success");
// });
// Promise.reject(2).then(null, (data) => {
//   console.log(data, "failed");
// });
// Promise.resolve(
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("ok");
//     }, 1000);
//   }),
// ).then((data) => {
//   console.log(data, "success");
// });

// let b = a.then((value) => {
//     console.log(value);
//     return 'hahaha'
// }, reason => {
//     console.log(reason);
// })

// a.then((value) => {
//     console.log(value);
// }, reason => {
//     console.log(reason);
// })

// Promise.resolve(10)
//     .then(value => {
//         console.log('ok', value); // ok 10
//         // return value * 10
//         throw value
//     })
//     .then(value => {
//         console.log('ok', value);
//         return value * 10
//         throw value
//     })
//     .catch(reason => {
//         console.log('fail', reason); // fail 10
//     })
//     .finally()

// Promise.resolve(10)
//     .then(value => {
//         console.log('ok', value); // ok 10
//         // return value * 10
//         throw value
//     })
//     .then(value => {
//         console.log('ok', value);
//         return value * 10
//     })
//     .then(null, reason => {
//         console.log('fail3', reason);
//     })

// let p1 = new Promise(resolve => {
//     setTimeout(() => {
//         resolve(1)
//     }, 3000);
// })
// let p2 = new Promise(resolve => {
//     setTimeout(() => {
//         resolve(2)
//     }, 2000);
// })

// let p3 = Promise.resolve(3)
// let p4 = 4 // 默认变为 Promise.resolve(4)

// let p = Promise.race([p1, p2, p3, p4])
// p.then((value) => {
//     console.log(value);
// }, reason => {
//     console.log('fail', reason);

// })

// $.ajax({
//     type: "method",
//     url: "url",
//     data: "data",
//     dataType: "dataType",
//     success: function (response) {
//         console.log(response);
//     }
// });

// axios.get('/api2').then(value => {
//     console.log(value);
//     return axios.get('/api2')
// }).then(value => {
//     console.log(value);
//     return axios.get('/api3')
// }).then(value => {
//     console.log(value);
// })

// // 设置三个定时器{2000,1000,3000}，类似于ajax串行（第一个定时器触发后才能设置第二个）
// const sleep = (interval = 1000) => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve()
//         }, interval);
//     })
// }

// sleep(2000)
//     .then(() => {
//         console.log("1");
//         return sleep(1000)
//     })
//     .then(() => {
//         console.log("2");
//         return sleep(3000)
//     })
//     .then(() => {
//         console.log("3");
//     })

// const handler = async () => {
//     await sleep(2000)
//     console.log("1");
//     await sleep(1000)
//     console.log("2");
//     await sleep(3000)
//     console.log("3");
// }

// handler.then(() => {
//     console.log('ok');
// }).catch(() => { })

// const fn = async () => { return 10; };
// console.log(fn()); // Promise { fulfilled 10 }

// const fn1 = async () => {
//     console.log(a);
// };
// console.log(fn1()); // Promise { {<rejected>: ReferenceError: a is not defined }

// const fn2 = async () => {
//     let x = await Promise.resolve(10);
//     console.log(x);
// };
// console.log(fn2())
// /**
// Promise { <pending> }
// 10
//  */

// const fn3 = async () => {
//     await Promise.reject(100);
// };
// fn3();
// console.log(
//     'hahaha'
// );

// const query = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // resolve({ code: 0, data: [1, 2, 3] })
//             reject('fail')
//         }, 1000)
//     });
// }

// (async function (params) {
//     try {
//         let value = await query()
//         console.log(value);
//     } catch (error) {
//         console.log(error);
//     }
// })()

// query().then(value => {
//     console.log(value);
// }, reason => {
//     console.log(reason);
// })

/**
 * p.then(onfulfilled, onrejected)，已知p的状态和值，也不会立即执行onfulfilled或onrejected，而是创建异步微任务，
 * 进入webApi中，当状态变为成功，再进入eventqueue排队等待执行
 */

// let p = new Promise(resolve => {
//     setTimeout(() => {
//         resolve(10)
//         console.log(p, 2);
//     }, 1000);
// })

// p.then(value => {
//     console.log('ok', value);
// })
// console.log(1);

// 1
// Promise { fulfilled, 10 } 2
// // ok 10

// Promise.resolve(1)
//     .then(value => {
//         console.log('ok', value);
//         return 2
//     })
//     .then(value => {
//         console.log('ok', value);
//     })

// const fn = async () => {
//     console.log(1);
//     return 10
// }
// (async function (params) {
//     let result = await fn()
//     console.log(2, result);
// })()
// console.log(3);

// let body = document.body
// body.addEventListener('click', function () {
//     Promise.resolve().then(() => {
//         console.log(1);
//     })
//     console.log(2);
// })

// body.addEventListener('click', function () {
//     Promise.resolve().then(() => {
//         console.log(3);
//     })
//     console.log(4);
// })

// class Iterator {
//     constructor(assemble) {
//         let self = this
//         self.assemble = assemble
//         self.index = 0
//     }
//     next() {
//         let self = this, assemble = self.assemble
//         if (self.index > assemble.length - 1) {
//             return {
//                 value: undefined,
//                 done: true
//             }
//         }
//         return {
//             value: assemble[self.index++],
//             done: false
//         }
//     }
// }

// let itor = new Iterator([1, 2, 3, 4])
// console.log(itor.next());
// console.log(itor.next());
// console.log(itor.next());
// console.log(itor.next());
// console.log(itor.next());

// let arr = [1, 2, 3]

// arr[Symbol.iterator] = function () {
//     let self = this, index = 0
//     return {
//         next() {
//             if (index > self.length - 1) {
//                 return {
//                     value: self[index++],
//                     done: true
//                 }
//             }
//             return {
//                 value: self[index++],
//                 done: false
//             }
//         }
//     }
// }

// for (let value of arr) {
//     console.log(value);
// }

// let obj = { 0: 'abc', 1: 11 , 2: 22, length: 3};
// obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
// for (let value of obj) {
//     console.log(value);
// }

// function* f(x,y) {
//     console.log('hello');
//     console.log(x, y);
//     console.log(this);

//     return 10
// }

// let itor = f(10, 20)
// console.log(itor); // Object [Generator] {}
// console.log(itor.next()); // hello { value: 10, done: true }

// function* generator() {
//     let res = yield 1;
//     console.log(res);
//     res = yield 2;
//     console.log(res);
//     res = yield 3;
//     console.log(res);
// }
// let itor = generator()
// console.log(itor.next(100)); // 第一次执行next传递的值没有用
// console.log(itor.next(200)); // 将200赋值给第一个res。每次next传递的值，会作为上一次yield执行的返回值
// console.log(itor.next(300));

// function* generator1() {
//     yield 1
//     yield 2
// }
// function* generator2() {
//     yield 3
//     yield* generator1() // yield*：表示进入到新的generator函数中
//     yield 4
// }
// let itor = generator2()
// console.log(itor.next()); // { value: 3, done: false }
// console.log(itor.next()); // { value: 1, done: false }
// console.log(itor.next()); // { value: 2, done: false }
// console.log(itor.next()); // { value: 4, done: false }

/**
    { value: 1, done: false }
    200
    { value: 2, done: false }
    300
    { value: 3, done: false }
 */
/**
A
{ value: 10, done: false }
B
{ value: 20, done: false }
C
{ value: 100, done: false }
{ value: undefined, done: true }
 */

// // 需求：并行发送三次请求，间隔1s、2s、3s
// const query = interval => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(interval)
//             // reject('fail')
//         }, interval)
//     });
// }

// const isPromise = function isPromise(x) {
//     if (x !== null && /^(object|function)$/i.test(typeof x)) {
//         var then
//         try {
//             then = x.then
//         } catch (e) {
//             return false
//         }
//         if (typeof then === 'function') return true
//     }
//     return false
// }

// function* generator() {
//     let value = yield query(1000)
//     console.log('第一次请求', value);
//     value = yield query(2000)
//     console.log('第二次请求', value);
//     value = yield query(3000)
//     console.log('第三次请求', value);
// }

// // co.js
// function AsyncFunction(generator, ...params) {
//     return new Promise((resolve, reject) => {
//         let itor = generator(...params)
//         const next = val => {
//             let { value, done } = itor.next(val) // value：第一次请求的promise实例
//             if (done) {
//                 resolve(value)
//                 return;
//             }
//             if (!isPromise(value)) {
//                 value = Promise.resolve(value)
//             }
//             value.then(val => next(val))
//                 .catch(reason => {
//                     reject(reason)
//                     itor.throw(reason)
//                 })
//         }
//         next()
//     })
// }

// AsyncFunction(generator).then(val => {
//     console.log('请求都成功 ', val);

// }).catch(reason => {
//     console.log('某次请求失败', reason);
// })

// let itor = generator()
// // itor.next().value：第一次请求的promise实例
// itor.next().value.then(val => {
//     // val：第一次请求的结果
//     console.log(val); // 1000
//     itor.next(val).value.then(val => {
//         console.log(val); // 2000
//         itor.next(val).value.then(val => {
//             console.log(val); // 3000
//             itor.next(val)
//         })
//     })
// })

// let xhr = new XMLHttpRequest()
