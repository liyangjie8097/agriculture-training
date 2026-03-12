<template>
  <view class="profile-container" :class="{ 'dark-mode': darkMode }">
    <view class="header" :class="{ 'dark-header': darkMode }">
      <text class="title">个人资料</text>
    </view>
    
    <!-- 头像上传 -->
    <view class="avatar-section" :class="{ 'dark-section': darkMode }" @click="changeAvatar">
      <image class="avatar" :class="{ 'dark-avatar': darkMode }" :src="userInfo.avatarUrl || '/static/logo.png'" mode="aspectFill"></image>
      <view class="avatar-edit" :class="{ 'dark-edit': darkMode }">
        <text class="edit-icon" :class="{ 'dark-icon': darkMode }">📷</text>
        <text class="edit-text" :class="{ 'dark-text': darkMode }">点击更换头像</text>
      </view>
    </view>
    
    <!-- 资料表单 -->
    <view class="form-section" :class="{ 'dark-section': darkMode }">
      <!-- 昵称 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">👤</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">昵称</text>
        </view>
        <input 
          class="form-input" 
          :class="{ 'dark-input': darkMode }"
          v-model="formData.nickName" 
          placeholder="请输入昵称"
          maxlength="20"
          placeholder-class="dark-placeholder"
        />
        <text class="input-count" :class="{ 'dark-count': darkMode }">{{ formData.nickName.length }}/20</text>
      </view>
      
      <!-- 手机号 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">📱</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">手机号</text>
        </view>
        <view class="phone-input">
          <input 
            class="form-input phone-field" 
            :class="{ 'dark-input': darkMode, 'dark-disabled': darkMode && !!userInfo.phone }"
            v-model="formData.phone" 
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            :disabled="!!userInfo.phone"
            placeholder-class="dark-placeholder"
          />
          <button 
            class="verify-btn" 
            :class="{ 'dark-btn': darkMode }"
            v-if="!userInfo.phone" 
            @click="sendVerifyCode"
            :disabled="codeBtnDisabled"
          >
            {{ codeBtnText }}
          </button>
        </view>
        <text class="input-tip" :class="{ 'dark-tip': darkMode }" v-if="!userInfo.phone">绑定手机号后可接收重要通知</text>
      </view>
      
      <!-- 验证码（新手机号时需要） -->
      <view class="form-item" v-if="showVerifyCode">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">🔑</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">验证码</text>
        </view>
        <input 
          class="form-input" 
          :class="{ 'dark-input': darkMode }"
          v-model="formData.verifyCode" 
          placeholder="请输入验证码"
          type="number"
          maxlength="6"
          placeholder-class="dark-placeholder"
        />
      </view>
      
      <!-- 性别 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">⚥</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">性别</text>
        </view>
        <view class="radio-group" :class="{ 'dark-radio-group': darkMode }">
          <view 
            class="radio-item" 
            :class="{ active: formData.gender === 1, 'dark-radio': darkMode, 'dark-active': darkMode && formData.gender === 1 }"
            @click="formData.gender = 1"
          >
            <text class="radio-icon" :class="{ 'dark-radio-icon': darkMode }">♂️</text>
            <text class="radio-text" :class="{ 'dark-radio-text': darkMode }">男</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: formData.gender === 2, 'dark-radio': darkMode, 'dark-active': darkMode && formData.gender === 2 }"
            @click="formData.gender = 2"
          >
            <text class="radio-icon" :class="{ 'dark-radio-icon': darkMode }">♀️</text>
            <text class="radio-text" :class="{ 'dark-radio-text': darkMode }">女</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ active: formData.gender === 0, 'dark-radio': darkMode, 'dark-active': darkMode && formData.gender === 0 }"
            @click="formData.gender = 0"
          >
            <text class="radio-icon" :class="{ 'dark-radio-icon': darkMode }">⚪</text>
            <text class="radio-text" :class="{ 'dark-radio-text': darkMode }">保密</text>
          </view>
        </view>
      </view>
      
      <!-- 生日 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">🎂</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">生日</text>
        </view>
        <picker mode="date" :value="formData.birthday" @change="onBirthdayChange">
          <view class="picker" :class="{ 'dark-picker': darkMode }">
            {{ formData.birthday || '请选择生日' }}
            <text class="picker-arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 地区 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">📍</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">地区</text>
        </view>
        <picker mode="region" :value="formData.region" @change="onRegionChange">
          <view class="picker" :class="{ 'dark-picker': darkMode }">
            {{ formData.region.join(' ') || '请选择地区' }}
            <text class="picker-arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 职业 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">💼</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">职业</text>
        </view>
        <picker @change="onJobChange" :value="jobIndex" :range="jobOptions">
          <view class="picker" :class="{ 'dark-picker': darkMode }">
            {{ jobOptions[jobIndex] }}
            <text class="picker-arrow" :class="{ 'dark-arrow': darkMode }">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 个人简介 -->
      <view class="form-item">
        <view class="form-label">
          <text class="label-icon" :class="{ 'dark-icon': darkMode }">📝</text>
          <text class="label-text" :class="{ 'dark-label': darkMode }">个人简介</text>
        </view>
        <textarea 
          class="form-textarea" 
          :class="{ 'dark-textarea': darkMode }"
          v-model="formData.bio" 
          placeholder="介绍一下自己吧..."
          maxlength="100"
          placeholder-class="dark-placeholder"
        />
        <text class="textarea-count" :class="{ 'dark-count': darkMode }">{{ formData.bio.length }}/100</text>
      </view>
    </view>
    
    <!-- 保存按钮 -->
    <button class="save-btn" :class="{ 'dark-btn': darkMode }" @click="saveProfile" :disabled="!hasChanges">
      保存修改
    </button>
    
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
      userInfo: {},
      formData: {
        nickName: '',
        phone: '',
        verifyCode: '',
        gender: 0,
        birthday: '',
        region: ['', '', ''],
        job: '',
        bio: ''
      },
      originalData: {}, // 用于检测是否修改
      jobOptions: ['请选择职业', '农民', '养殖户', '农机手', '农技员', '农业专家', '学生', '其他'],
      jobIndex: 0,
      
      // 验证码相关
      showVerifyCode: false,
      codeBtnDisabled: false,
      codeBtnText: '获取验证码',
      countdown: 60,
      timer: null
    }
  },
  computed: {
    hasChanges() {
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData)
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
    this.loadUserData()
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
    
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      const userInfo = uni.getStorageSync('userInfo')
      if (!token || !userInfo) {
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
    
    loadUserData() {
      // 从本地存储加载用户数据
      const userProfiles = uni.getStorageSync('userProfiles') || {}
      const userProfile = userProfiles[this.userInfo.userId] || {}
      
      // 初始化表单数据
      this.formData = {
        nickName: this.userInfo.nickName || this.userInfo.username || '',
        phone: this.userInfo.phone || '',
        verifyCode: '',
        gender: userProfile.gender || 0,
        birthday: userProfile.birthday || '',
        region: userProfile.region || ['', '', ''],
        job: userProfile.job || '',
        bio: userProfile.bio || ''
      }
      
      // 设置职业索引
      if (this.formData.job) {
        const index = this.jobOptions.findIndex(j => j === this.formData.job)
        this.jobIndex = index >= 0 ? index : 0
      }
      
      // 保存原始数据用于对比
      this.originalData = JSON.parse(JSON.stringify(this.formData))
    },
    
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFile = res.tempFilePaths[0]
          
          // 模拟上传头像
          uni.showLoading({
            title: '上传中...'
          })
          
          setTimeout(() => {
            uni.hideLoading()
            
            // 更新本地头像
            this.userInfo.avatarUrl = tempFile
            this.formData.avatarUrl = tempFile
            
            // 保存到本地存储
            uni.setStorageSync('userInfo', this.userInfo)
            
            uni.showToast({
              title: '头像已更新',
              icon: 'success'
            })
          }, 1000)
        }
      })
    },
    
    sendVerifyCode() {
      if (!this.formData.phone || !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '发送中...'
      })
      
      setTimeout(() => {
        uni.hideLoading()
        
        // 模拟发送验证码
        const mockCode = '123456'
        uni.setStorageSync('verifyCode_' + this.formData.phone, mockCode)
        
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
        
        this.showVerifyCode = true
        this.startCountdown()
      }, 1000)
    },
    
    startCountdown() {
      this.codeBtnDisabled = true
      this.countdown = 60
      this.codeBtnText = '60秒后重发'
      
      this.timer = setInterval(() => {
        this.countdown--
        this.codeBtnText = this.countdown + '秒后重发'
        
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          this.codeBtnDisabled = false
          this.codeBtnText = '重新获取'
        }
      }, 1000)
    },
    
    onBirthdayChange(e) {
      this.formData.birthday = e.detail.value
    },
    
    onRegionChange(e) {
      this.formData.region = e.detail.value
    },
    
    onJobChange(e) {
      this.jobIndex = e.detail.value
      this.formData.job = this.jobOptions[this.jobIndex]
    },
    
    saveProfile() {
      // 验证手机号
      if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
      
      // 验证验证码
      if (this.showVerifyCode) {
        const savedCode = uni.getStorageSync('verifyCode_' + this.formData.phone)
        if (savedCode !== this.formData.verifyCode) {
          uni.showToast({
            title: '验证码错误',
            icon: 'none'
          })
          return
        }
      }
      
      uni.showLoading({
        title: '保存中...'
      })
      
      setTimeout(() => {
        // 更新用户信息
        this.userInfo.nickName = this.formData.nickName
        this.userInfo.phone = this.formData.phone
        uni.setStorageSync('userInfo', this.userInfo)
        
        // 保存个人资料
        const userProfiles = uni.getStorageSync('userProfiles') || {}
        userProfiles[this.userInfo.userId] = {
          gender: this.formData.gender,
          birthday: this.formData.birthday,
          region: this.formData.region,
          job: this.formData.job,
          bio: this.formData.bio
        }
        uni.setStorageSync('userProfiles', userProfiles)
        
        // 清除验证码
        if (this.showVerifyCode) {
          uni.removeStorageSync('verifyCode_' + this.formData.phone)
        }
        
        uni.hideLoading()
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        
        // 更新原始数据
        this.originalData = JSON.parse(JSON.stringify(this.formData))
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.profile-container.dark-mode {
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
  text-align: center;
}

/* 头像区域 */
.avatar-section {
  background-color: #ffffff;
  margin: 0 30rpx 30rpx;
  padding: 40rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.avatar-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  margin-bottom: 20rpx;
  border: 4rpx solid #2b5e2b;
  transition: all 0.3s ease;
}

.avatar.dark-avatar {
  border-color: #4CAF50;
}

.avatar-edit {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10rpx 30rpx;
  background-color: #f0f0f0;
  border-radius: 40rpx;
  transition: all 0.3s ease;
}

.avatar-edit.dark-edit {
  background-color: #3a3a3a;
}

.edit-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.edit-icon.dark-icon {
  color: #aaa;
}

.edit-text {
  font-size: 28rpx;
  color: #666;
  transition: color 0.3s ease;
}

.edit-text.dark-text {
  color: #aaa;
}

/* 表单区域 */
.form-section {
  background-color: #ffffff;
  margin: 0 30rpx 30rpx;
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
  transition: color 0.3s ease;
}

.label-icon.dark-icon {
  color: #aaa;
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

.form-input[disabled] {
  background-color: #f0f0f0;
  color: #999;
}

.form-input.dark-input[disabled] {
  background-color: #3a3a3a;
  color: #666;
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

.input-tip {
  position: absolute;
  left: 80rpx;
  bottom: -30rpx;
  font-size: 22rpx;
  color: #f5a623;
  transition: color 0.3s ease;
}

.input-tip.dark-tip {
  color: #ffb74d;
}

.phone-input {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.phone-field {
  flex: 1;
  margin-right: 20rpx;
}

.verify-btn {
  width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 35rpx;
  border: none;
  transition: all 0.3s ease;
}

.verify-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.verify-btn[disabled] {
  background-color: #ccc;
  color: #999;
}

.dark-mode .verify-btn[disabled] {
  background-color: #3a3a3a;
  color: #666;
}

.verify-btn::after {
  border: none;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  padding: 10rpx;
  transition: all 0.3s ease;
}

.radio-group.dark-radio-group {
  background-color: #3a3a3a;
}

.radio-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15rpx 0;
  border-radius: 30rpx;
  transition: all 0.3s;
}

.radio-item.dark-radio {
  color: #aaa;
}

.radio-item.active {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
}

.radio-item.dark-active {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.radio-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
  transition: color 0.3s ease;
}

.radio-icon.dark-radio-icon {
  color: #aaa;
}

.radio-text {
  font-size: 26rpx;
  transition: color 0.3s ease;
}

.radio-text.dark-radio-text {
  color: #aaa;
}

.radio-item.active .radio-icon,
.radio-item.active .radio-text {
  color: #ffffff;
}

.radio-item.dark-active .radio-icon,
.radio-item.dark-active .radio-text {
  color: #fff;
}

/* 选择器 */
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

/* 文本域 */
.form-textarea {
  height: 160rpx;
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

/* 保存按钮 */
.save-btn {
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

.save-btn::after {
  border: none;
}

.save-btn[disabled] {
  opacity: 0.5;
}

.save-btn.dark-btn {
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

/* 占位符样式 */
.dark-placeholder {
  color: #aaa !important;
}
</style>