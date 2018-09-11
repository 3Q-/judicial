import Vue from 'vue';
import Router from 'vue-router';
import _import from './import';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: _import('pages/index/index')
    },
    {path: '/login', component: _import('pages/login/login')}
  ]
});
