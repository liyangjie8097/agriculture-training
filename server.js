const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 测试接口: http://localhost:${PORT}/api/test`);
    console.log(`📚 课程列表: http://localhost:${PORT}/api/courses`);
});