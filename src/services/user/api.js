import { request } from 'umi';

export async function getUser(body, params, options) {
  console.log('body', body);
  return request(`${API_URL}/users/${body}.json?print=pretty`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
