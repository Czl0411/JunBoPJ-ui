import request from './request';

// 获取策略列表
export const getStrategy = (params) => {
    const data = {...params };
    const query = new URLSearchParams();

    if (Array.isArray(data.advertiser_ids)) {
        data.advertiser_ids.forEach(id => query.append('advertiser_ids', id));
    }

    if (Array.isArray(data.strategy_ids)) {
        data.strategy_ids.forEach(id => query.append('strategy_ids', id));
    }

    for (const key in data) {
        if (data[key]!== undefined && key!== 'advertiser_ids' && key!== 'strategy_ids') {
            query.append(key, data[key]);
        }
    }

    return request({
        url: `/getstrategy?${query.toString()}`,
        method: 'get',
    });
};

// 获取广告下拉列表
export const Getadvertiser = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/advertiser?${query.toString()}`,
        method: 'get'
    });
};
// 获取策略下拉列表
export const getstrategyname = (params) => {
  const data = {...params };
  const query = new URLSearchParams();
  for (const key in data) {
      query.append(key, data[key]);
  }
  return request({
      url: `/trategyname?${query.toString()}`,
      method: 'get'
  });
};

// 获取策略模版列表
export const getTemplate = (params) => {
  const data = {...params };
  const query = new URLSearchParams();
  for (const key in data) {
      query.append(key, data[key]);
  }
  return request({
      url: `/template?${query.toString()}`,
      method: 'get'
  });
};

// 获取策略模版列表
export const getTemplateInfo = (params) => {
  const data = {...params };
  const query = new URLSearchParams();
  for (const key in data) {
      query.append(key, data[key]);
  }
  return request({
      url: `/getTemplateInfo?${query.toString()}`,
      method: 'get'
  });
};

// 获取定向包列表
export const getpackage = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/getPackage?${query.toString()}`,
        method: 'get'
    });
  };


// 获取子定向包列表
export const getpackageChild = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/getpackageChild?${query.toString()}`,
        method: 'get'
    });
  };

//   获取单个模版信息
export const getInfo = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/getInfo?${query.toString()}`,
        method: 'get'
    });
  };
//   修改单个模版信息
  export const updateTemplateInfo = (data) => {
    return request({
      url: '/updateTemplateInfo',
      method: 'put',
      data: data
    });
  };


//   获取标签

export const getVideoTag = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/getVideoTag?${query.toString()}`,
        method: 'get'
    });
  };

  export const getImageTag = (params) => {
    const data = {...params };
    const query = new URLSearchParams();
    for (const key in data) {
        query.append(key, data[key]);
    }
    return request({
        url: `/getImageTag?${query.toString()}`,
        method: 'get'
    });
  };


//   查询素材

export const getMaterials = (data) => {
    return request({
      url: '/getMaterials',
      method: 'post',
      data: data
    });
  };
