const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取所有课程
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('获取课程失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

// 获取单个课程详情
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '课程不存在'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('获取课程详情失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;  // 确保这行存在