// src/api/request.js
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';

// 创建 axios 实例
const service = axios.create({
  // baseURL: "https://20d2f5c8.r19.cpolar.top", // API 的基础 URL
  baseURL: "/api",
  timeout: 0 // 无超时限制
});

// 定义不需要携带 token 的接口列表
const whiteList = ['/login'];

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 检查当前请求的接口是否在白名单中
    const isInWhiteList = whiteList.some(url => config.url.includes(url));
    if (!isInWhiteList) {
      // 如果不在白名单中，添加 token 到请求头
      const token = localStorage.getItem('token');
      const tenantid = localStorage.getItem('tenantid');
      const version = localStorage.getItem('version');
      if (token) {
        config.headers['Token'] = `${token}`;
        config.headers['Tenantid'] = `${tenantid}`;
        config.headers['content-type'] = "application/json; charset=utf-8";
        config.headers['version'] = `${version}`;
      }
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 如果返回的状态码不是成功状态码，给出错误提示
    if (res.code!== 0 && res.code!== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });

      // 例如，401 状态码表示未登录，跳转到登录页面
      if (res.code === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 跳转到登录页面
          window.location.href = '/login';
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    // 处理响应错误
    console.log('err' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;