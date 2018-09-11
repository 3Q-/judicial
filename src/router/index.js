import Vue from 'vue';
import Router from 'vue-router';
import _import from './import';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: _import('pages/index/index')
    }
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: _import('pages/test/test')
    // }
  ]
});
