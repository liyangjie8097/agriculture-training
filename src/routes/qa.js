const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取问答列表
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT q.*, 
                   u.nick_name as author_name, 
                   u.avatar_url as author_avatar,
                   (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.id
            ORDER BY q.create_time DESC
        `);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('获取问答列表失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取单个问题详情
router.get('/:id', async (req, res) => {
    try {
        const [questionRows] = await db.query(`
            SELECT q.*, 
                   u.nick_name as author_name, 
                   u.avatar_url as author_avatar
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.id
            WHERE q.id = ?
        `, [req.params.id]);
        
        if (questionRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '问题不存在'
            });
        }
        
        // 获取该问题的回答
        const [answerRows] = await db.query(`
            SELECT a.*, 
                   u.nick_name as author_name, 
                   u.avatar_url as author_avatar
            FROM answers a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE a.question_id = ?
            ORDER BY a.create_time DESC
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...questionRows[0],
                answers: answerRows
            }
        });
    } catch (error) {
        console.error('获取问题详情失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 创建新问题
router.post('/', async (req, res) => {
    try {
        const { user_id, category, title, content, is_anonymous } = req.body;
        
        if (!user_id || !title || !content) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO questions (user_id, category, title, content, is_anonymous) VALUES (?, ?, ?, ?, ?)',
            [user_id, category || 'other', title, content, is_anonymous || 0]
        );
        
        res.json({
            success: true,
            data: {
                id: result.insertId,
                user_id,
                category,
                title,
                content,
                is_anonymous
            }
        });
    } catch (error) {
        console.error('创建问题失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 回答问题
router.post('/:id/answers', async (req, res) => {
    try {
        const { user_id, content } = req.body;
        const question_id = req.params.id;
        
        if (!user_id || !content) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)',
            [question_id, user_id, content]
        );
        
        res.json({
            success: true,
            data: {
                id: result.insertId,
                question_id,
                user_id,
                content
            }
        });
    } catch (error) {
        console.error('回答问题失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 点赞问题
router.post('/:id/like', async (req, res) => {
    try {
        const { user_id } = req.body;
        
        // 这里简化处理，实际应该记录谁点了赞
        await db.query('UPDATE questions SET like_count = like_count + 1 WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: '点赞成功'
        });
    } catch (error) {
        console.error('点赞失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;