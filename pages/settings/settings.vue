<template>
  <view class="settings-container" :class="{ 'dark-mode': darkMode }">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar" :class="{ 'dark-navbar': darkMode }">
      <view class="nav-left" @click="goBack">
        <text class="back-icon" :class="{ 'dark-icon': darkMode }">←</text>
      </view>
      <view class="nav-title" :class="{ 'dark-text': darkMode }">设置</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 通用设置 -->
      <view class="settings-group" :class="{ 'dark-group': darkMode }">
        <view class="group-title" :class="{ 'dark-title': darkMode }">通用设置</view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">{{ darkMode ? '☀️' : '🌙' }}</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">深色模式</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': darkMode }" @click="toggleDarkMode">
              <view class="switch-slider" :class="{ 'slider-on': darkMode }"></view>
            </button>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">🔄</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">自动连播</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': autoPlay }" @click="toggleAutoPlay">
              <view class="switch-slider" :class="{ 'slider-on': autoPlay }"></view>
            </button>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">📶</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">仅在WiFi下播放</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': wifiOnly }" @click="toggleWiFiOnly">
              <view class="switch-slider" :class="{ 'slider-on': wifiOnly }"></view>
            </button>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="showFontSizePicker">
          <view class="item-left">
            <text class="item-icon">🔤</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">字体大小</text>
          </view>
          <view class="item-right">
            <text class="item-value" :class="{ 'dark-value': darkMode }">{{ fontSizeText }}</text>
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
      </view>
      
      <!-- 通知设置 -->
      <view class="settings-group" :class="{ 'dark-group': darkMode }">
        <view class="group-title" :class="{ 'dark-title': darkMode }">通知设置</view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">🔔</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">系统通知</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': systemNotice }" @click="toggleSystemNotice">
              <view class="switch-slider" :class="{ 'slider-on': systemNotice }"></view>
            </button>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">评论回复通知</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': commentNotice }" @click="toggleCommentNotice">
              <view class="switch-slider" :class="{ 'slider-on': commentNotice }"></view>
            </button>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">❤️</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">点赞收藏通知</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': likeNotice }" @click="toggleLikeNotice">
              <view class="switch-slider" :class="{ 'slider-on': likeNotice }"></view>
            </button>
          </view>
        </view>
      </view>
      
      <!-- 缓存设置 -->
      <view class="settings-group" :class="{ 'dark-group': darkMode }">
        <view class="group-title" :class="{ 'dark-title': darkMode }">缓存设置</view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="showCacheSize">
          <view class="item-left">
            <text class="item-icon">💾</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">缓存大小</text>
          </view>
          <view class="item-right">
            <text class="item-value" :class="{ 'dark-value': darkMode }">{{ cacheSize }}</text>
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="clearCache">
          <view class="item-left">
            <text class="item-icon">🗑️</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">清除缓存</text>
          </view>
          <view class="item-right">
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
      </view>
      
      <!-- 隐私设置 -->
      <view class="settings-group" :class="{ 'dark-group': darkMode }">
        <view class="group-title" :class="{ 'dark-title': darkMode }">隐私设置</view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="goToPrivacyPolicy">
          <view class="item-left">
            <text class="item-icon">📜</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">隐私政策</text>
          </view>
          <view class="item-right">
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="goToUserAgreement">
          <view class="item-left">
            <text class="item-icon">📄</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">用户协议</text>
          </view>
          <view class="item-right">
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }">
          <view class="item-left">
            <text class="item-icon">📊</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">个性化推荐</text>
          </view>
          <view class="item-right">
            <button class="custom-switch" :class="{ 'switch-on': dataCollection }" @click="toggleDataCollection">
              <view class="switch-slider" :class="{ 'slider-on': dataCollection }"></view>
            </button>
          </view>
        </view>
      </view>
      
      <!-- 关于 -->
      <view class="settings-group" :class="{ 'dark-group': darkMode }">
        <view class="group-title" :class="{ 'dark-title': darkMode }">关于</view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="goToAbout">
          <view class="item-left">
            <text class="item-icon">ℹ️</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">关于我们</text>
          </view>
          <view class="item-right">
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
        
        <view class="settings-item" :class="{ 'dark-item': darkMode }" @click="checkUpdate">
          <view class="item-left">
            <text class="item-icon">🔄</text>
            <text class="item-label" :class="{ 'dark-label': darkMode }">检查更新</text>
          </view>
          <view class="item-right">
            <text class="item-value" :class="{ 'dark-value': darkMode }">当前版本 1.0.0</text>
            <text class="arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 字体大小选择弹窗 -->
    <view class="modal-mask" v-if="showFontModal" @click="showFontModal = false"></view>
    <view class="font-modal" :class="{ 'dark-modal': darkMode }" v-if="showFontModal">
      <view class="modal-title" :class="{ 'dark-text': darkMode }">字体大小</view>
      <view class="font-options">
        <view 
          class="font-option" 
          v-for="(size, index) in fontSizes" 
          :key="index"
          :class="{ 'dark-option': darkMode }"
          @click="selectFontSize(index)"
        >
          <text class="option-label" :class="{ 'dark-label': darkMode }">{{ size.name }}</text>
          <text class="option-check" v-if="fontSizeIndex === index">✓</text>
        </view>
      </view>
      <view class="modal-preview" :class="{ 'dark-preview': darkMode }">
        <text class="preview-text" :class="{ 'dark-text': darkMode }" :style="{ fontSize: fontSizeValue + 'px' }">预览文字大小</text>
      </view>
      <view class="modal-close" :class="{ 'dark-modal-close': darkMode }" @click="showFontModal = false">关闭</view>
    </view>
    
    <!-- 开发者信息 -->
    <view class="dev-info" :class="{ 'dark-dev': darkMode }">
      <text>开发者：李阳杰</text>
      <text>学号：2227010134</text>
    </view>
  </view>
