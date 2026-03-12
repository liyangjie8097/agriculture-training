<template>
  <view class="favorites-container" :class="{ 'dark-mode': darkMode }">
    <view class="header" :class="{ 'dark-header': darkMode }">
      <text class="title">我的收藏</text>
      <text class="subtitle">共 {{ favoritesList.length }} 门课程</text>
    </view>
    
    <!-- 收藏列表 -->
    <view class="favorites-list" v-if="favoritesList.length > 0">
      <view 
        class="favorite-card" 
        :class="{ 'dark-card': darkMode }"
        v-for="course in favoritesList" 
        :key="course.id"
        @click="goToCourseDetail(course.id)"
      >
        <image class="course-image" :src="course.image" mode="aspectFill"></image>
        <view class="course-info">
          <text class="course-title" :class="{ 'dark-text': darkMode }">{{ course.title }}</text>
          <text class="course-desc" :class="{ 'dark-desc': darkMode }">{{ course.desc }}</text>
          <view class="course-meta">
            <text class="course-teacher" :class="{ 'dark-meta': darkMode }">👨‍🏫 {{ course.teacher }}</text>
            <text class="course-student" :class="{ 'dark-meta': darkMode }">👥 {{ course.studentCount }}人</text>
          </view>
        </view>
        <!-- 取消收藏按钮 -->
        <view class="remove-btn" :class="{ 'dark-remove-btn': darkMode }" @click.stop="removeFavorite(course.id)">
          <text class="remove-icon" :class="{ 'dark-remove-icon': darkMode }">✕</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon" :class="{ 'dark-empty-icon': darkMode }">❤️</text>
      <text class="empty-text" :class="{ 'dark-text': darkMode }">暂无收藏课程</text>
      <text class="empty-desc" :class="{ 'dark-desc': darkMode }">快去收藏你感兴趣的课程吧</text>
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
      favoritesList: [],
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
    
    console.log('收藏页面显示')
    this.checkLoginStatus()
    this.loadAllCourses()
    this.loadFavorites()
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
      console.log('当前用户:', userInfo)
    },
    
    loadAllCourses() {
      // 尝试从首页获取课程数据
      const pages = getCurrentPages()
      const indexPage = pages.find(p => p.route === 'pages/index/index')
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || []
        console.log('从首页加载课程数据:', this.allCourses.length)
      } else {
        // 默认数据
        this.allCourses = [
          {
            id: 1,
            title: '水稻高产种植技术',
            desc: '从选种到收割，全方位讲解水稻种植技巧',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=水稻种植',
            studentCount: 1234,
            teacher: '王教授'
          },
          {
            id: 2,
            title: '大棚蔬菜种植技术',
            desc: '大棚蔬菜全年种植管理指南',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=大棚蔬菜',
            studentCount: 892,
            teacher: '李老师'
          },
          {
            id: 3,
            title: '生猪科学养殖技术',
            desc: '现代化生猪养殖全流程',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=生猪养殖',
            studentCount: 1567,
            teacher: '张教授'
          },
          {
            id: 4,
            title: '家禽生态养殖技术',
            desc: '鸡鸭鹅生态养殖方法',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=家禽养殖',
            studentCount: 678,
            teacher: '赵老师'
          },
          {
            id: 5,
            title: '拖拉机操作与维护',
            desc: '拖拉机使用技巧和日常保养',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=拖拉机',
            studentCount: 2345,
            teacher: '刘师傅'
          },
          {
            id: 6,
            title: '收割机使用指南',
            desc: '联合收割机操作技巧',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=收割机',
            studentCount: 1123,
            teacher: '陈师傅'
          },
          {
            id: 7,
            title: '常见病虫害识别与防治',
            desc: '图文并茂讲解30种常见病虫害',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=病虫害',
            studentCount: 1890,
            teacher: '周教授'
          },
          {
            id: 8,
            title: '农产品初加工技术',
            desc: '粮食、果蔬的初加工方法',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=农产品加工',
            studentCount: 567,
            teacher: '吴老师'
          },
          {
            id: 9,
            title: '农产品电商运营',
            desc: '从开店到爆款打造',
            image: 'https://via.placeholder.com/200x150/2b5e2b/ffffff?text=农业电商',
            studentCount: 2341,
            teacher: '郑老师'
          }
        ]
        console.log('使用默认课程数据:', this.allCourses.length)
      }
    },
    
    loadFavorites() {
      // 获取收藏列表
      const favorites = uni.getStorageSync('favorites') || {}
      const userId = this.userInfo.userId
      
      if (!userId) {
        console.error('用户ID不存在')
        return
      }
      
      const userFavorites = favorites[userId] || []
      
      console.log('用户收藏ID列表:', userFavorites)
      console.log('所有课程数据:', this.allCourses.map(c => ({ id: c.id, title: c.title })))
      
      // 确保课程ID是数字类型进行比较
      const favoriteIds = userFavorites.map(id => parseInt(id))
      
      // 过滤出收藏的课程
      this.favoritesList = this.allCourses.filter(course => {
        const courseId = parseInt(course.id)
        return favoriteIds.includes(courseId)
      })
      
      console.log('过滤后的收藏课程:', this.favoritesList.map(c => ({ id: c.id, title: c.title })))
    },
    
    removeFavorite(courseId) {
      uni.showModal({
        title: '提示',
        content: '确定取消收藏吗？',
        success: (res) => {
          if (res.confirm) {
            const favorites = uni.getStorageSync('favorites') || {}
            const userId = this.userInfo.userId
            
            if (favorites[userId]) {
              // 确保课程ID是数字类型
              const courseIdNum = parseInt(courseId)
              favorites[userId] = favorites[userId].filter(id => parseInt(id) != courseIdNum)
              uni.setStorageSync('favorites', favorites)
              
              // 更新列表
              this.favoritesList = this.favoritesList.filter(c => parseInt(c.id) != courseIdNum)
              
              uni.showToast({
                title: '已取消收藏',
                icon: 'none'
              })
              
              console.log('取消收藏后列表:', favorites[userId])
            }
          }
        }
      })
    },
    
    goToCourseDetail(courseId) {
      uni.navigateTo({
        url: '/pages/course-detail/course-detail?id=' + courseId
      })
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
.favorites-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.favorites-container.dark-mode {
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

.favorites-list {
  padding: 0 30rpx;
}

.favorite-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.favorite-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.course-image {
  width: 180rpx;
  height: 140rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 50rpx;
}

.course-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  lines: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.course-title.dark-text {
  color: #fff;
}

.course-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.course-desc.dark-desc {
  color: #aaa;
}

.course-meta {
  display: flex;
  flex-direction: row;
  font-size: 22rpx;
  color: #666;
  transition: color 0.3s ease;
}

.course-meta.dark-meta {
  color: #aaa;
}

.course-teacher {
  margin-right: 20rpx;
}

.remove-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #f0f0f0;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn.dark-remove-btn {
  background-color: #3a3a3a;
}

.remove-icon {
  font-size: 28rpx;
  color: #999;
  transition: color 0.3s ease;
}

.remove-icon.dark-remove-icon {
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