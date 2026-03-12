<template>
  <view class="search-container" :class="{ 'dark-mode': darkMode }">
    <!-- 搜索栏 -->
    <view class="search-header" :class="{ 'dark-header': darkMode }">
      <view class="search-box" :class="{ 'dark-search-box': darkMode }">
        <text class="search-icon" :class="{ 'dark-icon': darkMode }">🔍</text>
        <input 
          class="search-input" 
          :class="{ 'dark-input': darkMode }"
          type="text" 
          v-model="keyword" 
          placeholder="搜索农业视频..."
          confirm-type="search"
          @confirm="handleSearch"
          focus
          placeholder-class="dark-placeholder"
        />
        <text class="clear-icon" :class="{ 'dark-icon': darkMode }" v-if="keyword" @click="clearKeyword">✕</text>
      </view>
      <text class="cancel-btn" :class="{ 'dark-text': darkMode }" @click="goBack">取消</text>
    </view>
    
    <!-- 搜索历史和热门搜索 -->
    <view class="history-section" :class="{ 'dark-section': darkMode }" v-if="!searchPerformed && historyList.length > 0">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">最近搜索</text>
        <text class="clear-history" :class="{ 'dark-text-light': darkMode }" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <view 
          class="history-tag" 
          :class="{ 'dark-tag': darkMode }"
          v-for="(item, index) in historyList" 
          :key="index"
          @click="searchHistory(item)"
        >
          <text :class="{ 'dark-text': darkMode }">{{ item }}</text>
        </view>
      </view>
    </view>
    
    <view class="hot-section" :class="{ 'dark-section': darkMode }" v-if="!searchPerformed">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">🔥 热门搜索</text>
      </view>
      <view class="hot-tags">
        <view 
          class="hot-tag" 
          v-for="(item, index) in hotSearches" 
          :key="index"
          :class="['hot-tag-' + (index % 4 + 1), { 'dark-hot-tag': darkMode }]"
          @click="searchHistory(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>
    
    <!-- 搜索结果 -->
    <scroll-view 
      class="search-results-scroll" 
      scroll-y 
      v-if="searchPerformed"
      @scrolltolower="loadMore"
      @scroll="onScroll"
      :scroll-top="scrollTop"
      ref="scrollView"
    >
      <view class="results-list">
        <!-- 工具栏 -->
        <view class="toolbar">
          <text class="result-count" :class="{ 'dark-text': darkMode }">共找到 {{ totalVideos }} 个农业视频</text>
          <view class="toolbar-buttons">
            <button class="refresh-btn" :class="{ 'dark-btn': darkMode }" @click="refreshSearch" :disabled="refreshing">
              <text class="refresh-icon" :class="{ 'refreshing': refreshing, 'dark-icon': darkMode }">↻</text>
              <text>{{ refreshing ? '刷新中' : '刷新' }}</text>
            </button>
          </view>
        </view>
        
        <!-- 当前显示的视频 -->
        <view 
          class="result-card" 
          :class="{ 'dark-card': darkMode }"
          v-for="video in paginatedVideos" 
          :key="video.id"
          @click="playVideo(video)"
        >
          <image class="result-image" :src="video.cover || 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c'" mode="aspectFill"></image>
          <view class="result-info">
            <text class="result-title" :class="{ 'dark-text': darkMode }">{{ video.title || '无标题' }}</text>
            <text class="result-desc" :class="{ 'dark-desc': darkMode }">{{ video.description || video.title || '暂无描述' }}</text>
            <view class="result-meta" :class="{ 'dark-meta': darkMode }">
              <text class="meta-item" :class="{ 'dark-meta-item': darkMode }">👤 {{ video.author || '未知作者' }}</text>
              <text class="meta-item" :class="{ 'dark-meta-item': darkMode }">⏱️ {{ video.duration || '15分钟' }}</text>
              <text class="meta-item" :class="{ 'dark-meta-item': darkMode }">👁️ {{ video.playCount || '0' }}</text>
            </view>
          </view>
        </view>
        
        <!-- 分页控件 -->
        <view class="pagination" v-if="totalPages > 1">
          <view class="pagination-info">
            <text :class="{ 'dark-text-light': darkMode }">第 {{ currentPage }} / {{ totalPages }} 页</text>
          </view>
          <view class="pagination-buttons">
            <button 
              class="page-btn" 
              :class="{ 'dark-page-btn': darkMode, 'dark-disabled': darkMode && currentPage === 1 }"
              @click="goToPage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >上一页</button>
            <button 
              class="page-btn" 
              :class="{ 'dark-page-btn': darkMode, 'dark-disabled': darkMode && currentPage === totalPages }"
              @click="goToPage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >下一页</button>
          </view>
        </view>
        
        <!-- 加载更多提示（兼容上滑加载） -->
        <view class="load-more" v-if="hasMore && !showPagination">
          <text :class="{ 'dark-text-light': darkMode }">{{ loadingMore ? '加载中...' : '上滑加载更多' }}</text>
        </view>
        <view class="no-more" v-if="!hasMore && !showPagination && paginatedVideos.length > 0">
          <text :class="{ 'dark-text-light': darkMode }">已显示全部视频</text>
        </view>
        
        <!-- 无结果 -->
        <view class="no-results" v-if="paginatedVideos.length === 0 && !searching">
          <text class="no-results-icon" :class="{ 'dark-icon': darkMode }">🔍</text>
          <text class="no-results-text" :class="{ 'dark-text': darkMode }">没有找到相关农业视频</text>
          <text class="no-results-desc" :class="{ 'dark-desc': darkMode }">试试其他关键词</text>
        </view>
        
        <!-- 加载中 -->
        <view class="loading-more" v-if="searching">
          <text :class="{ 'dark-text-light': darkMode }">搜索中...</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 回到顶部按钮 -->
    <view class="back-to-top" :class="{ 'dark-btn': darkMode }" v-if="showBackToTop" @click="scrollToTop">
      <text>↑</text>
    </view>
    
    <!-- 视频播放组件 -->
    <VideoPlayer 
      :show="showVideoModal" 
      :video="currentVideo"
      @close="closeVideoModal"
      @start="onVideoStart"
      @complete="onVideoComplete"
    />
    
    <!-- 开发者信息 -->
    <view class="dev-info" :class="{ 'dark-dev': darkMode }">
      <text>开发者：李阳杰</text>
      <text>学号：2227010134</text>
    </view>
  </view>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue'
