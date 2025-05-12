const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.122.31:5000', // 后端 API 的地址
        changeOrigin: true, // 允许跨域
        secure: false,  // 允许代理到 HTTP 目标（默认 HTTPS 代理时需设置）
        pathRewrite: {
          '^/api': '' // 重写路径，去掉 /api
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
});