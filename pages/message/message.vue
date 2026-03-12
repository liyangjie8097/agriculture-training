<template>
  <view class="message-container" :class="{ 'dark-mode': darkMode }">
    <view class="header" :class="{ 'dark-header': darkMode }">
      <text class="title">消息中心</text>
    </view>
    
    <!-- 消息分类标签 -->
    <view class="tab-bar" :class="{ 'dark-tab-bar': darkMode }">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'system', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'system' }"
        @click="switchTab('system')"
      >
        系统通知
        <text class="badge" v-if="unreadCount.system > 0">{{ unreadCount.system }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'interact', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'interact' }"
        @click="switchTab('interact')"
      >
        互动消息
        <text class="badge" v-if="unreadCount.interact > 0">{{ unreadCount.interact }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'comment', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'comment' }"
        @click="switchTab('comment')"
      >
        评论回复
        <text class="badge" v-if="unreadCount.comment > 0">{{ unreadCount.comment }}</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'like', 'dark-tab-item': darkMode, 'dark-active': darkMode && currentTab === 'like' }"
        @click="switchTab('like')"
      >
        点赞收藏
        <text class="badge" v-if="unreadCount.like > 0">{{ unreadCount.like }}</text>
      </view>
    </view>
    
    <!-- 消息列表 -->
    <scroll-view class="message-list-scroll" scroll-y @scrolltolower="loadMore">
      <view class="message-list">
        <!-- 全部已读提示 -->
        <view class="all-read-tip" v-if="filteredMessages.length === 0">
          <text class="tip-icon" :class="{ 'dark-tip-icon': darkMode }">📭</text>
          <text class="tip-text" :class="{ 'dark-tip-text': darkMode }">暂无消息</text>
        </view>
        
        <!-- 消息列表 -->
        <view 
          class="message-card" 
          v-for="message in filteredMessages" 
          :key="message.id"
          :class="{ 'unread': !message.isRead, 'dark-card': darkMode, 'dark-unread': darkMode && !message.isRead }"
          @click="goToMessageDetail(message)"
        >
          <!-- 消息图标 -->
          <view class="message-icon" :class="['icon-' + message.type, { 'dark-icon': darkMode }]">
            <text>{{ getMessageIcon(message.type) }}</text>
          </view>
          
          <view class="message-content">
            <view class="message-header">
              <text class="message-title" :class="{ 'dark-text': darkMode }">{{ message.title }}</text>
              <text class="message-time" :class="{ 'dark-time': darkMode }">{{ message.time }}</text>
            </view>
            <text class="message-desc" :class="{ 'dark-desc': darkMode }">{{ message.content }}</text>
            
            <!-- 互动消息的额外信息 -->
            <view class="message-extra" :class="{ 'dark-extra': darkMode }" v-if="message.extra">
              <text class="extra-text" :class="{ 'dark-extra-text': darkMode }">{{ message.extra }}</text>
            </view>
          </view>
          
          <!-- 未读红点 -->
          <view class="unread-dot" v-if="!message.isRead"></view>
          
          <!-- 删除按钮 -->
          <view class="delete-btn" :class="{ 'dark-delete-btn': darkMode }" @click.stop="deleteMessage(message)">
            <text class="delete-icon" :class="{ 'dark-delete-icon': darkMode }">🗑️</text>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <text :class="{ 'dark-load-text': darkMode }">{{ loadingText }}</text>
        </view>
        <view class="no-more" v-if="!hasMore && filteredMessages.length > 0">
          <text :class="{ 'dark-no-more': darkMode }">没有更多消息了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar" :class="{ 'dark-bottom-bar': darkMode }" v-if="filteredMessages.length > 0">
      <view class="bottom-left" :class="{ 'dark-bottom-left': darkMode }" @click="markAllAsRead">
        <text class="mark-icon" :class="{ 'dark-mark-icon': darkMode }">✓</text>
        <text class="mark-text" :class="{ 'dark-mark-text': darkMode }">全部已读</text>
      </view>
      <view class="bottom-right" :class="{ 'dark-bottom-right': darkMode }" @click="clearAllMessages">
        <text class="clear-icon" :class="{ 'dark-clear-icon': darkMode }">🗑️</text>
        <text class="clear-text" :class="{ 'dark-clear-text': darkMode }">清空消息</text>
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
      currentTab: 'system',
      messages: [],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loadingText: '加载中...',
      isLogin: false,
      userInfo: {},
      unreadCount: {
        system: 0,
        interact: 0,
        comment: 0,
        like: 0
      }
    }
  },
  computed: {
    filteredMessages() {
      return this.messages.filter(m => m.type === this.currentTab)
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
    this.loadMessages()
  },
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    this.checkLoginStatus()
    this.loadMessages()
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
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    },
    
    getMessageIcon(type) {
      const icons = {
        system: '🔔',
        interact: '💬',
        comment: '📝',
        like: '❤️'
      }
      return icons[type] || '📩'
    },
    
    loadMessages() {
      // 模拟从后端获取消息数据
      setTimeout(() => {
        const allMessages = [
          // 系统通知
          {
            id: 1,
            type: 'system',
            title: '系统维护通知',
            content: '亲爱的用户，为了提供更稳定的服务，系统将于2026年3月15日凌晨2:00-4:00进行例行维护，期间可能无法正常访问，敬请谅解。',
            time: '2小时前',
            isRead: false,
            extra: null
          },
          {
            id: 2,
            type: 'system',
            title: '版本更新通知',
            content: '农业技能培训小程序v2.0版本已发布，新增问答社区、专家库等功能，快来体验吧！',
            time: '昨天',
            isRead: true,
            extra: null
          },
          {
            id: 3,
            type: 'system',
            title: '春节放假通知',
            content: '春节期间（2月10日-2月17日）专家答疑服务暂停，2月18日恢复正常，祝您春节快乐！',
            time: '3天前',
            isRead: true,
            extra: null
          },
          
          // 互动消息
          {
            id: 4,
            type: 'interact',
            title: '王教授回答了您的问题',
            content: '您在"水稻育苗期需要注意什么？"问题中收到了新的回答。',
            time: '1小时前',
            isRead: false,
            extra: '水稻育苗期要注意温度控制在25-30℃之间...',
            targetId: 1,
            targetType: 'question'
          },
          {
            id: 5,
            type: 'interact',
            title: '张师傅回复了您的评论',
            content: '您在"拖拉机保养周期"课程下的评论收到了回复。',
            time: '昨天',
            isRead: false,
            extra: '张师傅回复：说得对，还要注意定期更换机油',
            targetId: 5,
            targetType: 'course'
          },
          
          // 评论回复
          {
            id: 6,
            type: 'comment',
            title: '新评论',
            content: '李老师评论了您的课程笔记："总结得很详细，赞！"',
            time: '3小时前',
            isRead: false,
            extra: null,
            targetId: 3,
            targetType: 'note'
          },
          {
            id: 7,
            type: 'comment',
            title: '新评论',
            content: '赵师傅评论了您的回答："这个方案很实用，我也试过"',
            time: '昨天',
            isRead: true,
            extra: null,
            targetId: 2,
            targetType: 'answer'
          },
          {
            id: 8,
            type: 'comment',
            title: '新评论',
            content: '刘教授评论了您的问题："很好的问题，建议补充具体情况"',
            time: '2天前',
            isRead: true,
            extra: null,
            targetId: 1,
            targetType: 'question'
          },
          
          // 点赞收藏
          {
            id: 9,
            type: 'like',
            title: '点赞通知',
            content: '您的回答获得了5个新的点赞',
            time: '1天前',
            isRead: false,
            extra: '累计获得15个点赞',
            targetId: 2,
            targetType: 'answer'
          },
          {
            id: 10,
            type: 'like',
            title: '收藏通知',
            content: '您的课程笔记被3位用户收藏',
            time: '2天前',
            isRead: true,
            extra: '《水稻种植要点》笔记',
            targetId: 3,
            targetType: 'note'
          },
          {
            id: 11,
            type: 'like',
            title: '点赞通知',
            content: '您的问题被8位用户点赞',
            time: '3天前',
            isRead: true,
            extra: '《猪舍温度控制》问题',
            targetId: 2,
            targetType: 'question'
          }
        ]
        
        // 计算未读数量
        this.messages = allMessages
        this.calculateUnreadCount()
        
        // 保存到本地存储
        uni.setStorageSync('messages', allMessages)
        
        this.hasMore = false
      }, 500)
    },
    
    calculateUnreadCount() {
      this.unreadCount = {
        system: this.messages.filter(m => m.type === 'system' && !m.isRead).length,
        interact: this.messages.filter(m => m.type === 'interact' && !m.isRead).length,
        comment: this.messages.filter(m => m.type === 'comment' && !m.isRead).length,
        like: this.messages.filter(m => m.type === 'like' && !m.isRead).length
      }
      
      // 更新全局未读消息数量
      const totalUnread = Object.values(this.unreadCount).reduce((a, b) => a + b, 0)
      uni.setStorageSync('totalUnreadMessages', totalUnread)
    },
    
    switchTab(tab) {
      this.currentTab = tab
      this.page = 1
    },
    
    loadMore() {
      // 分页加载
      if (this.hasMore) {
        this.loadingText = '加载中...'
        setTimeout(() => {
          this.page++
        }, 500)
      }
    },
    
    markAsRead(message) {
      if (!message.isRead) {
        message.isRead = true
        this.calculateUnreadCount()
        
        // 更新本地存储
        const messages = uni.getStorageSync('messages') || []
        const index = messages.findIndex(m => m.id === message.id)
        if (index !== -1) {
          messages[index].isRead = true
          uni.setStorageSync('messages', messages)
        }
      }
    },
    
    markAllAsRead() {
      uni.showModal({
        title: '提示',
        content: '确定将所有消息标记为已读吗？',
        success: (res) => {
          if (res.confirm) {
            this.messages.forEach(m => {
              if (m.type === this.currentTab) {
                m.isRead = true
              }
            })
            this.calculateUnreadCount()
            
            // 更新本地存储
            const messages = uni.getStorageSync('messages') || []
            messages.forEach(m => {
              if (m.type === this.currentTab) {
                m.isRead = true
              }
            })
            uni.setStorageSync('messages', messages)
            
            uni.showToast({
              title: '已全部标记为已读',
              icon: 'none'
            })
          }
        }
      })
    },
    
    deleteMessage(message) {
      uni.showModal({
        title: '提示',
        content: '确定删除这条消息吗？',
        success: (res) => {
          if (res.confirm) {
            // 从列表中移除
            this.messages = this.messages.filter(m => m.id !== message.id)
            this.calculateUnreadCount()
            
            // 从本地存储中移除
            const messages = uni.getStorageSync('messages') || []
            const updatedMessages = messages.filter(m => m.id !== message.id)
            uni.setStorageSync('messages', updatedMessages)
            
            uni.showToast({
              title: '已删除',
              icon: 'success'
            })
          }
        }
      })
    },
    
    clearAllMessages() {
      uni.showModal({
        title: '提示',
        content: '确定清空所有消息吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            // 清空当前分类的消息
            this.messages = this.messages.filter(m => m.type !== this.currentTab)
            this.calculateUnreadCount()
            
            // 更新本地存储
            const messages = uni.getStorageSync('messages') || []
            const updatedMessages = messages.filter(m => m.type !== this.currentTab)
            uni.setStorageSync('messages', updatedMessages)
            
            uni.showToast({
              title: '已清空',
              icon: 'success'
            })
          }
        }
      })
    },
    
    goToMessageDetail(message) {
      // 标记为已读
      this.markAsRead(message)
      
      // 根据消息类型跳转到对应页面
      switch(message.targetType) {
        case 'question':
          uni.navigateTo({
            url: '/pages/qa-detail/qa-detail?id=' + message.targetId
          })
          break
        case 'course':
          uni.navigateTo({
            url: '/pages/course-detail/course-detail?id=' + message.targetId
          })
          break
        case 'answer':
          uni.navigateTo({
            url: '/pages/qa-detail/qa-detail?id=' + message.targetId
          })
          break
        case 'note':
          uni.showToast({
            title: '笔记详情开发中',
            icon: 'none'
          })
          break
        default:
          uni.showToast({
            title: '消息详情',
            icon: 'none'
          })
      }
    }
  }
}
</script>

