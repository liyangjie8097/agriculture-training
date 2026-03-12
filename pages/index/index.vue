<template>
  <view class="index-container dark-mode-container" :class="{ 'dark-mode': darkMode }">
    <!-- 搜索栏 -->
    <view class="search-bar" :class="{ 'dark-search': darkMode }" @click="goToSearch">
      <view class="search-box" :class="{ 'dark-search-box': darkMode }">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder" :class="{ 'dark-placeholder': darkMode }">搜索全网农业视频...</text>
      </view>
    </view>
    
    <!-- Banner 轮播图 -->
    <swiper class="banner-swiper" indicator-dots autoplay interval="3000" circular>
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <image class="banner-image" :src="banner.image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    
    <!-- 快捷入口 -->
    <view class="quick-entry" :class="{ 'dark-card': darkMode }">
      <view class="entry-item" @click="quickSearch('种植')">
        <view class="entry-icon planting">🌱</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">种植</text>
      </view>
      <view class="entry-item" @click="quickSearch('养殖')">
        <view class="entry-icon breeding">🐄</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">养殖</text>
      </view>
      <view class="entry-item" @click="quickSearch('农机')">
        <view class="entry-icon machine">🚜</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">农机</text>
      </view>
      <view class="entry-item" @click="quickSearch('病虫害')">
        <view class="entry-icon pest">🐛</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">防治</text>
      </view>
      <view class="entry-item" @click="quickSearch('加工')">
        <view class="entry-icon process">🏭</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">加工</text>
      </view>
      <view class="entry-item" @click="goToQa">
        <view class="entry-icon" style="background-color: #9C27B0; color: white;">❓</view>
        <text class="entry-name" :class="{ 'dark-text-secondary': darkMode }">问答</text>
      </view>
    </view>
    
    <!-- 热门推荐 -->
    <view class="section" :class="{ 'dark-card': darkMode }" v-if="hotVideos.length > 0">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">🔥 热门推荐</text>
        <text class="section-more" :class="{ 'dark-text-light': darkMode }" @click="goToVideoList">更多 ></text>
      </view>
      
      <scroll-view class="recommend-scroll" scroll-x show-scrollbar="false">
        <view class="recommend-list">
          <view 
            class="recommend-card" 
            v-for="video in hotVideos" 
            :key="video.id"
            @click="playVideo(video)"
          >
            <image class="recommend-image" :src="video.cover" mode="aspectFill"></image>
            <view class="recommend-info">
              <text class="recommend-title" :class="{ 'dark-text': darkMode }">{{ video.title }}</text>
              <view class="recommend-source" :class="'source-' + video.source">
                {{ video.sourceName }}
              </view>
              <view class="recommend-meta">
                <text class="recommend-author">👤 {{ video.author }}</text>
                <text class="recommend-play">👁️ {{ video.playCount }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 继续学习 -->
    <view class="section" :class="{ 'dark-card': darkMode }" v-if="learningVideos.length > 0">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">📚 继续学习</text>
        <text class="section-more" :class="{ 'dark-text-light': darkMode }" @click="goToMyCourses">更多 ></text>
      </view>
      
      <view class="learning-list">
        <view 
          class="learning-card" 
          v-for="video in learningVideos" 
          :key="video.courseId"
          @click="playVideo(video)"
        >
          <image class="learning-image" :src="video.cover" mode="aspectFill"></image>
          <view class="learning-info">
            <text class="learning-title" :class="{ 'dark-text': darkMode }">{{ video.courseTitle }}</text>
            <view class="learning-progress">
              <view class="progress-bar" :class="{ 'dark-progress': darkMode }">
                <view class="progress-fill" :style="{ width: (video.progress || 0) + '%' }"></view>
              </view>
              <text class="progress-text">{{ video.progress || 0 }}%</text>
            </view>
            <text class="learning-time" :class="{ 'dark-text-light': darkMode }">上次看到: {{ formatTime(video.lastWatchTime) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 精选资讯 -->
    <view class="section" :class="{ 'dark-card': darkMode }">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">📰 今日农业资讯</text>
        <text class="section-more" :class="{ 'dark-text-light': darkMode }" @click="goToNews">更多 ></text>
      </view>
      
      <view class="news-list" v-if="topNews.length > 0">
        <view 
          class="news-item" 
          v-for="news in topNews" 
          :key="news.id"
          @click="goToNewsDetail(news)"
        >
          <image class="news-image" :src="news.thumb || news.image" mode="aspectFill"></image>
          <view class="news-info">
            <text class="news-title" :class="{ 'dark-text': darkMode }">{{ news.title }}</text>
            <view class="news-meta">
              <text class="news-source">{{ news.source }}</text>
              <text class="news-time" :class="{ 'dark-text-light': darkMode }">{{ news.time }}</text>
              <text class="news-comments">💬 {{ news.commentCount || 0 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 视频播放组件 -->
    <VideoPlayer 
      :show="showVideoModal" 
      :video="currentVideo"
      @close="closeVideoModal"
      @start="onVideoStart"
      @complete="onVideoComplete"
      @progress="onVideoProgress"
      @title-updated="onVideoTitleUpdated"
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
import baseUrl from '@/config.js'

export default {
  components: {
    VideoPlayer
  },
  data() {
    return {
      darkMode: false,
      currentDate: '',
      farmingReminder: '',
      showVideoModal: false,
      currentVideo: null,
      
      banners: [
        { image: 'https://via.placeholder.com/750x300/2b5e2b/ffffff?text=农业技能培训' },
        { image: 'https://via.placeholder.com/750x300/1e4b1e/ffffff?text=B站热门' },
        { image: 'https://via.placeholder.com/750x300/3a773a/ffffff?text=腾讯视频' }
      ],
      
      hotVideos: [],
      topNews: [],
      learningVideos: [],
      currentUser: null
    }
  },
  
  onLoad() {
    // 获取深色模式状态
    const app = getApp()
    this.darkMode = app.globalData.darkMode || false
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
    
    this.getCurrentDate()
    this.getFarmingReminder()
    this.loadHotVideos()
    this.loadTopNews()
    this.getCurrentUser()
    this.loadLearningVideos()
  },
  
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app.globalData.darkMode || false
    
    this.getCurrentUser()
    this.loadLearningVideos()
  },
  
  methods: {
    getCurrentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekday = weekdays[date.getDay()]
      this.currentDate = `${year}年${month}月${day}日 ${weekday}`
    },
    
    getFarmingReminder() {
      const month = new Date().getMonth() + 1
      if (month >= 3 && month <= 5) {
        this.farmingReminder = '春季是播种关键期，推荐搜索“春耕”视频'
      } else if (month >= 6 && month <= 8) {
        this.farmingReminder = '夏季高温多雨，推荐搜索“田间管理”视频'
      } else if (month >= 9 && month <= 11) {
        this.farmingReminder = '秋季是收获季节，推荐搜索“收割”视频'
      } else {
        this.farmingReminder = '冬季推荐搜索“农机保养”视频'
      }
    },
    
    async loadHotVideos() {
      try {
        const res = await uni.request({
          url: baseUrl + '/video/hot',
          method: 'GET'
        })
        
        if (res.data.success) {
          this.hotVideos = res.data.data
          console.log('热门视频加载成功:', this.hotVideos.length)
        }
      } catch (error) {
        console.error('加载热门视频失败:', error)
      }
    },
    
    loadTopNews() {
      this.topNews = [
        {
          id: 1,
          title: '2024年中央一号文件发布：全面推进乡村振兴',
          thumb: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=政策',
          source: '农业农村部',
          time: '2小时前',
          commentCount: 12
        },
        {
          id: 2,
          title: '生猪价格连续上涨，养殖户迎来盈利期',
          thumb: 'https://via.placeholder.com/200x150/FF9800/ffffff?text=生猪',
          source: '中国农业信息网',
          time: '昨天',
          commentCount: 8
        },
        {
          id: 3,
          title: '无人机植保技术：效率提升80%',
          thumb: 'https://via.placeholder.com/200x150/2196F3/ffffff?text=无人机',
          source: '农业科技报',
          time: '3天前',
          commentCount: 15
        }
      ]
    },
    
    loadLearningVideos() {
      if (!this.currentUser) return
      
      const records = uni.getStorageSync('learningRecords') || {}
      const userRecords = records[this.currentUser.userId] || {}
      
      this.learningVideos = Object.values(userRecords)
        .sort((a, b) => b.lastWatchTime - a.lastWatchTime)
        .slice(0, 3)
    },
    
    getCurrentUser() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.currentUser = userInfo
      }
    },
    
    quickSearch(keyword) {
      uni.navigateTo({
        url: '/pages/search/search?keyword=' + encodeURIComponent(keyword)
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
    
    onVideoProgress(data) {
      if (data && data.video && data.progress) {
        this.updateLearningProgress(data.video, data.progress)
      }
    },
    
    onVideoTitleUpdated(data) {
      console.log('视频标题更新:', data)
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
          source: video.source,
          sourceName: video.sourceName,
          lastWatchTime: new Date().getTime(),
          progress: 0,
          type: 'external',
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
    
    formatTime(timestamp) {
      if (!timestamp) return '未知时间'
      const date = new Date(timestamp)
      const now = new Date()
      
      if (date.toDateString() === now.toDateString()) {
        return '今天 ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      }
      
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      if (date.toDateString() === yesterday.toDateString()) {
        return '昨天 ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      }
      
      return (date.getMonth() + 1) + '-' + date.getDate()
    },
    
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },
    
    goToVideoList() {
      uni.switchTab({
        url: '/pages/course/course'
      })
    },
    
    goToQa() {
      uni.switchTab({
        url: '/pages/qa/qa'
      })
    },
    
    goToMyCourses() {
      if (!this.currentUser) {
        this.showLoginTip()
        return
      }
      uni.navigateTo({
        url: '/pages/my-courses/my-courses'
      })
    },
    
    goToNews() {
      uni.switchTab({
        url: '/pages/news/news'
      })
    },
    
    goToNewsDetail(news) {
      uni.navigateTo({
        url: '/pages/news-detail/news-detail?id=' + news.id
      })
    },
    
    showLoginTip() {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.index-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: background-color 0.3s ease;
}

.index-container.dark-mode {
  background-color: #1a1a1a;
}

.search-bar {
  padding: 20rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  transition: all 0.3s ease;
}

.search-bar.dark-search {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.search-box {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background-color 0.3s ease;
}

.search-box.dark-search-box {
  background-color: #2a2a2a;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #999;
  transition: color 0.3s ease;
}

.dark-mode .search-icon {
  color: #aaa;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
  flex: 1;
  transition: color 0.3s ease;
}

.search-placeholder.dark-placeholder {
  color: #666;
}

.banner-swiper {
  width: 100%;
  height: 300rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.quick-entry {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
  transition: background-color 0.3s ease;
}

.quick-entry.dark-card {
  background-color: #2a2a2a;
}

.entry-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.entry-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.entry-icon.planting {
  background-color: #e8f5e8;
  color: #2b5e2b;
}

.dark-mode .entry-icon.planting {
  background-color: #1e4b1e;
  color: #4CAF50;
}

.entry-icon.breeding {
  background-color: #fff3e0;
  color: #FF9800;
}

.dark-mode .entry-icon.breeding {
  background-color: #664d00;
  color: #ffb74d;
}

.entry-icon.machine {
  background-color: #e3f2fd;
  color: #2196F3;
}

.dark-mode .entry-icon.machine {
  background-color: #0d2b4d;
  color: #64b5f6;
}

.entry-icon.pest {
  background-color: #ffebee;
  color: #F44336;
}

.dark-mode .entry-icon.pest {
  background-color: #661e1e;
  color: #e57373;
}

.entry-icon.process {
  background-color: #f3e5f5;
  color: #9C27B0;
}

.dark-mode .entry-icon.process {
  background-color: #3d1e4b;
  color: #ba68c8;
}

.entry-name {
  font-size: 24rpx;
  color: #666;
  transition: color 0.3s ease;
}

.entry-name.dark-text-secondary {
  color: #aaa;
}

.section {
  background-color: #ffffff;
  margin-bottom: 20rpx;
  padding: 30rpx 20rpx;
  transition: background-color 0.3s ease;
}

.section.dark-card {
  background-color: #2a2a2a;
}

.section-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 0 10rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.section-title.dark-text {
  color: #fff;
}

.section-more {
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.section-more.dark-text-light {
  color: #aaa;
}

.recommend-scroll {
  width: 100%;
  white-space: nowrap;
}

.recommend-list {
  display: flex;
  flex-direction: row;
  padding: 0 10rpx;
}

.recommend-card {
  display: inline-block;
  width: 280rpx;
  margin-right: 20rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.dark-mode .recommend-card {
  background-color: #3a3a3a;
}

.recommend-image {
  width: 280rpx;
  height: 180rpx;
}

.recommend-info {
  padding: 15rpx;
}

.recommend-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.recommend-title.dark-text {
  color: #fff;
}

.recommend-source {
  display: inline-block;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.source-bilibili {
  background-color: #fb7299;
}

.source-tencent {
  background-color: #0052cc;
}

.recommend-meta {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 22rpx;
  color: #666;
  transition: color 0.3s ease;
}

.dark-mode .recommend-meta {
  color: #aaa;
}

.recommend-author {
  color: #2b5e2b;
}

.dark-mode .recommend-author {
  color: #4CAF50;
}

.recommend-play {
  color: #999;
}

.dark-mode .recommend-play {
  color: #aaa;
}

.learning-list {
  padding: 0 10rpx;
}

.learning-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 25rpx;
  padding-bottom: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: border-color 0.3s ease;
}

.learning-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.dark-mode .learning-card {
  border-bottom-color: #3a3a3a;
}

.learning-image {
  width: 160rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.learning-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.learning-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.learning-title.dark-text {
  color: #fff;
}

.learning-progress {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background-color: #f0f0f0;
  border-radius: 4rpx;
  margin-right: 15rpx;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.progress-bar.dark-progress {
  background-color: #3a3a3a;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2b5e2b);
  border-radius: 4rpx;
}

.progress-text {
  font-size: 22rpx;
  color: #2b5e2b;
  min-width: 60rpx;
  text-align: right;
  transition: color 0.3s ease;
}

.dark-mode .progress-text {
  color: #4CAF50;
}

.learning-time {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.learning-time.dark-text-light {
  color: #aaa;
}

.news-list {
  padding: 0 10rpx;
}

.news-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 25rpx;
  padding-bottom: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: border-color 0.3s ease;
}

.news-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.dark-mode .news-item {
  border-bottom-color: #3a3a3a;
}

.news-image {
  width: 160rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.news-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 28rpx;
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

.news-title.dark-text {
  color: #fff;
}

.news-meta {
  display: flex;
  flex-direction: row;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.dark-mode .news-meta {
  color: #aaa;
}

.news-source {
  color: #2b5e2b;
  margin-right: 20rpx;
}

.dark-mode .news-source {
  color: #4CAF50;
}

.news-time {
  transition: color 0.3s ease;
}

.news-time.dark-text-light {
  color: #aaa;
}

.news-comments {
  color: #666;
  transition: color 0.3s ease;
}

.dark-mode .news-comments {
  color: #aaa;
}

.dev-info {
  text-align: center;
  padding: 20rpx;
  font-size: 24rpx;
  color: #ccc;
  transition: color 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
}
</style>