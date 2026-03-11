const axios = require('axios');

// ==================== 农业关键词库 ====================
const AGRICULTURE_KEYWORDS = {
  plant: ['种植', '栽培', '育苗', '播种', '移栽', '施肥', '灌溉', '收割', '粮食', '水稻', '小麦', '玉米', '大豆', '蔬菜', '果树', '大棚', '温室', '农场', '田间', '作物', '耕地', '土壤', '肥料', '种子', '秧苗', '丰收', '产量', '农事', '春耕', '秋收', '麦子', '稻谷', '瓜果', '菜地'],
  breed: ['养殖', '饲养', '喂食', '繁育', '配种', '产仔', '孵化', '养猪', '养鸡', '养鸭', '养牛', '养羊', '水产', '渔业', '池塘', '饲料', '牧场', '畜禽', '牲口', '兽医', '防疫', '畜牧', '家禽'],
  machine: ['农机', '拖拉机', '收割机', '播种机', '旋耕机', '无人机', '植保', '灌溉设备', '农具', '机械化', '发动机', '维修', '保养', '操作', '驾驶', '农用机械', '耕种机'],
  pest: ['病虫害', '虫害', '病害', '防治', '农药', '杀虫', '杀菌', '除草', '防疫', '疫苗', '虫', '病', '害', '除虫', '治病'],
  process: ['加工', '烘干', '储藏', '保鲜', '包装', '冷链', '农产品加工', '粮食加工', '储存', '运输', '晾晒', '入库'],
  general: ['农业', '三农', '农民', '农村', '农技', '农艺', '农学', '田园', '乡村', '有机', '绿色', '生态', '种植', '养殖', '丰收', '土地', '庄稼', '菜园', '果园', '稻田', '麦田', '田野', '耕地']
};

const ALL_AGRICULTURE_KEYWORDS = [
  ...AGRICULTURE_KEYWORDS.plant,
  ...AGRICULTURE_KEYWORDS.breed,
  ...AGRICULTURE_KEYWORDS.machine,
  ...AGRICULTURE_KEYWORDS.pest,
  ...AGRICULTURE_KEYWORDS.process,
  ...AGRICULTURE_KEYWORDS.general
];

function filterAgricultureVideos(videos) {
  return videos.filter(video => {
    const title = (video.title || '').toLowerCase();
    return ALL_AGRICULTURE_KEYWORDS.some(keyword => title.includes(keyword));
  });
}

// ==================== 视频平台适配器基类 ====================
class VideoPlatformAdapter {
  constructor(platform) {
    this.platform = platform;
    this.searchHistory = new Map();
    this.searchPage = new Map();
  }

  formatPlayCount(count) {
    if (!count) return '0';
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
  }

  formatDuration(seconds) {
    if (!seconds) return '0分钟';
    if (seconds < 60) return seconds + '秒';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes + '分钟' + (remainingSeconds > 0 ? ' ' + remainingSeconds + '秒' : '');
  }

  stripHtml(html) {
    return html ? html.replace(/<[^>]*>/g, '') : '';
  }

  saveHistory(keyword, videos) {
    if (!this.searchHistory.has(keyword)) {
      this.searchHistory.set(keyword, []);
    }
    const existing = this.searchHistory.get(keyword);
    const newVideos = videos.filter(v => !existing.some(e => e.id === v.id));
    this.searchHistory.set(keyword, [...existing, ...newVideos]);
    return this.searchHistory.get(keyword);
  }

  getHistory(keyword) {
    return this.searchHistory.get(keyword) || [];
  }

  clearHistory(keyword) {
    this.searchHistory.delete(keyword);
    this.searchPage.delete(keyword);
  }

  async search(keyword) {
    throw new Error('search method must be implemented');
  }

  async getHotVideos() {
    throw new Error('getHotVideos method must be implemented');
  }
}

// ==================== B站适配器（优化版，获取多页）====================
class BilibiliAdapter extends VideoPlatformAdapter {
  constructor(cookie = '') {
    super('bilibili');
    this.cookie = cookie;
  }