<style>
.message-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.message-container.dark-mode {
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

/* 分类标签 */
.tab-bar {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 20rpx;
  margin: 0 30rpx 20rpx 30rpx;
  border-radius: 50rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.tab-bar.dark-tab-bar {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 15rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 40rpx;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item.dark-tab-item {
  color: #aaa;
}

.tab-item.active {
  background: linear-gradient(135deg, #2b5e2b 0%, #1e4b1e 100%);
  color: #ffffff;
  font-weight: 500;
}

.tab-item.dark-active {
  background: linear-gradient(135deg, #1e4b1e 0%, #0f2a0f 100%);
  color: #fff;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: 10rpx;
  min-width: 30rpx;
  height: 30rpx;
  background-color: #f56c6c;
  color: #ffffff;
  font-size: 20rpx;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

/* 消息列表 */
.message-list-scroll {
  height: calc(100vh - 300rpx);
}

.message-list {
  padding: 0 30rpx;
}

.all-read-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.tip-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.tip-icon.dark-tip-icon {
  opacity: 0.2;
}

.tip-text {
  font-size: 30rpx;
  color: #999;
  transition: color 0.3s ease;
}

.tip-text.dark-tip-text {
  color: #666;
}

.message-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: row;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.message-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.message-card.unread {
  background-color: #f0f9f0;
  border-left: 8rpx solid #2b5e2b;
}

.message-card.dark-unread {
  background-color: #1e3a1e;
  border-left-color: #4CAF50;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
  transition: all 0.3s ease;
}

.message-icon.dark-icon {
  filter: brightness(0.9);
}

.icon-system {
  background-color: #e8f5e8;
  color: #2b5e2b;
}

.icon-interact {
  background-color: #fff3e0;
  color: #FF9800;
}

.icon-comment {
  background-color: #e3f2fd;
  color: #2196F3;
}

.icon-like {
  background-color: #ffebee;
  color: #F44336;
}

.message-content {
  flex: 1;
  padding-right: 50rpx;
}

.message-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.message-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
  transition: color 0.3s ease;
}

.message-title.dark-text {
  color: #fff;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.message-time.dark-time {
  color: #666;
}

.message-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.message-desc.dark-desc {
  color: #aaa;
}

.message-extra {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-top: 10rpx;
  transition: all 0.3s ease;
}

.message-extra.dark-extra {
  background-color: #3a3a3a;
}

.extra-text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.extra-text.dark-extra-text {
  color: #aaa;
}

.unread-dot {
  position: absolute;
  top: 30rpx;
  right: 80rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #f56c6c;
  border-radius: 8rpx;
}

.delete-btn {
  position: absolute;
  top: 30rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.delete-btn.dark-delete-btn {
  opacity: 0.3;
}

.delete-icon {
  font-size: 32rpx;
  color: #999;
  transition: color 0.3s ease;
}

.delete-icon.dark-delete-icon {
  color: #aaa;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: 1rpx solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: all 0.3s ease;
}

.bottom-bar.dark-bottom-bar {
  background-color: #2a2a2a;
  border-top-color: #3a3a3a;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.bottom-left, .bottom-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15rpx 50rpx;
  border-radius: 40rpx;
  transition: all 0.3s ease;
}

.bottom-left {
  background-color: #e8f5e8;
}

.bottom-left.dark-bottom-left {
  background-color: #1e3a1e;
}

.bottom-right {
  background-color: #ffebee;
}

.bottom-right.dark-bottom-right {
  background-color: #4a1e1e;
}

.mark-icon, .clear-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.mark-icon {
  color: #2b5e2b;
}

.mark-icon.dark-mark-icon {
  color: #4CAF50;
}

.clear-icon {
  color: #f56c6c;
}

.clear-icon.dark-clear-icon {
  color: #ef5350;
}

.mark-text {
  font-size: 28rpx;
  color: #2b5e2b;
  transition: color 0.3s ease;
}

.mark-text.dark-mark-text {
  color: #4CAF50;
}

.clear-text {
  font-size: 28rpx;
  color: #f56c6c;
  transition: color 0.3s ease;
}

.clear-text.dark-clear-text {
  color: #ef5350;
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
  padding: 20rpx;
  font-size: 24rpx;
  color: #ccc;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
  background-color: #2a2a2a;
}
</style>