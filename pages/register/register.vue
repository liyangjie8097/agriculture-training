<template>
  <view class="register-container" :class="{ 'dark-mode': darkMode }">
    <view class="register-box" :class="{ 'dark-box': darkMode }">
      <view class="logo-area">
        <image class="logo" :class="{ 'dark-logo': darkMode }" src="/static/logo.png"></image>
      </view>
      <text class="app-name" :class="{ 'dark-app-name': darkMode }">农业技能培训</text>
      <text class="welcome-text" :class="{ 'dark-welcome': darkMode }">注册新账号</text>
      
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
      
      <!-- 昵称输入 -->
      <input 
        type="text" 
        v-model="nickName" 
        placeholder="请输入昵称" 
        class="input-field" 
        :class="{ 'dark-input': darkMode }"
        placeholder-class="dark-placeholder"
      />
      
      <!-- 密码输入 -->
      <input 
        type="password" 
        v-model="password" 
        placeholder="请输入密码" 
        class="input-field" 
        :class="{ 'dark-input': darkMode }"
        placeholder-class="dark-placeholder"
      />
      
      <!-- 确认密码 -->
      <input 
        type="password" 
        v-model="confirmPassword" 
        placeholder="请确认密码" 
        class="input-field" 
        :class="{ 'dark-input': darkMode }"
        placeholder-class="dark-placeholder"
      />
      
      <button class="register-btn" :class="{ 'dark-btn': darkMode }" @click="handleRegister">注册</button>
      
      <!-- 返回登录链接 -->
      <view class="login-link">
        <text :class="{ 'dark-text-light': darkMode }">已有账号？</text>
        <text class="link" :class="{ 'dark-link': darkMode }" @click="goToLogin">立即登录</text>
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
      nickName: '',
      password: '',
      confirmPassword: ''
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
    
    console.log('注册页面加载成功', options)
    // 如果从登录页带了手机号过来，自动填充
    if (options && options.phone) {
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
  },
  methods: {
    handleRegister() {
      // 验证手机号
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
      
      if (!this.nickName) {
        uni.showToast({
          title: '请输入昵称',
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
      
      if (this.password.length < 6) {
        uni.showToast({
          title: '密码至少6位',
          icon: 'none'
        })
        return
      }
      
      if (this.password !== this.confirmPassword) {
        uni.showToast({
          title: '两次密码不一致',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '注册中...'
      })
      
      // 模拟从本地存储获取已注册用户
      const registeredUsers = uni.getStorageSync('registeredUsers') || []
      
      // 检查手机号是否已被注册
      const userExists = registeredUsers.find(user => user.phone === this.phone)
      
      setTimeout(() => {
        if (userExists) {
          uni.hideLoading()
          uni.showModal({
            title: '提示',
            content: '该手机号已注册，请直接登录',
            success: (res) => {
              if (res.confirm) {
                // 返回登录页
                uni.navigateBack()
              }
            }
          })
          return
        }
        
        // 创建新用户
        const newUser = {
          phone: this.phone,
          nickName: this.nickName,
          password: this.password, // 实际开发中应该加密存储
          userId: 'user_' + new Date().getTime(),
          createTime: new Date().getTime()
        }
        
        // 保存到本地存储
        registeredUsers.push(newUser)
        uni.setStorageSync('registeredUsers', registeredUsers)
        
        uni.hideLoading()
        
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        })
        
        // 延迟返回登录页
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
.register-container {
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
.register-container.dark-mode {
  background: linear-gradient(135deg, #1a2a1a 0%, #0f1a0f 100%);
}

.register-box {
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

.register-box.dark-box {
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

.register-btn {
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

.register-btn::after {
  border: none;
}

.register-btn.dark-btn {
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

.login-link .dark-text-light {
  color: #aaa;
}

.login-link .link {
  color: #2b5e2b;
  margin-left: 10rpx;
  text-decoration: underline;
  transition: color 0.3s ease;
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