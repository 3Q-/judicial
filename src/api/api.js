import axios from 'common/js/axios';
import {context} from './config';
import CryptoJS from 'crypto-js';

export const login = (data) => {
  const user = encryption({
    data: data,
    key: '1234567887654321',
    param: ['password']
  });
  // console.log(user);
  return axios({
    method: 'post',
    url: '/auth/oauth/token',
    params: user
  });
};

export const getLiveVideoList = (data) => {
  const url = context + 'ys/video/getLiveVideoList.jspx';
  return axios.post(url, {params: data});
};

export const getExamNodes = (data) => {
  const url = context + 'examNode/getExamNodes.jspx';
  return axios.get(url);
};

// http://localhost:9090/monitor/ysCamera/list?planId=ouidmckuou8e0ujgT_AT2aIOYF0eL9TJ
export const getysCameraList = (data) => {
  const url = '/monitor/ysCamera/list';
  const params = {planId: 'ouidmckuou8e0ujgT_AT2aIOYF0eL9TJ'};
  return axios({
    method: 'get',
    url: url,
    params: params
  });
};

function encryption(params){
  let {
    data,
    type,
    param,
    key
  } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === 'Base64'){
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach(ele => {
      var data = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      var iv = key;
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        });
      result[ele] = encrypted.toString();
    });
  }
  return result;
}
