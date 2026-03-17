// 控制正转： 整个过程都是我自己来控制的
// 控制反转： 失去了控制权，控制权被反转了

// ioc 解除耦合 ， 耦合度降低 代码更方便调试和测试， 代码间的依赖关系

// interface Monitor {
//   display(): void;
// }
// interface Host {
//   start(): void;
// }

// class Monitor23inch implements Monitor {
//   display() {
//     console.log("显示开启");
//   }
// }
// class AppleHost implements Host {
//   start() {
//     console.log("开机");
//   }
// }

// class Computer {
//   //   public monitor: Monitor;
//   //   public host: Host;
//   constructor(public monitor: Monitor, public host: Host) {
//     // this.monitor = new Monitor23inch();
//     // this.host = new AppleHost();
//   }
//   bootstrap() {
//     this.monitor.display();
//     this.host.start();
//   }
// }
// 特点灵活，但是创建过程需要自己手动的new 很麻烦
// const monitor = new Monitor23inch();
// const host = new AppleHost();
// const computer = new Computer(monitor, host);
// computer.bootstrap();

// class Container {
//   private instances = new Map();
//   bind<T>(key: string, creator: () => T) {
//     if (!this.instances.has(key)) {
//       this.instances.set(key, creator());
//     }
//     return this.instances.get(key) as T;
//   }
//   resolve<T>(key: string): T {
//     return this.instances.get(key) as T;
//   }
// }
// 容器内部会维护创建的实例，但是目前的缺点就是依赖需要自己来管理
// const container = new Container();
// container.bind<Monitor>("Monitor", () => new Monitor23inch());
// container.bind<Host>("Host", () => new AppleHost());
// const computer = container.bind<Computer>(
//   "Computer",
//   () => new Computer(container.resolve("Monitor"), container.resolve("Host"))
// );

// computer.bootstrap();

// 依赖注入 DI , 通过依赖注入的方式让代码变得灵活，而不是死板。 他是ioc的一种实现
import "reflect-metadata";
class Container {
  private instances = new Map();
  public properties = new Map(); // 所有的注入的属性 都维护到 映射表中，解析某个类的时候查找注入的属性即可
  bind<T>(key: string, creator: () => T) {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }
  resolve<T>(key: string): T {
    //// Computer:monitor =Monitor
    const instance = this.instances.get(key);
    for (let property of this.properties) {
      let [key, ServiceKey] = property;
      let [classKey, propKey] = key.split(":");
      // 这个属性 是当前类需要注入的才注入，否则不需要进行注入操作
      if (instance.constructor.name != classKey) {
        continue;
      }
      // 之前是字符串，现在是类，类用名字来实例化
      const dep = this.resolve(ServiceKey.name ?? ServiceKey); // 依赖的实例
      instance[propKey] = dep; // 自定找到依赖
    }
    return instance as T;
  }
}

const container = new Container();
// provide 就是将当前类放入到容器中
function Provide(key: string) {
  return function (Target: any) {
    container.bind(key ?? Target.name, () => new Target());
  };
}
// 哪个类的某个属性 注入谁的实例  Computer:monitor = Monitor23inch
function Inject(injectKey?: string) {
  // computer.monitor:new Monitor
  return function (target: any, key: string) {
    // Computer:monitor =Monitor
    // 维护注入的信息，稍后创建computer的时候 查找这样的依赖关系 进行依赖注入
    container.properties.set(
      `${target.constructor.name}:${key}`,
      injectKey ?? Reflect.getMetadata("design:type", target, key)
    );
  };
}
interface Monitor {
  display(): void;
}
interface Host {
  start(): void;
}
@Provide("Monitor23inch")
class Monitor23inch implements Monitor {
  display() {
    console.log("显示开启");
  }
}
@Provide("AppleHost")
class AppleHost implements Host {
  start() {
    console.log("开机");
  }
}
@Provide("Computer")
class Computer {
  @Inject()
  public monitor!: Monitor23inch;
  @Inject()
  public host!: AppleHost;
  bootstrap() {
    this.monitor.display();
    this.host.start();
  }
}
const computer = container.resolve<Computer>("Computer");
computer.bootstrap();
