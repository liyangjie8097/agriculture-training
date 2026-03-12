<template>
  <view class="news-detail-container" :class="{ 'dark-mode': darkMode }">
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text :class="{ 'dark-loading-text': darkMode }">加载中...</text>
    </view>
    
    <scroll-view class="content-scroll" scroll-y v-else>
      <!-- 标题区域 -->
      <view class="title-section" :class="{ 'dark-section': darkMode }">
        <text class="news-title" :class="{ 'dark-text': darkMode }">{{ news.title }}</text>
        <view class="news-meta" :class="{ 'dark-meta': darkMode }">
          <text class="news-source" :class="{ 'dark-source': darkMode }">{{ news.source }}</text>
          <text class="news-time" :class="{ 'dark-time': darkMode }">{{ formatTime(news.publish_time) }}</text>
          <text class="news-views" :class="{ 'dark-views': darkMode }">👁️ {{ news.view_count || 0 }}阅读</text>
        </view>
      </view>
      
      <!-- 封面图 -->
      <image class="news-image" :src="news.cover_image || 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c'" mode="widthFix"></image>
      
      <!-- 正文内容 -->
      <view class="news-content" :class="{ 'dark-content': darkMode }">
        <text class="content-text" :class="{ 'dark-text': darkMode }">{{ news.content }}</text>
      </view>
      
      <!-- 点赞收藏 -->
      <view class="action-bar" :class="{ 'dark-section': darkMode }">
        <view class="action-item" @click="likeNews">
          <text class="action-icon" :class="{ 'liked': isLiked, 'dark-icon': darkMode && !isLiked }">👍</text>
          <text class="action-text" :class="{ 'liked-text': isLiked, 'dark-text': darkMode && !isLiked }">{{ isLiked ? '已点赞' : '点赞' }}</text>
          <text class="action-count" v-if="news.like_count > 0" :class="{ 'dark-count': darkMode }">{{ news.like_count }}</text>
        </view>
        <view class="action-item" @click="favoriteNews">
          <text class="action-icon" :class="{ 'favorited': isFavorited, 'dark-icon': darkMode && !isFavorited }">❤️</text>
          <text class="action-text" :class="{ 'favorited-text': isFavorited, 'dark-text': darkMode && !isFavorited }">{{ isFavorited ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="action-item" @click="shareNews">
          <text class="action-icon" :class="{ 'dark-icon': darkMode }">📤</text>
          <text class="action-text" :class="{ 'dark-text': darkMode }">分享</text>
        </view>
      </view>
      
      <!-- 评论区域 -->
      <view class="comments-section" :class="{ 'dark-section': darkMode }">
        <view class="comments-header">
          <text class="comments-title" :class="{ 'dark-text': darkMode }">全部评论 ({{ comments.length }})</text>
          <text class="comment-sort" :class="{ 'dark-sort': darkMode }" @click="toggleSort">{{ sortText }}</text>
        </view>
        
        <!-- 评论列表 -->
        <view class="comments-list">
          <view 
            class="comment-card" 
            :class="{ 'dark-card': darkMode }"
            v-for="comment in sortedComments" 
            :key="comment.id"
          >
            <view class="comment-header">
              <image class="comment-avatar" :src="comment.author_avatar || '/static/logo.png'" mode="aspectFill"></image>
              <view class="comment-author">
                <text class="comment-name" :class="{ 'dark-text': darkMode }">{{ comment.author_name || '匿名用户' }}</text>
                <text class="comment-time" :class="{ 'dark-time': darkMode }">{{ formatTime(comment.create_time) }}</text>
              </view>
              <!-- 回复按钮 -->
              <view class="comment-reply-btn" :class="{ 'dark-reply-btn': darkMode }" @click="showReplyInput(comment)">
                <text class="reply-icon" :class="{ 'dark-reply-icon': darkMode }">💬</text>
                <text class="reply-text" :class="{ 'dark-reply-text': darkMode }">回复</text>
              </view>
            </view>
            
            <view class="comment-content" :class="{ 'dark-content': darkMode }">{{ comment.content }}</view>
            
            <view class="comment-footer">
              <view class="comment-actions">
                <text class="comment-action" :class="{ 'dark-action': darkMode }" @click="likeComment(comment)">👍 {{ comment.like_count || 0 }}</text>
              </view>
            </view>
            
            <!-- 回复列表 -->
            <view class="replies-list" v-if="comment.replies && comment.replies.length > 0">
              <view 
                class="reply-item" 
                v-for="reply in comment.replies" 
                :key="reply.id"
              >
                <image class="reply-avatar" :src="reply.author_avatar || '/static/logo.png'" mode="aspectFill"></image>
                <view class="reply-content-wrapper">
                  <view class="reply-header">
                    <text class="reply-name" :class="{ 'dark-reply-name': darkMode }">{{ reply.author_name }}</text>
                    <text class="reply-time" :class="{ 'dark-time': darkMode }">{{ formatTime(reply.create_time) }}</text>
                  </view>
                  <text class="reply-content" :class="{ 'dark-reply-content': darkMode }">{{ reply.content }}</text>
                  <view class="reply-actions">
                    <text class="reply-action" :class="{ 'dark-action': darkMode }" @click="likeReply(reply)">👍 {{ reply.like_count || 0 }}</text>
                    <text class="reply-action" :class="{ 'dark-action': darkMode }" @click="showReplyInput(comment, reply)">回复</text>
                  </view>
                </view>
              </view>
            </view>
            
            <!-- 回复输入框（当前评论） -->
            <view class="reply-input-wrapper" v-if="activeReplyCommentId === comment.id">
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
                  <button class="reply-submit" :class="{ 'dark-submit': darkMode }" @click="submitReply(comment)">发送</button>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 写评论 -->
        <view class="write-comment" v-if="isLogin">
          <view class="comment-input">
            <textarea 
              v-model="commentContent" 
              placeholder="写下你的评论..." 
              class="comment-textarea" 
              :class="{ 'dark-textarea': darkMode }"
              :maxlength="200"
              auto-height
              placeholder-class="dark-placeholder"
            />
            <button class="comment-submit" :class="{ 'dark-submit': darkMode }" @click="submitComment">发布</button>
          </view>
        </view>
        <view class="login-tip" v-else @click="goToLogin" :class="{ 'dark-login-tip': darkMode }">
          <text>登录后参与评论</text>
        </view>
      </view>
      
      <!-- 相关推荐 -->
      <view class="related-section" :class="{ 'dark-section': darkMode }" v-if="relatedNews.length > 0">
        <view class="section-title">
          <text :class="{ 'dark-text': darkMode }">相关推荐</text>
        </view>
        <view 
          class="related-card" 
          :class="{ 'dark-card': darkMode }"
          v-for="item in relatedNews" 
          :key="item.id"
          @click="goToNewsDetail(item)"
        >
          <image class="related-image" :src="item.cover_image || 'https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u'" mode="aspectFill"></image>
          <view class="related-info">
            <text class="related-title" :class="{ 'dark-text': darkMode }">{{ item.title }}</text>
            <text class="related-desc" :class="{ 'dark-desc': darkMode }">{{ item.summary || item.description }}</text>
          </view>
        </view>
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
// 导入 baseUrl
import baseUrl from '@/config.js'

export default {
  data() {
    return {
      darkMode: false,
      newsId: '',
      loading: true,
      news: {
        id: '',
        category: '',
        title: '',
        summary: '',
        content: '',
        cover_image: '',
        source: '',
        author: '',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        is_top: 0,
        publish_time: ''
      },
      allNews: [],
      relatedNews: [],
      comments: [],
      commentContent: '',
      isLogin: false,
      userInfo: {},
      isLiked: false,
      isFavorited: false,
      
      // 排序相关
      sortBy: 'time', // 'time' 或 'hot'
      
      // 回复相关
      activeReplyCommentId: null,
      replyToCommentId: null,
      replyToReplyId: null,
      replyToUser: '',
      replyContent: ''
    }
  },
  computed: {
    sortText() {
      return this.sortBy === 'time' ? '最新' : '最热'
    },
    sortedComments() {
      if (this.sortBy === 'hot') {
        return [...this.comments].sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      }
      return this.comments
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
    
    this.newsId = options.id
    this.checkLoginStatus()
    this.loadNewsDetail()
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
    
    // 加载资讯详情
    async loadNewsDetail() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: baseUrl + '/news/' + this.newsId,
            method: 'GET',
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          })
        })
        
        if (res.data.success) {
          this.news = res.data.data
          this.comments = res.data.data.comments || []
          this.loadRelatedNews()
          this.checkFavoriteStatus()
          
          uni.setNavigationBarTitle({
            title: this.news.title.substring(0, 15) + '...'
          })
        }
        
        this.loading = false
      } catch (error) {
        console.error('加载资讯详情失败:', error)
        this.loading = false
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    
    // 加载相关推荐
    loadRelatedNews() {
      const pages = getCurrentPages()
      const newsPage = pages.find(p => p.route === 'pages/news/news')
      
      if (newsPage && newsPage.$vm) {
        this.allNews = newsPage.$vm.newsList || []
        this.relatedNews = this.allNews
          .filter(n => n.category === this.news.category && n.id != this.news.id)
          .slice(0, 3)
      }
    },
    
    // 检查收藏状态
    checkFavoriteStatus() {
      if (!this.isLogin) return
      
      const favorites = uni.getStorageSync('newsFavorites') || {}
      const userFavorites = favorites[this.userInfo.userId] || []
      this.isFavorited = userFavorites.includes(parseInt(this.newsId))
    },
    
    // 切换排序
    toggleSort() {
      this.sortBy = this.sortBy === 'time' ? 'hot' : 'time'
    },
    
    // 点赞资讯
    async likeNews() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      
      try {
        await new Promise((resolve, reject) => {
          uni.request({
            url: baseUrl + '/news/' + this.newsId + '/like',
            method: 'POST',
            data: { user_id: this.userInfo.userId },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          })
        })
        
        if (this.isLiked) {
          this.news.like_count--
        } else {
          this.news.like_count++
        }
        this.isLiked = !this.isLiked
        
        uni.showToast({
          title: this.isLiked ? '点赞成功' : '已取消点赞',
          icon: 'none'
        })
      } catch (error) {
        console.error('点赞失败:', error)
      }
    },
    
    // 收藏资讯
    favoriteNews() {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      
      const favorites = uni.getStorageSync('newsFavorites') || {}
      const userId = this.userInfo.userId
      
      if (!favorites[userId]) {
        favorites[userId] = []
      }
      
      const newsIdNum = parseInt(this.newsId)
      
      if (this.isFavorited) {
        favorites[userId] = favorites[userId].filter(id => id != newsIdNum)
        uni.showToast({
          title: '已取消收藏',
          icon: 'none'
        })
      } else {
        if (!favorites[userId].includes(newsIdNum)) {
          favorites[userId].push(newsIdNum)
          uni.showToast({
            title: '收藏成功',
            icon: 'success'
          })
        }
      }
      
      uni.setStorageSync('newsFavorites', favorites)
      this.isFavorited = !this.isFavorited
    },
    
    // 分享资讯
    shareNews() {
      uni.showActionSheet({
        itemList: ['分享到微信好友', '分享到朋友圈', '复制链接'],
        success: (res) => {
          if (res.tapIndex === 2) {
            uni.setClipboardData({
              data: 'http://81.71.93.186:3000/pages/news-detail/news-detail?id=' + this.newsId,
              success: () => {
                uni.showToast({
                  title: '链接已复制',
                  icon: 'success'
                })
              }
            })
          } else {
            uni.showToast({
              title: '分享功能开发中',
              icon: 'none'
            })
          }
        }
      })
    },
    
    // 点赞评论
    likeComment(comment) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      comment.like_count = (comment.like_count || 0) + 1
      this.saveComments()
    },
    
    // 点赞回复
    likeReply(reply) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      reply.like_count = (reply.like_count || 0) + 1
      this.saveComments()
    },
    
    // 保存评论到本地存储（临时方案，后续可改为后端接口）
    saveComments() {
      const newsComments = uni.getStorageSync('newsComments') || {}
      newsComments[this.newsId] = this.comments
      uni.setStorageSync('newsComments', newsComments)
    },
    
    // 显示回复输入框
    showReplyInput(comment, reply = null) {
      if (!this.isLogin) {
        this.showLoginTip()
        return
      }
      
      this.activeReplyCommentId = comment.id
      
      if (reply) {
        this.replyToCommentId = comment.id
        this.replyToReplyId = reply.id
        this.replyToUser = reply.author_name
      } else {
        this.replyToCommentId = comment.id
        this.replyToReplyId = null
        this.replyToUser = comment.author_name
      }
    },
    
    // 取消回复
    cancelReply() {
      this.activeReplyCommentId = null
      this.replyToCommentId = null
      this.replyToReplyId = null
      this.replyToUser = ''
      this.replyContent = ''
    },
    
    // 提交回复
    submitReply(comment) {
      if (!this.replyContent.trim()) {
        uni.showToast({
          title: '请输入回复内容',
          icon: 'none'
        })
        return
      }
      
      const newReply = {
        id: Date.now(),
        author_name: this.userInfo.nickName || this.userInfo.username || '用户',
        author_avatar: this.userInfo.avatarUrl || '/static/logo.png',
        content: this.replyContent,
        create_time: new Date().toISOString(),
        like_count: 0
      }
      
      if (!comment.replies) {
        comment.replies = []
      }
      
      comment.replies.push(newReply)
      this.saveComments()
      this.cancelReply()
      
      uni.showToast({
        title: '回复成功',
        icon: 'success'
      })
    },
    
    // 提交评论
    async submitComment() {
      if (!this.commentContent.trim()) {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        })
        return
      }
      
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: baseUrl + '/news/' + this.newsId + '/comments',
            method: 'POST',
            data: {
              user_id: this.userInfo.userId,
              content: this.commentContent
            },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          })
        })
        
        if (res.data.success) {
          const newComment = {
            id: res.data.data.id,
            author_name: this.userInfo.nickName || this.userInfo.username || '用户',
            author_avatar: this.userInfo.avatarUrl || '/static/logo.png',
            content: this.commentContent,
            create_time: new Date().toISOString(),
            like_count: 0,
            replies: []
          }
          
          this.comments.unshift(newComment)
          this.news.comment_count = (this.news.comment_count || 0) + 1
          this.commentContent = ''
          
          uni.showToast({
            title: '评论已发布',
            icon: 'success'
          })
        }
      } catch (error) {
        console.error('发表评论失败:', error)
        uni.showToast({
          title: '评论失败',
          icon: 'none'
        })
      }
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
    
    // 显示登录提示
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
    
    // 跳转到登录
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    
    // 跳转到资讯详情
    goToNewsDetail(news) {
      uni.redirectTo({
        url: '/pages/news-detail/news-detail?id=' + news.id
      })
    }
  }
}
</script>