// 导入 baseUrl
import baseUrl from '@/config.js'

export default {
  components: {
    VideoPlayer
  },
  data() {
    return {
      darkMode: false,
      keyword: '',
      searchPerformed: false,
      searching: false,
      refreshing: false,
      loadingMore: false,
      hasMore: true,
      showBackToTop: false,
      scrollTop: 0,
      historyList: [],
      hotSearches: [
        '水稻种植', '大棚蔬菜', '拖拉机操作', 
        '病虫害防治', '果树修剪', '农产品电商',
        '养猪技术', '养鸡技术', '施肥技巧'
      ],
      allVideos: [],      // 所有历史视频
      paginatedVideos: [], // 当前页显示的视频
      currentPage: 1,
      pageSize: 10,        // 每页显示数量
      totalVideos: 0,
      showPagination: true, // 是否显示分页控件（true显示分页，false显示上滑加载）
      showVideoModal: false,
      currentVideo: null,
      currentUser: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.allVideos.length / this.pageSize)
    }
  },
  onLoad(options) {
    // 获取深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
    
    this.loadSearchHistory()
    this.getCurrentUser()
    if (options.keyword) {
      this.keyword = options.keyword
      this.handleSearch()
    }
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    getCurrentUser() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.currentUser = userInfo
      }
    },
    
    async handleSearch() {
      if (!this.keyword.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        })
        return
      }
      
      this.saveSearchHistory(this.keyword)
      this.searchPerformed = true
      this.searching = true
      this.allVideos = []
      this.paginatedVideos = []
      this.currentPage = 1
      this.hasMore = true
      
      try {
        const res = await uni.request({
          url: baseUrl + '/video/search',
          method: 'GET',
          data: { keyword: this.keyword }
        })
        
        if (res.data.success) {
          this.allVideos = res.data.data || []
          this.totalVideos = this.allVideos.length
          this.updatePaginatedVideos()
          console.log('搜索到农业视频:', this.allVideos.length)
          
          if (this.allVideos.length === 0) {
            uni.showToast({
              title: '没有找到相关农业视频',
              icon: 'none'
            })
          }
        } else {
          // 如果后端返回失败，使用模拟数据
          this.useMockData()
        }
      } catch (error) {
        console.error('搜索请求失败，使用模拟数据', error)
        this.useMockData()
      } finally {
        this.searching = false
      }
    },
    
    // 使用模拟数据
    useMockData() {
      const mockAll = [
        // 种植类
        { id: 1, title: '水稻高产种植技术', cover: 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c', author: '农业科普频道', playCount: '23.4万', description: '从选种到收割全流程，30年经验老农手把手教学', duration: '45分钟', category: 'plant' },
        { id: 2, title: '大棚蔬菜冬季管理技巧', cover: 'https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u', author: '蔬菜种植大全', playCount: '12.8万', description: '冬季大棚保温、通风、浇水全攻略', duration: '32分钟', category: 'plant' },
        { id: 3, title: '玉米密植高产栽培技术', cover: 'https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p', author: '玉米种植专家', playCount: '18.9万', description: '玉米密植技术，提高产量30%', duration: '38分钟', category: 'plant' },
        { id: 4, title: '小麦返青期田间管理', cover: 'https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f', author: '小麦研究所', playCount: '15.2万', description: '返青期水肥管理、病虫害防治', duration: '29分钟', category: 'plant' },
        { id: 5, title: '果树修剪技术大全', cover: 'https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v', author: '园艺师老张', playCount: '21.3万', description: '苹果、梨、桃树修剪技巧', duration: '52分钟', category: 'plant' },
        { id: 6, title: '西瓜种植技术', cover: 'https://img.ixigua.com/3w2x1y0z-9a8b-7c6d-5e4f-3g2h1i0j9k8l', author: '西瓜大王', playCount: '14.7万', description: '西瓜育苗、移栽、水肥管理', duration: '41分钟', category: 'plant' },
        { id: 7, title: '草莓种植技术', cover: 'https://img.ixigua.com/7m6n5o4p-3q2r-1s0t-9u8v-7w6x5y4z3a2b', author: '草莓达人', playCount: '16.8万', description: '草莓大棚种植，全年结果技巧', duration: '37分钟', category: 'plant' },
        { id: 8, title: '葡萄种植技术', cover: 'https://img.ixigua.com/1c2d3e4f-5g6h-7i8j-9k0l-1m2n3o4p5q6r', author: '葡萄大王', playCount: '19.2万', description: '葡萄修剪、施肥、病虫害防治', duration: '48分钟', category: 'plant' },
        { id: 9, title: '土豆高产栽培技术', cover: 'https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h', author: '土豆专家', playCount: '13.5万', description: '土豆种植、施肥、收获技巧', duration: '33分钟', category: 'plant' },
        { id: 10, title: '蔬菜育苗技术', cover: 'https://img.ixigua.com/3i4j5k6l-7m8n-9o0p-1q2r-3s4t5u6v7w8x', author: '育苗专家', playCount: '11.2万', description: '各类蔬菜育苗方法', duration: '27分钟', category: 'plant' },
        
        // 养殖类
        { id: 11, title: '生猪科学养殖技术', cover: 'https://img.ixigua.com/9y0z1a2b-3c4d-5e6f-7g8h-9i0j1k2l3m4n', author: '猪司令', playCount: '67.3万', description: '从仔猪到出栏，科学喂养', duration: '68分钟', category: 'breed' },
        { id: 12, title: '家禽生态养殖技术', cover: 'https://img.ixigua.com/5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d', author: '养鸡大户', playCount: '34.2万', description: '鸡鸭鹅生态养殖方法', duration: '56分钟', category: 'breed' },
        { id: 13, title: '牛羊育肥技术', cover: 'https://img.ixigua.com/1e2f3g4h-5i6j-7k8l-9m0n-1o2p3q4r5s6t', author: '养殖专家', playCount: '28.9万', description: '肉牛、肉羊快速育肥', duration: '49分钟', category: 'breed' },
        { id: 14, title: '水产养殖技术', cover: 'https://img.ixigua.com/7u8v9w0x-1y2z-3a4b-5c6d-7e8f9g0h1i2j', author: '水产达人', playCount: '19.4万', description: '鱼、虾、蟹养殖技术', duration: '43分钟', category: 'breed' },
        { id: 15, title: '蜜蜂养殖技术', cover: 'https://img.ixigua.com/3k4l5m6n-7o8p-9q0r-1s2t-3u4v5w6x7y8z', author: '蜂农老陈', playCount: '11.2万', description: '蜜蜂养殖、取蜜技巧', duration: '35分钟', category: 'breed' },
        { id: 16, title: '兔子养殖技术', cover: 'https://img.ixigua.com/9a0b1c2d-3e4f-5g6h-7i8j-9k0l1m2n3o4p', author: '兔业专家', playCount: '14.8万', description: '肉兔、宠物兔养殖', duration: '31分钟', category: 'breed' },
        
        // 农机类
        { id: 17, title: '拖拉机操作与维护', cover: 'https://img.ixigua.com/5q6r7s8t-9u0v-1w2x-3y4z-5a6b7c8d9e0f', author: '农机手老李', playCount: '34.2万', description: '拖拉机驾驶、保养、故障排除', duration: '55分钟', category: 'machine' },
        { id: 18, title: '收割机使用指南', cover: 'https://img.ixigua.com/1g2h3i4j-5k6l-7m8n-9o0p-1q2r3s4t5u6v', author: '陈师傅', playCount: '28.7万', description: '联合收割机操作技巧', duration: '48分钟', category: 'machine' },
        { id: 19, title: '无人机植保技术', cover: 'https://img.ixigua.com/7w8x9y0z-1a2b-3c4d-5e6f-7g8h9i0j1k2l', author: '飞手小王', playCount: '42.1万', description: '无人机喷洒农药技术', duration: '36分钟', category: 'machine' },
        { id: 20, title: '插秧机操作技巧', cover: 'https://img.ixigua.com/3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b', author: '农机培训', playCount: '16.8万', description: '插秧机使用、调试', duration: '29分钟', category: 'machine' },
        { id: 21, title: '烘干机使用维护', cover: 'https://img.ixigua.com/9c0d1e2f-3g4h-5i6j-7k8l-9m0n1o2p3q4r', author: '粮食加工', playCount: '13.5万', description: '粮食烘干机操作', duration: '32分钟', category: 'machine' },
        
        // 病虫害防治
        { id: 22, title: '常见病虫害识别与防治', cover: 'https://img.ixigua.com/5s6t7u8v-9w0x-1y2z-3a4b-5c6d7e8f9g0h', author: '农技推广站', playCount: '18.2万', description: '30种常见病虫害识别与防治', duration: '52分钟', category: 'pest' },
        { id: 23, title: '水稻稻瘟病防治技术', cover: 'https://img.ixigua.com/1i2j3k4l-5m6n-7o8p-9q0r-1s2t3u4v5w6x', author: '植保专家', playCount: '22.3万', description: '稻瘟病识别、预防、治疗', duration: '41分钟', category: 'pest' },
        { id: 24, title: '果树病虫害防治', cover: 'https://img.ixigua.com/7y8z9a0b-1c2d-3e4f-5g6h-7i8j9k0l1m2n', author: '果农之友', playCount: '19.7万', description: '苹果、梨树病虫害', duration: '44分钟', category: 'pest' },
        { id: 25, title: '蔬菜病害识别', cover: 'https://img.ixigua.com/3o4p5q6r-7s8t-9u0v-1w2x-3y4z5a6b7c8d', author: '蔬菜医生', playCount: '15.4万', description: '蔬菜常见病害防治', duration: '36分钟', category: 'pest' },
        
        // 加工类
        { id: 26, title: '农产品初加工技术', cover: 'https://img.ixigua.com/9e0f1g2h-3i4j-5k6l-7m8n-9o0p1q2r3s4t', author: '加工专家', playCount: '11.3万', description: '粮食烘干、脱壳、包装', duration: '39分钟', category: 'process' },
        { id: 27, title: '粮食烘干技术', cover: 'https://img.ixigua.com/5u6v7w8x-9y0z-1a2b-3c4d-5e6f7g8h9i0j', author: '粮食加工厂', playCount: '9.8万', description: '粮食烘干设备使用', duration: '28分钟', category: 'process' },
        { id: 28, title: '果蔬保鲜技术', cover: 'https://img.ixigua.com/1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z', author: '保鲜专家', playCount: '14.2万', description: '果蔬保鲜方法', duration: '33分钟', category: 'process' },
        
        // 电商类
        { id: 29, title: '农产品电商运营指南', cover: 'https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p', author: '电商讲师', playCount: '23.1万', description: '从开店到爆款打造', duration: '47分钟', category: 'ecommerce' },
        { id: 30, title: '直播带货技巧', cover: 'https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f', author: '带货达人', playCount: '31.5万', description: '农产品直播销售技巧', duration: '43分钟', category: 'ecommerce' },
        { id: 31, title: '农产品品牌打造', cover: 'https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v', author: '品牌专家', playCount: '17.8万', description: '农产品品牌建设', duration: '38分钟', category: 'ecommerce' }
      ]
      
      // 根据关键词过滤
      const keywordLower = this.keyword.toLowerCase()
      this.allVideos = mockAll.filter(v => 
        v.title.includes(this.keyword) || 
        v.title.includes(keywordLower) ||
        v.description.includes(this.keyword) || 
        v.description.includes(keywordLower) ||
        v.author.includes(this.keyword) || 
        v.author.includes(keywordLower) ||
        v.category.includes(this.keyword) || 
        v.category.includes(keywordLower)
      )
      
      // 如果没找到，返回全部（按相关度排序）
      if (this.allVideos.length === 0) {
        this.allVideos = mockAll
      }
      
      this.totalVideos = this.allVideos.length
      this.updatePaginatedVideos()
      this.hasMore = false
    },
    
    async refreshSearch() {
      if (this.refreshing) return
      
      this.refreshing = true
      this.scrollTop = 0
      
      try {
        const res = await uni.request({
          url: baseUrl + '/video/refresh',
          method: 'GET',
          data: { keyword: this.keyword }
        })
        
        if (res.data.success) {
          this.allVideos = res.data.data || []
          this.totalVideos = this.allVideos.length
          this.currentPage = 1
          this.updatePaginatedVideos()
          
          uni.showToast({
            title: '刷新成功',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('刷新失败', error)
        uni.showToast({
          title: '刷新失败',
          icon: 'none'
        })
      } finally {
        this.refreshing = false
      }
    },
    
    // 更新当前页显示的视频
    updatePaginatedVideos() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.paginatedVideos = this.allVideos.slice(start, end)
    },
    
    // 跳转到指定页
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      
      this.currentPage = page
      this.updatePaginatedVideos()
      this.scrollTop = 0
      
      // 滚动到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    
    // 上滑加载更多（兼容模式）
    async loadMore() {
      if (this.showPagination) return // 如果使用分页控件，不上滑加载
      if (this.loadingMore || !this.hasMore) return
      
      this.loadingMore = true
      
      // 模拟网络延迟
      setTimeout(() => {
        const nextPage = this.currentPage + 1
        const start = (nextPage - 1) * this.pageSize
        const end = nextPage * this.pageSize
        const newVideos = this.allVideos.slice(start, end)
        
        if (newVideos.length > 0) {
          this.paginatedVideos = [...this.paginatedVideos, ...newVideos]
          this.currentPage = nextPage
          this.hasMore = end < this.allVideos.length
        } else {
          this.hasMore = false
        }
        
        this.loadingMore = false
      }, 300)
    },
    
    // 切换分页模式
    togglePaginationMode() {
      this.showPagination = !this.showPagination
      // 重置到第一页
      this.currentPage = 1
      this.updatePaginatedVideos()
    },
    
    onScroll(e) {
      this.showBackToTop = e.detail.scrollTop > 500
    },
    
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    
    playVideo(video) {
      this.currentVideo = video
      this.showVideoModal = true
    },
    
    closeVideoModal() {
      this.showVideoModal = false
      this.currentVideo = null
    },
    
    onVideoStart(video) {
      this.saveLearningRecord(video)
    },
    
    onVideoComplete(video) {
      this.updateLearningProgress(video, 100)
    },
    
    saveLearningRecord(video) {
      if (!this.currentUser) return
      
      const records = uni.getStorageSync('learningRecords') || {}
      const userId = this.currentUser.userId
      
      if (!records[userId]) {
        records[userId] = {}
      }
      
      if (!records[userId][video.id]) {
        records[userId][video.id] = {
          courseId: video.id,
          courseTitle: video.title,
          lastWatchTime: new Date().getTime(),
          progress: 0,
          cover: video.cover,
          url: video.url,
          author: video.author,
          duration: video.duration
        }
      } else {
        records[userId][video.id].lastWatchTime = new Date().getTime()
      }
      
      uni.setStorageSync('learningRecords', records)
    },
    
    updateLearningProgress(video, progress) {
      if (!this.currentUser) return
      
      const records = uni.getStorageSync('learningRecords') || {}
      const userId = this.currentUser.userId
      
      if (records[userId] && records[userId][video.id]) {
        records[userId][video.id].progress = progress
        records[userId][video.id].lastWatchTime = new Date().getTime()
        uni.setStorageSync('learningRecords', records)
      }
    },
    
    loadSearchHistory() {
      const history = uni.getStorageSync('searchHistory') || []
      this.historyList = history
    },
    
    saveSearchHistory(keyword) {
      if (!keyword.trim()) return
      let history = uni.getStorageSync('searchHistory') || []
      history = history.filter(item => item !== keyword)
      history.unshift(keyword)
      if (history.length > 10) {
        history = history.slice(0, 10)
      }
      uni.setStorageSync('searchHistory', history)
      this.historyList = history
    },
    
    clearHistory() {
      uni.showModal({
        title: '提示',
        content: '确定清空搜索历史吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('searchHistory')
            this.historyList = []
          }
        }
      })
    },
    
    searchHistory(keyword) {
      this.keyword = keyword
      this.handleSearch()
    },
    
    clearKeyword() {
      this.keyword = ''
      this.searchPerformed = false
    },
    
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.search-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.search-container.dark-mode {
  background-color: #1a1a1a;
}

.search-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eee;
  transition: all 0.3s ease;
}

