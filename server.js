const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const cors = require('cors');

const app = express();
const port = 8080;

// 配置日志记录
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// 从环境变量中获取代理目标地址，如果未设置则使用新的后端服务地址
const target = process.env.PROXY_TARGET || 'https://20d2f5c8.r19.cpolar.top';

// 验证目标地址是否为有效的 URL
try {
    new URL(target);
} catch (error) {
    logger.error(`Invalid PROXY_TARGET: ${target}`);
    process.exit(1);
}

// 静态文件服务
app.use(express.static('dist'));

// 跨域处理
app.use(cors());

// 反向代理配置
const proxyConfig = {
    target,
    changeOrigin: true,
    pathRewrite: {},
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying request: ${req.method} ${req.url}`);
        logger.info(`Proxy request headers: ${JSON.stringify(proxyReq.getHeaders())}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        logger.info(`Proxy response: ${proxyRes.statusCode}`);
        logger.info(`Proxy response headers: ${JSON.stringify(proxyRes.headers)}`);
    },
    onError: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).send('Proxy error');
    }
};

// 匹配所有路径进行代理
app.use(createProxyMiddleware(proxyConfig));

// 处理根路径请求
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html', (err) => {
        if (err) {
            logger.error(`Error loading index.html: ${err.message}`);
            res.status(500).send('Error loading index.html');
        }
    });
});

// 启动服务器并添加错误处理
app.listen(port, (err) => {
    if (err) {
        logger.error(`Failed to start server on port ${port}: ${err.message}`);
    } else {
        logger.info(`Server is running on port ${port}`);
    }
});