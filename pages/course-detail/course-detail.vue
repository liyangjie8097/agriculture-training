<template>
  <view class="detail-container" :class="{ 'dark-mode': darkMode }">
    <!-- 顶部导航栏（非全屏时显示） -->
    <view class="custom-navbar" v-if="!isFullscreen" :class="{ 'dark-navbar': darkMode }">
      <view class="nav-left" @click="goBack">
        <text class="back-icon" :class="{ 'dark-icon': darkMode }">←</text>
      </view>
      <view class="nav-title" :class="{ 'dark-text': darkMode }">视频详情</view>
      <view class="nav-right">
        <text class="share-icon" :class="{ 'dark-icon': darkMode }">⋯</text>
      </view>
    </view>
    
    <!-- 视频播放区域 -->
    <view class="video-wrapper" :class="{ 'fullscreen': isFullscreen }">
      <video
        v-if="showVideo"
        id="courseVideo"
        class="course-video"
        :src="videoUrl"
        :poster="course.cover"
        controls
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @error="onVideoError"
        @fullscreenchange="onFullscreenChange"
        show-progress
        show-fullscreen-btn
        enable-play-gesture
        :page-gesture="false"
        :direction="90"
        :object-fit="videoFit"
      ></video>
      <view v-else class="video-cover-wrapper" @click="playVideo">
        <image class="video-cover" :src="course.cover" mode="aspectFill"></image>
        <view class="play-btn">
          <text class="play-icon">▶</text>
        </view>
      </view>
    </view>
    
    <!-- 视频信息区域 - 移到视频下方 -->
    <view class="video-info-section" v-if="!isFullscreen" :class="{ 'dark-section': darkMode }">
      <text class="video-title" :class="{ 'dark-text': darkMode }">{{ course.title }}</text>
    </view>
    
    <!-- 视频操作栏（仿B站）- 移到信息下方 -->
    <view class="action-bar" v-if="!isFullscreen" :class="{ 'dark-section': darkMode }">
      <view class="action-item" @click="likeVideo">
        <view class="action-icon-wrapper">
          <text class="action-icon" :class="{ 'liked': isLiked, 'dark-icon': darkMode && !isLiked }">👍</text>
          <text class="action-count" v-if="course.likes > 0" :class="{ 'dark-count': darkMode }">{{ course.likes }}</text>
        </view>
        <text class="action-text" :class="{ 'liked-text': isLiked, 'dark-text': darkMode && !isLiked }">点赞</text>
      </view>
      <view class="action-item" @click="favoriteVideo">
        <view class="action-icon-wrapper">
          <text class="action-icon" :class="{ 'favorited': isFavorited, 'dark-icon': darkMode && !isFavorited }">❤️</text>
        </view>
        <text class="action-text" :class="{ 'favorited-text': isFavorited, 'dark-text': darkMode && !isFavorited }">收藏</text>
      </view>
      <view class="action-item" @click="shareVideo">
        <view class="action-icon-wrapper">
          <text class="action-icon" :class="{ 'dark-icon': darkMode }">📤</text>
        </view>
        <text class="action-text" :class="{ 'dark-text': darkMode }">分享</text>
      </view>
      <view class="action-item" @click="downloadVideo">
        <view class="action-icon-wrapper">
          <text class="action-icon" :class="{ 'dark-icon': darkMode }">⬇️</text>
        </view>
        <text class="action-text" :class="{ 'dark-text': darkMode }">缓存</text>
      </view>
    </view>
    
    <!-- 视频播放量和点赞数（简洁版）- 移到操作栏下方 -->
    <view class="video-stats-section" v-if="!isFullscreen" :class="{ 'dark-section': darkMode, 'dark-border': darkMode }">
      <text class="stat-item" :class="{ 'dark-text-light': darkMode }">👁️ {{ course.playCount || '0' }}次观看</text>
      <text class="stat-item" :class="{ 'dark-text-light': darkMode }">👍 {{ course.likes || '0' }}点赞</text>
      <text class="stat-item" :class="{ 'dark-text-light': darkMode }">💬 {{ course.comments || '0' }}评论</text>
    </view>
    
    <!-- 全屏控制栏（全屏时显示） -->
    <view class="fullscreen-controls" v-if="isFullscreen">
      <view class="control-group">
        <view class="control-item" @click.stop="showSpeedMenu = true">
          <text class="control-label">倍速</text>
          <text class="control-value">{{ currentSpeed }}x</text>
        </view>
        <view class="control-item" @click.stop="showQualityMenu = true">
          <text class="control-label">画质</text>
          <text class="control-value">{{ currentQuality }}</text>
        </view>
        <view class="control-item" @click.stop="showRatioMenu = true">
          <text class="control-label">比例</text>
          <text class="control-value">{{ currentRatioText }}</text>
        </view>
      </view>
    </view>
    
    <!-- 倍速菜单 -->
    <view class="menu-mask" v-if="showSpeedMenu" @click="showSpeedMenu = false"></view>
    <view class="speed-menu" :class="{ 'fullscreen-menu': isFullscreen, 'dark-menu': darkMode }" v-if="showSpeedMenu">
      <view class="menu-title" :class="{ 'dark-menu-title': darkMode }">播放速度</view>
      <view 
        class="menu-item" 
        v-for="speed in speedOptions" 
        :key="speed"
        :class="{ 'dark-menu-item': darkMode }"
        @click="selectSpeed(speed)"
      >
        <text :class="{ 'dark-menu-text': darkMode }">{{ speed }}x</text>
        <text class="check-icon" v-if="currentSpeed === speed">✓</text>
      </view>
    </view>
    
    <!-- 画质菜单 -->
    <view class="menu-mask" v-if="showQualityMenu" @click="showQualityMenu = false"></view>
    <view class="quality-menu" :class="{ 'fullscreen-menu': isFullscreen, 'dark-menu': darkMode }" v-if="showQualityMenu">
      <view class="menu-title" :class="{ 'dark-menu-title': darkMode }">画质选择</view>
      <view 
        class="menu-item" 
        v-for="quality in qualityOptions" 
        :key="quality"
        :class="{ 'dark-menu-item': darkMode }"
        @click="selectQuality(quality)"
      >
        <text :class="{ 'dark-menu-text': darkMode }">{{ quality }}</text>
        <text class="check-icon" v-if="currentQuality === quality">✓</text>
      </view>
    </view>
    
    <!-- 画面比例菜单 -->
    <view class="menu-mask" v-if="showRatioMenu" @click="showRatioMenu = false"></view>
    <view class="ratio-menu" :class="{ 'fullscreen-menu': isFullscreen, 'dark-menu': darkMode }" v-if="showRatioMenu">
      <view class="menu-title" :class="{ 'dark-menu-title': darkMode }">画面比例</view>
      <view 
        class="menu-item" 
        v-for="ratio in ratioOptions" 
        :key="ratio.value"
        :class="{ 'dark-menu-item': darkMode }"
        @click="selectRatio(ratio)"
      >
        <text :class="{ 'dark-menu-text': darkMode }">{{ ratio.name }}</text>
        <text class="check-icon" v-if="videoFit === ratio.value">✓</text>
      </view>
    </view>
    
    <!-- 分隔线 -->
    <view class="divider" v-if="!isFullscreen" :class="{ 'dark-divider': darkMode }"></view>
    
    <!-- UP主信息区域（非全屏时显示） -->
    <view class="up-info-section" v-if="!isFullscreen" :class="{ 'dark-section': darkMode }">
      <view class="up-header">
        <view class="up-left">
          <image class="up-avatar" :src="course.authorAvatar || '/static/logo.png'" mode="aspectFill"></image>
          <view class="up-detail">
            <text class="up-name" :class="{ 'dark-text': darkMode }">{{ course.author || 'UP主' }}</text>
            <text class="up-desc" :class="{ 'dark-text-light': darkMode }">{{ course.authorDesc || '农业领域创作者' }}</text>
          </view>
        </view>
        <view class="follow-btn" :class="{ followed: isFollowed, 'dark-follow': darkMode && !isFollowed }" @click="toggleFollow">
          <text>{{ isFollowed ? '已关注' : '+ 关注' }}</text>
        </view>
      </view>
      
      <view class="video-desc">
        <text class="desc-text" :class="{ 'dark-text': darkMode }">{{ course.description || '暂无描述' }}</text>
        <text class="show-more" :class="{ 'dark-show-more': darkMode }" v-if="showFullDesc" @click="toggleDesc">收起</text>
        <text class="show-more" :class="{ 'dark-show-more': darkMode }" v-else @click="toggleDesc">展开</text>
      </view>
      
      <view class="video-tags">
        <view class="tag" :class="{ 'dark-tag': darkMode }" v-for="(tag, index) in tags" :key="index">{{ tag }}</view>
      </view>
      
      <text class="publish-time" :class="{ 'dark-text-light': darkMode }">{{ course.publishTime || '2026-01-01 发布' }}</text>
    </view>
    
    <!-- 评论区域（非全屏时显示） -->
    <view class="comments-section" v-if="!isFullscreen" :class="{ 'dark-section': darkMode }">
      <view class="comments-header">
        <text class="comments-title" :class="{ 'dark-text': darkMode }">评论区</text>
        <text class="comments-count" :class="{ 'dark-text-light': darkMode }">{{ comments.length }}条评论</text>
        <text class="sort-btn" :class="{ 'dark-sort-btn': darkMode }" @click="toggleSort">{{ sortText }}</text>
      </view>
      
      <!-- 写评论框 -->
      <view class="write-comment">
        <image class="my-avatar" :src="userAvatar || '/static/logo.png'" mode="aspectFill"></image>
        <input 
          class="comment-input" 
          :class="{ 'dark-input': darkMode }"
          type="text" 
          v-model="commentContent" 
          placeholder="发一条友善的评论..."
          confirm-type="send"
          @confirm="submitComment"
        />
        <button class="send-btn" :class="{ 'dark-send-btn': darkMode }" @click="submitComment">发布</button>
      </view>
      
      <!-- 评论列表 -->
      <view class="comment-list">
        <view class="comment-card" :class="{ 'dark-comment-card': darkMode }" v-for="(comment, index) in displayedComments" :key="index">
          <image class="comment-avatar" :src="comment.avatar || '/static/logo.png'" mode="aspectFill"></image>
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-name" :class="{ 'dark-text': darkMode }">{{ comment.name }}</text>
              <text class="comment-time" :class="{ 'dark-text-light': darkMode }">{{ comment.time }}</text>
            </view>
            <text class="comment-text" :class="{ 'dark-text': darkMode }">{{ comment.content }}</text>
            <view class="comment-actions">
              <text class="comment-action" :class="{ 'dark-action': darkMode }" @click="likeComment(comment)">👍 {{ comment.likes || 0 }}</text>
              <text class="comment-action" :class="{ 'dark-action': darkMode }" @click="replyComment(comment)">💬 回复</text>
            </view>
            
            <!-- 回复列表 -->
            <view class="reply-list" :class="{ 'dark-reply-list': darkMode }" v-if="comment.replies && comment.replies.length > 0">
              <view class="reply-item" v-for="(reply, idx) in comment.replies" :key="idx">
                <text class="reply-name" :class="{ 'dark-reply-name': darkMode }">{{ reply.name }}：</text>
                <text class="reply-text" :class="{ 'dark-reply-text': darkMode }">{{ reply.content }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多评论 -->
      <view class="load-more" @click="loadMoreComments" v-if="hasMoreComments">
        <text :class="{ 'dark-load-more': darkMode }">加载更多评论</text>
      </view>
    </view>
    
    <!-- 相关推荐（非全屏时显示） -->
    <view class="recommend-section" v-if="!isFullscreen" :class="{ 'dark-section': darkMode }">
      <view class="recommend-header">
        <text class="recommend-title" :class="{ 'dark-text': darkMode }">相关推荐</text>
      </view>
      
      <view class="recommend-list">
        <view class="recommend-card" :class="{ 'dark-recommend-card': darkMode }" v-for="(item, index) in recommendVideos" :key="index" @click="goToVideo(item)">
          <image class="recommend-cover" :src="item.cover" mode="aspectFill"></image>
          <view class="recommend-info">
            <text class="recommend-name" :class="{ 'dark-text': darkMode }">{{ item.title }}</text>
            <text class="recommend-author" :class="{ 'dark-text-light': darkMode }">{{ item.author }}</text>
            <text class="recommend-play" :class="{ 'dark-text-light': darkMode }">👁️ {{ item.playCount }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部留白 -->
    <view class="bottom-space" v-if="!isFullscreen"></view>
    
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
      courseId: '',
      showVideo: false,
      videoUrl: '/static/videos/test.mp4',
      isFullscreen: false,
      videoContext: null,
      
      // 倍速相关
      showSpeedMenu: false,
      currentSpeed: 1.0,
      speedOptions: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
      
      // 画质相关
      showQualityMenu: false,
      currentQuality: '自动',
      qualityOptions: ['自动', '360P', '480P', '720P', '1080P', '4K'],
      
      // 画面比例相关
      showRatioMenu: false,
      videoFit: 'contain',
      ratioOptions: [
        { name: '原始比例', value: 'contain' },
        { name: '铺满画面', value: 'fill' },
        { name: '16:9', value: 'cover' },
        { name: '4:3', value: 'contain' }
      ],
      
      // 课程数据
      course: {
        title: '水稻高产种植技术',
        cover: 'https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c',
        playCount: '23.4万',
        likes: 1234,
        comments: 89,
        author: '农业科普频道',
        authorAvatar: '',
        authorDesc: '优质农业领域创作者',
        description: '从选种到收割，30年经验老农手把手教学。本视频详细讲解了水稻种植的每一个环节，包括选种技巧、育苗方法、田间管理、病虫害防治、收割时机等。',
        publishTime: '2026-01-15'
      },
      tags: ['水稻种植', '农业技术', '农作物'],
      isLiked: false,
      isFavorited: false,
      isFollowed: false,
      showFullDesc: false,
      commentContent: '',
      userAvatar: '',
      comments: [
        {
          name: '新农人小王',
          avatar: '',
          content: '讲得太好了，终于明白为什么我家水稻总是产量不高了',
          time: '2小时前',
          likes: 56,
          replies: [
            { name: '老张', content: '确实，病虫害防治这块很关键' }
          ]
        },
        {
          name: '种植大户老李',
          avatar: '',
          content: '每年都看你的视频，学到了很多实用技巧',
          time: '昨天',
          likes: 23
        },
        {
          name: '农业专业学生',
          avatar: '',
          content: '作为农学生，老师的讲解非常专业，比课本生动多了',
          time: '3天前',
          likes: 89
        }
      ],
      sortBy: 'hot',
      page: 1,
      pageSize: 10,
      hasMoreComments: true,
      recommendVideos: [
        {
          id: 2,
          title: '大棚蔬菜管理技巧',
          cover: 'https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u',
          author: '蔬菜种植大全',
          playCount: '12.8万'
        },
        {
          id: 3,
          title: '拖拉机操作入门',
          cover: 'https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p',
          author: '农机手老李',
          playCount: '34.2万'
        },
        {
          id: 4,
          title: '养猪技术大全',
          cover: 'https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h',
          author: '猪司令',
          playCount: '67.3万'
        }
      ]
    }
  },
  computed: {
    sortText() {
      return this.sortBy === 'hot' ? '最热' : '最新'
    },
    displayedComments() {
      return this.comments.slice(0, this.page * this.pageSize)
    },
    currentRatioText() {
      const ratio = this.ratioOptions.find(r => r.value === this.videoFit)
      return ratio ? ratio.name : '原始比例'
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
    
    this.courseId = options.id
    // 可以根据 ID 设置不同的内容（所有时间都改为2026年）
    const courseData = {
      1: { title: '水稻高产种植技术', author: '农业科普频道', playCount: '23.4万', publishTime: '2026-01-15' },
      2: { title: '大棚蔬菜管理技巧', author: '蔬菜种植大全', playCount: '12.8万', publishTime: '2026-01-10' },
      3: { title: '拖拉机操作入门', author: '农机手老李', playCount: '34.2万', publishTime: '2026-01-05' },
      4: { title: '养猪技术大全', author: '猪司令', playCount: '67.3万', publishTime: '2026-01-12' },
      5: { title: '病虫害防治', author: '农技推广站', playCount: '18.2万', publishTime: '2026-01-08' },
      6: { title: '农产品电商', author: '电商讲师', playCount: '23.1万', publishTime: '2026-01-18' },
      7: { title: '玉米密植技术', author: '玉米专家', playCount: '18.9万', publishTime: '2026-01-20' },
      8: { title: '果树修剪大全', author: '园艺师', playCount: '21.3万', publishTime: '2026-01-22' },
      9: { title: '西瓜种植技术', author: '西瓜王', playCount: '14.7万', publishTime: '2026-01-25' },
      10: { title: '水产养殖技术', author: '水产达人', playCount: '19.4万', publishTime: '2026-01-28' }
    }
    const data = courseData[this.courseId] || courseData[1]
    this.course.title = data.title
    this.course.author = data.author
    this.course.playCount = data.playCount
    this.course.publishTime = data.publishTime
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
  onReady() {
    // 创建视频上下文
    this.videoContext = uni.createVideoContext('courseVideo')
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    playVideo() {
      this.showVideo = true
    },
    
    // 全屏状态变化事件
    onFullscreenChange(e) {
      this.isFullscreen = e.detail.fullScreen
      console.log('全屏状态变化:', this.isFullscreen)
      
      // 全屏时隐藏导航栏
      if (this.isFullscreen) {
        uni.hideTabBar()
        uni.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#000000'
        })
        uni.setNavigationBarTitle({ title: '' })
      } else {
        uni.showTabBar()
        uni.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#F8F8F8'
        })
        uni.setNavigationBarTitle({ title: this.course.title })
      }
    },
    
    // 选择倍速
    selectSpeed(speed) {
      this.currentSpeed = speed
      this.showSpeedMenu = false
      
      if (this.videoContext) {
        this.videoContext.playbackRate({
          rate: speed
        })
      }
    },
    
    // 选择画质
    selectQuality(quality) {
      this.currentQuality = quality
      this.showQualityMenu = false
      
      uni.showToast({
        title: '画质切换: ' + quality,
        icon: 'none'
      })
    },
    
    // 选择画面比例
    selectRatio(ratio) {
      this.videoFit = ratio.value
      this.showRatioMenu = false
      
      uni.showToast({
        title: '画面比例: ' + ratio.name,
        icon: 'none'
      })
    },
    
    // 点赞视频
    likeVideo() {
      this.isLiked = !this.isLiked
      if (this.isLiked) {
        this.course.likes++
        uni.showToast({ title: '点赞成功', icon: 'none' })
      } else {
        this.course.likes--
      }
    },
    
    // 收藏视频
    favoriteVideo() {
      this.isFavorited = !this.isFavorited
      uni.showToast({
        title: this.isFavorited ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
    },
    
    shareVideo() {
      uni.showActionSheet({
        itemList: ['分享到微信', '分享到朋友圈', '复制链接']
      })
    },
    
    downloadVideo() {
      uni.showToast({ title: '缓存功能开发中', icon: 'none' })
    },
    
    toggleFollow() {
      this.isFollowed = !this.isFollowed
    },
    
    toggleDesc() {
      this.showFullDesc = !this.showFullDesc
    },
    
    toggleSort() {
      this.sortBy = this.sortBy === 'hot' ? 'time' : 'hot'
    },
    
    // 提交评论
    submitComment() {
      if (!this.commentContent.trim()) {
        uni.showToast({ title: '请输入评论内容', icon: 'none' })
        return
      }
      
      const newComment = {
        name: '当前用户',
        avatar: this.userAvatar,
        content: this.commentContent,
        time: '刚刚',
        likes: 0
      }
      
      this.comments.unshift(newComment)
      this.commentContent = ''
      uni.showToast({ title: '评论成功', icon: 'success' })
    },
    
    likeComment(comment) {
      comment.likes = (comment.likes || 0) + 1
    },
    
    replyComment(comment) {
      uni.showToast({ title: '回复功能开发中', icon: 'none' })
    },
    
    loadMoreComments() {
      this.page++
      if (this.page * this.pageSize >= this.comments.length + 5) {
        this.hasMoreComments = false
      }
    },
    
    goToVideo(item) {
      uni.navigateTo({
        url: '/pages/course-detail/course-detail?id=' + item.id
      })
    },
    
    onPlay() {
      console.log('视频开始播放')
    },
    
    onPause() {
      console.log('视频暂停')
    },
    
    onEnded() {
      console.log('视频播放结束')
    },
    
    onVideoError(e) {
      console.error('视频错误', e)
      uni.showToast({ title: '视频加载失败', icon: 'none' })
    }
  }
}
</script>