<style>
.news-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* 深色模式 */
.news-detail-container.dark-mode {
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

/* 标题区域 */
.title-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.title-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.news-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 20rpx;
  display: block;
  transition: color 0.3s ease;
}

.news-title.dark-text {
  color: #fff;
}

.news-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.news-meta.dark-meta {
  color: #aaa;
}

.news-source {
  color: #2b5e2b;
  margin-right: 20rpx;
  transition: color 0.3s ease;
}

.news-source.dark-source {
  color: #4CAF50;
}

.news-time.dark-time {
  color: #aaa;
}

.news-views.dark-views {
  color: #aaa;
}

/* 封面图 */
.news-image {
  width: 100%;
  margin-bottom: 30rpx;
}

/* 正文内容 */
.news-content {
  padding: 0 30rpx 40rpx;
  transition: background-color 0.3s ease;
}

.news-content.dark-content {
  background-color: #1a1a1a;
}

.content-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  transition: color 0.3s ease;
}

.content-text.dark-text {
  color: #fff;
}

/* 操作栏 */
.action-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.action-bar.dark-section {
  background-color: #2a2a2a;
  border-top-color: #3a3a3a;
  border-bottom-color: #3a3a3a;
}

.action-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10rpx 30rpx;
  background-color: #f8f8f8;
  border-radius: 40rpx;
  transition: all 0.3s ease;
}

