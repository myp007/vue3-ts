//axios.d.ts
import { AxiosRequestConfig } from "axios";
 
// 处理axios 响应的数据 在ts中报错 类型“AxiosResponse<any, any>”上不存在属性“state”
declare module 'axios'{
  interface AxiosInstance{
    (config:AxiosRequestConfig):Promise<any>
  }
}