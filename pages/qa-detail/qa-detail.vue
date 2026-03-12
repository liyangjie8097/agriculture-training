<template>
  <view class="qa-detail-container" :class="{ 'dark-mode': darkMode }">
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text :class="{ 'dark-loading-text': darkMode }">加载中...</text>
    </view>
    
    <scroll-view class="content-scroll" scroll-y v-else>
      <!-- 问题详情 -->
      <view class="question-section" :class="{ 'dark-section': darkMode }">
        <view class="question-header">
          <view class="question-tag" :class="{ 'dark-tag': darkMode }" v-if="question.isTop">置顶</view>
          <view class="question-category" :class="['category-' + (question.category || 'other'), { 'dark-category': darkMode }]">
            {{ getCategoryName(question.category) }}
          </view>
          <text class="question-title" :class="{ 'dark-text': darkMode }">{{ question.title }}</text>
        </view>
        
        <view class="question-content" :class="{ 'dark-content': darkMode }">{{ question.content }}</view>
        
        <!-- 问题图片 -->
        <view class="question-images" v-if="question.images && question.images.length > 0">
          <image 
            class="question-image" 
            v-for="(img, index) in question.images" 
            :key="index"
            :src="img" 
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </view>
        
        <view class="question-footer" :class="{ 'dark-footer': darkMode }">
          <view class="question-author">
            <image class="author-avatar" :src="question.author.avatar" mode="aspectFill"></image>
            <view class="author-info">
              <text class="author-name" :class="{ 'dark-text': darkMode }">{{ question.author.name }}</text>
              <text class="author-title" :class="{ 'dark-title': darkMode }">{{ question.author.title }}</text>
            </view>
          </view>
          <view class="question-stats">
            <text class="stat-item" :class="{ 'dark-stat': darkMode }" @click="likeQuestion">👍 {{ question.likes }}</text>
            <text class="stat-item" :class="{ 'dark-stat': darkMode }">👁️ {{ question.views }}</text>
            <text class="stat-item" :class="{ 'dark-stat': darkMode }">⏱️ {{ question.time }}</text>
          </view>
        </view>
      </view>
      
      <!-- 回答列表 -->
      <view class="answers-section" :class="{ 'dark-section': darkMode }">
        <view class="answers-header">
          <text class="answers-title" :class="{ 'dark-text': darkMode }">全部回答 ({{ answers.length }})</text>
          <text class="answer-sort" :class="{ 'dark-sort': darkMode }" @click="toggleSort">{{ sortText }}</text>
        </view>
        
        <view class="answer-list">
          <view 
            class="answer-card" 
            :class="{ 'dark-card': darkMode }"
            v-for="answer in sortedAnswers" 
            :key="answer.id"
          >
            <view class="answer-header">
              <image class="answer-avatar" :src="answer.author.avatar" mode="aspectFill"></image>
              <view class="answer-author">
                <text class="answer-name" :class="{ 'dark-text': darkMode }">{{ answer.author.name }}</text>
                <text class="answer-title" :class="{ 'dark-title': darkMode }">{{ answer.author.title || '普通用户' }}</text>
              </view>
              <view class="answer-time" :class="{ 'dark-time': darkMode }">{{ answer.time }}</view>
              <!-- 回复按钮 -->
              <view class="answer-reply-btn" :class="{ 'dark-reply-btn': darkMode }" @click="showReplyInput(answer)">
                <text class="reply-icon" :class="{ 'dark-icon': darkMode }">💬</text>
                <text class="reply-text" :class="{ 'dark-text': darkMode }">回复</text>
              </view>
            </view>
            
            <view class="answer-content" :class="{ 'dark-content': darkMode }">{{ answer.content }}</view>
            
            <!-- 回答图片 -->
            <view class="answer-images" v-if="answer.images && answer.images.length > 0">
              <image 
                class="answer-image" 
                v-for="(img, idx) in answer.images" 
                :key="idx"
                :src="img" 
                mode="aspectFill"
                @click="previewImage(idx, 'answer')"
              ></image>
            </view>
            
            <view class="answer-footer">
              <view class="answer-actions">
                <text class="action-item" :class="{ 'dark-action': darkMode }" @click="likeAnswer(answer)">👍 {{ answer.likes }}</text>
              </view>
            </view>
            
            <!-- 回复列表 -->
            <view class="replies-list" v-if="answer.replies && answer.replies.length > 0">
              <view 
                class="reply-item" 
                :class="{ 'dark-reply-item': darkMode }"
                v-for="reply in answer.replies" 
                :key="reply.id"
              >
                <image class="reply-avatar" :src="reply.author.avatar" mode="aspectFill"></image>
                <view class="reply-content-wrapper">
                  <view class="reply-header">
                    <text class="reply-name" :class="{ 'dark-reply-name': darkMode }">{{ reply.author.name }}</text>
                    <text class="reply-time" :class="{ 'dark-time': darkMode }">{{ reply.time }}</text>
                  </view>
                  <text class="reply-content" :class="{ 'dark-reply-content': darkMode }">{{ reply.content }}</text>
                  <view class="reply-actions">
                    <text class="reply-action" :class="{ 'dark-action': darkMode }" @click="likeReply(reply)">👍 {{ reply.likes || 0 }}</text>
                    <text class="reply-action" :class="{ 'dark-action': darkMode }" @click="showReplyInput(answer, reply)">回复</text>
                  </view>
                </view>
              </view>
            </view>
            
            <!-- 回复输入框（当前回答） -->
            <view class="reply-input-wrapper" v-if="activeReplyAnswerId === answer.id">
              <view class="reply-to" v-if="replyToUser" :class="{ 'dark-reply-to': darkMode }">
                回复 @{{ replyToUser }}：
              </view>
              <view class="reply-input" :class="{ 'dark-reply-input': darkMode }">
                <textarea 
                  v-model="replyContent" 
                  :placeholder="replyPlaceholder" 
                  class="reply-textarea"
                  :class="{ 'dark-textarea': darkMode }"
                  :maxlength="150"
                  auto-height
                  placeholder-class="dark-placeholder"
                />
                <view class="reply-actions">
                  <text class="reply-cancel" :class="{ 'dark-cancel': darkMode }" @click="cancelReply">取消</text>
                  <button class="reply-submit" :class="{ 'dark-submit': darkMode }" @click="submitReply(answer)">发送</button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 写回答 -->
      <view class="write-answer" :class="{ 'dark-section': darkMode }" v-if="isLogin">
        <view class="answer-input">
          <textarea 
            v-model="answerContent" 
            placeholder="写下你的回答..." 
            class="answer-textarea"
            :class="{ 'dark-textarea': darkMode }"
            :maxlength="500"
            auto-height
            placeholder-class="dark-placeholder"
          />
          <button class="answer-submit" :class="{ 'dark-submit': darkMode }" @click="submitAnswer">发布</button>
        </view>
      </view>
      <view class="login-tip" :class="{ 'dark-login-tip': darkMode }" v-else @click="goToLogin">
        <text>登录后参与回答</text>
      </view>
      
      <!-- 开发者信息 -->
      <view class="dev-info" :class="{ 'dark-dev': darkMode }">
        <text>开发者：李阳杰</text>
        <text>学号：2227010134</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      questionId: '',
      loading: true,
      question: {
        id: '',
        category: '',
        title: '',
        content: '',
        images: [],
        author: {
          name: '',
          avatar: '',
          title: ''
        },
        views: 0,
        likes: 0,
        time: '',
        isTop: false
      },
      answers: [],
      answerContent: '',
      isLogin: false,
      userInfo: {},
      categories: [
        { name: '种植技术', value: 'plant' },
        { name: '养殖技术', value: 'breed' },
        { name: '农机操作', value: 'machine' },
        { name: '病虫害防治', value: 'pest' },
        { name: '农产品加工', value: 'process' },
        { name: '农业电商', value: 'ecommerce' }
      ],
      
      // 排序相关
      sortBy: 'time', // 'time' 或 'hot'
      
      // 回复相关
      activeReplyAnswerId: null,
      replyToAnswerId: null,
      replyToReplyId: null,
      replyToUser: '',
      replyContent: ''
    }
  },
  computed: {
    sortText() {
      return this.sortBy === 'time' ? '最新' : '最热'
    },
    sortedAnswers() {
      if (this.sortBy === 'hot') {
        return [...this.answers].sort((a, b) => b.likes - a.likes)
      }
      return this.answers
    },
    replyPlaceholder() {
      return this.replyToUser ? `回复 @${this.replyToUser}` : '写下你的回复...'
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
    
    this.questionId = options.id
    this.checkLoginStatus()
    this.loadQuestionDetail()
    this.loadAnswers()
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
    
    getCategoryName(value) {
      const category = this.categories.find(c => c.value === value)
      return category ? category.name : value
    },
    
    loadQuestionDetail() {
      // 从问答列表页获取数据
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      
      if (prevPage && prevPage.$vm) {
        const allQuestions = prevPage.$vm.questions || []
        const question = allQuestions.find(q => q.id == this.questionId)
        
        if (question) {
          this.question = { ...question, views: (question.views || 0) + 1 }
          
          uni.setNavigationBarTitle({
            title: question.title.substring(0, 15) + '...'
          })
        }
      }
    },
    
    // 加载回答数据（从本地存储）
    loadAnswers() {
      const qaAnswers = uni.getStorageSync('qaAnswers') || {}
      const savedAnswers = qaAnswers[this.questionId]
      
      if (savedAnswers && savedAnswers.length > 0) {
        // 如果有保存的数据，使用保存的数据
        this.answers = savedAnswers
      } else {
        // 否则使用默认模拟数据
        this.answers = [
          {
            id: 1,
            author: {
              name: '王教授',
              avatar: 'https://via.placeholder.com/100x100/2b5e2b/ffffff?text=王',
              title: '种植专家'
            },
            content: '水稻育苗期要注意以下几点：1. 温度控制：白天25-30℃，夜间15-20℃；2. 水分管理：保持土壤湿润但不要积水；3. 光照充足；4. 预防病害，可适当喷施多菌灵。',
            images: [],
            likes: 15,
            time: '1小时前',
            replies: [
              {
                id: 101,
                author: {
                  name: '新农人小李',
                  avatar: 'https://via.placeholder.com/100x100/4CAF50/ffffff?text=李'
                },
                content: '非常感谢王教授的详细解答！',
                time: '50分钟前',
                likes: 2
              },
              {
                id: 102,
                author: {
                  name: '老张',
                  avatar: 'https://via.placeholder.com/100x100/FF9800/ffffff?text=张'
                },
                content: '补充一点：育苗盘底部要留孔，避免积水烂根。',
                time: '30分钟前',
                likes: 3
              }
            ]
          },
          {
            id: 2,
            author: {
              name: '李老师',
              avatar: 'https://via.placeholder.com/100x100/FF9800/ffffff?text=李',
              title: '农技员'
            },
            content: '除了温度管理，还要注意育苗土的选择。最好用专门的育苗基质，透气性好，保水性适中。播种不要太密，一般每穴2-3粒种子即可。',
            images: [],
            likes: 8,
            time: '3小时前',
            replies: []
          }
        ]
      }
      
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    
    // 保存回答数据到本地存储
    saveAnswers() {
      const qaAnswers = uni.getStorageSync('qaAnswers') || {}
      qaAnswers[this.questionId] = this.answers
      uni.setStorageSync('qaAnswers', qaAnswers)
      
      // 更新问答列表页的回答数
      const pages = getCurrentPages()
      const qaPage = pages.find(p => p.route === 'pages/qa/qa')
      if (qaPage && qaPage.$vm) {
        // 触发问答列表页刷新
        qaPage.$vm.refreshQuestions && qaPage.$vm.refreshQuestions()
      }
    },
    
    previewImage(index, type = 'question') {
      let urls = []
      if (type === 'question' && this.question.images) {
        urls = this.question.images
      } else if (type === 'answer') {
        urls = this.answers.flatMap(a => a.images || [])
      }
      
      uni.previewImage({
        current: index,
        urls: urls
      })
    },
    
    toggleSort() {
      this.sortBy = this.sortBy === 'time' ? 'hot' : 'time'
    },
    
    likeQuestion() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      this.question.likes++
      uni.showToast({
        title: '点赞成功',
        icon: 'none'
      })
    },
    
    likeAnswer(answer) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      answer.likes++
      this.saveAnswers()
    },
    
    likeReply(reply) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      reply.likes = (reply.likes || 0) + 1
      this.saveAnswers()
    },
    
    showReplyInput(answer, reply = null) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      
      this.activeReplyAnswerId = answer.id
      
      if (reply) {
        this.replyToAnswerId = answer.id
        this.replyToReplyId = reply.id
        this.replyToUser = reply.author.name
      } else {
        this.replyToAnswerId = answer.id
        this.replyToReplyId = null
        this.replyToUser = answer.author.name
      }
    },
    
    cancelReply() {
      this.activeReplyAnswerId = null
      this.replyToAnswerId = null
      this.replyToReplyId = null
      this.replyToUser = ''
      this.replyContent = ''
    },
    
    submitReply(answer) {
      if (!this.replyContent.trim()) {
        uni.showToast({
          title: '请输入回复内容',
          icon: 'none'
        })
        return
      }
      
      const newReply = {
        id: Date.now(),
        author: {
          name: this.userInfo.nickName || this.userInfo.username || '用户',
          avatar: this.userInfo.avatarUrl || '/static/logo.png'
        },
        content: this.replyContent,
        time: '刚刚',
        likes: 0
      }
      
      if (!answer.replies) {
        answer.replies = []
      }
      
      answer.replies.push(newReply)
      this.saveAnswers()
      this.cancelReply()
      
      uni.showToast({
        title: '回复成功',
        icon: 'success'
      })
    },
    
    submitAnswer() {
      if (!this.answerContent.trim()) {
        uni.showToast({
          title: '请输入回答内容',
          icon: 'none'
        })
        return
      }
      
      const newAnswer = {
        id: Date.now(),
        author: {
          name: this.userInfo.nickName || this.userInfo.username || '用户',
          avatar: this.userInfo.avatarUrl || '/static/logo.png',
          title: '普通用户'
        },
        content: this.answerContent,
        images: [],
        likes: 0,
        time: '刚刚',
        replies: []
      }
      
      this.answers.unshift(newAnswer)
      this.saveAnswers()
      this.answerContent = ''
      
      uni.showToast({
        title: '回答已发布',
        icon: 'success'
      })
    },
    
    showLoginTip() {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin()
          }
        }
      })
    },
    
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style>
.qa-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* 深色模式 */
.qa-detail-container.dark-mode {
  background-color: #1a1a1a;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #999;
  font-size: 28rpx;
  transition: color 0.3s ease;
}

