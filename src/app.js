const express = require('express');
const cors = require('cors');

// 导入路由
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const qaRouter = require('./routes/qa');
const newsRouter = require('./routes/news');
const usersRouter = require('./routes/users');

const app = express();

// 中间件
app.use(cors());              // 允许跨域请求
app.use(express.json());      // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/courses', coursesRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/qa', qaRouter);
app.use('/api/news', newsRouter);
app.use('/api/users', usersRouter);

// 测试路由
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: '后端服务运行正常',
        time: new Date().toLocaleString()
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: '接口不存在' 
    });
});

module.exports = app;