</template>

<script>
import { getDarkMode, toggleDarkMode as toggleGlobalDarkMode } from '@/utils/darkmode'

export default {
  data() {
    return {
      darkMode: false,
      autoPlay: false,
      wifiOnly: false,
      
      // 字体大小设置
      fontSizeIndex: 1,
      fontSizes: [
        { name: '小', value: 14 },
        { name: '中', value: 16 },
        { name: '大', value: 18 },
        { name: '特大', value: 20 }
      ],
      showFontModal: false,
      
      // 通知设置
      systemNotice: true,
      commentNotice: true,
      likeNotice: true,
      
      // 缓存设置
      cacheSize: '0 MB',
      
      // 隐私设置
      dataCollection: true
    }
  },
  
  computed: {
    fontSizeText() {
      return this.fontSizes[this.fontSizeIndex].name
    },
    fontSizeValue() {
      return this.fontSizes[this.fontSizeIndex].value
    }
  },
  
  onLoad() {
    // 获取深色模式状态
    this.darkMode = getDarkMode()
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
    
    this.loadSettings()
    this.calculateCacheSize()
    this.applyFontSize()
  },
  
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    // 加载设置
    loadSettings() {
      const settings = uni.getStorageSync('appSettings') || {}
      this.autoPlay = settings.autoPlay ?? false
      this.wifiOnly = settings.wifiOnly ?? false
      this.fontSizeIndex = settings.fontSize ?? 1
      this.systemNotice = settings.systemNotice ?? true
      this.commentNotice = settings.commentNotice ?? true
      this.likeNotice = settings.likeNotice ?? true
      this.dataCollection = settings.dataCollection ?? true
    },
    
    // 保存设置
    saveSettings() {
      const settings = {
        darkMode: this.darkMode,
        autoPlay: this.autoPlay,
        wifiOnly: this.wifiOnly,
        fontSize: this.fontSizeIndex,
        systemNotice: this.systemNotice,
        commentNotice: this.commentNotice,
        likeNotice: this.likeNotice,
        dataCollection: this.dataCollection
      }
      uni.setStorageSync('appSettings', settings)
    },
    
    // 应用字体大小
    applyFontSize() {
      uni.$emit('fontSizeChange', this.fontSizeValue)
    },
    
    // 深色模式切换
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.saveSettings()
      
      // 使用工具函数切换深色模式
      toggleGlobalDarkMode(this.darkMode)
      
      uni.showToast({
        title: this.darkMode ? '深色模式已开启' : '深色模式已关闭',
        icon: 'none'
      })
    },
    
    // 自动连播切换
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay
      this.saveSettings()
      uni.showToast({
        title: this.autoPlay ? '自动连播已开启' : '自动连播已关闭',
        icon: 'none'
      })
    },
    
    // WiFi only切换
    toggleWiFiOnly() {
      this.wifiOnly = !this.wifiOnly
      this.saveSettings()
      uni.showToast({
        title: this.wifiOnly ? '仅在WiFi下播放' : '所有网络均可播放',
        icon: 'none'
      })
    },
    
    // 显示字体大小选择器
    showFontSizePicker() {
      this.showFontModal = true
    },
    
    // 选择字体大小
    selectFontSize(index) {
      this.fontSizeIndex = index
      this.saveSettings()
      this.applyFontSize()
      this.showFontModal = false
      uni.showToast({
        title: '字体大小已设置为' + this.fontSizes[index].name,
        icon: 'none'
      })
    },
    
    // 通知设置切换
    toggleSystemNotice() {
      this.systemNotice = !this.systemNotice
      this.saveSettings()
    },
    
    toggleCommentNotice() {
      this.commentNotice = !this.commentNotice
      this.saveSettings()
    },
    
    toggleLikeNotice() {
      this.likeNotice = !this.likeNotice
      this.saveSettings()
    },
    
    // 数据收集切换
    toggleDataCollection() {
      this.dataCollection = !this.dataCollection
      this.saveSettings()
    },
    
    // 计算缓存大小
    calculateCacheSize() {
      const records = uni.getStorageSync('learningRecords')
      const favorites = uni.getStorageSync('favorites')
      const history = uni.getStorageSync('searchHistory')
      
      let totalSize = 0
      if (records) totalSize += JSON.stringify(records).length
      if (favorites) totalSize += JSON.stringify(favorites).length
      if (history) totalSize += JSON.stringify(history).length
      
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2)
      this.cacheSize = sizeInMB > 0 ? sizeInMB + ' MB' : '0 MB'
    },
    
    // 显示缓存大小
    showCacheSize() {
      uni.showToast({
        title: '缓存大小: ' + this.cacheSize,
        icon: 'none'
      })
    },
    
    // 清除缓存
    clearCache() {
      uni.showModal({
        title: '提示',
        content: '确定清除所有缓存吗？清除后不会影响您的学习记录和收藏。',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('searchHistory')
            this.calculateCacheSize()
            uni.showToast({
              title: '缓存已清除',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 隐私政策
    goToPrivacyPolicy() {
      uni.showModal({
        title: '隐私政策',
        content: '本应用尊重并保护所有用户的个人隐私。您在使用本应用时，我们不会收集您的任何个人信息。',
        showCancel: false,
        confirmText: '知道了'
      })
    },
    
    // 用户协议
    goToUserAgreement() {
      uni.showModal({
        title: '用户协议',
        content: '欢迎使用农业技能培训应用。使用本应用即表示您同意遵守本协议的所有条款。',
        showCancel: false,
        confirmText: '知道了'
      })
    },
    
    // 关于我们
    goToAbout() {
      uni.navigateTo({
        url: '/pages/about/about'
      })
    },
    
    // 检查更新
    checkUpdate() {
      uni.showToast({
        title: '当前已是最新版本',
        icon: 'none'
      })
    }
  }
}
</script>

<style>
.settings-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.settings-container.dark-mode {
  background-color: #1a1a1a;
}

/* 顶部导航栏 */
.custom-navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60rpx 30rpx 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.custom-navbar.dark-navbar {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.nav-left {
  width: 80rpx;
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  transition: color 0.3s ease;
}

.back-icon.dark-icon {
  color: #fff;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.nav-title.dark-text {
  color: #fff;
}

.nav-right {
  width: 80rpx;
}

/* 设置列表 */
.settings-list {
  padding: 20rpx 30rpx;
}

.settings-group {
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.settings-group.dark-group {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.group-title {
  padding: 25rpx 30rpx;
  font-size: 28rpx;
  color: #999;
  background-color: #f9f9f9;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.group-title.dark-title {
  background-color: #333;
  color: #aaa;
  border-bottom-color: #444;
}

.settings-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.settings-item.dark-item {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

.item-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  width: 50rpx;
  text-align: center;
}

.item-label {
  font-size: 30rpx;
  color: #333;
  transition: color 0.3s ease;
}

.item-label.dark-label {
  color: #fff;
}

.item-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-value {
  font-size: 28rpx;
  color: #999;
  margin-right: 15rpx;
  transition: color 0.3s ease;
}

.item-value.dark-value {
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

/* 自定义开关按钮 */
.custom-switch {
  width: 96rpx;
  height: 52rpx;
  background-color: #e0e0e0;
  border-radius: 52rpx;
  position: relative;
  border: none;
  padding: 0;
  margin: 0;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.custom-switch::after {
  display: none;
}

.custom-switch.switch-on {
  background-color: #2b5e2b;
}

.switch-slider {
  width: 44rpx;
  height: 44rpx;
  background-color: #ffffff;
  border-radius: 44rpx;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  transition: left 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.switch-slider.slider-on {
  left: 48rpx;
}

/* 字体大小选择弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.font-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx;
  z-index: 1001;
  transition: all 0.3s ease;
}

.font-modal.dark-modal {
  background-color: #2a2a2a;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
  transition: color 0.3s ease;
}

.modal-title.dark-text {
  color: #fff;
}

.font-options {
  margin-bottom: 40rpx;
}

.font-option {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.font-option.dark-option {
  border-bottom-color: #3a3a3a;
}

.option-label {
  font-size: 32rpx;
  color: #333;
  transition: color 0.3s ease;
}

.dark-mode .option-label {
  color: #fff;
}

.option-check {
  font-size: 36rpx;
  color: #2b5e2b;
  font-weight: bold;
}

.modal-preview {
  background-color: #f8f8f8;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.modal-preview.dark-preview {
  background-color: #333;
}

.preview-text {
  color: #333;
  transition: font-size 0.3s ease, color 0.3s ease;
}

.preview-text.dark-text {
  color: #fff;
}

.modal-close {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.modal-close.dark-modal-close {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

/* 开发者信息 */
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