<style>
.detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
  transition: all 0.3s ease;
}

/* 深色模式 */
.detail-container.dark-mode {
  background-color: #1a1a1a;
}

/* 顶部导航栏 */
.custom-navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.custom-navbar.dark-navbar {
  background-color: #2a2a2a;
  border-bottom-color: #3a3a3a;
}

.nav-left, .nav-right {
  width: 80rpx;
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  transition: color 0.3s ease;
}

.back-icon.dark-icon {
  color: #fff;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

.nav-title.dark-text {
  color: #fff;
}

.share-icon {
  font-size: 40rpx;
  color: #333;
  transition: color 0.3s ease;
}

.share-icon.dark-icon {
  color: #fff;
}

/* 视频播放区域 */
.video-wrapper {
  position: relative;
  width: 100%;
  height: 420rpx;
  background-color: #000;
}

.video-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background-color: #000;
}

.video-cover-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-cover {
  width: 100%;
  height: 100%;
}

.course-video {
  width: 100%;
  height: 100%;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  color: #ffffff;
  font-size: 48rpx;
  margin-left: 8rpx;
}

/* 视频信息区域 - 移到视频下方 */
.video-info-section {
  background-color: #ffffff;
  padding: 30rpx 30rpx 15rpx;
  transition: all 0.3s ease;
}

