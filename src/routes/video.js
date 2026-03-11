const express = require('express');
const router = express.Router();
const axios = require('axios'); // 必须添加这行
const VideoAggregator = require('../services/videoAdapter');
require('dotenv').config();

const aggregator = new VideoAggregator({
  bilibiliCookie: process.env.BILIBILI_COOKIE || ''
});

// ==================== 搜索接口 ====================
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '缺少关键词 keyword'
      });
    }

    console.log('搜索关键词:', keyword);
    
    const videos = await aggregator.searchAll(keyword);

    console.log(`搜索到 ${videos.length} 个农业视频`);

    res.json({
      success: true,
      data: videos
    });

  } catch (error) {
    console.error('搜索请求出错:', error.message);
    res.status(500).json({
      success: false,
      message: '搜索失败: ' + error.message
    });
  }
});

// ==================== 获取更多历史视频 ====================
router.get('/more', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '缺少关键词 keyword'
      });
    }

    const videos = aggregator.getMore(keyword);

    res.json({
      success: true,
      data: videos
    });

  } catch (error) {
    console.error('获取更多失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取失败: ' + error.message
    });
  }
});

// ==================== 刷新搜索结果 ====================
router.get('/refresh', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '缺少关键词 keyword'
      });
    }

    console.log('刷新搜索:', keyword);
    
    const videos = await aggregator.refresh(keyword);

    console.log(`刷新后获取到 ${videos.length} 个视频`);

    res.json({
      success: true,
      data: videos
    });

  } catch (error) {
    console.error('刷新失败:', error.message);
    res.status(500).json({
      success: false,
      message: '刷新失败: ' + error.message
    });
  }
});

// ==================== 热门视频接口 ====================
router.get('/hot', async (req, res) => {
  try {
    console.log('获取热门视频');
    
    const videos = await aggregator.getHotVideos();

    console.log(`获取到 ${videos.length} 个热门视频`);

    res.json({
      success: true,
      data: videos.slice(0, 20)
    });

  } catch (error) {
    console.error('获取热门失败:', error.message);
    res.status(500).json({
      success: false,
      message: '获取失败: ' + error.message
    });
  }
});

// ==================== B站视频解析接口 ====================
router.get('/parse/bilibili', async (req, res) => {
  try {
    const { bvid } = req.query;
    if (!bvid) {
      return res.status(400).json({
        success: false,
        message: '缺少bvid参数'
      });
    }

    console.log('解析B站视频:', bvid);

    // 获取视频基本信息
    const infoResponse = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.bilibili.com'
      }
    });

    if (infoResponse.data.code !== 0) {
      return res.status(404).json({
        success: false,
        message: '视频不存在'
      });
    }

    const videoInfo = infoResponse.data.data;
    const cid = videoInfo.cid;

    // 获取视频播放地址
    const playResponse = await axios.get(
      `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&type=&platform=html5`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.bilibili.com'
        }
      }
    );

    if (playResponse.data.code !== 0) {
      return res.status(404).json({
        success: false,
        message: '获取播放地址失败'
      });
    }

    const videoData = playResponse.data.data;
    let videoUrl = '';

    if (videoData.durl && videoData.durl.length > 0) {
      videoUrl = videoData.durl[0].url;
    }

    if (!videoUrl) {
      return res.status(404).json({
        success: false,
        message: '无法获取视频地址'
      });
    }

    // 返回视频信息
    res.json({
      success: true,
      data: {
        url: videoUrl,
        title: videoInfo.title,
        cover: videoInfo.pic,
        author: videoInfo.owner.name,
        duration: videoInfo.duration,
        playCount: videoInfo.stat.view,
        description: videoInfo.desc
      }
    });

  } catch (error) {
    console.error('解析B站视频失败:', error.message);
    if (error.response) {
      console.error('错误状态:', error.response.status);
      console.error('错误数据:', error.response.data);
    }
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

module.exports = router;