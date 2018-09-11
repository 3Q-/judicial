import axios from 'axios';
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
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  response => {
    const res = response.data;
    if (res && res.state !== 0){
      console.log(`获取数据失败 ${response.config.url} `, res);
      return Promise.reject(res);
    }
    return res;
  },

  error => {
    console.log('err ' + error);// for debug
    return Promise.reject(error);
  });

/**
 * 提示语
 * @param  {Object} codeMap code的对象 {101:'鉴权不通过'}
 */
service.code = (codeMap) => {
  code = Object.assign(code, codeMap);
};

/**
 * @param  {Array} promises 数组promise
 * @return {promise}          [description]
 */
service.all = (promises) => {
  return Promise.all(promises);
};

service.race = (promises) => {
  return Promise.race(promises);
};

export default service;
