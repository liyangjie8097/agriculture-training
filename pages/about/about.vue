<template>
  <view class="about-container" :class="{ 'dark-mode': darkMode }">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="nav-left" @click="goBack">
        <text class="back-icon" :class="{ 'dark-back-icon': darkMode }">←</text>
      </view>
      <view class="nav-title" :class="{ 'dark-nav-title': darkMode }">关于我们</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- Logo区域 -->
    <view class="logo-section">
      <image class="logo" :class="{ 'dark-logo': darkMode }" src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name" :class="{ 'dark-app-name': darkMode }">农业技能培训</text>
    </view>
    
    <!-- 制作人信息卡片 -->
    <view class="info-card" :class="{ 'dark-info-card': darkMode }">
      <view class="info-item" :class="{ 'dark-info-item': darkMode }">
        <text class="info-label" :class="{ 'dark-info-label': darkMode }">制作人</text>
        <text class="info-value" :class="{ 'dark-info-value': darkMode }">李阳杰</text>
      </view>
      <view class="info-item" :class="{ 'dark-info-item': darkMode }">
        <text class="info-label" :class="{ 'dark-info-label': darkMode }">班级</text>
        <text class="info-value" :class="{ 'dark-info-value': darkMode }">计科1班</text>
      </view>
      <view class="info-item" :class="{ 'dark-info-item': darkMode }">
        <text class="info-label" :class="{ 'dark-info-label': darkMode }">学号</text>
        <text class="info-value" :class="{ 'dark-info-value': darkMode }">2227010134</text>
      </view>
    </view>
    
    <!-- 版权信息 -->
    <view class="copyright" :class="{ 'dark-copyright': darkMode }">
      <text>© 2026 李阳杰 计科1班</text>
      <text>学号：2227010134</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false
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
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.about-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* 深色模式 */
.about-container.dark-mode {
  background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
}

/* 顶部导航栏 */
.custom-navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60rpx 30rpx 20rpx;
  background-color: transparent;
}

.nav-left {
  width: 80rpx;
}

.back-icon {
  font-size: 48rpx;
  color: #2b5e2b;
  font-weight: bold;
  transition: color 0.3s ease;
}

.back-icon.dark-back-icon {
  color: #4CAF50;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #2b5e2b;
  transition: color 0.3s ease;
}

.nav-title.dark-nav-title {
  color: #4CAF50;
}

.nav-right {
  width: 80rpx;
}

/* Logo区域 */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(43, 94, 43, 0.2);
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.logo.dark-logo {
  box-shadow: 0 10rpx 30rpx rgba(76, 175, 80, 0.3);
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #2b5e2b;
  transition: color 0.3s ease;
}

.app-name.dark-app-name {
  color: #4CAF50;
}

/* 信息卡片 */
.info-card {
  background-color: #ffffff;
  border-radius: 30rpx;
  margin: 0 40rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(43, 94, 43, 0.1);
  transition: all 0.3s ease;
}

.info-card.dark-info-card {
  background-color: #2a2a2a;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
  border-color: rgba(76, 175, 80, 0.2);
}

.info-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.info-item.dark-info-item {
  border-bottom-color: #3a3a3a;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 32rpx;
  color: #666;
  font-weight: 400;
  transition: color 0.3s ease;
}

.info-label.dark-info-label {
  color: #aaa;
}

.info-value {
  font-size: 34rpx;
  color: #2b5e2b;
  font-weight: 600;
  transition: color 0.3s ease;
}

.info-value.dark-info-value {
  color: #4CAF50;
}

/* 版权信息 */
.copyright {
  margin-top: auto;
  padding: 60rpx 0 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.copyright.dark-copyright {
  color: #666;
}

.copyright text {
  margin-bottom: 6rpx;
}
</style>