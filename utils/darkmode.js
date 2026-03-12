// 深色模式工具函数

// 获取深色模式状态
export function getDarkMode() {
  try {
    const settings = uni.getStorageSync('appSettings') || {}
    return settings.darkMode || false
  } catch (error) {
    console.error('获取深色模式失败:', error)
    return false
  }
}

// 保存深色模式状态
export function saveDarkMode(darkMode) {
  try {
    const settings = uni.getStorageSync('appSettings') || {}
    settings.darkMode = darkMode
    uni.setStorageSync('appSettings', settings)
    return true
  } catch (error) {
    console.error('保存深色模式失败:', error)
    return false
  }
}

// 设置导航栏颜色
export function setNavigationBarColor(darkMode) {
  try {
    if (darkMode) {
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1a1a1a'
      })
    } else {
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F8F8F8'
      })
    }
  } catch (error) {
    console.error('设置导航栏颜色失败:', error)
  }
}

// 更新全局深色模式状态
export function updateGlobalDarkMode(darkMode) {
  const app = getApp()
  if (app) {
    app.globalData.darkMode = darkMode
  }
  // 触发事件
  uni.$emit('darkModeChange', darkMode)
}

// 切换深色模式（完整流程）
export function toggleDarkMode(darkMode) {
  // 保存到本地
  saveDarkMode(darkMode)
  // 更新全局变量
  updateGlobalDarkMode(darkMode)
  // 设置导航栏
  setNavigationBarColor(darkMode)
  
  return darkMode
}

// 初始化页面深色模式（在页面的 onLoad 中调用）
export function initPageDarkMode(page) {
  // 获取当前深色模式状态
  const darkMode = getDarkMode()
  page.setData({ darkMode })
  
  // 监听深色模式变化
  uni.$on('darkModeChange', (darkMode) => {
    page.setData({ darkMode })
  })
}

// 销毁页面监听（在页面的 onUnload 中调用）
export function destroyPageDarkMode() {
  uni.$off('darkModeChange')
}

// 获取当前字体大小
export function getFontSize() {
  try {
    const settings = uni.getStorageSync('appSettings') || {}
    return settings.fontSize || 1 // 默认中等字体
  } catch (error) {
    console.error('获取字体大小失败:', error)
    return 1
  }
}

// 保存字体大小
export function saveFontSize(fontSizeIndex) {
  try {
    const settings = uni.getStorageSync('appSettings') || {}
    settings.fontSize = fontSizeIndex
    uni.setStorageSync('appSettings', settings)
    
    // 触发字体大小变化事件
    uni.$emit('fontSizeChange', fontSizeIndex)
    return true
  } catch (error) {
    console.error('保存字体大小失败:', error)
    return false
  }
}

// 获取字体大小对应的像素值
export function getFontSizeValue(index) {
  const fontSizes = [14, 16, 18, 20]
  return fontSizes[index] || 16
}

// 初始化页面字体大小
export function initPageFontSize(page) {
  const fontSizeIndex = getFontSize()
  const fontSizeValue = getFontSizeValue(fontSizeIndex)
  page.setData({ 
    fontSizeIndex,
    fontSizeValue 
  })
  
  uni.$on('fontSizeChange', (index) => {
    const value = getFontSizeValue(index)
    page.setData({ 
      fontSizeIndex: index,
      fontSizeValue: value 
    })
  })
}