.dark-mode .action-item {
  background-color: #3a3a3a;
}

.action-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
  color: #666;
  transition: all 0.2s ease;
}

.action-icon.dark-icon {
  color: #aaa;
}

.action-icon.liked {
  color: #fb7299;
  transform: scale(1.1);
}

.action-icon.favorited {
  color: #f56c6c;
  transform: scale(1.1);
}

.action-text {
  font-size: 26rpx;
  color: #666;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.action-text.dark-text {
  color: #aaa;
}

.action-text.liked-text {
  color: #fb7299;
  font-weight: 500;
}

.action-text.favorited-text {
  color: #f56c6c;
  font-weight: 500;
}

.action-count {
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.action-count.dark-count {
  color: #aaa;
}

/* 评论区域 */
.comments-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.comments-section.dark-section {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.comments-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.comments-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.comments-title.dark-text {
  color: #fff;
}

.comment-sort {
  font-size: 26rpx;
  color: #999;
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  transition: all 0.3s ease;
}

.comment-sort.dark-sort {
  background-color: #3a3a3a;
  color: #aaa;
}

.comments-list {
  margin-bottom: 30rpx;
}

.comment-card {
  background-color: #f8f8f8;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.comment-card.dark-card {
  background-color: #3a3a3a;
}

.comment-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15rpx;
  position: relative;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 15rpx;
}

.comment-author {
  flex: 1;
}

.comment-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
  transition: color 0.3s ease;
}

