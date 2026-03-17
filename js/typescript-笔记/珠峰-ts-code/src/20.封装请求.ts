import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

// {code:500,data:T,message:'ok'}

export type ResponseData<T = any> = {
  code: number;
  data?: T;
  message?: string;
};
class HttpRequest {
  public timeout = 3000;
  public loadingMaping: Record<string, string> = {};
  public baseURL =
    import.meta.url === "development" ? "http://localhost:3000" : "/";

  public mergeConfig(options: AxiosRequestConfig) {
    return { ...options, baseURL: this.baseURL, timeout: this.timeout };
  }
  public setInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use(
      (config) => {
        // ....
        return config;
      },
      (err) => {
        return Promise.reject();
      }
    );
    instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        return Promise.reject();
      }
    );
  }
  public request(options: AxiosRequestConfig) {
    // 每次调用request 我门都可以创建一个axios的实例
    const instance = axios.create();
    options = this.mergeConfig(options);
    this.setInterceptor(instance);
    return instance(options);
  }

  public post<T>(url: string, data: any): Promise<ResponseData<T>> {
    return this.request({
      url,
      method: "POST",
      data,
    }).then((res) => {
      return Promise.resolve(res.data);
    }); // res.data.data
  }
}
const http = new HttpRequest();

http
  .post<{ token: string }>("/login", {})
  .then((res) => {
    res.data?.token;
  })
  .catch((err) => {
    console.log(err);
  });

// infer
export {};
