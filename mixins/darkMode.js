// mixins/darkMode.js
export default {
  data() {
    return {
      darkMode: false
    }
  },
  
  onLoad() {
    // 获取深色模式状态
    const app = getApp()
    this.darkMode = app.globalData.darkMode || false
    
    // 监听深色模式变化
    uni.$on('darkModeChange', (darkMode) => {
      this.darkMode = darkMode
    })
  },
  
  onShow() {
    // 刷新深色模式状态
    const app = getApp()
    this.darkMode = app.globalData.darkMode || false
  },
  
  onUnload() {
    // 移除监听
    uni.$off('darkModeChange')
  }
}