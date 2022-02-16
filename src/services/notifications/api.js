import { request } from 'umi';
//'https://react-getting-startef-default-rtdb.firebaseio.com/Cases.json',
export async function getNotifications(query, body, params, options) {
  console.log('body', body);
  return request(`${API_URL}/Notifications/${body}.json?print=pretty`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    params: { ...params, ...query },
    ...(options || {}),
  });
}