.video-info-section.dark-section {
  background-color: #2a2a2a;
}

.video-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: block;
  transition: color 0.3s ease;
}

.video-title.dark-text {
  color: #fff;
}

/* 视频操作栏 - 仿B站样式 */
.action-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 15rpx 30rpx 20rpx;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.action-bar.dark-section {
  background-color: #2a2a2a;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.action-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 6rpx;
}

.action-icon {
  font-size: 44rpx;
  color: #666;
  transition: all 0.2s ease;
}

.action-icon.dark-icon {
  color: #aaa;
}

/* 点赞激活样式 - B站粉 */
.action-icon.liked {
  color: #fb7299;
  transform: scale(1.1);
}

.action-text.liked-text {
  color: #fb7299;
  font-weight: 500;
}

/* 收藏激活样式 - 红色 */
.action-icon.favorited {
  color: #f56c6c;
  transform: scale(1.1);
}

.action-text.favorited-text {
  color: #f56c6c;
  font-weight: 500;
}

/* 数字角标 - 修复错位问题 */
.action-count {
  position: absolute;
  top: -33rpx;
  right: -8rpx;
  font-size: 22rpx;
  color: #999;
  background-color: #f5f5f5;
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  min-width: 30rpx;
  text-align: center;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.action-count.dark-count {
  background-color: #3a3a3a;
  color: #aaa;
}

.action-text {
  font-size: 24rpx;
  color: #666;
  transition: color 0.2s ease;
}

.action-text.dark-text {
  color: #aaa;
}

/* 视频统计数据区域 */
.video-stats-section {
  background-color: #ffffff;
  padding: 0 30rpx 30rpx;
  display: flex;
  flex-direction: row;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.video-stats-section.dark-section {
  background-color: #2a2a2a;
}

.video-stats-section.dark-border {
  border-bottom-color: #3a3a3a;
}

.stat-item {
  font-size: 26rpx;
  color: #999;
  margin-right: 40rpx;
  transition: color 0.3s ease;
}

.stat-item.dark-text-light {
  color: #aaa;
}

/* 全屏控制栏 */
.fullscreen-controls {
  position: absolute;
  bottom: 120rpx;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.control-group {
  display: flex;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 60rpx;
  padding: 15rpx 20rpx;
  pointer-events: auto;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.5);
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx 30rpx;
  border-radius: 40rpx;
  background-color: rgba(255, 255, 255, 0.15);
  margin: 0 10rpx;
  min-width: 100rpx;
}

.control-label {
  font-size: 22rpx;
  color: rgba(255,255,255,0.8);
  margin-bottom: 6rpx;
}

.control-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 菜单遮罩 */
.menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10000;
}

/* 菜单样式 */
.speed-menu,
.quality-menu,
.ratio-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 30rpx;
  z-index: 10001;
  max-height: 60vh;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.speed-menu.dark-menu,
.quality-menu.dark-menu,
.ratio-menu.dark-menu {
  background-color: #2a2a2a;
}

.fullscreen-menu {
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 70%;
  max-width: 600rpx;
  border-radius: 40rpx;
  background-color: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.8);
}