.loading.dark-loading-text {
  color: #666;
}

.content-scroll {
  height: 100vh;
}

/* 问题详情 */
.question-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.question-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.question-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.question-tag {
  padding: 4rpx 15rpx;
  background-color: #f5a623;
  color: #ffffff;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  transition: all 0.3s ease;
}

.question-tag.dark-tag {
  filter: brightness(0.9);
}

.question-category {
  padding: 4rpx 15rpx;
  font-size: 22rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  transition: all 0.3s ease;
}

.question-category.dark-category {
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

.question-title {
  flex: 1;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.question-title.dark-text {
  color: #fff;
}

.question-content {
  font-size: 32rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
  transition: color 0.3s ease;
}

.question-content.dark-content {
  color: #aaa;
}

.question-images {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.question-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  margin-right: 15rpx;
  margin-bottom: 15rpx;
}

.question-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.question-footer.dark-footer {
  border-top-color: #3a3a3a;
}

.question-author {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.author-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 15rpx;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
  transition: color 0.3s ease;
}

.author-name.dark-text {
  color: #fff;
}

.author-title {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.author-title.dark-title {
  color: #aaa;
}

.question-stats {
  display: flex;
  flex-direction: row;
}

.stat-item {
  font-size: 26rpx;
  color: #999;
  margin-left: 30rpx;
  transition: color 0.3s ease;
}

.stat-item.dark-stat {
  color: #aaa;
}

/* 回答列表 */
.answers-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.answers-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.answers-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.answers-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.answers-title.dark-text {
  color: #fff;
}

.answer-sort {
  font-size: 26rpx;
  color: #999;
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  transition: all 0.3s ease;
}

.answer-sort.dark-sort {
  background-color: #3a3a3a;
  color: #aaa;
}

.answer-card {
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.answer-card.dark-card {
  border-bottom-color: #3a3a3a;
}

.answer-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.answer-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
  position: relative;
}

.answer-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 15rpx;
}

.answer-author {
  flex: 1;
}

.answer-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-right: 10rpx;
  display: block;
  margin-bottom: 4rpx;
  transition: color 0.3s ease;
}

.answer-name.dark-text {
  color: #fff;
}

.answer-title {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.answer-title.dark-title {
  color: #aaa;
}

.answer-time {
  font-size: 22rpx;
  color: #ccc;
  margin-right: 20rpx;
  transition: color 0.3s ease;
}

.answer-time.dark-time {
  color: #666;
}

.answer-reply-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6rpx 20rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  transition: all 0.3s ease;
}

.answer-reply-btn.dark-reply-btn {
  background-color: #3a3a3a;
}

.reply-icon {
  font-size: 24rpx;
  margin-right: 4rpx;
  transition: color 0.3s ease;
}

.reply-icon.dark-icon {
  color: #aaa;
}

.reply-text {
  font-size: 24rpx;
  color: #666;
  transition: color 0.3s ease;
}

.reply-text.dark-text {
  color: #aaa;
}

.answer-content {
  font-size: 30rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15rpx;
  padding-left: 75rpx;
  transition: color 0.3s ease;
}

.answer-content.dark-content {
  color: #aaa;
}

.answer-images {
  display: flex;
  flex-direction: row;
  margin-bottom: 15rpx;
  padding-left: 75rpx;
}

.answer-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
}

