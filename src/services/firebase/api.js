import { request } from 'umi';
//'https://react-getting-startef-default-rtdb.firebaseio.com/Cases.json',
export async function getTables(options) {
  return request('https://fire-alarm-system-ab525-default-rtdb.firebaseio.com/Cases.json', {
    method: 'GET',
    ...(options || {}),
  });
}
