import axios from 'common/js/axios';
import {context} from './config';

export const getLiveVideoList = (data) => {
  let url = context + 'ys/video/getLiveVideoList.jspx';
  return axios.get(url, {params: data});
};

export const getExamNodes = (data) => {
  let url = context + 'examNode/getExamNodes.jspx';
  return axios.get(url);
};
