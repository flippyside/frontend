/**
 * 
 Promise 的基本特征：
1. promise 有三个状态：pending，fulfilled，or rejected；
2. new promise时， 需要传递一个executor()执行器，执行器立即执行；
3. executor接受两个参数，分别是resolve和reject；执行executor时如果报错，promise会调用reject
4. promise  的默认状态是 pending；
5. promise 有一个value保存成功状态的值，可以是undefined/thenable/promise；
6. promise 有一个reason保存失败状态的值；
7. promise 只能从pending到rejected, 或者从pending到fulfilled，状态一旦确认，就不会再改变；
8. promise 必须有一个then方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；
9. 如果调用 then 时，promise 已经成功，则执行onFulfilled，参数是promise的value；
10. 如果调用 then 时，promise 已经失败，那么执行onRejected, 参数是promise的reason；
11. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected；
 */
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

// 基础版promise：只能处理同步操作
class Promise_BASIC {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    let resolve = (value) => {
      if (this.state == PENDING) {
        this.state = FULFILLED;
        this.value = value;
      }
    };
    let reject = (reason) => {
      if (this.state == PENDING) {
        this.state = REJECTED;
        this.reason = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.state === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.state === REJECTED) {
      onRejected(this.reason);
    }
  }
}

// promise：可以处理异步操作
// 如果在Promise仍为pending时调用了then，就将成功和失败的回调存储起来
// 在executor()的异步任务被执行时，触发 resolve 或 reject，依次调用先前存放的成功或失败的回调。
// 【发布订阅模式：收集回调 -> 触发通知 -> 取出回调执行】
class Promise_ASYNC {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCbs = [];
    this.onRejectedCbs = [];
    let resolve = (value) => {
      if (this.state === PENDING) {
        this.value = value;
        this.state = FULFILLED;
        this.onFulfilledCbs.forEach((cb) => cb());
      }
    };
    let reject = (reason) => {
      if (this.state === PENDING) {
        this.value = reason;
        this.state = REJECTED;
        this.onRejectedCbs.forEach((cb) => cb());
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onfulfilled, onrejected) {
    if (this.state === PENDING) {
      this.onFulfilledCbs.push(() => onfulfilled(this.value));
      this.onRejectedCbs.push(() => onrejected(this.reason));
    } else if (this.state === FULFILLED) {
      onfulfilled(this.value);
    } else if (this.state === REJECTED) {
      onrejected(this.reason);
    }
  }
}

/**
then 的参数 onFulfilled 和 onRejected 可以缺省，如果 onFulfilled 或者 onRejected不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；
promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"
如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；
如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；
如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；
如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；

 */

// 【标准版promise】：实现 then 的链式调用&值穿透特性

/**
 * 工具函数，处理 then 回调函数的返回值 x，并决定 promise2 的最终状态（resolve or reject）
 * 如果x.then的返回值还是promise，递归调用resolvePromise，直到返回值是普通值，才能调用resolve并传入x
 * @param {*} promise2
 * @param {*} x
 * @param {*} resolve promise2的resolve
 * @param {*} reject promise2的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x)
    // promise 和 x 不能相同，即不能自己等待自己完成
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>"),
    );

  let called; // Promise/A+ 2.3.3.3.3 规定只能调用一次resolve 和 reject，预防不规范的第三方实现
  // x 可能是 promise（或者类promise对象/thenable对象）
  if ((typeof x === "object" && x != null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        // x 是 promise（或者类promise对象/thenable对象）
        // 调用x.then(onfulfilled,onrejected)，value是onfulfilled的返回值，可能还是promise
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          },
        );
      } else {
        // x是普通值
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // x是普通值
    resolve(x);
  }
}
/**
 * resolvePromise的一些细节
Q：为什么用 then.call(x, ...) 而不直接 x.then(...)？
A：防止多次访问属性：有些对象在访问 .then 属性时可能会有副作用（通过 Object.defineProperty 定义的 getter）。
                   我们先存下 let then = x.then，之后只用这个存好的变量。
                   */

class Promise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCbs = [];
    this.onRejectedCbs = [];
    let resolve = (value) => {
      // 如果 resolve 的是一个 Promise，递归拆解它
      if (value instanceof Promise) {
        // 这里的 value.then 会在 value 成功后再次调用当前实例的 resolve
        return value.then(resolve, reject);
      }
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCbs.forEach((cb) => cb());
      }
    };
    let reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCbs.forEach((cb) => cb());
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onfulfilled, onrejected) {
    // 如果onfulfilled/onrejected没有传值，默认把value/reason穿透传递给下一个promise
    onfulfilled = typeof onfulfilled === "function" ? onfulfilled : (v) => v;
    onrejected =
      typeof onrejected === "function"
        ? onrejected
        : (err) => {
            throw err;
          };

    // then会返回一个新Promise实例, 这里记为promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === PENDING) {
        this.onFulfilledCbs.push(() => {
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCbs.push(() => {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      } else if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
            // Q：为什么不能直接返回promise类型的x？
            // A：直接返回x，会导致then链获得的是promise对象，甚至是嵌套的promise对象，还需要手动拆箱才能获取数据，不符合直觉
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });
    return promise2;
  }
}

