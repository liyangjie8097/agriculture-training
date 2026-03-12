<template>
  <view class="qa-container" :class="{ 'dark-mode': darkMode }">
    <!-- 搜索栏 -->
    <view class="search-bar" :class="{ 'dark-search': darkMode }" @click="goToSearch">
      <view class="search-box" :class="{ 'dark-search-box': darkMode }">
        <text class="search-icon" :class="{ 'dark-icon': darkMode }">🔍</text>
        <text class="search-placeholder" :class="{ 'dark-placeholder': darkMode }">搜索问题或关键词...</text>
      </view>
    </view>
    
    <!-- 分类标签 -->
    <scroll-view class="category-scroll" :class="{ 'dark-category-scroll': darkMode }" scroll-x show-scrollbar="false">
      <view class="category-list">
        <view 
          class="category-item" 
          :class="{ active: currentCategory === 'all', 'dark-category-item': darkMode, 'dark-active': darkMode && currentCategory === 'all' }"
          @click="switchCategory('all')"
        >
          全部
        </view>
        <view 
          class="category-item" 
          :class="{ active: currentCategory === item.value, 'dark-category-item': darkMode, 'dark-active': darkMode && currentCategory === item.value }"
          v-for="item in categories" 
          :key="item.value"
          @click="switchCategory(item.value)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
    
    <!-- 我的问题快速入口 -->
    <view class="my-questions-bar" :class="{ 'dark-bar': darkMode }" v-if="isLogin && myQuestionsCount > 0" @click="goToMyQuestions">
      <text class="bar-icon" :class="{ 'dark-bar-icon': darkMode }">📋</text>
      <text class="bar-text" :class="{ 'dark-bar-text': darkMode }">我的提问 ({{ myQuestionsCount }})</text>
      <text class="bar-arrow" :class="{ 'dark-bar-arrow': darkMode }">›</text>
    </view>
    
    <!-- 提问按钮 -->
    <view class="ask-btn" :class="{ 'dark-btn': darkMode }" @click="goToAsk">
      <text class="ask-icon">+</text>
      <text class="ask-text">提问</text>
    </view>
    
    <!-- 问题列表 -->
    <scroll-view class="qa-list-scroll" scroll-y @scrolltolower="loadMore">
      <view class="qa-list">
        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading && questions.length === 0">
          <text class="loading-icon" :class="{ 'dark-icon': darkMode }">📚</text>
          <text class="loading-text" :class="{ 'dark-text-light': darkMode }">加载中...</text>
        </view>
        
        <!-- 问题列表 -->
        <view 
          class="qa-card" 
          v-for="question in filteredQuestions" 
          :key="question.id"
          :class="{ 
            'my-question': question.isMine,
            'dark-card': darkMode,
            'dark-my-question': darkMode && question.isMine
          }"
        >
          <!-- 右上角三个点菜单 -->
          <view class="qa-menu" @click.stop="showMenu(question, $event)">
            <text class="menu-dots" :class="{ 'dark-dots': darkMode }">⋮</text>
          </view>
          
          <view class="qa-header" @click="goToQaDetail(question)">
            <view class="qa-tag" :class="{ 'dark-tag': darkMode }" v-if="question.isTop">置顶</view>
            <view class="qa-category" :class="['category-' + (question.category || 'other'), { 'dark-category': darkMode }]">
              {{ getCategoryName(question.category) }}
            </view>
            <view class="qa-badge" :class="{ 'dark-badge': darkMode }" v-if="question.isMine">我的</view>
            <text class="qa-title" :class="{ 'dark-text': darkMode }">{{ question.title }}</text>
          </view>
          
          <!-- 热度标签 -->
          <view class="qa-hot-tag" :class="{ 'dark-hot-tag': darkMode }" v-if="question.hotScore > 80" @click="goToQaDetail(question)">
            🔥 热度 {{ question.hotScore }}
          </view>
          
          <view class="qa-content" :class="{ 'dark-content': darkMode }" @click="goToQaDetail(question)">{{ question.content }}</view>
          
          <view class="qa-footer" @click="goToQaDetail(question)">
            <view class="qa-author">
              <image class="author-avatar" :src="question.author?.avatar || '/static/logo.png'" mode="aspectFill"></image>
              <text class="author-name" :class="{ 'dark-name': darkMode }">{{ question.author?.name || '匿名用户' }}</text>
            </view>
            <view class="qa-stats">
              <text class="stat-item" :class="{ 'dark-stat': darkMode }">👁️ {{ question.view_count || 0 }}</text>
              <text class="stat-item" :class="{ 'dark-stat': darkMode }">💬 {{ question.answer_count || 0 }}</text>
              <text class="stat-item" :class="{ 'dark-stat': darkMode }">👍 {{ question.like_count || 0 }}</text>
            </view>
          </view>
          <view class="qa-time" :class="{ 'dark-time': darkMode }" @click="goToQaDetail(question)">{{ formatTime(question.create_time) }}</view>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <text :class="{ 'dark-load-text': darkMode }">{{ loadingText }}</text>
        </view>
        <view class="no-more" v-if="!hasMore && questions.length > 0">
          <text :class="{ 'dark-no-more': darkMode }">没有更多问题了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 操作菜单弹窗 -->
    <view class="menu-mask" v-if="showMenuPopup" @click="closeMenu"></view>
    <view class="action-menu" :class="{ 'dark-menu': darkMode }" v-if="showMenuPopup" :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }">
      <view class="menu-item" :class="{ 'dark-menu-item': darkMode }" @click="setTopQuestion(selectedQuestion)">
        <text class="menu-icon" :class="{ 'dark-icon': darkMode }">📌</text>
        <text class="menu-text" :class="{ 'dark-text': darkMode }">{{ selectedQuestion?.isTop ? '取消置顶' : '置顶问题' }}</text>
      </view>
      <view class="menu-item" :class="{ 'dark-menu-item': darkMode }" v-if="selectedQuestion?.isMine" @click="deleteQuestion(selectedQuestion)">
        <text class="menu-icon" :class="{ 'dark-icon': darkMode }">🗑️</text>
        <text class="menu-text" :class="{ 'dark-text': darkMode }">删除问题</text>
      </view>
      <view class="menu-item" :class="{ 'dark-menu-item': darkMode }" @click="shareQuestion(selectedQuestion)">
        <text class="menu-icon" :class="{ 'dark-icon': darkMode }">📤</text>
        <text class="menu-text" :class="{ 'dark-text': darkMode }">分享</text>
      </view>
      <view class="menu-item" :class="{ 'dark-menu-item': darkMode }" @click="reportQuestion(selectedQuestion)">
        <text class="menu-icon" :class="{ 'dark-icon': darkMode }">⚠️</text>
        <text class="menu-text" :class="{ 'dark-text': darkMode }">举报</text>
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
// 导入 baseUrl
import baseUrl from '@/config.js'

