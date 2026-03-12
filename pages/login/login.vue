<template>
  <view class="login-container" :class="{ 'dark-mode': darkMode }">
    <view class="login-box" :class="{ 'dark-box': darkMode }">
      <view class="logo-area">
        <image class="logo" :class="{ 'dark-logo': darkMode }" src="/static/logo.png"></image>
      </view>
      <text class="app-name" :class="{ 'dark-app-name': darkMode }">农业技能培训</text>
      <text class="welcome-text" :class="{ 'dark-welcome': darkMode }">欢迎回来</text>
      
      <!-- 手机号输入 -->
      <input 
        type="number" 
        v-model="phone" 
        placeholder="请输入手机号" 
        class="input-field" 
        :class="{ 'dark-input': darkMode }"
        maxlength="11"
        placeholder-class="dark-placeholder"
      />
      <input 
        type="password" 
        v-model="password" 
        placeholder="请输入密码" 
        class="input-field" 
        :class="{ 'dark-input': darkMode }"
        placeholder-class="dark-placeholder"
      />
      
      <button class="login-btn" :class="{ 'dark-btn': darkMode }" @click="handleLogin">登录</button>
      
      <!-- 忘记密码和注册链接 -->
      <view class="action-links">
        <text class="link" :class="{ 'dark-link': darkMode }" @click="goToForgotPassword">忘记密码？</text>
        <view class="register-link">
          <text :class="{ 'dark-text': darkMode }">还没有账号？</text>
          <text class="link" :class="{ 'dark-link': darkMode }" @click="goToRegister">立即注册</text>
        </view>
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
      phone: '',
      password: ''
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
    
    console.log('登录页面加载成功')
    // 检查是否已登录
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
      const token = uni.getStorageSync('token')
      if (token) {
        // 已登录，跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    
    handleLogin() {
      // 验证手机号
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号格式（简单验证）
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
      
      if (!this.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '登录中...'
      })
      
      // 模拟从本地存储获取已注册用户
      const registeredUsers = uni.getStorageSync('registeredUsers') || []
      
      // 查找手机号是否已注册
      const userExists = registeredUsers.find(user => user.phone === this.phone)
      
      setTimeout(() => {
        if (!userExists) {
          // 账号未注册
          uni.hideLoading()
          uni.showModal({
            title: '提示',
            content: '账号未注册请先前往注册',
            success: (res) => {
              if (res.confirm) {
                // 点击确定后跳转到注册页面
                uni.navigateTo({
                  url: '/pages/register/register?phone=' + this.phone
                })
              }
            }
          })
          return
        }
        
        // 验证密码（简单模拟，实际应该比对加密后的密码）
        if (userExists.password !== this.password) {
          uni.hideLoading()
          uni.showToast({
            title: '密码错误',
            icon: 'none'
          })
          return
        }
        
        // 登录成功
        const mockToken = 'mock_token_' + new Date().getTime()
        const mockUserInfo = {
          phone: this.phone,
          nickName: userExists.nickName || this.phone,
          userId: userExists.userId || '10001',
          avatarUrl: ''
        }
        
        uni.setStorageSync('token', mockToken)
        uni.setStorageSync('userInfo', mockUserInfo)
        
        uni.hideLoading()
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 1000)
    },
    
    goToRegister() {
      console.log('跳转到注册页面，手机号：', this.phone)
      uni.navigateTo({
        url: '/pages/register/register?phone=' + this.phone,
        success: (res) => {
          console.log('跳转注册页面成功', res)
        },
        fail: (err) => {
          console.log('跳转注册页面失败', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    },
    
    goToForgotPassword() {
      console.log('跳转到忘记密码页面')
      uni.navigateTo({
        url: '/pages/forgot/forgot?phone=' + this.phone,
        success: (res) => {
          console.log('跳转忘记密码页面成功', res)
        },
        fail: (err) => {
          console.log('跳转忘记密码页面失败', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style>
.login-container {
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
.login-container.dark-mode {
  background: linear-gradient(135deg, #1a2a1a 0%, #0f1a0f 100%);
}

.login-box {
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

.login-box.dark-box {
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

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  border: none;
  transition: all 0.3s ease;
}

.login-btn::after {
  border: none;
}

.login-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.action-links {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60rpx;
  font-size: 28rpx;
}

.action-links text {
  color: #999;
  transition: color 0.3s ease;
}

.action-links .dark-text {
  color: #aaa;
}

.action-links .link {
  color: #2b5e2b;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.action-links .dark-link {
  color: #4CAF50;
}

.register-link {
  display: flex;
  flex-direction: row;
}

.register-link text {
  color: #999;
}

.register-link .link {
  color: #2b5e2b;
  margin-left: 10rpx;
  text-decoration: underline;
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