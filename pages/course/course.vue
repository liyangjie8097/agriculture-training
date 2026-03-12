<template>
  <view class="course-container" :class="{ 'dark-mode': darkMode }">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar" :class="{ 'dark-navbar': darkMode }">
      <text class="nav-title" :class="{ 'dark-text': darkMode }">视频库</text>
      <view class="nav-right">
        <text class="search-icon" :class="{ 'dark-icon': darkMode }" @click="goToSearch">🔍</text>
      </view>
    </view>
    
    <!-- 分类导航（农业技能相关） -->
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
    
    <!-- 视频列表（优化两列） -->
    <scroll-view class="video-list-scroll" scroll-y @scrolltolower="loadMore">
      <view class="video-list">
        <view 
          class="video-card" 
          :class="{ 'dark-card': darkMode }"
          v-for="video in filteredVideos" 
          :key="video.id"
          @click="goToDetail(video)"
        >
          <!-- 封面区域（保持原有渐变色，无需深色模式调整） -->
          <view class="video-cover" :style="{ background: video.bgColor }">
            <text class="cover-title">{{ video.title.substring(0, 4) }}</text>
            <view class="cover-category">{{ getCategoryName(video.category) }}</view>
          </view>
          
          <!-- 信息区域 -->
          <view class="video-info">
            <text class="video-title" :class="{ 'dark-title': darkMode }">{{ video.title }}</text>
            <view class="video-meta" :class="{ 'dark-meta': darkMode }">
              <text class="video-author" :class="{ 'dark-author': darkMode }">👤 {{ video.author }}</text>
              <text class="video-play" :class="{ 'dark-play': darkMode }">👁️ {{ video.playCount }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text :class="{ 'dark-load-text': darkMode }">{{ loadingText }}</text>
      </view>
    </scroll-view>
    
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
    // 农业技能相关分类（去除电商）
    const categories = [
      { name: '种植技术', value: 'plant' },
      { name: '养殖技术', value: 'breed' },
      { name: '农机操作', value: 'machine' },
      { name: '病虫害防治', value: 'pest' },
      { name: '农产品加工', value: 'process' },
      { name: '土壤肥料', value: 'soil' },
      { name: '良种繁育', value: 'seed' },
      { name: '节水灌溉', value: 'irrigation' },
      { name: '设施农业', value: 'facility' },
      { name: '其他', value: 'other' }
    ]
    
    // 暗色系渐变色
    const gradients = [
      'linear-gradient(145deg, #2c3e50, #34495e)',      // 深灰蓝
      'linear-gradient(145deg, #1e3c2c, #2c5f2d)',      // 森林绿
      'linear-gradient(145deg, #3a2c2c, #8b5a2b)',      // 棕褐色
      'linear-gradient(145deg, #2b1e3c, #6c3483)',      // 深紫色
      'linear-gradient(145deg, #1e2b3c, #2874a6)',      // 深海蓝
      'linear-gradient(145deg, #3c2e1e, #b45f06)',      // 大地色
      'linear-gradient(145deg, #2c1e2b, #943126)',      // 暗红色
      'linear-gradient(145deg, #1e3c3c, #117a65)',      // 墨绿松
      'linear-gradient(145deg, #2c2c1e, #b7950b)',      // 橄榄绿
      'linear-gradient(145deg, #3c1e2b, #cb4335)',      // 砖红色
      'linear-gradient(145deg, #1e2b2c, #1f618d)',      // 灰蓝
      'linear-gradient(145deg, #2c1e2c, #76448a)',      // 紫罗兰
      'linear-gradient(145deg, #1e3c2c, #1e8449)',      // 翠绿
      'linear-gradient(145deg, #2c3e50, #5d6d7e)',      // 雾霾蓝
      'linear-gradient(145deg, #3c2c2c, #a569bd)'       // 淡紫
    ]
    
    return {
      darkMode: false,
      currentCategory: 'all',
      categories: categories,
      videos: [
        // 种植技术类 (plant) - 15个
        { id: 101, title: '水稻高产种植技术', bgColor: gradients[0], author: '农业科普', playCount: '23.4万', category: 'plant' },
        { id: 102, title: '玉米密植高产栽培', bgColor: gradients[1], author: '玉米专家', playCount: '18.9万', category: 'plant' },
        { id: 103, title: '小麦返青期管理', bgColor: gradients[2], author: '小麦所', playCount: '15.2万', category: 'plant' },
        { id: 104, title: '果树修剪技术大全', bgColor: gradients[3], author: '园艺师', playCount: '21.3万', category: 'plant' },
        { id: 105, title: '西瓜种植技术', bgColor: gradients[4], author: '西瓜王', playCount: '14.7万', category: 'plant' },
        { id: 106, title: '草莓大棚种植', bgColor: gradients[5], author: '草莓达', playCount: '16.8万', category: 'plant' },
        { id: 107, title: '葡萄种植管理', bgColor: gradients[6], author: '葡萄王', playCount: '19.2万', category: 'plant' },
        { id: 108, title: '土豆高产栽培', bgColor: gradients[7], author: '土豆专', playCount: '13.5万', category: 'plant' },
        { id: 109, title: '蔬菜育苗技术', bgColor: gradients[8], author: '育苗专', playCount: '11.2万', category: 'plant' },
        { id: 110, title: '大棚蔬菜管理', bgColor: gradients[9], author: '蔬菜大', playCount: '12.8万', category: 'plant' },
        { id: 111, title: '果园水肥管理', bgColor: gradients[10], author: '果树专', playCount: '17.3万', category: 'plant' },
        { id: 112, title: '茶树种植技术', bgColor: gradients[11], author: '茶农', playCount: '14.2万', category: 'plant' },
        { id: 113, title: '花生高产技术', bgColor: gradients[12], author: '花生专', playCount: '12.7万', category: 'plant' },
        { id: 114, title: '大豆种植技术', bgColor: gradients[13], author: '大豆所', playCount: '15.8万', category: 'plant' },
        { id: 115, title: '中药材种植', bgColor: gradients[14], author: '药材专', playCount: '16.4万', category: 'plant' },
        
        // 养殖技术类 (breed) - 15个
        { id: 201, title: '生猪科学养殖', bgColor: gradients[0], author: '猪司令', playCount: '67.3万', category: 'breed' },
        { id: 202, title: '家禽生态养殖', bgColor: gradients[1], author: '养鸡户', playCount: '34.2万', category: 'breed' },
        { id: 203, title: '牛羊育肥技术', bgColor: gradients[2], author: '养殖专', playCount: '28.9万', category: 'breed' },
        { id: 204, title: '水产养殖技术', bgColor: gradients[3], author: '水产达', playCount: '19.4万', category: 'breed' },
        { id: 205, title: '蜜蜂养殖技术', bgColor: gradients[4], author: '蜂农', playCount: '11.2万', category: 'breed' },
        { id: 206, title: '兔子养殖技术', bgColor: gradients[5], author: '兔专家', playCount: '14.8万', category: 'breed' },
        { id: 207, title: '肉牛育肥技术', bgColor: gradients[6], author: '养牛户', playCount: '23.5万', category: 'breed' },
        { id: 208, title: '奶山羊养殖', bgColor: gradients[7], author: '养羊专', playCount: '17.2万', category: 'breed' },
        { id: 209, title: '鸭鹅养殖技术', bgColor: gradients[8], author: '水禽专', playCount: '15.6万', category: 'breed' },
        { id: 210, title: '鸽子养殖技术', bgColor: gradients[9], author: '养鸽达', playCount: '12.3万', category: 'breed' },
        { id: 211, title: '蚯蚓养殖技术', bgColor: gradients[10], author: '蚯蚓专', playCount: '9.8万', category: 'breed' },
        { id: 212, title: '鸵鸟养殖技术', bgColor: gradients[11], author: '特种养', playCount: '13.1万', category: 'breed' },
        { id: 213, title: '饲料配比技术', bgColor: gradients[12], author: '营养专', playCount: '16.2万', category: 'breed' },
        { id: 214, title: '疫病防控技术', bgColor: gradients[13], author: '兽医', playCount: '22.4万', category: 'breed' },
        { id: 215, title: '繁殖育种技术', bgColor: gradients[14], author: '育种专', playCount: '18.7万', category: 'breed' },
        
        // 农机操作类 (machine) - 12个
        { id: 301, title: '拖拉机操作入门', bgColor: gradients[0], author: '农机手', playCount: '34.2万', category: 'machine' },
        { id: 302, title: '收割机使用指南', bgColor: gradients[1], author: '陈师傅', playCount: '28.7万', category: 'machine' },
        { id: 303, title: '无人机植保技术', bgColor: gradients[2], author: '飞手王', playCount: '42.1万', category: 'machine' },
        { id: 304, title: '插秧机操作技巧', bgColor: gradients[3], author: '农机培', playCount: '16.8万', category: 'machine' },
        { id: 305, title: '烘干机使用维护', bgColor: gradients[4], author: '粮食加', playCount: '13.5万', category: 'machine' },
        { id: 306, title: '播种机调试', bgColor: gradients[5], author: '农机专', playCount: '14.2万', category: 'machine' },
        { id: 307, title: '旋耕机操作', bgColor: gradients[6], author: '老农机', playCount: '11.8万', category: 'machine' },
        { id: 308, title: '喷灌设备使用', bgColor: gradients[7], author: '灌溉专', playCount: '12.4万', category: 'machine' },
        { id: 309, title: '微耕机操作', bgColor: gradients[8], author: '农机达', playCount: '15.3万', category: 'machine' },
        { id: 310, title: '农用无人机', bgColor: gradients[9], author: '飞防队', playCount: '22.6万', category: 'machine' },
        { id: 311, title: '农机维修技术', bgColor: gradients[10], author: '维修师', playCount: '17.8万', category: 'machine' },
        { id: 312, title: '农机保养常识', bgColor: gradients[11], author: '老农机', playCount: '14.5万', category: 'machine' },
        
        // 病虫害防治类 (pest) - 10个
        { id: 401, title: '常见病虫害识别', bgColor: gradients[12], author: '农技站', playCount: '18.2万', category: 'pest' },
        { id: 402, title: '水稻稻瘟病防治', bgColor: gradients[13], author: '植保专', playCount: '22.3万', category: 'pest' },
        { id: 403, title: '果树病虫害防治', bgColor: gradients[14], author: '果农友', playCount: '19.7万', category: 'pest' },
        { id: 404, title: '蔬菜病害识别', bgColor: gradients[0], author: '蔬菜医', playCount: '15.4万', category: 'pest' },
        { id: 405, title: '玉米病虫害', bgColor: gradients[1], author: '玉米专', playCount: '16.7万', category: 'pest' },
        { id: 406, title: '小麦赤霉病防治', bgColor: gradients[2], author: '小麦所', playCount: '14.5万', category: 'pest' },
        { id: 407, title: '农药使用技巧', bgColor: gradients[3], author: '农药专', playCount: '21.8万', category: 'pest' },
        { id: 408, title: '生物防治技术', bgColor: gradients[4], author: '生态农', playCount: '13.2万', category: 'pest' },
        { id: 409, title: '病害预测预报', bgColor: gradients[5], author: '测报站', playCount: '11.6万', category: 'pest' },
        { id: 410, title: '综合防治技术', bgColor: gradients[6], author: '植保站', playCount: '16.3万', category: 'pest' },
        
        // 农产品加工类 (process) - 8个
        { id: 501, title: '农产品初加工', bgColor: gradients[7], author: '加工专', playCount: '11.3万', category: 'process' },
        { id: 502, title: '粮食烘干技术', bgColor: gradients[8], author: '粮食加', playCount: '9.8万', category: 'process' },
        { id: 503, title: '果蔬保鲜技术', bgColor: gradients[9], author: '保鲜专', playCount: '14.2万', category: 'process' },
        { id: 504, title: '榨油技术', bgColor: gradients[10], author: '榨油师', playCount: '10.5万', category: 'process' },
        { id: 505, title: '酿酒技术', bgColor: gradients[11], author: '酿酒师', playCount: '16.3万', category: 'process' },
        { id: 506, title: '饲料加工', bgColor: gradients[12], author: '饲料专', playCount: '12.7万', category: 'process' },
        { id: 507, title: '农产品分级', bgColor: gradients[13], author: '质检员', playCount: '8.9万', category: 'process' },
        { id: 508, title: '农产品包装', bgColor: gradients[14], author: '包装师', playCount: '9.2万', category: 'process' },
        
        // 土壤肥料类 (soil) - 6个
        { id: 601, title: '土壤改良技术', bgColor: gradients[0], author: '土肥专', playCount: '12.3万', category: 'soil' },
        { id: 602, title: '测土配方施肥', bgColor: gradients[1], author: '农技站', playCount: '14.5万', category: 'soil' },
        { id: 603, title: '有机肥制作', bgColor: gradients[2], author: '生态农', playCount: '16.2万', category: 'soil' },
        { id: 604, title: '化肥使用技巧', bgColor: gradients[3], author: '土肥专', playCount: '13.7万', category: 'soil' },
        { id: 605, title: '土壤酸碱调节', bgColor: gradients[4], author: '农技师', playCount: '10.8万', category: 'soil' },
        { id: 606, title: '土壤检测方法', bgColor: gradients[5], author: '检测站', playCount: '9.4万', category: 'soil' },
        
        // 良种繁育类 (seed) - 6个
        { id: 701, title: '水稻良种繁育', bgColor: gradients[6], author: '育种家', playCount: '13.2万', category: 'seed' },
        { id: 702, title: '玉米制种技术', bgColor: gradients[7], author: '种子站', playCount: '15.6万', category: 'seed' },
        { id: 703, title: '蔬菜种子处理', bgColor: gradients[8], author: '育苗专', playCount: '11.8万', category: 'seed' },
        { id: 704, title: '种子贮藏技术', bgColor: gradients[9], author: '种子库', playCount: '8.7万', category: 'seed' },
        { id: 705, title: '杂交育种技术', bgColor: gradients[10], author: '育种家', playCount: '17.3万', category: 'seed' },
        { id: 706, title: '种子质量检验', bgColor: gradients[11], author: '质检站', playCount: '9.8万', category: 'seed' },
        
        // 节水灌溉类 (irrigation) - 6个
        { id: 801, title: '滴灌技术应用', bgColor: gradients[12], author: '灌溉专', playCount: '14.2万', category: 'irrigation' },
        { id: 802, title: '喷灌系统设计', bgColor: gradients[13], author: '水利师', playCount: '12.5万', category: 'irrigation' },
        { id: 803, title: '微灌技术', bgColor: gradients[14], author: '灌溉专', playCount: '11.3万', category: 'irrigation' },
        { id: 804, title: '水肥一体化', bgColor: gradients[0], author: '农技师', playCount: '18.6万', category: 'irrigation' },
        { id: 805, title: '节水灌溉模式', bgColor: gradients[1], author: '水利局', playCount: '10.2万', category: 'irrigation' },
        { id: 806, title: '灌溉制度制定', bgColor: gradients[2], author: '农水专', playCount: '9.7万', category: 'irrigation' },
        
        // 设施农业类 (facility) - 6个
        { id: 901, title: '大棚建造技术', bgColor: gradients[3], author: '设施专', playCount: '16.8万', category: 'facility' },
        { id: 902, title: '温室环境调控', bgColor: gradients[4], author: '园艺师', playCount: '14.3万', category: 'facility' },
        { id: 903, title: '大棚蔬菜种植', bgColor: gradients[5], author: '菜农', playCount: '19.2万', category: 'facility' },
        { id: 904, title: '温室大棚管理', bgColor: gradients[6], author: '设施专', playCount: '15.7万', category: 'facility' },
        { id: 905, title: '大棚保温技术', bgColor: gradients[7], author: '农技师', playCount: '12.4万', category: 'facility' },
        { id: 906, title: '大棚通风技巧', bgColor: gradients[8], author: '菜农', playCount: '11.8万', category: 'facility' },
        
        // 其他类 (other) - 6个
        { id: 1001, title: '农业气象知识', bgColor: gradients[9], author: '气象员', playCount: '8.7万', category: 'other' },
        { id: 1002, title: '农业保险指南', bgColor: gradients[10], author: '保险员', playCount: '7.9万', category: 'other' },
        { id: 1003, title: '农业政策解读', bgColor: gradients[11], author: '农经师', playCount: '12.3万', category: 'other' },
        { id: 1004, title: '农业合作社管理', bgColor: gradients[12], author: '社长', playCount: '10.5万', category: 'other' },
        { id: 1005, title: '农产品营销', bgColor: gradients[13], author: '营销员', playCount: '14.2万', category: 'other' },
        { id: 1006, title: '农业法律法规', bgColor: gradients[14], author: '法律顾问', playCount: '9.3万', category: 'other' }
      ],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loadingText: '加载中...'
    }
  },
  computed: {
    filteredVideos() {
      if (this.currentCategory === 'all') {
        return this.videos
      }
      return this.videos.filter(v => v.category === this.currentCategory)
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
  },
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  },
  methods: {
    getCategoryName(category) {
      const map = {
        plant: '种植',
        breed: '养殖',
        machine: '农机',
        pest: '防治',
        process: '加工',
        soil: '土肥',
        seed: '良种',
        irrigation: '灌溉',
        facility: '设施',
        other: '其他'
      }
      return map[category] || category
    },
    
    switchCategory(category) {
      this.currentCategory = category
    },
    
    loadMore() {
      // 加载更多逻辑
    },
    
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      })
    },
    
    goToDetail(video) {
      uni.navigateTo({
        url: '/pages/course-detail/course-detail?id=' + video.id
      })
    }
  }
}
</script>

