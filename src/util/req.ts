import {request} from "@umijs/max";
import {message} from "antd";
import {history} from "@@/core/history";

const loginPath = '/user/login';

export const req = <T>(url: string, options?: { [key: string]: any }) => {
  return request<Common.Result<T>>(url, {
    ...(options || {}),
  }).then(data => {
    if (!data.success) {
      message.error(data.message)
      //未登陆
      if (data.code === 'notLogin') {
        history.push(loginPath)
      }
      throw new Error(data.message);
    }else {
      return data.map?.data
    }
  }, (err) => {
    if (err.response.status === 403) {
      message.error('没有权限')
      throw new Error('没有权限');
    }else {
      message.error('异常')
      throw err
    }
  });
}

export const get = <T>(url: string, options?: { [key: string]: any }) => {
  return req<T>(url, {
    method: 'GET',
    ...(options || {}),
  });
}

export const post = <T>(url: string, options?: { [key: string]: any }) => {
  return req<T>(url, {
    method: 'POST',
    ...(options || {}),
  });
}

export const put = <T>(url: string, options?: { [key: string]: any }) => {
  return req<T>(url, {
    method: 'PUT',
    ...(options || {}),
  });
}

export const patch = <T>(url: string, options?: { [key: string]: any }) => {
  return req<T>(url, {
    method: 'PATCH',
    ...(options || {}),
  });
}
