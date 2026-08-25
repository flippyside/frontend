class AsyncSchedule {
  constructor(max) {
    this.running = 0;
    this.max = max;
    this.queue = [];
    this.paused = true;
  }
  add(cb) {
    this.queue.push(cb);
  }

  pause() {
    this.paused = true;
  }

  start() {
    this.paused = false;
    for (let i = 0; i < this.max; i++) {
      this.run();
    }
  }

  async run() {
    if (this.running >= this.max || this.queue.length <= 0 || this.paused)
      return;
    this.running++;
    try {
      await this.queue.shift()();
    } catch (error) {
      console.log(error);
    }
    this.running--;
    this.run();
  }
}

const scheduler = new AsyncSchedule(3);
const addTask = (id, timeout) => {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(id);
        resolve();
      }, timeout);
    });
};

scheduler.add(addTask(1, 1000));
scheduler.add(addTask(2, 1000));
scheduler.add(addTask(3, 1000));
scheduler.add(addTask(4, 500));

setTimeout(() => {
  scheduler.start();
}, 1000);
setTimeout(() => {
  scheduler.pause();
}, 2000);
