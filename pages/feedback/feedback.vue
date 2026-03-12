<template>
  <view class="feedback-container" :class="{ 'dark-mode': darkMode }">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar" :class="{ 'dark-navbar': darkMode }">
      <view class="nav-left" @click="goBack">
        <text class="back-icon" :class="{ 'dark-icon': darkMode }">←</text>
      </view>
      <view class="nav-title" :class="{ 'dark-text': darkMode }">意见反馈</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 反馈表单 -->
    <view class="form-section" :class="{ 'dark-section': darkMode }">
      <!-- 反馈类型 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon">{{ darkMode ? '📋' : '📋' }}</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">反馈类型</text>
        </view>
        <picker @change="onTypeChange" :value="typeIndex" :range="typeOptions">
          <view class="picker" :class="{ 'dark-picker': darkMode }">
            {{ typeOptions[typeIndex] }}
            <text class="picker-arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 反馈标题 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon">📝</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">反馈标题</text>
        </view>
        <input 
          class="form-input" 
          :class="{ 'dark-input': darkMode }"
          v-model="formData.title" 
          placeholder="请简要描述问题或建议"
          maxlength="50"
          placeholder-class="dark-placeholder"
        />
        <text class="input-count" :class="{ 'dark-count': darkMode }">{{ formData.title.length }}/50</text>
      </view>
      
      <!-- 反馈内容 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon">💬</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">详细描述</text>
        </view>
        <textarea 
          class="form-textarea" 
          :class="{ 'dark-textarea': darkMode }"
          v-model="formData.content" 
          placeholder="请详细描述您遇到的问题或建议，包括具体情况、操作步骤等"
          maxlength="500"
          placeholder-class="dark-placeholder"
        />
        <text class="textarea-count" :class="{ 'dark-count': darkMode }">{{ formData.content.length }}/500</text>
      </view>
      
      <!-- 联系方式 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon">📞</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">联系方式</text>
        </view>
        <input 
          class="form-input" 
          :class="{ 'dark-input': darkMode }"
          v-model="formData.contact" 
          placeholder="手机/微信/QQ（选填）"
          maxlength="50"
          placeholder-class="dark-placeholder"
        />
        <text class="input-tip" :class="{ 'dark-tip': darkMode }">方便我们与您联系</text>
      </view>
      
      <!-- 图片上传 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon">🖼️</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">添加图片</text>
        </view>
        <view class="upload-section">
          <view class="upload-list">
            <view 
              class="upload-item" 
              v-for="(img, index) in images" 
              :key="index"
            >
              <image class="upload-image" :src="img" mode="aspectFill"></image>
              <view class="upload-remove" @click="removeImage(index)">✕</view>
            </view>
            <view class="upload-btn" :class="{ 'dark-upload-btn': darkMode }" @click="chooseImage" v-if="images.length < 3">
              <text class="upload-icon" :class="{ 'dark-upload-icon': darkMode }">+</text>
              <text class="upload-text" :class="{ 'dark-upload-text': darkMode }">上传图片</text>
            </view>
          </view>
          <text class="upload-tip" :class="{ 'dark-tip': darkMode }">最多上传3张，可提供截图</text>
        </view>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <button 
      class="submit-btn" 
      :class="{ 'dark-btn': darkMode }"
      @click="submitFeedback"
      :disabled="!canSubmit"
    >
      提交反馈
    </button>
    
    <!-- 历史反馈列表 -->
    <view class="history-section" :class="{ 'dark-section': darkMode }" v-if="feedbackList.length > 0">
      <view class="section-header">
        <text class="section-title" :class="{ 'dark-text': darkMode }">📋 历史反馈</text>
      </view>
      
      <view class="feedback-list">
        <view 
          class="feedback-card" 
          :class="{ 'dark-feedback-card': darkMode }"
          v-for="item in feedbackList" 
          :key="item.id"
        >
          <view class="feedback-header">
            <view class="feedback-type" :class="'type-' + item.type">
              {{ getTypeName(item.type) }}
            </view>
            <view class="feedback-status" :class="'status-' + item.status">
              {{ getStatusName(item.status) }}
            </view>
          </view>
          
          <text class="feedback-title" :class="{ 'dark-text': darkMode }">{{ item.title }}</text>
          <text class="feedback-content" :class="{ 'dark-content': darkMode }">{{ item.content }}</text>
          
          <!-- 回复内容 -->
          <view class="feedback-reply" :class="{ 'dark-reply': darkMode }" v-if="item.reply">
            <text class="reply-label" :class="{ 'dark-reply-label': darkMode }">管理员回复：</text>
            <text class="reply-content" :class="{ 'dark-reply-content': darkMode }">{{ item.reply }}</text>
          </view>
          
          <view class="feedback-footer">
            <text class="feedback-time" :class="{ 'dark-time': darkMode }">{{ item.create_time }}</text>
          </view>
        </view>
      </view>
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
      typeIndex: 0,
      typeOptions: ['功能建议', '内容问题', '技术故障', '其他'],
      
      formData: {
        title: '',
        content: '',
        contact: ''
      },
      
      images: [],
      isLogin: false,
      userInfo: {},
      feedbackList: []
    }
  },
  
  computed: {
    canSubmit() {
      return this.formData.title.trim() && this.formData.content.trim()
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
    
    this.checkLoginStatus()
    this.loadFeedbackHistory()
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
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (token && userInfo) {
        this.isLogin = true
        this.userInfo = userInfo
      }
    },
    
    goBack() {
      uni.navigateBack()
    },
    
    onTypeChange(e) {
      this.typeIndex = e.detail.value
    },
    
    getTypeName(type) {
      const types = ['', '功能建议', '内容问题', '技术故障', '其他']
      return types[type] || '其他'
    },
    
    getStatusName(status) {
      const statuses = ['待处理', '处理中', '已处理', '已驳回']
      return statuses[status] || '待处理'
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths]
        }
      })
    },
    
    removeImage(index) {
      this.images.splice(index, 1)
    },
    
    // 提交反馈
    submitFeedback() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '提交中...'
      })
      
      // 模拟提交
      setTimeout(() => {
        // 创建新反馈
        const newFeedback = {
          id: Date.now(),
          user_id: this.userInfo?.userId || 0,
          user_name: this.userInfo?.nickName || '匿名用户',
          type: this.typeIndex + 1,
          title: this.formData.title,
          content: this.formData.content,
          contact: this.formData.contact,
          images: this.images,
          status: 0,
          reply: '',
          create_time: this.formatDate(new Date())
        }
        
        // 保存到本地存储
        const feedbacks = uni.getStorageSync('feedbacks') || []
        feedbacks.unshift(newFeedback)
        uni.setStorageSync('feedbacks', feedbacks)
        
        // 清空表单
        this.formData.title = ''
        this.formData.content = ''
        this.formData.contact = ''
        this.images = []
        this.typeIndex = 0
        
        // 刷新列表
        this.loadFeedbackHistory()
        
        uni.hideLoading()
        
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
      }, 1000)
    },
    
    // 加载历史反馈
    loadFeedbackHistory() {
      const allFeedbacks = uni.getStorageSync('feedbacks') || []
      
      if (this.isLogin) {
        // 登录用户显示自己的反馈
        this.feedbackList = allFeedbacks
          .filter(f => f.user_id === this.userInfo?.userId)
          .slice(0, 5)
      } else {
        // 未登录用户显示最近5条匿名反馈（模拟）
        this.feedbackList = allFeedbacks
          .filter(f => f.user_id === 0)
          .slice(0, 5)
      }
    },
    
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  }
}
</script>

