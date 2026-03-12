<template>
  <view class="ask-container" :class="{ 'dark-mode': darkMode }">
    <view class="ask-header" :class="{ 'dark-header': darkMode }">
      <text class="ask-title">提问题</text>
    </view>
    
    <view class="ask-form" :class="{ 'dark-form': darkMode }">
      <!-- 问题分类 -->
      <view class="form-item">
        <text class="form-label" :class="{ 'dark-label': darkMode }">问题分类</text>
        <picker @change="onCategoryChange" :value="categoryIndex" :range="categoryNames">
          <view class="picker" :class="{ 'dark-picker': darkMode }">
            {{ categoryNames[categoryIndex] }}
            <text class="picker-arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </picker>
        
        <!-- 当选择"其他"时，显示自定义分类输入框 -->
        <view class="custom-category" v-if="isCustomCategory">
          <input 
            type="text" 
            v-model="customCategory" 
            placeholder="请输入分类名称" 
            class="custom-input" 
            :class="{ 'dark-input': darkMode, 'dark-custom-input': darkMode }"
            maxlength="20"
          />
        </view>
      </view>
      
      <!-- 问题标题 -->
      <view class="form-item">
        <text class="form-label" :class="{ 'dark-label': darkMode }">问题标题</text>
        <input 
          type="text" 
          v-model="title" 
          placeholder="请简要描述你的问题" 
          class="form-input" 
          :class="{ 'dark-input': darkMode }"
          maxlength="50"
        />
        <text class="input-count" :class="{ 'dark-count': darkMode }">{{ title.length }}/50</text>
      </view>
      
      <!-- 问题描述 -->
      <view class="form-item">
        <text class="form-label" :class="{ 'dark-label': darkMode }">问题描述</text>
        <textarea 
          v-model="content" 
          placeholder="请详细描述你的问题，包括具体情况、时间、症状等" 
          class="form-textarea" 
          :class="{ 'dark-textarea': darkMode }"
          maxlength="500"
        />
        <text class="textarea-count" :class="{ 'dark-count': darkMode }">{{ content.length }}/500</text>
      </view>
      
      <!-- 图片上传（可选） -->
      <view class="form-item">
        <text class="form-label" :class="{ 'dark-label': darkMode }">添加图片（选填）</text>
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
        </view>
      </view>
      
      <!-- 匿名提问 -->
      <view class="form-item switch-item">
        <text class="form-label" :class="{ 'dark-label': darkMode }">匿名提问</text>
        <switch @change="onAnonymousChange" :checked="isAnonymous" color="#2b5e2b" />
      </view>
      
      <!-- 提交按钮 -->
      <button 
        class="submit-btn" 
        :class="{ 'dark-submit-btn': darkMode }" 
        @click="submitQuestion"
        :disabled="!canSubmit"
      >
        提交问题
      </button>
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
      categories: [
        { name: '种植技术', value: 'plant' },
        { name: '养殖技术', value: 'breed' },
        { name: '农机操作', value: 'machine' },
        { name: '病虫害防治', value: 'pest' },
        { name: '农产品加工', value: 'process' },
        { name: '农业电商', value: 'ecommerce' },
        { name: '其他', value: 'other' }
      ],
      categoryIndex: 0,
      customCategory: '',
      title: '',
      content: '',
      images: [],
      isAnonymous: false,
      userInfo: {}
    }
  },
  computed: {
    categoryNames() {
      return this.categories.map(c => c.name)
    },
    isCustomCategory() {
      return this.categories[this.categoryIndex]?.value === 'other'
    },
    finalCategory() {
      if (this.isCustomCategory && this.customCategory) {
        return this.customCategory
      }
      return this.categories[this.categoryIndex]?.value || 'other'
    },
    finalCategoryName() {
      if (this.isCustomCategory && this.customCategory) {
        return this.customCategory
      }
      return this.categories[this.categoryIndex]?.name || '其他'
    },
    canSubmit() {
      if (this.isCustomCategory && !this.customCategory) {
        return false
      }
      return this.title.trim() && this.content.trim()
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
    
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
    },
    
    onAnonymousChange(e) {
      this.isAnonymous = e.detail.value
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
    
    submitQuestion() {
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
        uni.hideLoading()
        
        // 创建新问题
        const newQuestion = {
          id: Date.now(),
          category: this.finalCategory,
          categoryName: this.finalCategoryName,
          title: this.title,
          content: this.content,
          images: this.images,
          isAnonymous: this.isAnonymous,
          author: this.isAnonymous ? {
            id: 'anonymous',
            name: '匿名用户',
            avatar: '/static/logo.png',
            title: ''
          } : {
            id: this.userInfo.userId || Date.now(),
            name: this.userInfo.nickName || this.userInfo.username || '用户',
            avatar: this.userInfo.avatarUrl || '/static/logo.png',
            title: '普通用户'
          },
          views: 0,
          answers: 0,
          likes: 0,
          time: '刚刚',
          isTop: false,
          isNew: true,
          status: 'normal'
        }
        
        // 保存到本地存储
        const questions = uni.getStorageSync('allQuestions') || []
        questions.unshift(newQuestion)
        uni.setStorageSync('allQuestions', questions)
        
        // 保存最新提问的ID，用于标记
        uni.setStorageSync('latestQuestionId', newQuestion.id)
        
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        
        // 跳转到问答列表页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/qa/qa'
          })
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style>
.ask-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* 深色模式 */
.ask-container.dark-mode {
  background-color: #1a1a1a;
}

.ask-header {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  padding: 40rpx 30rpx;
  color: #ffffff;
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
}

.ask-header.dark-header {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.ask-title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  text-align: center;
}

.ask-form {
  background-color: #ffffff;
  margin: 0 30rpx;
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.ask-form.dark-form {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.form-item {
  margin-bottom: 40rpx;
  position: relative;
}

.form-label {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  transition: color 0.3s ease;
}

.form-label.dark-label {
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
  color: #666;
}

.custom-category {
  margin-top: 20rpx;
}

.custom-input {
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  border: 1rpx solid #2b5e2b;
  transition: all 0.3s ease;
}

.custom-input.dark-input {
  background-color: #3a3a3a;
  color: #fff;
  border-color: #4CAF50;
}

.form-input {
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s ease;
}

.form-input.dark-input {
  background-color: #3a3a3a;
  color: #fff;
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
  color: #666;
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

.textarea-count {
  position: absolute;
  right: 20rpx;
  bottom: -30rpx;
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.textarea-count.dark-count {
  color: #666;
}

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

.switch-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin-top: 40rpx;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn::after {
  border: none;
}

.submit-btn[disabled] {
  opacity: 0.5;
}

.submit-btn.dark-submit-btn {
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