.fullscreen-menu .menu-title {
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.fullscreen-menu .menu-item {
  color: #eeeeee;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.fullscreen-menu .menu-item:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.fullscreen-menu .check-icon {
  color: #fb7299;
}

.menu-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  transition: all 0.3s ease;
}

.menu-title.dark-menu-title {
  color: #fff;
  border-bottom-color: #3a3a3a;
}

.menu-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 20rpx;
  font-size: 28rpx;
  color: #666;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.3s ease;
}

.menu-item.dark-menu-item {
  color: #aaa;
  border-bottom-color: #3a3a3a;
}

.menu-item:active {
  background-color: #f5f5f5;
}

.menu-item.dark-menu-item:active {
  background-color: #3a3a3a;
}

.check-icon {
  color: #fb7299;
  font-size: 32rpx;
  font-weight: bold;
}

/* 分隔线 */
.divider {
  height: 16rpx;
  background-color: #f5f5f5;
  width: 100%;
  transition: all 0.3s ease;
}

.divider.dark-divider {
  background-color: #2a2a2a;
}

/* UP主信息区域 */
.up-info-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.up-info-section.dark-section {
  background-color: #2a2a2a;
}

.up-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.up-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

.up-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.up-detail {
  display: flex;
  flex-direction: column;
}

.up-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 6rpx;
  transition: color 0.3s ease;
}