.search-header.dark-header {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.search-box {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
  height: 72rpx;
  transition: all 0.3s ease;
}

.search-box.dark-search-box {
  background-color: #3a3a3a;
}

.search-icon {
  font-size: 32rpx;
  color: #999;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.search-icon.dark-icon {
  color: #aaa;
}

.search-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  color: #333;
  transition: color 0.3s ease;
}

.search-input.dark-input {
  color: #fff;
  background-color: #3a3a3a;
}

.search-input.dark-input::placeholder {
  color: #aaa;
}

.clear-icon {
  font-size: 36rpx;
  color: #999;
  padding: 0 10rpx;
  transition: color 0.3s ease;
}

.clear-icon.dark-icon {
  color: #aaa;
}

.cancel-btn {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx;
  transition: color 0.3s ease;
}

.cancel-btn.dark-text {
  color: #aaa;
}

.history-section, .hot-section {
  background-color: #ffffff;
  margin-bottom: 20rpx;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.history-section.dark-section,
.hot-section.dark-section {
  background-color: #2a2a2a;
}

.section-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.section-title.dark-text {
  color: #fff;
}

.clear-history {
  font-size: 26rpx;
  color: #999;
  padding: 10rpx;
  transition: color 0.3s ease;
}

.clear-history.dark-text-light {
  color: #aaa;
}

.history-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.history-tag {
  background-color: #f5f5f5;
  padding: 15rpx 25rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s ease;
}

.history-tag.dark-tag {
  background-color: #3a3a3a;
  color: #aaa;
}

.hot-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.hot-tag {
  padding: 15rpx 30rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  background-color: #f0f0f0;
  color: #666;
  transition: all 0.3s ease;
}

.hot-tag.dark-hot-tag {
  filter: brightness(0.9);
}

.hot-tag-1 {
  background-color: #fef2e0;
  color: #f5a623;
}

.dark-mode .hot-tag-1 {
  background-color: #664d00;
  color: #ffb74d;
}

.hot-tag-2 {
  background-color: #e8f5e8;
  color: #2b5e2b;
}

.dark-mode .hot-tag-2 {
  background-color: #1e3a1e;
  color: #4CAF50;
}

.hot-tag-3 {
  background-color: #e3f2fd;
  color: #2196f3;
}

.dark-mode .hot-tag-3 {
  background-color: #0d2b4d;
  color: #64b5f6;
}

.hot-tag-4 {
  background-color: #f3e5f5;
  color: #9c27b0;
}

.dark-mode .hot-tag-4 {
  background-color: #3d1e4b;
  color: #ba68c8;
}

.search-results-scroll {
  height: calc(100vh - 180rpx);
}

.results-list {
  padding: 20rpx;
}

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.result-count {
  font-size: 26rpx;
  color: #666;
  transition: color 0.3s ease;
}

.result-count.dark-text {
  color: #aaa;
}

.toolbar-buttons {
  display: flex;
  flex-direction: row;
}

.refresh-btn {
  background-color: #2b5e2b;
  color: #ffffff;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  margin: 0;
  transition: all 0.3s ease;
}

.refresh-btn.dark-btn {
  background-color: #1e4b1e;
}

.refresh-btn[disabled] {
  background-color: #ccc;
}

.dark-mode .refresh-btn[disabled] {
  background-color: #3a3a3a;
  color: #666;
}

.refresh-icon {
  font-size: 28rpx;
  margin-right: 6rpx;
  transition: transform 0.5s;
}

.refresh-icon.dark-icon {
  color: #fff;
}

.refresh-icon.refreshing {
  animation: rotate 1s infinite linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.result-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.result-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.result-card:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.result-image {
  width: 180rpx;
  height: 130rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.result-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.result-title.dark-text {
  color: #fff;
}

.result-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.result-desc.dark-desc {
  color: #aaa;
}

.result-meta {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.result-meta.dark-meta {
  color: #aaa;
}

.meta-item {
  margin-right: 20rpx;
  margin-bottom: 4rpx;
  transition: color 0.3s ease;
}

.meta-item.dark-meta-item {
  color: #aaa;
}

/* 分页控件样式 */
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 0;
  border-top: 1rpx solid #eee;
  margin-top: 20rpx;
  transition: all 0.3s ease;
}

.dark-mode .pagination {
  border-top-color: #3a3a3a;
}

.pagination-info {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  transition: color 0.3s ease;
}

.pagination-info.dark-text-light {
  color: #aaa;
}

.pagination-buttons {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.page-btn {
  background-color: #ffffff;
  color: #2b5e2b;
  font-size: 26rpx;
  padding: 15rpx 40rpx;
  border-radius: 40rpx;
  border: 1rpx solid #2b5e2b;
  margin: 0;
  transition: all 0.3s ease;
}

.page-btn.dark-page-btn {
  background-color: #2a2a2a;
  color: #4CAF50;
  border-color: #4CAF50;
}

.page-btn[disabled] {
  background-color: #f5f5f5;
  color: #ccc;
  border-color: #ddd;
}

.page-btn.dark-page-btn[disabled] {
  background-color: #3a3a3a;
  color: #666;
  border-color: #555;
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.load-more.dark-text-light,
.no-more.dark-text-light {
  color: #aaa;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.no-results-icon {
  font-size: 120rpx;
  color: #ccc;
  margin-bottom: 30rpx;
  transition: color 0.3s ease;
}

.no-results-icon.dark-icon {
  color: #666;
}

.no-results-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.no-results-text.dark-text {
  color: #fff;
}

.no-results-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 50rpx;
  transition: color 0.3s ease;
}

.no-results-desc.dark-desc {
  color: #aaa;
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.loading-more.dark-text-light {
  color: #aaa;
}

.back-to-top {
  position: fixed;
  bottom: 100rpx;
  right: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #2b5e2b;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
  z-index: 100;
  transition: all 0.3s ease;
}

.back-to-top.dark-btn {
  background-color: #1e4b1e;
}

.dev-info {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #ccc;
  transition: color 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
}

/* 占位符样式 */
.dark-placeholder {
  color: #aaa !important;
}
</style>