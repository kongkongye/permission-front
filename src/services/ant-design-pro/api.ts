// @ts-ignore
/* eslint-disable */
import qs from 'qs';
import {get, post} from "@/util/req";

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return get<API.CurrentUser>('/all/user/currentUser', {
    ...(options || {}),
  })
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return post<any>('/login', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(body),
    ...(options || {}),
  });
}

/** 注销 */
export async function logout(options?: { [key: string]: any }) {
  return post('/logout', {
    ...(options || {}),
  });
}