.comment-name.dark-text {
  color: #fff;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.comment-time.dark-time {
  color: #aaa;
}

.comment-reply-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6rpx 15rpx;
  background-color: #f0f0f0;
  border-radius: 25rpx;
  transition: all 0.3s ease;
}

.comment-reply-btn.dark-reply-btn {
  background-color: #3a3a3a;
}

.reply-icon {
  font-size: 24rpx;
  margin-right: 4rpx;
  transition: color 0.3s ease;
}

.reply-icon.dark-reply-icon {
  color: #aaa;
}

.reply-text {
  font-size: 22rpx;
  color: #666;
  transition: color 0.3s ease;
}

.reply-text.dark-reply-text {
  color: #aaa;
}

.comment-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15rpx;
  padding-left: 75rpx;
  transition: color 0.3s ease;
}

.comment-content.dark-content {
  color: #aaa;
}

.comment-footer {
  padding-left: 75rpx;
}

.comment-actions {
  display: flex;
  flex-direction: row;
}

.comment-action {
  font-size: 24rpx;
  color: #999;
  margin-right: 30rpx;
  transition: color 0.3s ease;
}

.comment-action.dark-action {
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
  background-color: #f0f0f0;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
  transition: all 0.3s ease;
}

.dark-mode .reply-item {
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
  background-color: #f0f0f0;
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

/* 写评论 */
.write-comment {
  margin-top: 30rpx;
}

.comment-input {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.comment-textarea {
  flex: 1;
  min-height: 100rpx;
  background-color: #f8f8f8;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
  border: 1rpx solid #ddd;
  transition: all 0.3s ease;
}

.comment-textarea.dark-textarea {
  background-color: #3a3a3a;
  color: #fff;
  border-color: #555;
}

.comment-textarea.dark-textarea::placeholder {
  color: #aaa;
}

.comment-submit {
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

.comment-submit.dark-submit {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
}

.comment-submit::after {
  border: none;
}

.login-tip {
  background-color: #f0f9f0;
  margin-top: 30rpx;
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

/* 相关推荐 */
.related-section {
  background-color: #ffffff;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.related-section.dark-section {
  background-color: #2a2a2a;
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  transition: color 0.3s ease;
}

.section-title.dark-text {
  color: #fff;
}

.related-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.related-card.dark-card {
  border-bottom-color: #3a3a3a;
}

.related-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.related-image {
  width: 200rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.related-title.dark-text {
  color: #fff;
}

.related-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 6rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.related-desc.dark-desc {
  color: #aaa;
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