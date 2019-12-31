import axios from "axios";
import to from 'await-to-js';
import { genQuery } from "./helper";
import { API_HOST, Credentials } from '@/constants';
import { IRequestOptions } from './request.d';

const methods = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch'];

function checkStatus(response: any, error: (error: any) => void = () => { }) {
  switch (response.status) {
    case 200:
      return Promise.resolve(response.data);
    case 401:
      window.location.hash = '/home';
      return error('401');
    default:
      return (response.json()).then((json: any) => {
        if (json.message) {
          error(json.message);
        } else {
          error(json);
        }
        return Promise.reject(json);
      });
  }
}

const axiosRequest = (options: IRequestOptions) => {
  if (!options.method || methods.indexOf(options.method) === -1) {
    return Promise.reject('请求类型错误');
  }

  const instance = axios.create({
    baseURL: API_HOST,
    timeout: 5000,
  })

  const requestUrl = `${options.url}${genQuery(options.query)}`;

  const config: any = {
    ...options,
    withCredentials: options.withCredentials || Credentials,
    url: requestUrl
  };

  // application/json
  if (options.headers && options.headers['Content-Type'] === 'application/json') {
    config.data = JSON.stringify(options.data);
  }

  // application/x-www-form-urlencoded
  if (options.headers && options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const searchParams = options.data && Object.keys(options.data).map((key: any) => {
      return options.data && `${encodeURIComponent(key)}=${encodeURIComponent(options.data[key])}`;
    }).join('&');
    config.data = searchParams;
  }

  if (options.upload) {
    if (options.data instanceof FormData) {
      config.data = options.data;
    } else {
      console.error('上传服务中，data必须是FormData')
      return Promise.reject(new Error('上传服务中，data必须是FormData'));
    }
  }

  //拦截器 响应拦截
  instance.interceptors.request.use(res => {
    return res;
  }, err => {
    console.error("TCL: axiosRequest -> err", err)
  });

  return instance(config)
    .then((response: any) => checkStatus(response));
}

const request = {
  get: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'get',
      headers: {
        'Accept': 'application/json',
      }
    }));
  },
  post: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }));
  },
  postForm: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }));
  },
  delete: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'delete',
      headers: { 'Accept': 'application/json' }
    }));
  },
  put: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }));
  },
  upload: (opts: IRequestOptions) => {
    return to(axiosRequest({
      ...opts,
      method: 'post',
      headers: {
        'Accept': 'application/json'
      },
      upload: true
    }))
  }
};

export default request;




