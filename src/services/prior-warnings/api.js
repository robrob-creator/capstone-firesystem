import { request } from 'umi';
//'https://react-getting-startef-default-rtdb.firebaseio.com/Cases.json',
export async function getWarnings(query, body, params, options) {
  console.log('body', body);
  return request(`${API_URL}/PriorWarnings/${body}.json?print=pretty`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    params: { ...params, ...query },
    ...(options || {}),
  });
}

export async function deleteWarning(id, body, options) {
  console.log('this is delete', body.id, 'and this is station', body.station);
  return request(`${API_URL}/PriorWarnings/${body.station}/${id}.json?print=silent`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function editWarning(id, body, options) {
  console.log('the body', body);
  return request(`${API_URL}/PriorWarnings/${body.station}/${id}.json?print=pretty`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      date: body.date,
      id: body.id,
      link: body.link,
      name: body.name,
      station: body.station,
      status: body.status,
      userId: body.userId,
      time: body.time,
      warning_message: body.warning_message,
    },
    ...(options || {}),
    skipErrorHandler: true,
  });
}
