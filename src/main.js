// src/main.js
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'; // 引入路由配置

Vue.use(ElementUI);

new Vue({
  router, // 使用路由
  render: h => h(App)
}).$mount('#app');