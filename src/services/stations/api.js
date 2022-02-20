import { request } from 'umi';
import store from 'store';
//'https://react-getting-startef-default-rtdb.firebaseio.com/Cases.json',
export async function getStations(options) {
  return request(`${API_URL}/BFP_SERVER/Station.json`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteStation(body, options) {
  console.log('delete body', body.split(' '));
  return request(`${API_URL}/BFP_SERVER/Station/${body}.json?print=silent`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function createStation(body, options) {
  console.log('body post:', body);
  return request(`${API_URL}/BFP_SERVER/Station/${body.Station_Name}.json?print=silent`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      Station_Hotline: body.Station_Hotline,
      Station_Name: body.Station_Name,
      sorting: body.sorting,
      status: body.status,
      email: body.email,
      password: body.password,
      token: '',
      authorizations: body.res,
    },
    ...(options || {}),
  });
}

export async function createUser(body, options) {
  console.log('body post:', body);
  return request(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3kBVtAeUDhGuM5cJYG22lqFL0tH_S8io`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        Station_Hotline: body.Station_Hotline,
        Station_Name: body.Station_Name,
        sorting: body.sorting,
        status: body.status,
        email: body.email,
        password: body.password,
        returnSecureToken: true,
        isLogin: true,
      },
      ...(options || {}),
    },
  );
}

export async function createUsers(body, options) {
  store.set('idToken', body.idToken);
  store.set('localId', body.localId);
  return request(`${API_URL}/admin_users/${body.localId}.json?print=silent`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      access: 'user',
      currentAuthority: 'user',
      isLogin: true,
      name: 'admin',
      status: 'success',
      type: 'account',
    },
    ...(options || {}),
  });
}
