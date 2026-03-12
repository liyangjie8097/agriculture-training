<template>
  <view class="news-container" :class="{ 'dark-mode': darkMode }">
    <!-- 分类导航 -->
    <scroll-view class="category-scroll" :class="{ 'dark-category-scroll': darkMode }" scroll-x show-scrollbar="false">
      <view class="category-list">
        <view 
          class="category-item" 
          :class="{ active: currentCategory === 'all', 'dark-category-item': darkMode, 'dark-active': darkMode && currentCategory === 'all' }"
          @click="switchCategory('all')"
        >
          全部
        </view>
        <view 
          class="category-item" 
          :class="{ active: currentCategory === item.value, 'dark-category-item': darkMode, 'dark-active': darkMode && currentCategory === item.value }"
          v-for="item in categories" 
          :key="item.value"
          @click="switchCategory(item.value)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
    
    <!-- 资讯列表 -->
    <scroll-view class="news-list-scroll" scroll-y @scrolltolower="loadMore">
      <view class="news-list">
        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading && newsList.length === 0">
          <text class="loading-icon" :class="{ 'dark-loading-icon': darkMode }">📰</text>
          <text class="loading-text" :class="{ 'dark-loading-text': darkMode }">加载中...</text>
        </view>
        
        <!-- 置顶资讯（如果有） -->
        <view 
          class="news-card top-news" 
          :class="{ 'dark-card': darkMode }"
          v-if="topNews && filteredNews.length > 0"
          @click="goToNewsDetail(topNews)"
        >
          <image class="news-image" :src="topNews.cover_image || 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c'" mode="aspectFill"></image>
          <view class="news-info">
            <text class="news-title" :class="{ 'dark-text': darkMode }">{{ topNews.title }}</text>
            <text class="news-desc" :class="{ 'dark-desc': darkMode }">{{ topNews.summary || topNews.description }}</text>
            <view class="news-meta" :class="{ 'dark-meta': darkMode }">
              <text class="news-source" :class="{ 'dark-source': darkMode }">{{ topNews.source }}</text>
              <text class="news-time" :class="{ 'dark-time': darkMode }">{{ formatTime(topNews.publish_time) }}</text>
              <view class="news-stats">
                <text class="news-views" :class="{ 'dark-views': darkMode }">👁️ {{ topNews.view_count || 0 }}</text>
                <text class="news-comments" :class="{ 'dark-comments': darkMode }">💬 {{ topNews.comment_count || 0 }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 普通资讯列表 -->
        <view 
          class="news-card" 
          :class="{ 'dark-card': darkMode }"
          v-for="news in paginatedNews" 
          :key="news.id"
          @click="goToNewsDetail(news)"
        >
          <view class="news-content">
            <text class="news-title" :class="{ 'dark-text': darkMode }">{{ news.title }}</text>
            <text class="news-desc" :class="{ 'dark-desc': darkMode }">{{ news.summary || news.description }}</text>
            <view class="news-meta" :class="{ 'dark-meta': darkMode }">
              <text class="news-source" :class="{ 'dark-source': darkMode }">{{ news.source }}</text>
              <text class="news-time" :class="{ 'dark-time': darkMode }">{{ formatTime(news.publish_time) }}</text>
              <view class="news-stats">
                <text class="news-views" :class="{ 'dark-views': darkMode }">👁️ {{ news.view_count || 0 }}</text>
                <text class="news-comments" :class="{ 'dark-comments': darkMode }">💬 {{ news.comment_count || 0 }}</text>
              </view>
            </view>
          </view>
          <image class="news-thumb" :src="news.cover_image || 'https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u'" mode="aspectFill"></image>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <text :class="{ 'dark-load-text': darkMode }">{{ loadingText }}</text>
        </view>
        <view class="no-more" v-if="!hasMore && paginatedNews.length > 0">
          <text :class="{ 'dark-no-more': darkMode }">没有更多资讯了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 开发者信息 -->
    <view class="dev-info" :class="{ 'dark-dev': darkMode }">
      <text>开发者：李阳杰</text>
      <text>学号：2227010134</text>
    </view>
  </view>
</template>

<script>
// 导入 baseUrl
import baseUrl from '@/config.js'

export default {
  data() {
    return {
      darkMode: false,
      currentCategory: 'all',
      categories: [
        { name: '政策解读', value: 'policy' },
        { name: '市场行情', value: 'market' },
        { name: '技术前沿', value: 'tech' },
        { name: '专家观点', value: 'expert' },
        { name: '致富故事', value: 'story' },
        { name: '通知公告', value: 'notice' }
      ],
      
      newsList: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      loadingText: '加载中...'
    }
  },
  
  computed: {
    // 过滤后的资讯
    filteredNews() {
      if (this.currentCategory === 'all') {
        return this.newsList
      }
      return this.newsList.filter(news => news.category === this.currentCategory)
    },
    
    // 置顶资讯
    topNews() {
      return this.filteredNews.find(news => news.is_top === 1) || null
    },
    
    // 非置顶资讯
    normalNews() {
      return this.filteredNews.filter(news => news.is_top !== 1)
    },
    
    // 分页后的资讯
    paginatedNews() {
      const start = (this.page - 1) * this.pageSize
      const end = this.page * this.pageSize
      return this.normalNews.slice(start, end)
    }
  },
  
  onLoad() {
    // 获取深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
    
    this.loadNews()
  },
  
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    this.refreshNews()
  },
  
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  
  methods: {
    // 刷新资讯
    refreshNews() {
      this.page = 1
      this.hasMore = true
      this.newsList = []
      this.loadNews()
    },
    
    // 加载资讯
    async loadNews() {
      if (this.loading) return
      
      this.loading = true
      this.loadingText = '加载中...'
      
      try {
        const res = await uni.request({
          url: baseUrl + '/news',
          method: 'GET'
        })
        
        if (res.data.success) {
          const allNews = res.data.data
          const start = (this.page - 1) * this.pageSize
          const end = this.page * this.pageSize
          const pageNews = allNews.slice(start, end)
          
          this.newsList = [...this.newsList, ...pageNews]
          this.hasMore = end < allNews.length
          this.page++
          
          console.log('资讯加载成功:', this.newsList.length)
        } else {
          // 如果后端返回失败，使用模拟数据
          this.useMockData()
        }
      } catch (error) {
        console.error('加载资讯失败，使用模拟数据', error)
        this.useMockData()
      } finally {
        this.loading = false
      }
    },
    
    // 使用模拟数据
    useMockData() {
      // 模拟资讯数据（时间全部改为2025-2026年）
      const mockNews = [
        // 政策解读类 - 8条
        {
          id: 101,
          category: 'policy',
          title: '2026年中央一号文件发布：全面推进乡村振兴',
          summary: '文件提出要把推进乡村全面振兴作为新时代新征程"三农"工作的总抓手...',
          description: '2026年中央一号文件正式发布，提出多项惠农政策，包括加大农业补贴、完善农村基础设施、推进农业现代化等。',
          source: '农业农村部',
          cover_image: 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c',
          view_count: 3456,
          comment_count: 123,
          is_top: 1,
          publish_time: '2026-02-15T08:30:00Z'
        },
        {
          id: 102,
          category: 'policy',
          title: '2026年农业补贴政策新变化',
          summary: '今年农业补贴有哪些调整？种植大户、养殖户能拿到多少钱？',
          description: '2026年农业补贴政策有重大调整，包括种植补贴、农机购置补贴、农业保险补贴等都有所增加。',
          source: '财政部',
          cover_image: 'https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p',
          view_count: 2341,
          comment_count: 89,
          is_top: 0,
          publish_time: '2026-02-10T09:15:00Z'
        },
        {
          id: 103,
          category: 'policy',
          title: '农村土地流转新规解读',
          summary: '2026年起，农村土地流转将有新规定，农民朋友要注意了',
          description: '新规明确了土地流转的程序、合同范本、纠纷处理机制等，保障农民权益。',
          source: '自然资源部',
          cover_image: 'https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f',
          view_count: 1876,
          comment_count: 67,
          is_top: 0,
          publish_time: '2026-02-05T14:20:00Z'
        },
        {
          id: 104,
          category: 'policy',
          title: '2026年乡村振兴重点任务',
          summary: '今年乡村振兴有哪些重点工作？涉及产业、人才、文化、生态、组织五个方面',
          description: '2026年乡村振兴重点任务清单发布，包括100个示范县建设、5000个示范村打造等。',
          source: '农业农村部',
          cover_image: 'https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v',
          view_count: 2123,
          comment_count: 78,
          is_top: 0,
          publish_time: '2026-02-01T10:30:00Z'
        },
        {
          id: 105,
          category: 'policy',
          title: '农机购置补贴政策升级',
          summary: '2026年农机补贴范围扩大，新能源农机纳入补贴目录',
          description: '新政策将无人机、智能农机、新能源农机纳入补贴范围，单机最高补贴可达30%。',
          source: '工信部',
          cover_image: 'https://img.ixigua.com/3w2x1y0z-9a8b-7c6d-5e4f-3g2h1i0j9k8l',
          view_count: 1567,
          comment_count: 45,
          is_top: 0,
          publish_time: '2026-01-25T16:40:00Z'
        },
        {
          id: 106,
          category: 'policy',
          title: '农业保险新政：保障更全面',
          summary: '2026年起，农业保险覆盖范围扩大，理赔流程简化',
          description: '新政策将玉米、水稻、小麦等主粮作物纳入完全成本保险，保障水平提升。',
          source: '银保监会',
          cover_image: 'https://img.ixigua.com/7m6n5o4p-3q2r-1s0t-9u8v-7w6x5y4z3a2b',
          view_count: 1345,
          comment_count: 34,
          is_top: 0,
          publish_time: '2026-01-20T11:15:00Z'
        },
        {
          id: 107,
          category: 'policy',
          title: '农村电商扶持政策出台',
          summary: '2026年将重点扶持100个农村电商示范县',
          description: '政策包括物流补贴、培训支持、平台对接等，帮助农产品上行。',
          source: '商务部',
          cover_image: 'https://img.ixigua.com/1c2d3e4f-5g6h-7i8j-9k0l-1m2n3o4p5q6r',
          view_count: 1890,
          comment_count: 56,
          is_top: 0,
          publish_time: '2026-01-15T13:50:00Z'
        },
        {
          id: 108,
          category: 'policy',
          title: '高标准农田建设规划发布',
          summary: '到2026年底，新增高标准农田1亿亩',
          description: '规划明确了建设标准、投资规模和进度安排，提升耕地质量。',
          source: '发改委',
          cover_image: 'https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h',
          view_count: 1456,
          comment_count: 42,
          is_top: 0,
          publish_time: '2026-01-10T09:30:00Z'
        },
        
        // 市场行情类 - 8条
        {
          id: 201,
          category: 'market',
          title: '生猪价格连续上涨，养殖户迎来盈利期',
          summary: '据监测，全国生猪平均价格连续8周上涨，养殖效益明显改善',
          description: '生猪价格从年初的14元/公斤上涨到现在的18元/公斤，出栏一头猪可盈利300-500元。',
          source: '中国农业信息网',
          cover_image: 'https://img.ixigua.com/3i4j5k6l-7m8n-9o0p-1q2r-3s4t5u6v7w8x',
          view_count: 2890,
          comment_count: 98,
          is_top: 1,
          publish_time: '2026-02-18T08:20:00Z'
        },
        {
          id: 202,
          category: 'market',
          title: '玉米价格创三年新高',
          summary: '受供需关系影响，玉米价格持续走高',
          description: '目前东北地区玉米收购价已达2600元/吨，较去年同期上涨20%。',
          source: '粮油市场报',
          cover_image: 'https://img.ixigua.com/9y0z1a2b-3c4d-5e6f-7g8h-9i0j1k2l3m4n',
          view_count: 2345,
          comment_count: 76,
          is_top: 0,
          publish_time: '2026-02-15T10:30:00Z'
        },
        {
          id: 203,
          category: 'market',
          title: '鸡蛋价格季节性回落',
          summary: '春节过后，鸡蛋价格进入传统淡季',
          description: '目前全国鸡蛋批发均价8.2元/公斤，较春节前下降15%。',
          source: '禽业信息',
          cover_image: 'https://img.ixigua.com/5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
          view_count: 1678,
          comment_count: 45,
          is_top: 0,
          publish_time: '2026-02-12T14:15:00Z'
        },
        {
          id: 204,
          category: 'market',
          title: '蔬菜价格普遍下降',
          summary: '天气回暖，蔬菜上市量增加，价格走低',
          description: '菠菜、油菜、生菜等叶菜价格下降明显，降幅达20-30%。',
          source: '蔬菜市场',
          cover_image: 'https://img.ixigua.com/1e2f3g4h-5i6j-7k8l-9m0n-1o2p3q4r5s6t',
          view_count: 1456,
          comment_count: 34,
          is_top: 0,
          publish_time: '2026-02-10T11:40:00Z'
        },
        {
          id: 205,
          category: 'market',
          title: '化肥价格稳中有降',
          summary: '春耕备耕期间，化肥供应充足，价格稳定',
          description: '尿素价格较去年同期下降5%，复合肥价格基本持平。',
          source: '农资导报',
          cover_image: 'https://img.ixigua.com/7u8v9w0x-1y2z-3a4b-5c6d-7e8f9g0h1i2j',
          view_count: 1234,
          comment_count: 28,
          is_top: 0,
          publish_time: '2026-02-08T09:25:00Z'
        },
        {
          id: 206,
          category: 'market',
          title: '水果价格两极分化',
          summary: '柑橘类水果价格走低，进口水果价格坚挺',
          description: '砂糖橘、沃柑等柑橘类水果大量上市，价格同比下降10%；车厘子等进口水果价格仍处高位。',
          source: '果品流通协会',
          cover_image: 'https://img.ixigua.com/3k4l5m6n-7o8p-9q0r-1s2t-3u4v5w6x7y8z',
          view_count: 1890,
          comment_count: 52,
          is_top: 0,
          publish_time: '2026-02-05T16:30:00Z'
        },
        {
          id: 207,
          category: 'market',
          title: '水产品价格稳中有升',
          summary: '春节后水产品需求不减，价格小幅上涨',
          description: '草鱼、鲫鱼等常规鱼价上涨5%，虾蟹类价格保持稳定。',
          source: '水产前沿',
          cover_image: 'https://img.ixigua.com/9a0b1c2d-3e4f-5g6h-7i8j-9k0l1m2n3o4p',
          view_count: 1567,
          comment_count: 38,
          is_top: 0,
          publish_time: '2026-02-02T13:20:00Z'
        },
        {
          id: 208,
          category: 'market',
          title: '2026年一季度农产品价格走势预测',
          summary: '专家预计，一季度农产品价格将呈现分化走势',
          description: '粮食价格稳中有涨，猪肉价格季节性回落，蔬菜价格波动加大。',
          source: '农业监测中心',
          cover_image: 'https://img.ixigua.com/5q6r7s8t-9u0v-1w2x-3y4z-5a6b7c8d9e0f',
          view_count: 2123,
          comment_count: 67,
          is_top: 0,
          publish_time: '2026-01-28T10:15:00Z'
        },
        
        // 技术前沿类 - 8条
        {
          id: 301,
          category: 'tech',
          title: '无人机植保技术：效率提升80%，成本降低50%',
          summary: '随着农业现代化发展，无人机植保正在改变传统农作业方式',
          description: '无人机植保效率是人工的80倍，农药利用率提高30%，已在多地推广。',
          source: '农业科技报',
          cover_image: 'https://img.ixigua.com/1g2h3i4j-5k6l-7m8n-9o0p-1q2r3s4t5u6v',
          view_count: 3567,
          comment_count: 156,
          is_top: 1,
          publish_time: '2026-02-16T09:30:00Z'
        },
        {
          id: 302,
          category: 'tech',
          title: '智能温室控制系统亮相',
          summary: '手机APP即可远程控制大棚温湿度',
          description: '新系统可自动调节大棚内的温度、湿度、光照，节省人工成本50%以上。',
          source: '智慧农业',
          cover_image: 'https://img.ixigua.com/7w8x9y0z-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
          view_count: 2789,
          comment_count: 98,
          is_top: 0,
          publish_time: '2026-02-12T14:25:00Z'
        },
        {
          id: 303,
          category: 'tech',
          title: '新型生物农药问世',
          summary: '环保高效，对人畜无害，已获农业农村部登记',
          description: '该生物农药以植物提取物为主要成分，对害虫防治效果达85%以上。',
          source: '植保信息',
          cover_image: 'https://img.ixigua.com/3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
          view_count: 2345,
          comment_count: 76,
          is_top: 0,
          publish_time: '2026-02-08T11:40:00Z'
        },
        {
          id: 304,
          category: 'tech',
          title: '智能农机自动驾驶系统',
          summary: '拖拉机可实现无人驾驶，精准作业',
          description: '该系统基于北斗导航，作业精度达厘米级，可24小时连续作业。',
          source: '农机化导报',
          cover_image: 'https://img.ixigua.com/9c0d1e2f-3g4h-5i6j-7k8l-9m0n1o2p3q4r',
          view_count: 1987,
          comment_count: 65,
          is_top: 0,
          publish_time: '2026-02-05T15:20:00Z'
        },
        {
          id: 305,
          category: 'tech',
          title: '水肥一体化智能系统',
          summary: '节水40%，节肥30%，增产20%',
          description: '系统根据作物需水需肥规律自动配比，已在多个示范基地推广应用。',
          source: '灌溉技术',
          cover_image: 'https://img.ixigua.com/5s6t7u8v-9w0x-1y2z-3a4b-5c6d7e8f9g0h',
          view_count: 1765,
          comment_count: 54,
          is_top: 0,
          publish_time: '2026-02-02T10:35:00Z'
        },
        {
          id: 306,
          category: 'tech',
          title: '区块链农产品溯源平台',
          summary: '扫码可知农产品从田间到餐桌全过程',
          description: '平台已接入2000多家农业企业，消费者可追溯产品生产、加工、流通各环节。',
          source: '数字农业',
          cover_image: 'https://img.ixigua.com/1i2j3k4l-5m6n-7o8p-9q0r-1s2t3u4v5w6x',
          view_count: 2123,
          comment_count: 82,
          is_top: 0,
          publish_time: '2026-01-28T16:15:00Z'
        },
        {
          id: 307,
          category: 'tech',
          title: '新型无土栽培技术',
          summary: '产量提高50%，适合城市农业',
          description: '该技术采用营养液循环系统，已在北京、上海等城市郊区推广。',
          source: '设施农业',
          cover_image: 'https://img.ixigua.com/7y8z9a0b-1c2d-3e4f-5g6h-7i8j9k0l1m2n',
          view_count: 1890,
          comment_count: 47,
          is_top: 0,
          publish_time: '2026-01-25T13:50:00Z'
        },
        {
          id: 308,
          category: 'tech',
          title: 'AI病虫害识别系统',
          summary: '拍照即可识别病虫害，准确率90%以上',
          description: '系统已收录1000多种病虫害图像，可提供防治建议。',
          source: '农业AI',
          cover_image: 'https://img.ixigua.com/3o4p5q6r-7s8t-9u0v-1w2x-3y4z5a6b7c8d',
          view_count: 2678,
          comment_count: 93,
          is_top: 0,
          publish_time: '2026-01-22T09:10:00Z'
        },
        
        // 专家观点类 - 8条
        {
          id: 401,
          category: 'expert',
          title: '中国工程院院士：智慧农业是未来发展方向',
          summary: '在近日召开的农业科技论坛上，多位院士专家就智慧农业发展发表观点',
          description: '院士指出，智慧农业将大幅提高生产效率，降低劳动强度，是农业现代化的必由之路。',
          source: '农民日报',
          cover_image: 'https://img.ixigua.com/9e0f1g2h-3i4j-5k6l-7m8n-9o0p1q2r3s4t',
          view_count: 3123,
          comment_count: 145,
          is_top: 1,
          publish_time: '2026-02-15T08:45:00Z'
        },
        {
          id: 402,
          category: 'expert',
          title: '农科院专家：2026年农业生产建议',
          summary: '专家建议农户根据市场需求调整种植结构',
          description: '建议增加大豆、玉米种植面积，适当减少普通稻谷种植。',
          source: '中国农科院',
          cover_image: 'https://img.ixigua.com/5u6v7w8x-9y0z-1a2b-3c4d-5e6f7g8h9i0j',
          view_count: 2567,
          comment_count: 89,
          is_top: 0,
          publish_time: '2026-02-10T10:30:00Z'
        },
        {
          id: 403,
          category: 'expert',
          title: '经济学家：2026年农产品价格走势分析',
          summary: '受国内外因素影响，今年农产品价格波动可能加大',
          description: '专家建议农户关注市场动态，合理安排生产和销售。',
          source: '农业经济',
          cover_image: 'https://img.ixigua.com/1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
          view_count: 2234,
          comment_count: 67,
          is_top: 0,
          publish_time: '2026-02-08T14:15:00Z'
        },
        {
          id: 404,
          category: 'expert',
          title: '植保专家：2026年病虫害预测',
          summary: '预计今年水稻稻飞虱、玉米螟等病虫害偏重发生',
          description: '专家建议提前做好防控准备，选用抗病品种，合理用药。',
          source: '植保所',
          cover_image: 'https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p',
          view_count: 1987,
          comment_count: 56,
          is_top: 0,
          publish_time: '2026-02-05T11:25:00Z'
        },
        {
          id: 405,
          category: 'expert',
          title: '气象专家：2026年农业生产气候预测',
          summary: '今年可能发生中等强度厄尔尼诺现象，农业生产需提前应对',
          description: '专家建议北方注意抗旱，南方防范洪涝，合理安排农时。',
          source: '气象局',
          cover_image: 'https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f',
          view_count: 2345,
          comment_count: 78,
          is_top: 0,
          publish_time: '2026-02-02T15:40:00Z'
        },
        {
          id: 406,
          category: 'expert',
          title: '畜牧专家：2026年养殖业发展趋势',
          summary: '规模化、智能化是养殖业发展方向',
          description: '专家建议养殖户适度扩大规模，提高自动化水平，降低养殖成本。',
          source: '畜牧兽医局',
          cover_image: 'https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v',
          view_count: 2123,
          comment_count: 64,
          is_top: 0,
          publish_time: '2026-01-28T09:55:00Z'
        },
        {
          id: 407,
          category: 'expert',
          title: '农机专家：智能农机选型指南',
          summary: '如何选择适合自己农场的智能农机',
          description: '专家建议根据种植规模、作物类型、地形条件选择合适的农机装备。',
          source: '农机鉴定站',
          cover_image: 'https://img.ixigua.com/3w2x1y0z-9a8b-7c6d-5e4f-3g2h1i0j9k8l',
          view_count: 1876,
          comment_count: 45,
          is_top: 0,
          publish_time: '2026-01-25T13:20:00Z'
        },
        {
          id: 408,
          category: 'expert',
          title: '电商专家：农产品直播带货技巧',
          summary: '2026年农产品电商新趋势',
          description: '专家建议农户学习直播技巧，打造个人IP，提升产品附加值。',
          source: '电商协会',
          cover_image: 'https://img.ixigua.com/7m6n5o4p-3q2r-1s0t-9u8v-7w6x5y4z3a2b',
          view_count: 2765,
          comment_count: 98,
          is_top: 0,
          publish_time: '2026-01-22T16:30:00Z'
        },
        
        // 致富故事类 - 8条
        {
          id: 501,
          category: 'story',
          title: '90后新农人：返乡创业年入百万',
          summary: '放弃城市高薪，回乡创业做现代农业',
          description: '90后小伙张某返乡种植有机蔬菜，通过电商销售，年销售额突破100万。',
          source: '央视三农',
          cover_image: 'https://img.ixigua.com/1c2d3e4f-5g6h-7i8j-9k0l-1m2n3o4p5q6r',
          view_count: 4567,
          comment_count: 234,
          is_top: 1,
          publish_time: '2026-02-14T09:20:00Z'
        },
        {
          id: 502,
          category: 'story',
          title: '农民网红：直播带货年销500万',
          summary: '靠直播卖农产品，带动全村致富',
          description: '山东农民李某通过直播卖苹果，年销售额超500万，带动周边100多户果农增收。',
          source: '致富经',
          cover_image: 'https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h',
          view_count: 3890,
          comment_count: 167,
          is_top: 0,
          publish_time: '2026-02-10T14:35:00Z'
        },
        {
          id: 503,
          category: 'story',
          title: '夫妻返乡养猪，年出栏5000头',
          summary: '从零开始学习养猪技术，如今已成当地养殖大户',
          description: '80后夫妻返乡创业，通过科学养猪，年出栏生猪5000头，年利润200万。',
          source: '畜牧天地',
          cover_image: 'https://img.ixigua.com/3i4j5k6l-7m8n-9o0p-1q2r-3s4t5u6v7w8x',
          view_count: 3345,
          comment_count: 145,
          is_top: 0,
          publish_time: '2026-02-08T11:40:00Z'
        },
        {
          id: 504,
          category: 'story',
          title: '大学生种植有机蔬菜，年入300万',
          summary: '学以致用，将专业知识应用到农业生产',
          description: '农学专业毕业生创建有机农场，种植高端蔬菜，供应一线城市高端市场。',
          source: '新农人',
          cover_image: 'https://img.ixigua.com/9y0z1a2b-3c4d-5e6f-7g8h-9i0j1k2l3m4n',
          view_count: 2987,
          comment_count: 123,
          is_top: 0,
          publish_time: '2026-02-05T15:50:00Z'
        },
        {
          id: 505,
          category: 'story',
          title: '合作社带领300户农民致富',
          summary: '统一品种、统一技术、统一销售，年产值超2000万',
          description: '某合作社通过标准化生产，将当地特色农产品销往全国，带动300多户农民增收。',
          source: '农民日报',
          cover_image: 'https://img.ixigua.com/5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
          view_count: 2678,
          comment_count: 98,
          is_top: 0,
          publish_time: '2026-02-02T10:15:00Z'
        },
        {
          id: 506,
          category: 'story',
          title: '退役军人种出"网红"西瓜',
          summary: '退伍不褪色，种西瓜种出新天地',
          description: '退伍军人利用网络营销，将西瓜卖到全国各地，年销售额200万。',
          source: '退役军人事务部',
          cover_image: 'https://img.ixigua.com/1e2f3g4h-5i6j-7k8l-9m0n-1o2p3q4r5s6t',
          view_count: 2345,
          comment_count: 87,
          is_top: 0,
          publish_time: '2026-01-28T16:20:00Z'
        },
        {
          id: 507,
          category: 'story',
          title: '农家女做电商，年销百万',
          summary: '从零开始学电商，如今已是村里的致富带头人',
          description: '农村姑娘通过电商平台销售家乡特产，带动村里20多户贫困户脱贫。',
          source: '妇女报',
          cover_image: 'https://img.ixigua.com/7u8v9w0x-1y2z-3a4b-5c6d-7e8f9g0h1i2j',
          view_count: 2567,
          comment_count: 92,
          is_top: 0,
          publish_time: '2026-01-25T13:45:00Z'
        },
        {
          id: 508,
          category: 'story',
          title: '老茶农的电商之路',
          summary: '70岁老茶农学会网上卖茶，年入50万',
          description: '通过学习电商知识，将自家茶叶卖到全国各地，收入翻了几番。',
          source: '老年报',
          cover_image: 'https://img.ixigua.com/3k4l5m6n-7o8p-9q0r-1s2t-3u4v5w6x7y8z',
          view_count: 1890,
          comment_count: 67,
          is_top: 0,
          publish_time: '2026-01-22T09:30:00Z'
        },
        
        // 通知公告类 - 6条
        {
          id: 601,
          category: 'notice',
          title: '2026年农业技能培训计划发布',
          summary: '全年将举办100期培训班，覆盖种植、养殖、农机等专业',
          description: '培训免费，结业后可获得技能证书，详情可咨询当地农技站。',
          source: '农业农村部',
          cover_image: 'https://img.ixigua.com/9a0b1c2d-3e4f-5g6h-7i8j-9k0l1m2n3o4p',
          view_count: 3456,
          comment_count: 123,
          is_top: 1,
          publish_time: '2026-02-01T08:30:00Z'
        },
        {
          id: 602,
          category: 'notice',
          title: '2026年农机购置补贴申请开始',
          summary: '补贴申请时间为3月1日至5月31日',
          description: '今年补贴范围扩大，新增智能农机、新能源农机等品类。',
          source: '农机化司',
          cover_image: 'https://img.ixigua.com/5q6r7s8t-9u0v-1w2x-3y4z-5a6b7c8d9e0f',
          view_count: 2890,
          comment_count: 98,
          is_top: 0,
          publish_time: '2026-01-28T10:15:00Z'
        },
        {
          id: 603,
          category: 'notice',
          title: '2026年农业保险投保指南',
          summary: '投保截止日期为4月30日',
          description: '今年新增大豆、玉米完全成本保险，保障水平大幅提升。',
          source: '银保监会',
          cover_image: 'https://img.ixigua.com/1g2h3i4j-5k6l-7m8n-9o0p-1q2r3s4t5u6v',
          view_count: 2345,
          comment_count: 76,
          is_top: 0,
          publish_time: '2026-01-25T14:20:00Z'
        },
        {
          id: 604,
          category: 'notice',
          title: '2026年全国农业技能大赛报名',
          summary: '大赛设种植、养殖、农机维修等10个项目',
          description: '获奖者可获得奖金和技能等级证书，报名截止5月30日。',
          source: '人社部',
          cover_image: 'https://img.ixigua.com/7w8x9y0z-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
          view_count: 1987,
          comment_count: 65,
          is_top: 0,
          publish_time: '2026-01-22T11:35:00Z'
        },
        {
          id: 605,
          category: 'notice',
          title: '2026年乡村振兴示范县名单公布',
          summary: '全国100个县入选乡村振兴示范县',
          description: '示范县将获得政策和资金支持，带动周边地区发展。',
          source: '发改委',
          cover_image: 'https://img.ixigua.com/3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
          view_count: 3123,
          comment_count: 112,
          is_top: 0,
          publish_time: '2026-01-20T09:50:00Z'
        },
        {
          id: 606,
          category: 'notice',
          title: '2026年农业科技下乡活动启动',
          summary: '百名专家下乡，为农民提供技术指导',
          description: '活动覆盖全国500个县，专家将深入田间地头解决实际问题。',
          source: '科技部',
          cover_image: 'https://img.ixigua.com/9c0d1e2f-3g4h-5i6j-7k8l-9m0n1o2p3q4r',
          view_count: 2678,
          comment_count: 87,
          is_top: 0,
          publish_time: '2026-01-18T15:10:00Z'
        }
      ]
      
      // 计算未读数量
      this.newsList = mockNews
      this.hasMore = false
    },
    
    // 切换分类
    switchCategory(category) {
      this.currentCategory = category
      this.refreshNews()
    },
    
    // 加载更多
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadNews()
      }
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '未知时间'
      
      const date = new Date(timeStr)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return minutes + '分钟前'
      if (hours < 24) return hours + '小时前'
      if (days < 30) return days + '天前'
      
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    
    // 跳转到资讯详情
    goToNewsDetail(news) {
      uni.navigateTo({
        url: '/pages/news-detail/news-detail?id=' + news.id
      })
    }
  }
}
</script>