  async search(keyword) {
    try {
      let page = this.searchPage.get(keyword) || 1;
      let allVideos = [];
      
      // 获取连续3页的数据
      for (let i = 0; i < 3; i++) {
        const currentPage = page + i;
        if (currentPage > 10) break; // 最多10页
        
        const searchUrl = `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(keyword)}&page=${currentPage}`;
        
        const headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://www.bilibili.com',
          'Accept': 'application/json'
        };

        if (this.cookie) {
          headers['Cookie'] = this.cookie;
        }

        const response = await axios.get(searchUrl, { headers, timeout: 10000 });

        if (response.data.code !== 0) break;

        const resultItems = response.data.data?.result || [];
        let videoList = resultItems.filter(item => item.type === 'video');

        let videos = videoList.map(item => ({
          id: `bili_${item.bvid || item.aid}`,
          title: this.stripHtml(item.title),
          cover: item.pic || '',
          author: item.author || '未知',
          duration: this.formatDuration(item.duration || 0),
          playCount: this.formatPlayCount(item.play || item.view || 0),
          description: item.description || '',
          url: `https://www.bilibili.com/video/${item.bvid}`,
          bvid: item.bvid,
          platform: 'bilibili'
        }));

        videos = filterAgricultureVideos(videos);
        allVideos = [...allVideos, ...videos];
        
        // 如果这一页没有视频，停止
        if (videos.length === 0) break;
      }
      
      this.saveHistory(keyword, allVideos);
      
      // 更新页码，下次搜索从下一页开始
      let nextPage = page + 3;
      if (nextPage > 10) nextPage = 1;
      this.searchPage.set(keyword, nextPage);
      
      return allVideos;
    } catch (error) {
      console.error('B站搜索失败:', error.message);
      return [];
    }
  }

  async getHotVideos() {
    try {
      const hotUrl = 'https://api.bilibili.com/x/web-interface/popular';
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.bilibili.com'
      };

      const response = await axios.get(hotUrl, { headers, timeout: 10000 });

      if (response.data.code !== 0) return [];

      let videoList = response.data.data.list || [];
      
      let videos = videoList.slice(0, 50).map(item => ({
        id: `bili_${item.bvid}`,
        title: this.stripHtml(item.title),
        cover: item.pic || '',
        author: item.owner?.name || '未知',
        duration: this.formatDuration(item.duration || 0),
        playCount: this.formatPlayCount(item.stat?.view || 0),
        description: item.desc || '',
        url: `https://www.bilibili.com/video/${item.bvid}`,
        bvid: item.bvid,
        platform: 'bilibili'
      }));

      videos = filterAgricultureVideos(videos);
      
      return videos;
    } catch (error) {
      console.error('B站热门获取失败:', error.message);
      return [];
    }
  }
}

// ==================== 腾讯视频适配器（优化版）====================
class TencentAdapter extends VideoPlatformAdapter {
  constructor() {
    super('tencent');
  }

