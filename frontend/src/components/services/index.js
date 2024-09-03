import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://localhost:4500', // Set the default base URL here
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(function (config) {
  config.timeout = 10000;
  return config;
}, function (error) {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(function (response) {
  return { data: response?.data, status: response.status };
}, function (error) {
  if (error.response) {
    if (error.response.status === 401) {
        console.log('Status code 401');
    }
    return Promise.reject({ data: error?.response?.data, status: error.response.status });
  } else if (error.request) {
    console.log('Request error ', error.request)
    alert('Network Error');
    return Promise.reject(false);
  } else {
    alert('Something went wrong (Other)');
    return Promise.reject(false);
  }
});
export async function getRequest(url, payload, otherInfo = {}) {
  console.log('payload for search bar', payload);
  try {
    const accessToken = localStorage.getItem('token');

    const config = {
      ...otherInfo,
      headers: {
        ...otherInfo.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
      params: payload, // Use params to include the query parameters
    };

    return await axiosClient.get(url, config);
  } catch (error) {
    console.error('getRequest error:', error);
    throw error;
  }
}

// export async function getRequest(url, payload, otherInfo) {
//   console.log('pagination detail', payload);
//   const accessToken = localStorage.getItem('token')

//   try {

//   console.log('token new is >>>>>>>',accessToken);

//     return axiosClient.get(url, payload, {
//       ...otherInfo,
//       headers: {
//         ...otherInfo?.headers,
//         'Authorization': accessToken,
//       }
//     });
//   } catch (error) {
//     console.error('postRequest error:', error);
//     throw error;
//   }
// }

export async function uploadPostRequest(url, payload, otherInfo) {
  try {
    const accessToken = localStorage.getItem('token')

  console.log('biiling address accessToken', payload);

    return await axiosClient.post(url, payload, {
      ...otherInfo,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  } catch (error) {
    console.error('postRequest error:', error);
    throw  await error;
  }
}
export async function postRequest(url, payload, otherInfo) {
  console.log('biiling address paload', payload);
  try {
    const accessToken = localStorage.getItem('token')
    console.log('login token', accessToken);
    return await axiosClient.post(url, payload, {
      ...otherInfo,
      headers: {
        ...otherInfo?.headers,
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  } catch (error) {
    console.error('postRequest error:', error);
    throw  await error;
  }
}
export async function putRequest(url, payload, otherInfo) {
  console.log('forgot  detail', payload);
  try {
    const accessToken = localStorage.getItem('token')
    return axiosClient.put(url, payload, {
      ...otherInfo,
      headers: {
        ...otherInfo?.headers,
        'Authorization': accessToken,
      }
    });
  } catch (error) {
    console.error('postRequest error:', error);
    throw error;
  }
}

export async function imagePostRequest(url, payload) {
  try {
    const accessToken = await localStorage.getItem('token');
    return axiosClient.post(url, payload, {
      headers: {
          'Content-Type': 'multipart/form-data',
        'Authorization': accessToken,
      }
    });
  } catch (error) {
    console.error('postRequest error:', error);
    throw error;
  }
}
