<template>
  <view class="forgot-container" :class="{ 'dark-mode': darkMode }">
    <view class="forgot-box" :class="{ 'dark-box': darkMode }">
      <view class="logo-area">
        <image class="logo" :class="{ 'dark-logo': darkMode }" src="/static/logo.png"></image>
      </view>
      <text class="app-name" :class="{ 'dark-app-name': darkMode }">农业技能培训</text>
      <text class="welcome-text" :class="{ 'dark-welcome': darkMode }">重置密码</text>
      
      <!-- 步骤1：输入手机号 -->
      <view v-if="step === 1" class="step-content">
        <input 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号" 
          class="input-field" 
          :class="{ 'dark-input': darkMode }"
          maxlength="11"
          placeholder-class="dark-placeholder"
        />
        <button class="next-btn" :class="{ 'dark-btn': darkMode }" @click="sendVerifyCode">获取验证码</button>
      </view>
      
      <!-- 步骤2：输入验证码和新密码 -->
      <view v-if="step === 2" class="step-content">
        <view class="verify-code-row">
          <input 
            type="number" 
            v-model="verifyCode" 
            placeholder="请输入验证码" 
            class="input-field code-input" 
            :class="{ 'dark-input': darkMode }"
            maxlength="6"
            placeholder-class="dark-placeholder"
          />
          <button class="code-btn" :class="{ 'dark-code-btn': darkMode }" @click="sendVerifyCode" :disabled="codeBtnDisabled">
            {{ codeBtnText }}
          </button>
        </view>
        
        <input 
          type="password" 
          v-model="newPassword" 
          placeholder="请输入新密码" 
          class="input-field" 
          :class="{ 'dark-input': darkMode }"
          placeholder-class="dark-placeholder"
        />
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请确认新密码" 
          class="input-field" 
          :class="{ 'dark-input': darkMode }"
          placeholder-class="dark-placeholder"
        />
        
        <button class="reset-btn" :class="{ 'dark-btn': darkMode }" @click="resetPassword">确认重置</button>
      </view>
      
      <!-- 返回登录链接 -->
      <view class="login-link">
        <text :class="{ 'dark-login-text': darkMode }">想起密码了？</text>
        <text class="link" :class="{ 'dark-link': darkMode }" @click="goToLogin">返回登录</text>
      </view>
      
      <!-- 开发者信息 -->
      <view class="dev-info" :class="{ 'dark-dev': darkMode }">
        <text>开发者：李阳杰</text>
        <text>学号：2227010134</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      step: 1,
      phone: '',
      verifyCode: '',
      newPassword: '',
      confirmPassword: '',
      codeBtnDisabled: false,
      codeBtnText: '获取验证码',
      countdown: 60,
      timer: null
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
    
    console.log('忘记密码页面加载成功', options)
    if (options.phone) {
      this.phone = options.phone
    }
  },
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
    
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    sendVerifyCode() {
      if (!this.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      
      const registeredUsers = uni.getStorageSync('registeredUsers') || []
      const userExists = registeredUsers.find(user => user.phone === this.phone)
      
      if (!userExists) {
        uni.showModal({
          title: '提示',
          content: '该手机号未注册，请先注册',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/register/register?phone=' + this.phone
              })
            }
          }
        })
        return
      }
      
      uni.showLoading({ title: '发送中...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        const mockCode = '123456'
        uni.setStorageSync('resetPasswordCode_' + this.phone, mockCode)
        
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        
        this.step = 2
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
    
    resetPassword() {
      if (!this.verifyCode) {
        uni.showToast({ title: '请输入验证码', icon: 'none' })
        return
      }
      
      if (!this.newPassword) {
        uni.showToast({ title: '请输入新密码', icon: 'none' })
        return
      }
      
      if (this.newPassword.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
      }
      
      if (this.newPassword !== this.confirmPassword) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
      }
      
      const savedCode = uni.getStorageSync('resetPasswordCode_' + this.phone)
      if (savedCode !== this.verifyCode) {
        uni.showToast({ title: '验证码错误', icon: 'none' })
        return
      }
      
      uni.showLoading({ title: '重置中...' })
      
      setTimeout(() => {
        const registeredUsers = uni.getStorageSync('registeredUsers') || []
        const userIndex = registeredUsers.findIndex(user => user.phone === this.phone)
        
        if (userIndex !== -1) {
          registeredUsers[userIndex].password = this.newPassword
          uni.setStorageSync('registeredUsers', registeredUsers)
        }
        
        uni.removeStorageSync('resetPasswordCode_' + this.phone)
        uni.hideLoading()
        
        uni.showToast({ title: '密码重置成功', icon: 'success' })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    },
    
    goToLogin() {
      uni.navigateBack()
    }
  }
}
</script>

<style>
.forgot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.forgot-container.dark-mode {
  background: linear-gradient(135deg, #1a2a1a 0%, #0f1a0f 100%);
}

.forgot-box {
  width: 100%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.forgot-box.dark-box {
  background-color: #2a2a2a;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.3);
}

.logo-area {
  margin-bottom: 30rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  transition: all 0.3s ease;
}

.logo.dark-logo {
  filter: brightness(0.9);
}

.app-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #2b5e2b;
  margin-bottom: 16rpx;
  transition: color 0.3s ease;
}

.app-name.dark-app-name {
  color: #4CAF50;
}

.welcome-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 60rpx;
  transition: color 0.3s ease;
}

.welcome-text.dark-welcome {
  color: #aaa;
}

.step-content {
  width: 100%;
}

.input-field {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 40rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.input-field.dark-input {
  background-color: #3a3a3a;
  border-color: #555;
  color: #fff;
}

.input-field.dark-input::placeholder {
  color: #aaa;
}

.verify-code-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
}

.code-input {
  flex: 1;
  margin-bottom: 0;
  margin-right: 20rpx;
}

.code-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #2b5e2b;
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 40rpx;
  border: none;
  transition: all 0.3s ease;
}

.code-btn.dark-code-btn {
  background-color: #4CAF50;
}

.code-btn[disabled] {
  background-color: #ccc;
}

.dark-mode .code-btn[disabled] {
  background-color: #555;
  color: #999;
}

.next-btn, .reset-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin-top: 20rpx;
  margin-bottom: 30rpx;
  border: none;
  transition: all 0.3s ease;
}

.next-btn::after, .reset-btn::after {
  border: none;
}

.next-btn.dark-btn, .reset-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.login-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 60rpx;
  font-size: 28rpx;
}

.login-link text {
  color: #999;
  transition: color 0.3s ease;
}

.login-link .link {
  color: #2b5e2b;
  margin-left: 10rpx;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.login-link .dark-login-text {
  color: #aaa;
}

.login-link .dark-link {
  color: #4CAF50;
}

.dev-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #ccc;
  margin-top: 20rpx;
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