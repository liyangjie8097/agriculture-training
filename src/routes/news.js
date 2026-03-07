const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取资讯列表
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT n.*, 
                   (SELECT COUNT(*) FROM news_comments WHERE news_id = n.id) as comment_count
            FROM news n
            ORDER BY n.is_top DESC, n.publish_time DESC
        `);
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('获取资讯列表失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取单个资讯详情
router.get('/:id', async (req, res) => {
    try {
        // 更新浏览次数
        await db.query('UPDATE news SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);
        
        const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '资讯不存在'
            });
        }
        
        // 获取评论
        const [comments] = await db.query(`
            SELECT c.*, u.nick_name as author_name, u.avatar_url as author_avatar
            FROM news_comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.news_id = ?
            ORDER BY c.create_time DESC
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...rows[0],
                comments
            }
        });
    } catch (error) {
        console.error('获取资讯详情失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 发表评论
router.post('/:id/comments', async (req, res) => {
    try {
        const { user_id, content } = req.body;
        const news_id = req.params.id;
        
        if (!user_id || !content) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO news_comments (news_id, user_id, content) VALUES (?, ?, ?)',
            [news_id, user_id, content]
        );
        
        res.json({
            success: true,
            data: {
                id: result.insertId,
                news_id,
                user_id,
                content,
                create_time: new Date()
            }
        });
    } catch (error) {
        console.error('发表评论失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 点赞资讯
router.post('/:id/like', async (req, res) => {
    try {
        await db.query('UPDATE news SET like_count = like_count + 1 WHERE id = ?', [req.params.id]);
        
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