<style>
.course-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

/* 深色模式 */
.course-container.dark-mode {
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

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.nav-title.dark-text {
  color: #fff;
}

.nav-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-icon {
  font-size: 40rpx;
  color: #333;
  transition: color 0.3s ease;
}

.search-icon.dark-icon {
  color: #fff;
}

/* 分类导航 - 可横向滚动 */
.category-scroll {
  height: 90rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
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
  color: #fb7299;
  font-weight: 500;
}

.category-item.dark-active {
  color: #ff85a9;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background-color: #fb7299;
  border-radius: 2rpx;
}

.category-item.dark-active::after {
  background-color: #ff85a9;
}

/* 视频列表 - 两列优化 */
.video-list-scroll {
  height: calc(100vh - 180rpx);
}

.video-list {
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.video-card {
  width: 48%;
  background-color: #ffffff;
  border-radius: 20rpx;
  margin-bottom: 25rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.video-card.dark-card {
  background-color: #2a2a2a;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.3);
}

.video-card:active {
  transform: scale(0.98);
}

.video-cover {
  width: 100%;
  height: 220rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.cover-title {
  font-size: 44rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.4);
  letter-spacing: 2rpx;
}

.cover-category {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.25);
  padding: 6rpx 24rpx;
  border-radius: 40rpx;
  backdrop-filter: blur(4px);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.video-info {
  padding: 20rpx 16rpx;
}

.video-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
  lines: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.video-title.dark-title {
  color: #fff;
}

.video-meta {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 22rpx;
  color: #888;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 12rpx;
  transition: all 0.3s ease;
}

.video-meta.dark-meta {
  color: #aaa;
  border-top-color: #3a3a3a;
}

.video-author {
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #666;
  transition: color 0.3s ease;
}

.video-author.dark-author {
  color: #aaa;
}

.video-play {
  color: #999;
  margin-left: 10rpx;
  transition: color 0.3s ease;
}

.video-play.dark-play {
  color: #aaa;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
  transition: color 0.3s ease;
}

.load-more.dark-load-text {
  color: #666;
}

.dev-info {
  text-align: center;
  padding: 20rpx;
  font-size: 24rpx;
  color: #ccc;
  transition: color 0.3s ease;
}

.dev-info.dark-dev {
  color: #666;
}
</style>