.answer-footer {
  margin-bottom: 15rpx;
  padding-left: 75rpx;
}

.answer-actions {
  display: flex;
  flex-direction: row;
}

.action-item {
  font-size: 26rpx;
  color: #999;
  margin-right: 30rpx;
  transition: color 0.3s ease;
}

.action-item.dark-action {
  color: #aaa;
}

/* 回复列表 */
.replies-list {
  margin-top: 15rpx;
  padding-left: 75rpx;
}

.reply-item {
  display: flex;
  flex-direction: row;
  padding: 15rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
  transition: all 0.3s ease;
}

.reply-item.dark-reply-item {
  background-color: #3a3a3a;
}

.reply-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
}

.reply-content-wrapper {
  flex: 1;
}

.reply-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5rpx;
}

.reply-name {
  font-size: 24rpx;
  color: #2b5e2b;
  font-weight: 500;
  transition: color 0.3s ease;
}

.reply-name.dark-reply-name {
  color: #4CAF50;
}

.reply-time {
  font-size: 20rpx;
  color: #999;
  transition: color 0.3s ease;
}

.reply-time.dark-time {
  color: #aaa;
}

.reply-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8rpx;
  transition: color 0.3s ease;
}

.reply-content.dark-reply-content {
  color: #aaa;
}

