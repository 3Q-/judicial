import axios from 'axios';
import router from '@/router/index';
import {removeToken, getToken} from 'common/js/token';
// import qs from 'qs';
import {CODE_MAP} from './code-message';
// import store from '@/store';
// import { getToken } from '@/utils/auth';

let code = CODE_MAP || {};
// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  withCredentials: true
  // headers: { 'Content-type': 'application/json' }
  // timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(config => {
  // console.log(config);
  if (config.url === '/auth/oauth/token'){
    config.headers.Authorization = 'Basic c2lub3RuOnNpbm90bg==';
  } else {
    config.headers.Authorization = 'Bearer ' + (getToken() || '');
  }
  return config;
}, error => {
  // Do something with request error
  console.log('request error', error); // for debug
  return Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  response => {
    console.log(response);
    if (response && response.status === 200){
      const res = response.data;
      if (res && res.access_token){
        return res;
      } else if (res && res.code === 0){
        return res;
      } else {
        console.log(`获取数据失败 ${response.config.url} `, res);
        return Promise.reject(res);
      }
    } else if (response && response.status > 400 && response.status < 505){
      removeToken();
      return Promise.reject(response);
    } else {
      console.log(`获取数据失败 ${response.config.url} `, response);
      return Promise.reject(response);
    }
  },

  error => {
    removeToken();
    router.push('/login');
    return Promise.reject(error);
  });

/**
 * 提示语
 * @param  {Object} codeMap code的对象 {101:'鉴权不通过'}
 */
service.code = (codeMap) => {
  code = Object.assign(code, codeMap);
};

export default service;
