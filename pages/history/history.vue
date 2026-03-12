<template>
  <view class="history-container" :class="{ 'dark-mode': darkMode }">
    <view class="header" :class="{ 'dark-header': darkMode }">
      <text class="title">学习历史</text>
      <text class="subtitle">共 {{ historyList.length }} 条记录</text>
    </view>
    
    <!-- 历史列表 -->
    <view class="history-list" v-if="historyList.length > 0">
      <view 
        class="history-card" 
        :class="{ 'dark-card': darkMode }"
        v-for="item in historyList" 
        :key="item.courseId"
        @click="goToCourse(item)"
      >
        <image class="course-image" :src="getCourseImage(item)" mode="aspectFill"></image>
        <view class="course-info">
          <view class="course-title-row">
            <text class="course-title" :class="{ 'dark-text': darkMode }">{{ item.courseTitle }}</text>
            <text class="course-type" :class="['type-' + item.source, { 'dark-type': darkMode }]" v-if="item.type === 'external'">
              {{ item.sourceName || '站外视频' }}
            </text>
          </view>
          <view class="progress-bar" :class="{ 'dark-progress': darkMode }">
            <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
          </view>
          <view class="progress-text">
            <text :class="{ 'dark-text-light': darkMode }">学习进度 {{ item.progress }}%</text>
            <text class="last-time" :class="{ 'dark-time': darkMode }">{{ formatTime(item.lastWatchTime) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon" :class="{ 'dark-empty-icon': darkMode }">📚</text>
      <text class="empty-text" :class="{ 'dark-text': darkMode }">暂无学习记录</text>
      <text class="empty-desc" :class="{ 'dark-desc': darkMode }">快去学习一门课程吧</text>
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
      historyList: [],
      userInfo: {},
      allCourses: []
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
    
    this.loadHistory()
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    loadHistory() {
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
      this.loadAllCourses()
      
      const records = uni.getStorageSync('learningRecords') || {}
      const userRecords = records[userInfo.userId] || {}
      
      // 转换为数组并按时间排序
      this.historyList = Object.values(userRecords).sort((a, b) => {
        return b.lastWatchTime - a.lastWatchTime
      })
    },
    
    loadAllCourses() {
      const pages = getCurrentPages()
      const indexPage = pages.find(p => p.route === 'pages/index/index')
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || []
      }
    },
    
    getCourseImage(item) {
      if (item.type === 'external') {
        return item.cover || 'https://via.placeholder.com/200x150/2196F3/ffffff?text=站外视频'
      }
      const course = this.allCourses.find(c => c.id == item.courseId)
      return course ? course.image : 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=课程'
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
    
    goToCourse(item) {
      if (item.type === 'external') {
        uni.showModal({
          title: '提示',
          content: `跳转到${item.sourceName || '站外视频'}继续观看`,
          success: (res) => {
            if (res.confirm) {
              uni.setClipboardData({
                data: item.url || 'https://www.bilibili.com',
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
          url: '/pages/course-detail/course-detail?id=' + item.courseId
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
.history-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.history-container.dark-mode {
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

.history-list {
  padding: 0 30rpx;
}

.history-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.history-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.course-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.course-type {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  color: #ffffff;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.course-type.dark-type {
  filter: brightness(0.9);
}

.type-bilibili {
  background-color: #fb7299;
}

.type-douyin {
  background-color: #000000;
}

.type-kuaishou {
  background-color: #ff6f00;
}

.type-xigua {
  background-color: #f04e37;
}

.type-tencent {
  background-color: #0052cc;
}

.type-iqiyi {
  background-color: #00be06;
}

.type-youku {
  background-color: #005aa0;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  margin-bottom: 10rpx;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.progress-bar.dark-progress {
  background-color: #3a3a3a;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2b5e2b);
  border-radius: 6rpx;
}

.progress-text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.progress-text.dark-text-light {
  color: #aaa;
}

.last-time {
  color: #666;
  transition: color 0.3s ease;
}

.last-time.dark-time {
  color: #aaa;
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