// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import store from 'store';
/** 获取当前的用户 GET /api/currentUser */

export async function currentUser(options) {
  const localId = store.get('localId');
  return request(`${API_URL}/admin_users/${localId}.json?`, {
    method: 'GET',
    ...(options || {}),
  });
}
/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(options) {
  store.remove('idToken');
  store.remove('localId');
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  const idToken = store.get('idToken');
  return request(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3kBVtAeUDhGuM5cJYG22lqFL0tH_S8io',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: body.username,
        password: body.password,
        token: idToken,
      },

      ...(options || {}),
    },
  );
}
/** 此处后端没有提供注释 GET /api/notices */

export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取规则列表 GET /api/rule */

export async function rule(params, options) {
  return request('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建规则 PUT /api/rule */

export async function updateRule(options) {
  return request('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建规则 POST /api/rule */

export async function addRule(options) {
  return request('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return request('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
