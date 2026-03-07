const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 用户注册接口
router.post('/register', async (req, res) => {
    try {
        const { phone, password, nickName } = req.body;
        
        console.log('收到注册请求:', { phone, nickName });
        
        // 验证必填字段
        if (!phone || !password || !nickName) {
            return res.status(400).json({
                success: false,
                message: '手机号、密码和昵称不能为空'
            });
        }
        
        // 验证手机号格式
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: '手机号格式不正确'
            });
        }
        
        // 验证密码长度
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '密码至少6位'
            });
        }
        
        // 检查手机号是否已注册
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: '该手机号已注册'
            });
        }
        
        // 插入新用户
        const [result] = await db.query(
            'INSERT INTO users (phone, password, nick_name) VALUES (?, ?, ?)',
            [phone, password, nickName]
        );
        
        // 生成token
        const token = 'token_' + Date.now() + '_' + result.insertId;
        
        res.status(201).json({
            success: true,
            message: '注册成功',
            data: {
                token,
                userId: result.insertId,
                phone,
                nickName,
                avatarUrl: '/static/logo.png',
                gender: 0
            }
        });
        
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误: ' + error.message
        });
    }
});

// 用户登录接口
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        console.log('收到登录请求:', { phone });
        
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: '手机号和密码不能为空'
            });
        }
        
        const [users] = await db.query(
            'SELECT id, phone, nick_name, avatar_url, gender FROM users WHERE phone = ? AND password = ?',
            [phone, password]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '手机号或密码错误'
            });
        }
        
        const user = users[0];
        
        // 更新最后登录时间
        await db.query(
            'UPDATE users SET last_login_time = NOW() WHERE id = ?',
            [user.id]
        );
        
        const token = 'token_' + Date.now() + '_' + user.id;
        
        res.json({
            success: true,
            message: '登录成功',
            data: {
                token,
                userId: user.id,
                phone: user.phone,
                nickName: user.nick_name,
                avatarUrl: user.avatar_url,
                gender: user.gender
            }
        });
        
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取用户信息接口
router.get('/info', async (req, res) => {
    try {
        // 从请求头获取token
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未登录'
            });
        }
        
        // 从token中提取用户ID
        const userId = token.split('_').pop();
        
        const [users] = await db.query(
            'SELECT id, phone, nick_name, avatar_url, gender, birthday, province, city, job, bio, create_time FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        
        const user = users[0];
        
        res.json({
            success: true,
            data: {
                userId: user.id,
                phone: user.phone,
                nickName: user.nick_name,
                avatarUrl: user.avatar_url,
                gender: user.gender,
                birthday: user.birthday,
                province: user.province,
                city: user.city,
                job: user.job,
                bio: user.bio,
                createTime: user.create_time
            }
        });
        
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 更新用户信息接口
router.put('/info', async (req, res) => {
    try {
        // 从请求头获取token
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未登录'
            });
        }
        
        // 从token中提取用户ID
        const userId = token.split('_').pop();
        
        const { nickName, gender, birthday, province, city, job, bio } = req.body;
        
        // 构建更新字段
        const updateFields = [];
        const updateValues = [];
        
        if (nickName) {
            updateFields.push('nick_name = ?');
            updateValues.push(nickName);
        }
        if (gender !== undefined) {
            updateFields.push('gender = ?');
            updateValues.push(gender);
        }
        if (birthday) {
            updateFields.push('birthday = ?');
            updateValues.push(birthday);
        }
        if (province) {
            updateFields.push('province = ?');
            updateValues.push(province);
        }
        if (city) {
            updateFields.push('city = ?');
            updateValues.push(city);
        }
        if (job) {
            updateFields.push('job = ?');
            updateValues.push(job);
        }
        if (bio) {
            updateFields.push('bio = ?');
            updateValues.push(bio);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: '没有要更新的字段'
            });
        }
        
        // 添加用户ID到参数列表
        updateValues.push(userId);
        
        const [result] = await db.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        
        res.json({
            success: true,
            message: '更新成功'
        });
        
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 退出登录接口
router.post('/logout', (req, res) => {
    // 简化版，实际可能需要处理token黑名单
    res.json({
        success: true,
        message: '退出成功'
    });
});

module.exports = router;