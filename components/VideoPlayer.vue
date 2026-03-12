<template>
  <view>
    <!-- 视频播放弹窗 -->
    <view class="video-modal" :class="{ 'dark-mode': darkMode }" v-if="showModal" @click="closeModal">
      <view class="video-modal-content" @click.stop>
        <view class="video-modal-header" :class="{ 'dark-header': darkMode }">
          <view class="video-modal-title">
            <text class="title-text">{{ currentVideo?.title || '视频播放' }}</text>
          </view>
          <text class="video-modal-close" @click="closeModal">✕</text>
        </view>
        <view class="video-modal-body">
          <!-- 加载提示 -->
          <view v-if="loading" class="loading-container">
            <text class="loading-text" :class="{ 'dark-text-light': darkMode }">正在加载视频...</text>
          </view>
          
          <!-- 视频播放器 -->
          <video
            v-else-if="videoUrl"
            :src="videoUrl"
            controls
            autoplay
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
            @error="onError"
            @timeupdate="onTimeUpdate"
            show-progress
            show-fullscreen-btn
            enable-play-gesture
            :page-gesture="false"
            class="video-player"
          ></video>
          
          <!-- 错误提示 -->
          <view v-else-if="error" class="loading-container">
            <text class="error-text">{{ error }}</text>
            <text class="error-desc" :class="{ 'dark-error-desc': darkMode }" @click="loadVideoUrl">点击重试</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import baseUrl from '@/config.js'

export default {
  name: 'VideoPlayer',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    video: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      currentVideo: null,
      videoUrl: '',
      loading: false,
      error: '',
      isPlaying: false,
      currentTime: 0,
      progressReported: false,
      darkMode: false
    }
  },
  watch: {
    show: {
      handler(val) {
        console.log('VideoPlayer show 变化:', val)
        this.showModal = val
        if (val && this.video) {
          this.currentVideo = this.video
          this.loadVideoUrl()
          this.progressReported = false
        }
      },
      immediate: true
    },
    video: {
      handler(val) {
        console.log('VideoPlayer video 变化:', val)
        this.currentVideo = val
        if (this.showModal && val) {
          this.loadVideoUrl()
          this.progressReported = false
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取深色模式状态
    const app = getApp()
    this.darkMode = app?.globalData?.darkMode || false
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
  },
  beforeDestroy() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    closeModal() {
      console.log('关闭视频弹窗')
      this.showModal = false
      this.videoUrl = ''
      this.error = ''
      this.isPlaying = false
      this.currentTime = 0
      this.progressReported = false
      this.$emit('close')
    },
    
    async loadVideoUrl() {
      if (!this.currentVideo) {
        this.error = '没有视频数据'
        return
      }
      
      this.loading = true
      this.error = ''
      this.videoUrl = ''
      
      try {
        // 检查是否是B站视频
        if (this.currentVideo.id && this.currentVideo.id.startsWith('bili_')) {
          const bvid = this.currentVideo.bvid || this.currentVideo.id.replace('bili_', '')
          
          console.log('解析B站视频:', bvid)
          
          const res = await uni.request({
            url: baseUrl + '/video/parse/bilibili',
            method: 'GET',
            data: { bvid: bvid },
            timeout: 15000
          })
          
          console.log('解析结果:', res.data)
          
          if (res.data && res.data.success) {
            this.videoUrl = res.data.data.url
            console.log('获取到真实视频地址')
            
            // 通知父组件开始播放
            this.$emit('start', this.currentVideo)
          } else {
            // 解析失败，使用本地测试视频
            this.playLocalTestVideo()
          }
        } else {
          // 非B站视频，使用本地测试视频
          this.playLocalTestVideo()
        }
      } catch (error) {
        console.error('加载视频失败:', error)
        // 出错时使用本地测试视频
        this.playLocalTestVideo()
      } finally {
        this.loading = false
      }
    },
    
    // 播放本地测试视频
    playLocalTestVideo() {
      console.log('播放本地测试视频')
      
      // 本地测试视频路径
      this.videoUrl = '/static/videos/test.mp4'
      
      console.log('视频地址:', this.videoUrl)
      
      // 通知父组件开始播放
      this.$emit('start', this.currentVideo)
      
      uni.showToast({
        title: '播放测试视频',
        icon: 'none'
      })
    },
    
    onPlay() {
      this.isPlaying = true
      console.log('视频开始播放')
    },
    
    onPause(e) {
      this.isPlaying = false
      if (e && e.detail) {
        this.currentTime = e.detail.currentTime
        console.log('视频暂停于:', this.currentTime)
      }
    },
    
    onEnded() {
      console.log('视频播放结束')
      this.isPlaying = false
      this.$emit('complete', this.currentVideo)
    },
    
    onTimeUpdate(e) {
      if (!e || !e.detail) return
      
      this.currentTime = e.detail.currentTime
      const duration = e.detail.duration
      
      // 当播放到30%时记录进度
      if (duration > 0 && !this.progressReported && this.currentTime / duration > 0.3) {
        this.progressReported = true
        this.$emit('progress', {
          video: this.currentVideo,
          progress: 30
        })
      }
    },
    
    onError(e) {
      console.error('视频播放错误:', e)
      this.error = '视频播放失败，请重试'
      
      // 尝试重新播放本地视频
      if (this.videoUrl) {
        setTimeout(() => {
          this.playLocalTestVideo()
        }, 1000)
      }
    }
  }
}
</script>

<style>
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 深色模式 */
.video-modal.dark-mode {
  background-color: rgba(0, 0, 0, 0.98);
}

.video-modal-content {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

.video-modal-header {
  height: 100rpx;
  background: linear-gradient(180deg, #1a1a1a 0%, #000000 100%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #333;
  z-index: 10000;
}

.video-modal-header.dark-header {
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  border-bottom-color: #444;
}

.video-modal-title {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30rpx;
}

.title-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 500;
  lines: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.video-modal-close {
  color: #ffffff;
  font-size: 48rpx;
  padding: 10rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30rpx;
  background-color: rgba(255, 255, 255, 0.1);
}

.video-modal-body {
  flex: 1;
  width: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 40rpx;
}

.loading-text {
  color: #999;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  transition: color 0.3s ease;
}

.loading-text.dark-text-light {
  color: #666;
}

.error-text {
  color: #ff6b6b;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.error-desc {
  color: #2b5e2b;
  font-size: 28rpx;
  text-decoration: underline;
  padding: 20rpx;
  transition: color 0.3s ease;
}

.error-desc.dark-error-desc {
  color: #4CAF50;
}
</style>