.up-name.dark-text {
  color: #fff;
}

.up-desc {
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.up-desc.dark-text-light {
  color: #aaa;
}

.follow-btn {
  padding: 12rpx 30rpx;
  background-color: #fb7299;
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 40rpx;
  min-width: 120rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.follow-btn.followed {
  background-color: #f0f0f0;
  color: #999;
}

.follow-btn.dark-follow {
  background-color: #4CAF50;
  color: #fff;
}

.video-desc {
  margin-bottom: 20rpx;
  position: relative;
}

.desc-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.desc-text.dark-text {
  color: #aaa;
}

.show-more {
  position: absolute;
  right: 0;
  bottom: -10rpx;
  font-size: 26rpx;
  color: #fb7299;
  background-color: #ffffff;
  padding-left: 20rpx;
  transition: all 0.3s ease;
}

.show-more.dark-show-more {
  color: #4CAF50;
  background-color: #2a2a2a;
}

.video-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 15rpx;
}

.tag {
  padding: 6rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #666;
  margin-right: 15rpx;
  margin-bottom: 10rpx;
  transition: all 0.3s ease;
}

.tag.dark-tag {
  background-color: #3a3a3a;
  color: #aaa;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
  transition: color 0.3s ease;
}

.publish-time.dark-text-light {
  color: #aaa;
}

/* 评论区 */
.comments-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.comments-section.dark-section {
  background-color: #2a2a2a;
}

.comments-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
}