export default {
  data() {
    return {
      darkMode: false,
      currentCategory: 'all',
      categories: [
        { name: '种植技术', value: 'plant' },
        { name: '养殖技术', value: 'breed' },
        { name: '农机操作', value: 'machine' },
        { name: '病虫害防治', value: 'pest' },
        { name: '农产品加工', value: 'process' },
        { name: '农业电商', value: 'ecommerce' }
      ],
      
      questions: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      loadingText: '加载中...',
      
      isLogin: false,
      userInfo: {},
      myQuestionsCount: 0,
      
      // 菜单相关
      showMenuPopup: false,
      selectedQuestion: null,
      menuPosition: { top: 0, left: 0 }
    }
  },
  
  computed: {
    // 过滤后的问题
    filteredQuestions() {
      if (this.currentCategory === 'all') {
        return this.questions
      }
      return this.questions.filter(q => q.category === this.currentCategory)
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
    this.loadQuestions()
  },
  
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    this.checkLoginStatus()
    this.refreshQuestions()
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
    
    // 刷新问题列表
    refreshQuestions() {
      this.page = 1
      this.hasMore = true
      this.questions = []
      this.loadQuestions()
    },
    
    // 加载问题列表
    async loadQuestions() {
      if (this.loading) return
      
      this.loading = true
      this.loadingText = '加载中...'
      
      try {
        const res = await uni.request({
          url: baseUrl + '/qa',
          method: 'GET'
        })
        
        if (res.data.success) {
          // 处理真实数据
          const allQuestions = res.data.data
          const start = (this.page - 1) * this.pageSize
          const end = this.page * this.pageSize
          const pageQuestions = allQuestions.slice(start, end)
          
          const userId = this.userInfo?.userId
          const markedQuestions = pageQuestions.map(q => ({
            ...q,
            isMine: q.user_id === userId,
            hotScore: this.calculateHotScore(q)
          }))
          
          this.questions = [...this.questions, ...markedQuestions]
          this.hasMore = end < allQuestions.length
          this.page++
          this.myQuestionsCount = allQuestions.filter(q => q.user_id === userId).length
        } else {
          // 如果后端返回失败，使用模拟数据
          this.useMockData()
        }
      } catch (error) {
        console.error('加载问答失败，使用模拟数据', error)
        this.useMockData()
      } finally {
        this.loading = false
      }
    },
    
    // 使用模拟数据
    useMockData() {
      const mockQuestions = [
        {
          id: 1,
          category: 'plant',
          title: '水稻育苗期需要注意什么？',
          content: '我是第一次种水稻，现在正是育苗期，想请教一下育苗期间需要注意哪些问题？比如温度、湿度、病虫害防治等。',
          view_count: 1234,
          like_count: 56,
          answer_count: 8,
          author: { name: '新农人小王', avatar: '/static/logo.png' },
          create_time: '2026-03-10T08:30:00Z',
          hotScore: 92
        },
        {
          id: 2,
          category: 'plant',
          title: '大棚蔬菜冬季管理技巧',
          content: '冬天大棚蔬菜容易受冻，有哪些保温措施？除了加温，还有什么经济实惠的方法？',
          view_count: 987,
          like_count: 43,
          answer_count: 6,
          author: { name: '蔬菜种植户老张', avatar: '/static/logo.png' },
          create_time: '2026-03-09T14:20:00Z',
          hotScore: 88
        },
        {
          id: 3,
          category: 'breed',
          title: '猪舍温度控制的最佳范围是多少？',
          content: '最近天气变化大，猪舍温度不太好控制，想知道不同生长阶段的最佳温度范围。仔猪、育肥猪、母猪分别需要多少度？',
          view_count: 756,
          like_count: 32,
          answer_count: 5,
          author: { name: '养猪专业户', avatar: '/static/logo.png' },
          create_time: '2026-03-08T09:15:00Z',
          hotScore: 85
        },
        {
          id: 4,
          category: 'breed',
          title: '鸡舍通风怎么设计最合理？',
          content: '新建鸡舍，想请教通风系统怎么设计？夏天降温和冬天保温如何平衡？',
          view_count: 623,
          like_count: 28,
          answer_count: 4,
          author: { name: '养鸡大户', avatar: '/static/logo.png' },
          create_time: '2026-03-07T16:45:00Z',
          hotScore: 82
        },
        {
          id: 5,
          category: 'machine',
          title: '拖拉机保养周期是多久？',
          content: '刚买了一台新拖拉机，想知道多久保养一次比较合适，保养项目有哪些？机油、滤芯多久换一次？',
          view_count: 891,
          like_count: 37,
          answer_count: 6,
          author: { name: '农机手老李', avatar: '/static/logo.png' },
          create_time: '2026-03-06T11:30:00Z',
          hotScore: 86
        },
        {
          id: 6,
          category: 'machine',
          title: '收割机常见故障及排除方法',
          content: '收割机作业时经常出现堵塞、跑粮等问题，有没有经验丰富的老师傅分享一下解决方法？',
          view_count: 712,
          like_count: 31,
          answer_count: 5,
          author: { name: '农机维修师', avatar: '/static/logo.png' },
          create_time: '2026-03-05T13:50:00Z',
          hotScore: 83
        },
        {
          id: 7,
          category: 'pest',
          title: '水稻稻瘟病怎么防治最有效？',
          content: '今年水稻稻瘟病比较严重，有什么特效药？预防和治疗的最佳时机是什么时候？',
          view_count: 1345,
          like_count: 67,
          answer_count: 9,
          author: { name: '植保专家', avatar: '/static/logo.png' },
          create_time: '2026-03-04T10:20:00Z',
          hotScore: 95
        },
        {
          id: 8,
          category: 'pest',
          title: '果园红蜘蛛防治方法',
          content: '苹果园红蜘蛛爆发，打了药效果不好，有没有什么好办法？',
          view_count: 567,
          like_count: 24,
          answer_count: 4,
          author: { name: '果农老陈', avatar: '/static/logo.png' },
          create_time: '2026-03-03T15:40:00Z',
          hotScore: 78
        },
        {
          id: 9,
          category: 'process',
          title: '农产品初加工设备怎么选？',
          content: '想搞农产品加工，但不知道选什么设备。主要做粮食烘干、脱壳、包装，有没有性价比高的推荐？',
          view_count: 445,
          like_count: 19,
          answer_count: 3,
          author: { name: '加工户小李', avatar: '/static/logo.png' },
          create_time: '2026-03-02T08:10:00Z',
          hotScore: 74
        },
        {
          id: 10,
          category: 'ecommerce',
          title: '农产品电商怎么起步？',
          content: '想在网上卖自家种的农产品，但不知道怎么开始。需要办什么手续？怎么引流？',
          view_count: 1023,
          like_count: 48,
          answer_count: 7,
          author: { name: '新农人小芳', avatar: '/static/logo.png' },
          create_time: '2026-03-01T19:30:00Z',
          hotScore: 89
        },
        {
          id: 11,
          category: 'plant',
          title: '果树修剪最佳时间',
          content: '家里有几亩苹果树，不知道什么时候修剪最合适？冬剪和夏剪有什么区别？',
          view_count: 678,
          like_count: 29,
          answer_count: 5,
          author: { name: '果农老王', avatar: '/static/logo.png' },
          create_time: '2026-02-28T14:25:00Z',
          hotScore: 81
        },
        {
          id: 12,
          category: 'breed',
          title: '牛羊饲料配比技巧',
          content: '自家养了十几头牛，想知道精饲料和粗饲料的最佳配比，育肥期和繁殖期有什么区别？',
          view_count: 834,
          like_count: 36,
          answer_count: 6,
          author: { name: '养殖专业户', avatar: '/static/logo.png' },
          create_time: '2026-02-27T09:55:00Z',
          hotScore: 84
        }
      ]
      
      // 按热度排序
      this.questions = mockQuestions.sort((a, b) => b.hotScore - a.hotScore)
      this.hasMore = false
      this.myQuestionsCount = 0
    },
    
    // 计算热度分数
    calculateHotScore(question) {
      const views = question.view_count || 0
      const answers = question.answer_count || 0
      const likes = question.like_count || 0
      const timeWeight = this.getTimeWeight(question.create_time)
      
      return Math.round(views * 0.3 + answers * 2 + likes * 1.5 + timeWeight)
    },
    
    // 计算时间权重
    getTimeWeight(timeStr) {
      if (!timeStr) return 10
      
      const createTime = new Date(timeStr).getTime()
      const now = new Date().getTime()
      const hoursDiff = (now - createTime) / (1000 * 60 * 60)
      
      if (hoursDiff < 1) return 50
      if (hoursDiff < 24) return 40
      if (hoursDiff < 48) return 30
      if (hoursDiff < 72) return 20
      return Math.max(10, 30 - Math.floor(hoursDiff / 24) * 2)
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '未知时间'
      
      const date = new Date(timeStr)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return minutes + '分钟前'
      if (hours < 24) return hours + '小时前'
      if (days < 30) return days + '天前'
      
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    
    getCategoryName(value) {
      const category = this.categories.find(c => c.value === value)
      return category ? category.name : value
    },
    
    switchCategory(category) {
      this.currentCategory = category
      this.refreshQuestions()
    },
    
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadQuestions()
      }
    },
    
    // 显示菜单
    showMenu(question, event) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      
      this.selectedQuestion = question
      
      const query = uni.createSelectorQuery().in(this)
      query.select('.qa-menu').boundingClientRect(data => {
        if (data) {
          this.menuPosition = {
            top: data.top + 40,
            left: data.left - 150
          }
        }
      }).exec()
      
      this.showMenuPopup = true
    },
    
    closeMenu() {
      this.showMenuPopup = false
      this.selectedQuestion = null
    },
    
    setTopQuestion(question) {
      uni.showToast({
        title: question.isTop ? '已取消置顶' : '已置顶',
        icon: 'none'
      })
      this.closeMenu()
    },
    
    deleteQuestion(question) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这个问题吗？',
        success: (res) => {
          if (res.confirm) {
            this.questions = this.questions.filter(q => q.id !== question.id)
            uni.showToast({
              title: '已删除',
              icon: 'success'
            })
            this.closeMenu()
          }
        }
      })
    },
    
    shareQuestion(question) {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
      this.closeMenu()
    },
    
    reportQuestion(question) {
      uni.showToast({
        title: '举报功能开发中',
        icon: 'none'
      })
      this.closeMenu()
    },
    
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search?type=qa'
      })
    },
    
    goToAsk() {
      if (!this.isLogin) {
        uni.showModal({
          title: '提示',
          content: '请先登录后再提问',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
        return
      }
      uni.navigateTo({
        url: '/pages/ask/ask'
      })
    },
    
    goToQaDetail(question) {
      uni.navigateTo({
        url: '/pages/qa-detail/qa-detail?id=' + question.id
      })
    },
    
    goToMyQuestions() {
      uni.navigateTo({
        url: '/pages/my-questions/my-questions'
      })
    },
    
    showLoginTip() {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.qa-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* 深色模式 */
.qa-container.dark-mode {
  background-color: #1a1a1a;
}

/* 搜索栏 */
.search-bar {
  padding: 20rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  transition: all 0.3s ease;
}

.search-bar.dark-search {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.search-box {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.3s ease;
}

.search-box.dark-search-box {
  background-color: #2a2a2a;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #999;
  transition: color 0.3s ease;
}

.search-icon.dark-icon {
  color: #aaa;
}

.search-placeholder {
  font-size: 28rpx;
  color: #999;
  flex: 1;
  transition: color 0.3s ease;
}

.search-placeholder.dark-placeholder {
  color: #666;
}

/* 分类导航 */
.category-scroll {
  height: 90rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eee;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.category-scroll.dark-category-scroll {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.category-list {
  display: flex;
  flex-direction: row;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.category-item.dark-category-item {
  color: #aaa;
}

.category-item.active {
  color: #2b5e2b;
  font-weight: bold;
}

.category-item.dark-active {
  color: #4CAF50;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background-color: #2b5e2b;
  border-radius: 2rpx;
}

.category-item.dark-active::after {
  background-color: #4CAF50;
}

/* 我的问题快速入口 */
.my-questions-bar {
  background-color: #e8f5e8;
  margin: 20rpx;
  padding: 20rpx 30rpx;
  border-radius: 50rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1rpx solid #2b5e2b;
  transition: all 0.3s ease;
}

.my-questions-bar.dark-bar {
  background-color: #1e3a1e;
  border-color: #4CAF50;
}

.bar-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
  transition: color 0.3s ease;
}

.bar-icon.dark-bar-icon {
  color: #aaa;
}

.bar-text {
  flex: 1;
  font-size: 28rpx;
  color: #2b5e2b;
  font-weight: 500;
  transition: color 0.3s ease;
}

.bar-text.dark-bar-text {
  color: #4CAF50;
}

.bar-arrow {
  font-size: 40rpx;
  color: #2b5e2b;
  transition: color 0.3s ease;
}

.bar-arrow.dark-bar-arrow {
  color: #4CAF50;
}

/* 提问按钮 */
.ask-btn {
  position: fixed;
  bottom: 100rpx;
  right: 30rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  border-radius: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
  z-index: 100;
  transition: all 0.3s ease;
}

.ask-btn.dark-btn {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.ask-icon {
  font-size: 48rpx;
  color: #ffffff;
  line-height: 1;
  margin-bottom: 4rpx;
}

.ask-text {
  font-size: 24rpx;
  color: #ffffff;
}

/* 问题列表 */
.qa-list-scroll {
  flex: 1;
  height: calc(100vh - 180rpx);
}

.qa-list {
  padding: 20rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.loading-icon.dark-icon {
  opacity: 0.3;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  transition: color 0.3s ease;
}

.loading-text.dark-text-light {
  color: #666;
}

.qa-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.qa-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.qa-card.my-question {
  border-left: 8rpx solid #2b5e2b;
}

.qa-card.dark-my-question {
  border-left-color: #4CAF50;
}

/* 三个点菜单 */
.qa-menu {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.menu-dots {
  font-size: 40rpx;
  color: #999;
  transform: rotate(90deg);
  transition: color 0.3s ease;
}

.menu-dots.dark-dots {
  color: #aaa;
}

.qa-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15rpx;
  flex-wrap: wrap;
  padding-right: 50rpx;
}

.qa-tag {
  padding: 4rpx 15rpx;
  background-color: #f5a623;
  color: #ffffff;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  transition: all 0.3s ease;
}

.qa-tag.dark-tag {
  filter: brightness(0.9);
}

.qa-category {
  padding: 4rpx 15rpx;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  transition: all 0.3s ease;
}

.qa-category.dark-category {
  filter: brightness(0.9);
}

.category-plant {
  background-color: #e8f5e8;
  color: #2b5e2b;
}

.dark-mode .category-plant {
  background-color: #1e3a1e;
  color: #4CAF50;
}

.category-breed {
  background-color: #fff3e0;
  color: #FF9800;
}

.dark-mode .category-breed {
  background-color: #664d00;
  color: #ffb74d;
}

.category-machine {
  background-color: #e3f2fd;
  color: #2196F3;
}

.dark-mode .category-machine {
  background-color: #0d2b4d;
  color: #64b5f6;
}

.category-pest {
  background-color: #ffebee;
  color: #F44336;
}

.dark-mode .category-pest {
  background-color: #661e1e;
  color: #e57373;
}

.category-process {
  background-color: #f3e5f5;
  color: #9C27B0;
}

.dark-mode .category-process {
  background-color: #3d1e4b;
  color: #ba68c8;
}

.category-ecommerce {
  background-color: #fce4ec;
  color: #E91E63;
}

.dark-mode .category-ecommerce {
  background-color: #4a1e3a;
  color: #f06292;
}

.category-other {
  background-color: #f0f0f0;
  color: #666;
}

.dark-mode .category-other {
  background-color: #3a3a3a;
  color: #aaa;
}

.qa-badge {
  padding: 4rpx 15rpx;
  background-color: #2b5e2b;
  color: #ffffff;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  transition: all 0.3s ease;
}

.qa-badge.dark-badge {
  background-color: #4CAF50;
}

.qa-hot-tag {
  display: inline-block;
  padding: 4rpx 15rpx;
  background-color: #fff3e0;
  color: #f5a623;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-bottom: 10rpx;
  transition: all 0.3s ease;
}

.qa-hot-tag.dark-hot-tag {
  background-color: #664d00;
  color: #ffb74d;
}

.qa-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.qa-title.dark-text {
  color: #fff;
}

.qa-content {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.qa-content.dark-content {
  color: #aaa;
}

.qa-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.qa-author {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.author-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  margin-right: 10rpx;
}

.author-name {
  font-size: 26rpx;
  color: #333;
  transition: color 0.3s ease;
}

.author-name.dark-name {
  color: #fff;
}

.qa-stats {
  display: flex;
  flex-direction: row;
}

.stat-item {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
  transition: color 0.3s ease;
}

.stat-item.dark-stat {
  color: #aaa;
}

.qa-time {
  position: absolute;
  top: 30rpx;
  right: 80rpx;
  font-size: 22rpx;
  color: #ccc;
  transition: color 0.3s ease;
}

.qa-time.dark-time {
  color: #666;
}

/* 操作菜单 */
.menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.action-menu {
  position: fixed;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 15rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  z-index: 1001;
  min-width: 200rpx;
  transition: all 0.3s ease;
}

.action-menu.dark-menu {
  background-color: #2a2a2a;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.4);
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 30rpx;
  transition: all 0.3s ease;
}

.menu-item.dark-menu-item {
  background-color: #2a2a2a;
}

.menu-item:active {
  background-color: #f5f5f5;
}

.menu-item.dark-menu-item:active {
  background-color: #3a3a3a;
}

.menu-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
  width: 40rpx;
  text-align: center;
  transition: color 0.3s ease;
}

.menu-icon.dark-icon {
  color: #aaa;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
  transition: color 0.3s ease;
}

.menu-text.dark-text {
  color: #fff;
}

.load-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.load-more.dark-load-text,
.no-more.dark-no-more {
  color: #666;
}

.dev-info {
  text-align: center;
  padding: 10rpx;
  font-size: 20rpx;
  color: #ccc;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
  background-color: #2a2a2a;
}
</style>