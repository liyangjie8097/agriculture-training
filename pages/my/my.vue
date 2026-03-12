<template>
  <view class="content dark-mode-container" :class="{ 'dark-mode': darkMode }">
    <!-- 未登录状态 -->
    <view class="login-card" v-if="!isLogin" @tap="goToLogin">
      <image class="default-avatar" src="/static/logo.png"></image>
      <view class="login-text">
        <text class="click-login">点击登录</text>
        <text class="login-desc">登录后同步学习进度</text>
      </view>
    </view>
    
    <!-- 已登录状态 -->
    <view class="user-info-card" v-else @click="goToProfile">
      <image class="user-avatar" :src="userInfo.avatarUrl || '/static/logo.png'"></image>
      <view class="user-detail">
        <text class="user-name">{{ userInfo.nickName || userInfo.username || '微信用户' }}</text>
        <text class="user-phone">{{ userInfo.phone || '未绑定手机' }}</text>
        <view class="user-stats">
          <view class="stat-item" @click.stop="goToMyCourses">
            <text class="stat-value">{{ videoCount }}</text>
            <text class="stat-label">视频</text>
          </view>
          <view class="stat-item" @click.stop="goToFavorites">
            <text class="stat-value">{{ favoriteCount }}</text>
            <text class="stat-label">收藏</text>
          </view>
          <view class="stat-item" @click.stop="goToMyQuestions">
            <text class="stat-value">{{ questionCount }}</text>
            <text class="stat-label">提问</text>
          </view>
        </view>
      </view>
      <view class="edit-profile">
        <text class="edit-icon">✎</text>
      </view>
    </view>
    
    <!-- 消息中心入口 -->
    <view class="message-entry" :class="{ 'dark-card': darkMode }" @click="goToMessage" v-if="isLogin">
      <view class="message-left">
        <text class="message-icon">🔔</text>
        <text class="message-text" :class="{ 'dark-text': darkMode }">消息中心</text>
      </view>
      <view class="message-right">
        <text class="message-badge" v-if="totalUnreadMessages > 0">{{ totalUnreadMessages }}</text>
        <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
      </view>
    </view>
    
    <!-- 学习进度概览（仅登录显示） -->
    <view class="study-progress" :class="{ 'dark-card': darkMode }" v-if="isLogin">
      <view class="progress-header">
        <text class="progress-title" :class="{ 'dark-text': darkMode }">📊 本周学习进度</text>
        <text class="progress-detail" :class="{ 'dark-text-light': darkMode }" @click="goToHistory">查看详情 ></text>
      </view>
      <view class="progress-stats">
        <view class="progress-item">
          <text class="progress-value">{{ weekStudyHours }}</text>
          <text class="progress-label" :class="{ 'dark-text-light': darkMode }">观看小时</text>
        </view>
        <view class="progress-item">
          <text class="progress-value">{{ weekStudyVideos }}</text>
          <text class="progress-label" :class="{ 'dark-text-light': darkMode }">完成视频</text>
        </view>
        <view class="progress-item">
          <text class="progress-value">{{ weekStudyDays }}</text>
          <text class="progress-label" :class="{ 'dark-text-light': darkMode }">连续学习</text>
        </view>
      </view>
      <view class="progress-bar" :class="{ 'dark-progress': darkMode }">
        <view class="progress-fill" :style="{ width: weekProgress + '%' }"></view>
      </view>
      <text class="progress-tip" :class="{ 'dark-text-light': darkMode }">已完成本周目标的 {{ weekProgress }}%</text>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <!-- 学习管理 -->
      <view class="menu-group" :class="{ 'dark-group': darkMode }">
        <view class="menu-title" :class="{ 'dark-title': darkMode }">学习管理</view>
        <view class="menu-list">
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToMyCourses">
            <view class="menu-left">
              <text class="menu-icon">📚</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">我的视频</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ videoCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToFavorites">
            <view class="menu-left">
              <text class="menu-icon">❤️</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">我的收藏</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ favoriteCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToHistory">
            <view class="menu-left">
              <text class="menu-icon">📖</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">观看历史</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ historyCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToDownloads">
            <view class="menu-left">
              <text class="menu-icon">⬇️</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">离线缓存</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ downloadCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 社区互动 -->
      <view class="menu-group" :class="{ 'dark-group': darkMode }">
        <view class="menu-title" :class="{ 'dark-title': darkMode }">社区互动</view>
        <view class="menu-list">
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToMyQuestions">
            <view class="menu-left">
              <text class="menu-icon">❓</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">我的提问</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ questionCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToMyAnswers">
            <view class="menu-left">
              <text class="menu-icon">💬</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">我的回答</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ answerCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToMyNotes">
            <view class="menu-left">
              <text class="menu-icon">📝</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">我的笔记</text>
            </view>
            <view class="menu-right">
              <text class="menu-count" :class="{ 'dark-count': darkMode }">{{ noteCount }}</text>
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 个人设置 -->
      <view class="menu-group" :class="{ 'dark-group': darkMode }">
        <view class="menu-title" :class="{ 'dark-title': darkMode }">个人设置</view>
        <view class="menu-list">
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToProfile">
            <view class="menu-left">
              <text class="menu-icon">👤</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">个人资料</text>
            </view>
            <view class="menu-right">
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToSettings">
            <view class="menu-left">
              <text class="menu-icon">⚙️</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">设置</text>
            </view>
            <view class="menu-right">
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToFeedback">
            <view class="menu-left">
              <text class="menu-icon">📧</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">意见反馈</text>
            </view>
            <view class="menu-right">
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
          <view class="menu-item" :class="{ 'dark-item': darkMode }" @tap="goToAbout">
            <view class="menu-left">
              <text class="menu-icon">ℹ️</text>
              <text class="menu-label" :class="{ 'dark-label': darkMode }">关于我们</text>
            </view>
            <view class="menu-right">
              <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <button class="logout-btn" v-if="isLogin" @tap="logout">退出登录</button>
    
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
      isLogin: false,
      userInfo: {},
      totalUnreadMessages: 0,
      
      // 统计数据
      videoCount: 0,
      favoriteCount: 0,
      historyCount: 0,
      downloadCount: 0,
      questionCount: 0,
      answerCount: 0,
      noteCount: 0,
      
      // 学习进度
      weekStudyHours: 0,
      weekStudyVideos: 0,
      weekStudyDays: 0,
      weekProgress: 0
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
  },
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app.globalData.darkMode || false
    
    this.checkLoginStatus()
    if (this.isLogin) {
      this.loadUserStats()
      this.loadStudyProgress()
      this.loadUnreadMessages()
    }
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      
      if (token && userInfo) {
        this.isLogin = true
        this.userInfo = userInfo
      } else {
        this.isLogin = false
        this.userInfo = {}
      }
    },
    
    loadUnreadMessages() {
      const total = uni.getStorageSync('totalUnreadMessages') || 0
      this.totalUnreadMessages = total
    },
    
    async loadUserStats() {
      if (!this.userInfo.userId) return
      
      try {
        // 获取学习记录数量
        const records = uni.getStorageSync('learningRecords') || {}
        const userRecords = records[this.userInfo.userId] || {}
        this.videoCount = Object.keys(userRecords).length
        this.historyCount = this.videoCount
        
        // 获取收藏数量
        const favorites = uni.getStorageSync('favorites') || {}
        const userFavorites = favorites[this.userInfo.userId] || []
        this.favoriteCount = userFavorites.length
        
        // 从后端获取问答数量
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: baseUrl + '/qa',
            method: 'GET',
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          })
        })
        
        if (res.data.success) {
          const allQuestions = res.data.data
          this.questionCount = allQuestions.filter(q => q.user_id == this.userInfo.userId).length
        }
        
        this.downloadCount = 0
        this.answerCount = 12
        this.noteCount = 8
        
      } catch (error) {
        console.error('加载用户统计数据失败:', error)
      }
    },
    
    loadStudyProgress() {
      const records = uni.getStorageSync('learningRecords') || {}
      const userRecords = records[this.userInfo.userId] || {}
      
      const oneWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      let weekTotalMinutes = 0
      let weekCompletedVideos = 0
      let studyDays = new Set()
      
      Object.values(userRecords).forEach(record => {
        if (record.lastWatchTime > oneWeekAgo) {
          weekTotalMinutes += 30
          const date = new Date(record.lastWatchTime).toDateString()
          studyDays.add(date)
          if (record.progress === 100) {
            weekCompletedVideos++
          }
        }
      })
      
      this.weekStudyHours = (weekTotalMinutes / 60).toFixed(1)
      this.weekStudyVideos = weekCompletedVideos
      this.weekStudyDays = studyDays.size
      this.weekProgress = Math.min(100, Math.round((weekTotalMinutes / (7 * 120)) * 100))
    },
    
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    
    goToProfile() {
      uni.navigateTo({
        url: '/pages/profile/profile'
      })
    },
    
    goToMessage() {
      uni.navigateTo({
        url: '/pages/message/message'
      })
    },
    
    goToMyCourses() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.navigateTo({
        url: '/pages/my-courses/my-courses'
      })
    },
    
    goToFavorites() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.navigateTo({
        url: '/pages/favorites/favorites'
      })
    },
    
    goToHistory() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.navigateTo({
        url: '/pages/history/history'
      })
    },
    
    goToDownloads() {
      uni.showToast({
        title: '站外视频不支持下载',
        icon: 'none'
      })
    },
    
    goToMyQuestions() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.navigateTo({
        url: '/pages/my-questions/my-questions'
      })
    },
    
    goToMyAnswers() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.showToast({
        title: '我的回答开发中',
        icon: 'none'
      })
    },
    
    goToMyNotes() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      uni.showToast({
        title: '我的笔记开发中',
        icon: 'none'
      })
    },
    
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      })
    },
    
    goToFeedback() {
      uni.navigateTo({
        url: '/pages/feedback/feedback'
      })
    },
    
    goToAbout() {
      uni.navigateTo({
        url: '/pages/about/about'
      })
    },
    
    showLoginTip() {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin()
          }
        }
      })
    },
    
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            this.isLogin = false
            this.userInfo = {}
            uni.showToast({
              title: '已退出',
              icon: 'success'
            })
            setTimeout(() => {
              this.checkLoginStatus()
            }, 500)
          }
        }
      })
    }
  }
}
</script>

