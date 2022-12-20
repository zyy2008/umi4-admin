import { request } from "./request";
import type { RequestOptionsInit } from "umi-request";

/** 不再兼容非标准的数据结构 */
export declare type AjaxPromise<R> = Promise<R>;
/** 非标准包裹 */
export declare type NonStandardAjaxPromise<R> = Promise<{
  code?: number;
  message?: string;
  result: R;
}>;

export interface ExtraFetchParams {
  /** extra data for extends */
  extra?: any;
  /** 扩展请求头 */
  headers?: any;
  /** cancel request */
  cancel?: Promise<string | undefined>;
}

export interface WrappedFetchParams extends RequestOptionsInit {
  url: string;
  query?: any;
  form?: FormData;
}

const ajax = {
  ajax: ({ url, query, form, ...opt }: WrappedFetchParams) => {
    return request(url, {
      data: form,
      ...opt,
      params: query,
    });
  },
  check: (value: any, name: string) => {
    if (value === null || value === undefined) {
      const msg = `[ERROR PARAMS]: ${name} can't be null or undefined`;
      // 非生产环境，直接抛出错误
      if (process.env.NODE_ENV === "development") {
        throw Error(msg);
      }
    }
  },
};

export default ajax;
