import {request} from "@@/exports";
import {message} from "antd";
import {req} from "@/util/req";
import {useRequest} from "@umijs/max";

/**
 * 原生结构的请求
 */
export const useOriginReq = (url: string, options?: { [key: string]: any }, reqConfig?: { [key: string]: any }) => {
  const e = useRequest(() => {
    return request(url, {
      ...(options || {}),
    })
  }, {
    formatResult: res => res,
    ...(reqConfig || {}),
  });
  //错误提示
  if (e.error) {
    message.error(e.error.message)
  }
  return e;
};

/**
 * 通用Result<T>结构的请求
 */
export const useReq = <T>(url: string, options?: { [key: string]: any }, reqConfig?: { [key: string]: any }) => {
  return useRequest(() => {
    return req<T>(url, {
      ...(options || {}),
    })
  }, {
    formatResult: res => res,
    ...(reqConfig || {}),
  });
};

/**
 * 通用Result<T>结构的请求
 */
export const usePost = <T>(url: string, options?: { [key: string]: any }, reqConfig?: { [key: string]: any }) => {
  return useReq<T>(url, {
    method: 'POST',
    ...(options || {}),
  }, reqConfig)
};
