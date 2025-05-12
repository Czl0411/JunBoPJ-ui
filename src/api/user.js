// src/api/index.js
import request from './request';


// 登录
export const Login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data: data
  });
};

// 获取媒体信息
export const getMedia = () => {
  return request({
    url: '/media',
    method: 'get'
  });
};

// 获取素材标签



// 获取头条产品id
export const getAppid = () => {
  return request({
    url: '/appid',
    method: 'get'
  });
};