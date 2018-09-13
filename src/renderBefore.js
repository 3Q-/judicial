import router from './router';
// import {Message} from 'element-ui';
// import store from './store';
import Cookies from 'js-cookie';

const whiteList = ['/login'];
const TokenKey = 'Admin-Token';

export function getToken(){
  return Cookies.get(TokenKey);
}

export function setToken(token){
  return Cookies.set(TokenKey, token);
}

export function removeToken(){
  return Cookies.remove(TokenKey);
}

router.beforeEach((to, from, next) => {
  if (getToken()){
    if (to.path === '/login'){
      next({ path: '/' });
    } else {

    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1){ // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
  // store.dispatch('getExamBase').then(res => {
  //   store.dispatch('getExamAreas').then(res => {
  //     next();
  //   }).catch((err) => {
  //     Message.error('获取考区数据失败，不能跳转页面~  请练习开发人员');
  //     console.log('获取考区数据失败，不能跳转页面~  请练习开发人员');
  //     console.log(err);
  //   });
  // }).catch((err) => {
  //   Message.error('获取考点数据或者考试场次数据失败，不能跳转页面~  请练习开发人员');
  //   console.log('获取考点数据或者考试场次数据失败，不能跳转页面~  请练习开发人员');
  //   console.log(err);
  // });
});