<style>
.content {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: background-color 0.3s ease;
}

.content.dark-mode {
  background-color: #1a1a1a;
}

.login-card {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  padding: 50rpx 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 0 0 60rpx 60rpx;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
}

.dark-mode .login-card {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.default-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #fff;
  padding: 10rpx;
}

.dark-mode .default-avatar {
  filter: brightness(0.9);
}

.login-text {
  display: flex;
  flex-direction: column;
  margin-left: 30rpx;
}

.click-login {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.login-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.user-info-card {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  padding: 50rpx 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 0 0 60rpx 60rpx;
  margin-bottom: 30rpx;
  position: relative;
  transition: all 0.3s ease;
}

.dark-mode .user-info-card {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #fff;
  padding: 4rpx;
  margin-right: 25rpx;
}

.dark-mode .user-avatar {
  filter: brightness(0.9);
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.user-phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20rpx;
  display: block;
}

.user-stats {
  display: flex;
  flex-direction: row;
}

.stat-item {
  margin-right: 50rpx;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.edit-profile {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 60rpx;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 32rpx;
  color: #ffffff;
}

.message-entry {
  background-color: #ffffff;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  border-left: 8rpx solid #2b5e2b;
  transition: all 0.3s ease;
}

.message-entry.dark-card {
  background-color: #2a2a2a;
  border-left-color: #4CAF50;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.message-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.message-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.message-text.dark-text {
  color: #fff;
}

.message-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message-badge {
  min-width: 40rpx;
  height: 40rpx;
  background-color: #f56c6c;
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
  margin-right: 15rpx;
}

.study-progress {
  background-color: #ffffff;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.study-progress.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.progress-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.progress-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.progress-title.dark-text {
  color: #fff;
}

.progress-detail {
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.progress-detail.dark-text-light {
  color: #aaa;
}

.progress-stats {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-value {
  font-size: 44rpx;
  font-weight: bold;
  color: #2b5e2b;
  margin-bottom: 6rpx;
  transition: color 0.3s ease;
}

.dark-mode .progress-value {
  color: #4CAF50;
}

.progress-label {
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.progress-label.dark-text-light {
  color: #aaa;
}

.progress-bar {
  width: 100%;
  height: 12rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  margin-bottom: 15rpx;
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

.progress-tip {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  transition: color 0.3s ease;
}

.progress-tip.dark-text-light {
  color: #aaa;
}

.menu-section {
  padding: 0 30rpx;
}

.menu-group {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.menu-group.dark-group {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.menu-title {
  padding: 25rpx 30rpx;
  font-size: 28rpx;
  color: #999;
  background-color: #f9f9f9;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.menu-title.dark-title {
  background-color: #333;
  color: #aaa;
  border-bottom-color: #444;
}

.menu-list {
  padding: 0 30rpx;
}

.menu-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.menu-item.dark-item {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
  width: 50rpx;
  text-align: center;
}

.menu-label {
  font-size: 30rpx;
  color: #333;
  transition: color 0.3s ease;
}

.menu-label.dark-label {
  color: #fff;
}

.menu-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.menu-count {
  font-size: 28rpx;
  color: #999;
  margin-right: 15rpx;
  transition: color 0.3s ease;
}

.menu-count.dark-count {
  color: #aaa;
}

.arrow {
  font-size: 40rpx;
  color: #ccc;
  transition: color 0.3s ease;
}

.arrow.dark-arrow {
  color: #666;
}

.logout-btn {
  margin: 40rpx 30rpx 30rpx;
  background-color: #f56c6c;
  color: #fff;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  border: none;
  transition: background-color 0.3s ease;
}

.logout-btn::after {
  border: none;
}

.dark-mode .logout-btn {
  background-color: #c62828;
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