.comments-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-right: 15rpx;
  transition: color 0.3s ease;
}

.comments-title.dark-text {
  color: #fff;
}

.comments-count {
  font-size: 26rpx;
  color: #999;
  flex: 1;
  transition: color 0.3s ease;
}

.comments-count.dark-text-light {
  color: #aaa;
}

.sort-btn {
  font-size: 26rpx;
  color: #fb7299;
  padding: 10rpx;
  transition: color 0.3s ease;
}

.sort-btn.dark-sort-btn {
  color: #4CAF50;
}

.write-comment {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 40rpx;
}

.my-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 20rpx;
}

.comment-input {
  flex: 1;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 25rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
  transition: all 0.3s ease;
}

.comment-input.dark-input {
  background-color: #3a3a3a;
  color: #fff;
}

.send-btn {
  background-color: #fb7299;
  color: #ffffff;
  font-size: 26rpx;
  padding: 15rpx 30rpx;
  border-radius: 35rpx;
  line-height: 1;
  border: none;
  transition: background-color 0.3s ease;
}

.send-btn.dark-send-btn {
  background-color: #4CAF50;
}

.comment-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
}

.comment-card.dark-comment-card {
  background-color: #2a2a2a;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 10rpx;
}

.comment-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-right: 20rpx;
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

