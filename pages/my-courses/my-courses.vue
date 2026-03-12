<template>
  <view class="my-courses-container" :class="{ 'dark-mode': darkMode }">
    <view class="header" :class="{ 'dark-header': darkMode }">
      <text class="title">我的课程</text>
      <text class="subtitle">共 {{ courseList.length }} 门课程</text>
    </view>
    
    <!-- 分类标签 -->
    <view class="tab-bar" :class="{ 'dark-tab-bar': darkMode }">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'all', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'all' }"
        @click="switchTab('all')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'local', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'local' }"
        @click="switchTab('local')"
      >
        平台课程
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'external', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'external' }"
        @click="switchTab('external')"
      >
        站外视频
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'in-progress', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'in-progress' }"
        @click="switchTab('in-progress')"
      >
        学习中
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'completed', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'completed' }"
        @click="switchTab('completed')"
      >
        已完成
      </view>
    </view>
    
    <!-- 课程列表 -->
    <scroll-view class="course-list" scroll-y v-if="filteredCourses.length > 0">
      <view 
        class="course-card" 
        :class="{ 'dark-card': darkMode }"
        v-for="course in filteredCourses" 
        :key="course.courseId"
        @click="goToCourseDetail(course)"
      >
        <image class="course-image" :src="getCourseImage(course)" mode="aspectFill"></image>
        <view class="course-info">
          <view class="course-title-row">
            <text class="course-title" :class="{ 'dark-text': darkMode }">{{ course.courseTitle }}</text>
            <view class="course-badges">
              <text class="external-badge" v-if="course.type === 'external'" :class="['badge-' + course.source, { 'dark-badge': darkMode }]">
                {{ course.sourceName || '站外视频' }}
              </text>
              <text class="local-badge" :class="{ 'dark-local-badge': darkMode }" v-else>平台课程</text>
            </view>
          </view>
          
          <!-- 进度条 -->
          <view class="progress-section">
            <view class="progress-bar" :class="{ 'dark-progress-bar': darkMode }">
              <view class="progress-fill" :style="{ width: course.progress + '%' }"></view>
            </view>
            <text class="progress-text" :class="{ 'dark-progress-text': darkMode }">{{ course.progress }}%</text>
          </view>
          
          <view class="course-meta" :class="{ 'dark-meta': darkMode }">
            <text class="course-chapters">已学 {{ course.chapters?.length || 0 }} / {{ getTotalChapters(course.courseId) }} 节</text>
            <text class="course-time">{{ formatTime(course.lastWatchTime) }}</text>
          </view>
          
          <!-- 课程状态标签 -->
          <view class="course-status" :class="[getStatusClass(course.progress), { 'dark-status': darkMode }]">
            {{ getStatusText(course.progress) }}
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon" :class="{ 'dark-empty-icon': darkMode }">📚</text>
      <text class="empty-text" :class="{ 'dark-text': darkMode }">暂无课程</text>
      <text class="empty-desc" :class="{ 'dark-desc': darkMode }">{{ getEmptyDesc() }}</text>
      <button class="go-course-btn" :class="{ 'dark-btn': darkMode }" @click="goToCourseList">去选课</button>
    </view>
    
    <!-- 开发者信息 -->
    <view class="dev-info" :class="{ 'dark-dev': darkMode }">
      <text>开发者：李阳杰</text>
      <text>学号：2227010134</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      currentTab: 'all',
      courseList: [],
      userInfo: {},
      allCourses: [] // 所有课程数据（用于获取图片和章节数）
    }
  },
  computed: {
    filteredCourses() {
      let filtered = this.courseList
      
      // 按类型筛选
      if (this.currentTab === 'local') {
        filtered = filtered.filter(c => c.type !== 'external')
      } else if (this.currentTab === 'external') {
        filtered = filtered.filter(c => c.type === 'external')
      } else if (this.currentTab === 'in-progress') {
        filtered = filtered.filter(c => c.progress > 0 && c.progress < 100)
      } else if (this.currentTab === 'completed') {
        filtered = filtered.filter(c => c.progress === 100)
      }
      
      return filtered
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
  },
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    this.checkLoginStatus()
    this.loadAllCourses()
    this.loadMyCourses()
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo')
      if (!userInfo) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      this.userInfo = userInfo
    },
    
    loadAllCourses() {
      // 从首页获取课程数据
      const pages = getCurrentPages()
      const indexPage = pages.find(p => p.route === 'pages/index/index')
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || []
      } else {
        // 默认数据
        this.allCourses = [
          { id: 1, title: '水稻高产种植技术', image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=水稻种植', chapters: [{}, {}, {}, {}] },
          { id: 2, title: '大棚蔬菜种植技术', image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=大棚蔬菜', chapters: [{}, {}, {}] },
          { id: 3, title: '生猪科学养殖技术', image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=生猪养殖', chapters: [{}, {}, {}, {}] },
          { id: 4, title: '家禽生态养殖技术', image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=家禽养殖', chapters: [{}, {}, {}] },
          { id: 5, title: '拖拉机操作与维护', image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=拖拉机', chapters: [{}, {}, {}, {}] }
        ]
      }
    },
    
    loadMyCourses() {
      // 从学习记录中获取课程列表
      const records = uni.getStorageSync('learningRecords') || {}
      const userRecords = records[this.userInfo.userId] || {}
      
      // 转换为数组并按时间排序
      this.courseList = Object.values(userRecords).sort((a, b) => {
        return b.lastWatchTime - a.lastWatchTime
      })
    },
    
    getCourseImage(course) {
      if (course.type === 'external') {
        return course.cover || 'https://via.placeholder.com/200x150/2196F3/ffffff?text=站外视频'
      }
      const c = this.allCourses.find(c => c.id == course.courseId)
      return c ? c.image : 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=课程'
    },
    
    getTotalChapters(courseId) {
      const course = this.allCourses.find(c => c.id == courseId)
      return course ? (course.chapters?.length || 0) : 0
    },
    
    getStatusClass(progress) {
      if (progress === 100) return 'status-completed'
      if (progress > 0) return 'status-progress'
      return 'status-not-started'
    },
    
    getStatusText(progress) {
      if (progress === 100) return '已完成'
      if (progress > 0) return '学习中'
      return '未开始'
    },
    
    getEmptyDesc() {
      if (this.currentTab === 'all') return '你还没有学习任何课程'
      if (this.currentTab === 'local') return '还没有学习平台课程'
      if (this.currentTab === 'external') return '还没有观看站外视频'
      if (this.currentTab === 'in-progress') return '没有进行中的课程'
      if (this.currentTab === 'completed') return '还没有完成的课程'
      return '快去学习吧'
    },
    
    switchTab(tab) {
      this.currentTab = tab
    },
    
    formatTime(timestamp) {
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
    
    goToCourseDetail(course) {
      if (course.type === 'external') {
        // 站外视频，跳转到浏览器
        uni.showModal({
          title: '提示',
          content: `跳转到${course.sourceName || '站外视频'}观看`,
          success: (res) => {
            if (res.confirm) {
              uni.setClipboardData({
                data: course.url || 'https://www.bilibili.com',
                success: () => {
                  uni.showToast({
                    title: '链接已复制',
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      } else {
        uni.navigateTo({
          url: '/pages/course-detail/course-detail?id=' + course.courseId
        })
      }
    },
    
    goToCourseList() {
      uni.switchTab({
        url: '/pages/course/course'
      })
    }
  }
}
</script>

<style>
.my-courses-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.my-courses-container.dark-mode {
  background-color: #1a1a1a;
}

.header {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  padding: 40rpx 30rpx;
  color: #ffffff;
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
}

.header.dark-header {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.tab-bar {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 20rpx;
  margin: 0 30rpx 20rpx 30rpx;
  border-radius: 50rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

.tab-bar.dark-tab-bar {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 15rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 40rpx;
  margin: 0 5rpx;
  min-width: 100rpx;
  transition: all 0.3s ease;
}

.tab-item.dark-tab-item {
  color: #aaa;
}

.tab-item.active {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-weight: 500;
}

.tab-item.dark-active {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
  color: #fff;
}

.course-list {
  height: calc(100vh - 300rpx);
  padding: 0 30rpx;
}

.course-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.course-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.course-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.course-title-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.course-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 10rpx;
  lines: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.course-title.dark-text {
  color: #fff;
}

.course-badges {
  display: flex;
  flex-direction: row;
}

.external-badge {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  color: #ffffff;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.external-badge.dark-badge {
  filter: brightness(0.9);
}

.badge-bilibili {
  background-color: #fb7299;
}

.badge-douyin {
  background-color: #000000;
}

.badge-kuaishou {
  background-color: #ff6f00;
}

.badge-xigua {
  background-color: #f04e37;
}

.badge-tencent {
  background-color: #0052cc;
}

.badge-iqiyi {
  background-color: #00be06;
}

.badge-youku {
  background-color: #005aa0;
}

.local-badge {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #2b5e2b, #1e4b1e);
  color: #ffffff;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.local-badge.dark-local-badge {
  background: linear-gradient(135deg, #1e4b1e, #0f2a0f);
}

.progress-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  margin-right: 15rpx;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.progress-bar.dark-progress-bar {
  background-color: #3a3a3a;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2b5e2b);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  color: #2b5e2b;
  font-weight: 500;
  min-width: 70rpx;
  text-align: right;
  transition: color 0.3s ease;
}

.progress-text.dark-progress-text {
  color: #4CAF50;
}

.course-meta {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.course-meta.dark-meta {
  color: #aaa;
}

.course-status {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 22rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.course-status.dark-status {
  filter: brightness(0.9);
}

.status-not-started {
  background-color: #f0f0f0;
  color: #999;
}

.dark-mode .status-not-started {
  background-color: #3a3a3a;
  color: #aaa;
}

.status-progress {
  background-color: #e3f2fd;
  color: #2196f3;
}

.dark-mode .status-progress {
  background-color: #0d2b4d;
  color: #64b5f6;
}

.status-completed {
  background-color: #e8f5e8;
  color: #2b5e2b;
}

.dark-mode .status-completed {
  background-color: #1e3a1e;
  color: #4CAF50;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.empty-icon.dark-empty-icon {
  opacity: 0.3;
}

.empty-text {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 15rpx;
  transition: color 0.3s ease;
}

.empty-text.dark-text {
  color: #fff;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 50rpx;
  transition: color 0.3s ease;
}

.empty-desc.dark-desc {
  color: #aaa;
}

.go-course-btn {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
  transition: all 0.3s ease;
}

.go-course-btn::after {
  border: none;
}

.go-course-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
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
</style>