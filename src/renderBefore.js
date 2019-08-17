import router from './router';
import {getToken} from 'common/js/token';

const whiteList = ['/login'];

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
});