  async search(keyword) {
    try {
      let page = this.searchPage.get(keyword) || 1;
      let allVideos = [];
      
      // 获取连续2页的数据
      for (let i = 0; i < 2; i++) {
        const currentPage = page + i;
        
        const searchUrl = `https://pbaccess.video.qq.com/trpc.videosearch.search.HttpSearchProxy/search?keyword=${encodeURIComponent(keyword)}&platform=2&pagesize=20&pageindex=${currentPage}`;
        
        const headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://v.qq.com/'
        };

        const response = await axios.get(searchUrl, { headers, timeout: 10000 });

        if (!response.data?.data) break;

        let items = response.data.data.video_list || [];
        
        let videos = items.map(item => ({
          id: `tx_${item.vid}`,
          title: item.title || '',
          cover: item.picture_url || item.cover_url || '',
          author: item.uploader_name || item.author_name || '腾讯用户',
          duration: this.formatDuration(item.duration || 0),
          playCount: this.formatPlayCount(item.play_count || item.view_count || 0),
          description: item.description || item.brief || '',
          url: `https://v.qq.com/x/cover/${item.vid}.html`,
          platform: 'tencent'
        }));

        videos = filterAgricultureVideos(videos);
        allVideos = [...allVideos, ...videos];
        
        if (videos.length === 0) break;
      }
      
      this.saveHistory(keyword, allVideos);
      
      let nextPage = page + 2;
      if (nextPage > 10) nextPage = 1;
      this.searchPage.set(keyword, nextPage);
      
      return allVideos;
    } catch (error) {
      console.error('腾讯视频搜索失败:', error.message);
      return [];
    }
  }

  async getHotVideos() {
    try {
      const hotUrl = 'https://pbaccess.video.qq.com/trpc.universal_bi.project_list_server.ProjectListServer/GetProjectList?flow_id=hot_week&page_num=1&page_size=50';
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://v.qq.com/'
      };

      const response = await axios.get(hotUrl, { headers, timeout: 10000 });

      if (!response.data?.data) return [];

      let items = response.data.data.project_list || [];
      
      let videos = items.slice(0, 50).map(item => ({
        id: `tx_${item.vid}`,
        title: item.title || '',
        cover: item.cover_url || '',
        author: '腾讯视频',
        duration: this.formatDuration(item.duration || 0),
        playCount: this.formatPlayCount(item.view_all_count || 0),
        description: item.description || '',
        url: `https://v.qq.com/x/cover/${item.vid}.html`,
        platform: 'tencent'
      }));

      videos = filterAgricultureVideos(videos);
      
      return videos;
    } catch (error) {
      console.error('腾讯热门获取失败:', error.message);
      return [];
    }
  }
}

// ==================== 抖音适配器（优化版）====================
class DouyinAdapter extends VideoPlatformAdapter {
  constructor() {
    super('douyin');
  }

  async search(keyword) {
    // TODO: 接入抖音API
    return [];
  }

  async getHotVideos() {
    return [];
  }
}

// ==================== 快手适配器（优化版）====================
class KuaishouAdapter extends VideoPlatformAdapter {
  constructor() {
    super('kuaishou');
  }

  async search(keyword) {
    // TODO: 接入快手API
    return [];
  }

  async getHotVideos() {
    return [];
  }
}

// ==================== 视频聚合服务 ====================
class VideoAggregator {
  constructor(config = {}) {
    this.adapters = [
      new BilibiliAdapter(config.bilibiliCookie),
      new TencentAdapter(),
      new DouyinAdapter(),
      new KuaishouAdapter()
    ];
  }

  async searchAll(keyword) {
    const results = await Promise.all(
      this.adapters.map(adapter => 
        adapter.search(keyword).catch(err => {
          console.error(`${adapter.platform}搜索失败:`, err.message);
          return [];
        })
      )
    );
    
    const allVideos = results.flat();
    
    // 去重
    const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());
    
    console.log(`聚合结果: B站 ${results[0].length}, 腾讯 ${results[1].length}, 抖音 ${results[2].length}, 快手 ${results[3].length}`);
    
    return uniqueVideos;
  }

  getMore(keyword) {
    const allHistory = this.adapters.flatMap(adapter => 
      adapter.getHistory(keyword)
    );
    
    return Array.from(new Map(allHistory.map(v => [v.id, v])).values());
  }

  async refresh(keyword) {
    this.adapters.forEach(adapter => {
      adapter.clearHistory(keyword);
    });
    
    return this.searchAll(keyword);
  }

  async getHotVideos() {
    const results = await Promise.all(
      this.adapters.map(adapter => 
        adapter.getHotVideos().catch(err => {
          console.error(`${adapter.platform}热门获取失败:`, err.message);
          return [];
        })
      )
    );
    
    const allVideos = results.flat();
    
    return Array.from(new Map(allVideos.map(v => [v.id, v])).values())
      .sort(() => Math.random() - 0.5);
  }
}

module.exports = VideoAggregator;