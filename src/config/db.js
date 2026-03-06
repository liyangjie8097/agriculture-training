const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Yueyouke10250',
    database: process.env.DB_NAME || 'agri_training',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 将连接池转换为 Promise 形式
const promisePool = pool.promise();

module.exports = promisePool;