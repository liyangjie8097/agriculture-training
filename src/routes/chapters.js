const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取课程的章节列表
router.get('/', async (req, res) => {
    try {
        const { courseId } = req.query;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: '缺少课程ID'
            });
        }
        
        const [rows] = await db.query(
            'SELECT * FROM chapters WHERE course_id = ? ORDER BY sort_order',
            [courseId]
        );
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('获取章节失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取单个章节详情
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM chapters WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '章节不存在'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('获取章节详情失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 创建新章节（管理员用）
router.post('/', async (req, res) => {
    try {
        const { course_id, title, description, video_url, video_duration, sort_order, is_free } = req.body;
        
        if (!course_id || !title) {
            return res.status(400).json({
                success: false,
                message: '缺少必要字段'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO chapters (course_id, title, description, video_url, video_duration, sort_order, is_free) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [course_id, title, description, video_url, video_duration, sort_order, is_free || 0]
        );
        
        res.json({
            success: true,
            data: {
                id: result.insertId,
                course_id,
                title,
                description,
                video_url,
                video_duration,
                sort_order,
                is_free
            }
        });
    } catch (error) {
        console.error('创建章节失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 更新章节
router.put('/:id', async (req, res) => {
    try {
        const { title, description, video_url, video_duration, sort_order, is_free } = req.body;
        
        const [result] = await db.query(
            'UPDATE chapters SET title = ?, description = ?, video_url = ?, video_duration = ?, sort_order = ?, is_free = ? WHERE id = ?',
            [title, description, video_url, video_duration, sort_order, is_free, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '章节不存在'
            });
        }
        
        res.json({
            success: true,
            message: '更新成功'
        });
    } catch (error) {
        console.error('更新章节失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 删除章节
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM chapters WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: '章节不存在'
            });
        }
        
        res.json({
            success: true,
            message: '删除成功'
        });
    } catch (error) {
        console.error('删除章节失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;