// ====== promise的各种方法实现 ======

// 注意区分静态方法Promise.resolve和constructor内部的局部变量resolve
Promise.resolve = (value) => {
  // 1. 如果 value 本身就是当前构造函数的实例，直接返回它
  if (value instanceof Promise) {
    return value;
  }
  // 2. 否则，返回一个新的 Promise 实例
  return new Promise((resolve, reject) => {
    // 3. 利用我们之前写的 resolvePromise 逻辑来处理 value
    resolve(value);
  });
};

Promise.reject = (reason) => {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

Promise.prototype.catch = function (errCb) {
  return this.then(null, errCb);
};

// 无论 Promise 成功还是失败，都要执行 cb，并原封不动地传递之前的状态和值。
// 注意，就算cb又返回了一个新的promise，这个promise的成功结果不会影响最终结果
// 除非cb内部报错，最终结果就是错误
Promise.prototype.finally = function (cb) {
  return this.then(
    // 使用 Promise.resolve(cb()) 确保 cb 里的异步逻辑执行完。
    (value) => {
      // () => value: 忽略 cb() 的返回值，返回之前的值
      return Promise.resolve(cb()).then(() => value);
    },
    (reason) => {
      // 把之前的错误再次抛出
      return Promise.resolve(cb()).then(() => {
        throw reason;
      });
    },
  );
};

/**
 *
 * 只有当所有 Promise 都成功时才返回成功，返回值为promise执行结果，顺序与入参顺序一致。
 * 只要有一个 Promise 失败，all 返回失败。
 * 如果传入的是空数组，也返回一个已完成的 Promise。
 * 如果数组中有普通值，统一用Promise.resolve包装成promise
 * @param {Array} promises
 */
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    // 类型判断
    if (!Array.isArray(promises)) {
      const type = typeof promises;
      return reject(
        new TypeError(`TypeError: ${type} ${promises} is not iterable`),
      );
    }
    let len = promises.length;
    let res = Array(len);
    let cnt = 0;
    if (len === 0) {
      return resolve(res);
    }
    // 核心
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(
        (data) => {
          res[i] = data;
          cnt++;
          if (cnt === len) {
            resolve(res);
          }
        },
        (reason) => {
          reject(reason);
        },
      );
    }
  });
};

// 只要有一个promise完成就返回结果（谁最快用谁的，无论成功还是失败）。
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    // 类型判断
    if (!Array.isArray(promises)) {
      const type = typeof promises;
      return reject(
        new TypeError(`TypeError: ${type} ${promises} is not iterable`),
      );
    }
    let len = promises.length;
    // 核心
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(resolve, reject);
    }
  });
};

// 收集每个promise的结果，无论成功与失败
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let res = [];
    let cnt = 0;
    let len = promises.length;
    if (len === 0) return resolve([]);
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          res[i] = { status: "fulfilled", value };
          if (++cnt === len) resolve(res);
        },
        (reason) => {
          res[i] = { status: "rejected", reason };
          if (++cnt === len) resolve(res);
        },
      );
    }
  });
};

// 只要有一个promise成功就返回成功，全部失败才算失败，并将所有 reject 结果收集起来返回 AggregateError
// 作用：从最快的服务器检索资源、显示第一张已加载的图片
Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length;
    if (len === 0)
      return reject(new AggregateError("All promises were rejected"));
    let errs = [];
    let cnt = 0;
    // 核心
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(resolve, (reason) => {
        cnt++;
        errs[i] = reason;
        if (cnt === len) {
          reject(new AggregateError(errs));
        }
      });
    }
  });
};

module.exports = Promise;

let x1 = ["1", "2", "3"].map(parseInt);

let x2 = ["1", "2", "3"].map((item, index) => {
  return parseInt(item, index);
});
parseInt('1', 0)
parseInt('2', 1)
parseInt('3', 2)
console.log(x1, x2);

// 丢弃小数部分,保留整数部分 
console.log(parseInt(7/2)); // 3

// 向上取整
console.log(Math.ceil(7/2));// 4

// 向下取整
console.log(Math.floor(7/2));// 3

// 四舍五入
console.log(Math.round(7/2));// 4

// 丢弃小数部分,保留整数部分 
console.log(Math.trunc(7/2));// 3

// 返回x的绝对值 
console.log(Math.abs(-6.666));// 6.666

console.log([1,2,3,4,5].slice(1, -1)); // [ 2, 3, 4 ] 表示截取索引1到-1，不包含-1 (-1表示最后一个)

[1, [2, [3]]].flat(2);   // [1,2,3]
[1, 2, 3].flatMap(x => [x, x*2]); // [1,2,2,4,3,6]