<style>
.feedback-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.feedback-container.dark-mode {
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

/* 表单区域 */
.form-section {
  background-color: #ffffff;
  margin: 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.form-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.form-item {
  margin-bottom: 40rpx;
  position: relative;
}

.form-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15rpx;
}

.label-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
  width: 40rpx;
}

.label-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.label-text.dark-label {
  color: #fff;
}

.picker {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.picker.dark-picker {
  background-color: #3a3a3a;
  color: #fff;
}

.picker-arrow {
  font-size: 40rpx;
  color: #999;
  transition: color 0.3s ease;
}

.picker-arrow.dark-arrow {
  color: #aaa;
}

.form-input {
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-input.dark-input {
  background-color: #3a3a3a;
  color: #fff;
}

.form-input.dark-input::placeholder {
  color: #aaa;
}

.input-count {
  position: absolute;
  right: 20rpx;
  bottom: -30rpx;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.input-count.dark-count {
  color: #aaa;
}

.form-textarea {
  height: 200rpx;
  background-color: #f8f8f8;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-textarea.dark-textarea {
  background-color: #3a3a3a;
  color: #fff;
}

.form-textarea.dark-textarea::placeholder {
  color: #aaa;
}

.textarea-count {
  position: absolute;
  right: 20rpx;
  bottom: -30rpx;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.textarea-count.dark-count {
  color: #aaa;
}

.input-tip {
  position: absolute;
  left: 80rpx;
  bottom: -30rpx;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.input-tip.dark-tip {
  color: #aaa;
}

/* 上传区域 */
.upload-section {
  margin-top: 10rpx;
}

.upload-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.upload-item {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.upload-remove {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #f56c6c;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
}

.upload-btn {
  width: 180rpx;
  height: 180rpx;
  background-color: #f8f8f8;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-btn.dark-upload-btn {
  background-color: #3a3a3a;
  border-color: #555;
}

.upload-icon {
  font-size: 60rpx;
  color: #999;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.upload-icon.dark-upload-icon {
  color: #aaa;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.upload-text.dark-upload-text {
  color: #aaa;
}

.upload-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
  transition: color 0.3s ease;
}

.upload-tip.dark-tip {
  color: #aaa;
}

/* 提交按钮 */
.submit-btn {
  margin: 0 30rpx 40rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn::after {
  border: none;
}

.submit-btn[disabled] {
  opacity: 0.5;
}

.submit-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

/* 历史反馈 */
.history-section {
  background-color: #ffffff;
  margin: 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.history-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.section-header {
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

.feedback-card {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.feedback-card.dark-feedback-card {
  background-color: #3a3a3a;
}

.feedback-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.feedback-type {
  padding: 4rpx 20rpx;
  border-radius: 30rpx;
  font-size: 22rpx;
  color: #ffffff;
}

.type-1 { background-color: #2196F3; }
.type-2 { background-color: #FF9800; }
.type-3 { background-color: #F44336; }
.type-4 { background-color: #9C27B0; }

.feedback-status {
  padding: 4rpx 20rpx;
  border-radius: 30rpx;
  font-size: 22rpx;
}

.status-0 { background-color: #f0f0f0; color: #666; }
.status-1 { background-color: #e3f2fd; color: #1976D2; }
.status-2 { background-color: #e8f5e8; color: #2b5e2b; }
.status-3 { background-color: #ffebee; color: #c62828; }

.feedback-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  transition: color 0.3s ease;
}

.feedback-title.dark-text {
  color: #fff;
}

.feedback-content {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.feedback-content.dark-content {
  color: #aaa;
}

.feedback-reply {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-bottom: 15rpx;
  transition: all 0.3s ease;
}

.feedback-reply.dark-reply {
  background-color: #2a2a2a;
}

.reply-label {
  font-size: 24rpx;
  color: #2b5e2b;
  font-weight: 500;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.reply-label.dark-reply-label {
  color: #4CAF50;
}

.reply-content {
  font-size: 24rpx;
  color: #666;
  transition: color 0.3s ease;
}

.reply-content.dark-reply-content {
  color: #aaa;
}

.feedback-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.feedback-time {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.feedback-time.dark-time {
  color: #aaa;
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

/* 占位符样式 */
.dark-placeholder {
  color: #aaa !important;
}
</style>