.reply-actions {
  display: flex;
  flex-direction: row;
}

.reply-action {
  font-size: 22rpx;
  color: #999;
  margin-right: 20rpx;
  transition: color 0.3s ease;
}

.reply-action.dark-action {
  color: #aaa;
}

/* 回复输入框 */
.reply-input-wrapper {
  margin-top: 15rpx;
  padding-left: 75rpx;
}

.reply-to {
  font-size: 24rpx;
  color: #2b5e2b;
  margin-bottom: 8rpx;
  padding-left: 10rpx;
  transition: color 0.3s ease;
}

.reply-to.dark-reply-to {
  color: #4CAF50;
}

.reply-input {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 15rpx;
  transition: all 0.3s ease;
}

.reply-input.dark-reply-input {
  background-color: #3a3a3a;
}

.reply-textarea {
  width: 100%;
  min-height: 80rpx;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.reply-textarea.dark-textarea {
  color: #fff;
  background-color: #3a3a3a;
}

.reply-textarea.dark-textarea::placeholder {
  color: #aaa;
}

.reply-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.reply-cancel {
  font-size: 26rpx;
  color: #999;
  margin-right: 20rpx;
  padding: 10rpx;
  transition: color 0.3s ease;
}

.reply-cancel.dark-cancel {
  color: #aaa;
}

.reply-submit {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 30rpx;
  border: none;
  transition: all 0.3s ease;
}

.reply-submit.dark-submit {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.reply-submit::after {
  border: none;
}

/* 写回答 */
.write-answer {
  background-color: #ffffff;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.write-answer.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.answer-input {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.answer-textarea {
  flex: 1;
  min-height: 100rpx;
  background-color: #f8f8f8;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
  transition: all 0.3s ease;
}

.answer-textarea.dark-textarea {
  background-color: #3a3a3a;
  color: #fff;
}

.answer-textarea.dark-textarea::placeholder {
  color: #aaa;
}

.answer-submit {
  width: 120rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 35rpx;
  border: none;
  transition: all 0.3s ease;
}

.answer-submit.dark-submit {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.answer-submit::after {
  border: none;
}

.login-tip {
  background-color: #f0f9f0;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  text-align: center;
  color: #2b5e2b;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.login-tip.dark-login-tip {
  background-color: #1e3a1e;
  color: #4CAF50;
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

/* 占位符样式 */
.dark-placeholder {
  color: #aaa !important;
}
</style>