.comment-time.dark-text-light {
  color: #aaa;
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 15rpx;
  display: block;
  transition: color 0.3s ease;
}

.comment-text.dark-text {
  color: #fff;
}

.comment-actions {
  display: flex;
  flex-direction: row;
  margin-bottom: 15rpx;
}

.comment-action {
  font-size: 24rpx;
  color: #999;
  margin-right: 40rpx;
  transition: color 0.3s ease;
}

.comment-action.dark-action {
  color: #aaa;
}

.reply-list {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 15rpx;
  margin-top: 10rpx;
  transition: all 0.3s ease;
}

.reply-list.dark-reply-list {
  background-color: #3a3a3a;
}

.reply-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10rpx;
  transition: color 0.3s ease;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-name {
  color: #fb7299;
  font-weight: 500;
  margin-right: 10rpx;
  transition: color 0.3s ease;
}

.reply-name.dark-reply-name {
  color: #4CAF50;
}

.reply-text {
  color: #333;
  transition: color 0.3s ease;
}

.reply-text.dark-reply-text {
  color: #fff;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  color: #fb7299;
  font-size: 28rpx;
  transition: color 0.3s ease;
}

.load-more.dark-load-more {
  color: #4CAF50;
}

/* 相关推荐 */
.recommend-section {
  background-color: #ffffff;
  padding: 30rpx;
  transition: all 0.3s ease;
}

.recommend-section.dark-section {
  background-color: #2a2a2a;
}

.recommend-header {
  margin-bottom: 30rpx;
}

.recommend-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.recommend-title.dark-text {
  color: #fff;
}

.recommend-list {
  display: flex;
  flex-direction: column;
}

.recommend-card {
  display: flex;
  flex-direction: row;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.recommend-card.dark-recommend-card {
  border-bottom-color: #3a3a3a;
}

.recommend-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.recommend-cover {
  width: 200rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommend-name {
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

.recommend-name.dark-text {
  color: #fff;
}

.recommend-author {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 6rpx;
  transition: color 0.3s ease;
}

.recommend-author.dark-text-light {
  color: #aaa;
}

.recommend-play {
  font-size: 22rpx;
  color: #999;
  transition: color 0.3s ease;
}

.recommend-play.dark-text-light {
  color: #aaa;
}

.bottom-space {
  height: 30rpx;
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