<style>
.news-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* 深色模式 */
.news-container.dark-mode {
  background-color: #1a1a1a;
}

/* 分类导航 */
.category-scroll {
  height: 90rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eee;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.category-scroll.dark-category-scroll {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.category-list {
  display: flex;
  flex-direction: row;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.category-item.dark-category-item {
  color: #aaa;
}

.category-item.active {
  color: #2b5e2b;
  font-weight: bold;
}

.category-item.dark-active {
  color: #4CAF50;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background-color: #2b5e2b;
  border-radius: 2rpx;
}

.category-item.dark-active::after {
  background-color: #4CAF50;
}

/* 资讯列表 */
.news-list-scroll {
  flex: 1;
  height: calc(100vh - 90rpx);
}

.news-list {
  padding: 20rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.loading-icon.dark-loading-icon {
  opacity: 0.3;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  transition: color 0.3s ease;
}

.loading-text.dark-loading-text {
  color: #666;
}

.news-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.news-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.top-news {
  padding: 0;
  overflow: hidden;
}

.top-news .news-image {
  width: 100%;
  height: 350rpx;
}

.top-news .news-info {
  padding: 20rpx;
}

.top-news .news-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.top-news .news-title.dark-text {
  color: #fff;
}

.news-card:not(.top-news) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20rpx;
}

.news-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.news-title.dark-text {
  color: #fff;
}

.news-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 15rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.news-desc.dark-desc {
  color: #aaa;
}

.news-thumb {
  width: 180rpx;
  height: 140rpx;
  border-radius: 12rpx;
}

.news-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.news-meta.dark-meta {
  color: #aaa;
}

.news-source {
  color: #2b5e2b;
  margin-right: 20rpx;
  transition: color 0.3s ease;
}

.news-source.dark-source {
  color: #4CAF50;
}

.news-time.dark-time {
  color: #aaa;
}

.news-stats {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.news-views {
  margin-right: 15rpx;
  transition: color 0.3s ease;
}

.news-views.dark-views {
  color: #aaa;
}

.news-comments {
  color: #666;
  transition: color 0.3s ease;
}

.news-comments.dark-comments {
  color: #aaa;
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.load-more.dark-load-text,
.no-more.dark-no-more {
  color: #666;
}

.dev-info {
  text-align: center;
  padding: 10rpx;
  font-size: 20rpx;
  color: #ccc;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
  background-color: #2a2a2a;
}
</style>