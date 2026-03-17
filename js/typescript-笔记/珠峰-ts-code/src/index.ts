// 请求
import "reflect-metadata";

// 元数据
function methodDecorator(method: string) {
  // 柯里化
  return function (path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
      Reflect.defineMetadata("method", method, descriptor.value);
      Reflect.defineMetadata("path", path, descriptor.value);
    };
  };
}
function Controller(path?: string) {
  return function (Target: any) {
    Reflect.defineMetadata("path", path ?? "", Target);
  };
}
const Get = methodDecorator("get");
const Post = methodDecorator("post");
@Controller("/article")
class ArtileController {
  @Get("/detail")
  getDetial() {
    return {
      err: 0,
      data: "get Detail",
    };
  }
  @Post("/add")
  addArticle() {
    return {
      err: 0,
      data: "post add",
    };
  }
}
// nestjs的写法
// get /article/detail -> { err: 0,data: "get Detail" };
// post /article/add -> { err: 0, data: "post add"  };

function createRoutes(instance: any) {
  const prototype = Reflect.getPrototypeOf(instance)!; // 获取实例的原型
  const controllerPath = Reflect.getMetadata("path", prototype.constructor);
  const protoKeys = Reflect.ownKeys(prototype).filter(
    (item) => item !== "constructor"
  );
  return protoKeys.map((key) => {
    const requestHandler = (prototype as any)[key];
    const requestMethod = Reflect.getMetadata("method", requestHandler);
    const requestPath = Reflect.getMetadata("path", requestHandler);

    return {
      requestPath: `${controllerPath}${requestPath}`,
      requestMethod,
      requestHandler,
    };
  });
}

const routes = createRoutes(new ArtileController());
console.log(routes);

// 通过装饰器实现路由系统
export {};
