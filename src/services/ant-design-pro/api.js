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
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
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
        token:
          'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyNGYzMTQ4MTk3ZWNlYTUyOTE3YzNmMTgzOGFiNWQ0ODg3ZWEwNzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZS1hbGFybS1zeXN0ZW0tYWI1MjUiLCJhdWQiOiJmaXJlLWFsYXJtLXN5c3RlbS1hYjUyNSIsImF1dGhfdGltZSI6MTY0NDU5NTA2NCwidXNlcl9pZCI6InRZaU5nd0tmRXRmNE1QMXVxajBpbG90YzA2cDIiLCJzdWIiOiJ0WWlOZ3dLZkV0ZjRNUDF1cWowaWxvdGMwNnAyIiwiaWF0IjoxNjQ0NTk1MDY0LCJleHAiOjE2NDQ1OTg2NjQsImVtYWlsIjoiYWRtaW5pc3RyYXRvckBhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5pc3RyYXRvckBhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.mgGWgR3aYcA-qFU_Jw8CpwaCSAypBEV8tLyo6_RekfJRjVGE1RUBsEliCYc6QrAprfaN31xyLYwo_34dN2lOca_YeoYHfBDVbgInjVlzzquwUhiWpxZk5P2818FAfXKc1FwIQiDI5N-KkaYYTCPhmbkUVkYxTh7yEmPnnn_-R9GR-R7YQjQxoLVs28M3o9RfnUKfFOZXPqv7lXQ2epUEmjl5bStaBf22SdwKpLayYg7Z1TR5tf3Bm4vBsOf0NFt5lO7WhAmwiRAusKu9ezLXyiUZApLZR4Q4U6-4agzC8uWi6Yq5cgM9UGDZCBzOSpTvBAqMTstcyt1vv5HltqCoOw',
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
