// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Index from '../components/Index/Index.vue';
import Strategy from '../components/Strategy/Strategy.vue';
import Template from '../components/Strategy/Template.vue';
import Account from '../components/Account/Account.vue';
import Toutiao from '../components/Toutiao/index.vue';
import Ad from '../components/Ad/Ad.vue';
import Channel from '../components/Channel/Channel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        name: 'Index',
        component: Index
      },
      {
        path: 'strategy',
        name: 'Strategy',
        component: Strategy,
        meta: {
          keepAlive: true // 设置该路由组件需要被缓存
        }
      },
      {
        path: 'account',
        name: 'Account',
        component: Account
      },
      {
        path: 'ad',
        name: 'Ad',
        component: Ad
      },
      {
        path: 'channel',
        name: 'Channel',
        component: Channel
      },
      {
        path: 'template',
        name: 'Template',
        component: Template
      },
      {
        path: 'toutiao',
        name: 'Toutiao',
        component: Toutiao
      },
      
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

// 重写 push 方法
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {
    if (err.name === 'NavigationDuplicated') {
      return err;
    }
    throw err;
  });
};

// 重写 replace 方法
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => {
    if (err.name === 'NavigationDuplicated') {
      return err;
    }
    throw err;
  });
};

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token && to.name!== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;