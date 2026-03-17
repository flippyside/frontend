const PROMISE_STATE = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
};

class MyPromise {
  #result; // 存储Promise的结果

  #callbacks = []; //存储回调函数（可能有多个）

  #state = PROMISE_STATE.PENDING; // Promise的状态: pending:0 fulfilled:1 rejected:2

  constructor(executor) {
    executor(this.#resolve, this.#reject);
  }

  // 私有的resolve() 用来存储成功的数据
  #resolve = (value) => {
    if (this.#state !== PROMISE_STATE.PENDING) return; // 禁止值被重复修改

    this.#result = value;
    this.#state = PROMISE_STATE.FULFILLED;

    // 当resolve执行时，说明数据已经存储，需要调用then的回调函数
    // this.#callback && this.#callback(this.#result); // 注意callback可能为空
    queueMicrotask(() => {
      this.#callbacks.forEach((cb) => {
        cb();
      });
    });
  };
  #reject(reason) {}

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.#state == PROMISE_STATE.PENDING) {
        // 此时数据还未进入Promise，将回调函数赋予callback
        this.#callbacks.push(() => {
          resolve(onFulfilled(this.#result)); // then中回调函数中的返回值成为新的Promise中的数据
        });
      } else if (this.#state == PROMISE_STATE.FULFILLED) {
        // 将then的回调函数放入微任务队列
        queueMicrotask(() => {
          resolve(onFulfilled(this.#result));
        });
      }
    });
  }
}

const mp = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("data000"), 1000);
  // resolve("data123");
});
// console.log(mp);

// mp.then((result) => {
//   console.log(result);
// });

// mp.then((result) => {
//   console.log(result);
// });

// mp.then((result) => {
//   console.log(result);
// });

mp.then((result) => {
  console.log("读取数据1", result);
  return "猪八戒";
})
  .then((r) => {
    console.log("读取数据2", r);
    return "沙和尚";
  })
  .then((r) => {
    console.log("读取数据3", r);
  });
