// src/api/index.js
import request from './request';


// 获取群聊列表
export const Chat = () => {
  return request({
    url: '/chat',
    method: 'get'
  });
};

// 获取当前群聊人员信息
export const chatUsers = (data) => {
    return request({
      url: '/chatusers',
      method: 'post',
      data:data
    });
  };

  // 更新请求配置
export const updateFormDate = (data) => {
    return request({
      url: '/updateformdate',
      method: 'post',
      data:data
    });
  };

    // 获得请求配置
export const getFormDate = (data) => {
    return request({
      url: '/getformdate',
      method: 'post',
      data:data
    });
  };


     // 启动定时任务
export const startTimer = (data) => {
    return request({
      url: '/startimer',
      method: 'post',
      data:data
    });
  };


     // 停止定时任务
export const stopTimer = (data) => {
    return request({
      url: '/stoptimer',
      method: 'post',
      data:data
    });
  };


       // 停止定时任务
export const getAllTimers = (data) => {
    return request({
      url: '/getalltimers',
      method: 'post',
      data:data
    });
  };

  // 保存规则
export const saveRules = (data) => {
  return request({
    url: '/save_rules',
    method: 'post',
    data: data
  });
};

// 删除规则
export const deleteRule = (data) => {
  return request({
    url: '/delete_rule',
    method: 'post',
    data: data
  });
};

// 根据 user_name 查询规则列表
export const getRulesByUserName = (data) => {
  return request({
      url: '/get_rules',
      method: 'post',
      data: data
  });
};


