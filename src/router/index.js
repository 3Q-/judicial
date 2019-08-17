import Vue from 'vue';
import Router from 'vue-router';
import _import from './import';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: _import('pages/news/news')
    },
    {
      path: '/news',
      name: 'news',
      component: _import('pages/news/news')
    },
    {path: '/login', component: _import('pages/login/login')}
  ]
});
