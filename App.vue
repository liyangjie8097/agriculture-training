<script>
import { getDarkMode, setNavigationBarColor } from '@/utils/darkmode'

export default {
  onLaunch: function() {
    console.log('农业技能培训小程序启动成功')
    console.log('开发者：李阳杰')
    console.log('学号：2227010134')
    
    // 初始化深色模式
    const darkMode = getDarkMode()
    this.globalData.darkMode = darkMode
    
    // 设置导航栏颜色
    setNavigationBarColor(darkMode)
  },
  
  onShow: function() {
    // 每次显示时检查深色模式状态
    const darkMode = getDarkMode()
    if (this.globalData.darkMode !== darkMode) {
      this.globalData.darkMode = darkMode
      setNavigationBarColor(darkMode)
    }
  },
  
  globalData: {
    darkMode: false
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

/* 深色模式全局样式 */
page.dark-mode {
  background-color: #1a1a1a;
}

/* 公共深色模式样式类 */
.dark-bg {
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}
.dark-mode .dark-bg {
  background-color: #1a1a1a;
}

.dark-card {
  background-color: #ffffff;
  transition: all 0.3s ease;
}
.dark-mode .dark-card {
  background-color: #2a2a2a;
}

.dark-text {
  color: #333;
  transition: color 0.3s ease;
}
.dark-mode .dark-text {
  color: #fff;
}

.dark-text-secondary {
  color: #666;
  transition: color 0.3s ease;
}
.dark-mode .dark-text-secondary {
  color: #aaa;
}

.dark-text-light {
  color: #999;
  transition: color 0.3s ease;
}
.dark-mode .dark-text-light {
  color: #666;
}

.dark-border {
  border-color: #f0f0f0;
  transition: border-color 0.3s ease;
}
.dark-mode .dark-border {
  border-color: #3a3a3a;
}

/* 按钮样式 */
.dark-btn {
  background: linear-gradient(135deg, #2b5e2b, #1e4b1e);
  transition: all 0.3s ease;
}
.dark-mode .dark-btn {
  background: linear-gradient(135deg, #1e4b1e, #0f2a0f);
}

/* 输入框样式 */
.dark-input {
  background-color: #f8f8f8;
  color: #333;
  transition: all 0.3s ease;
}
.dark-mode .dark-input {
  background-color: #3a3a3a;
  color: #fff;
}
.dark-mode .dark-input::placeholder {
  color: #aaa;
}

/* 分割线样式 */
.dark-divider {
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}
.dark-mode .dark-divider {
  background-color: #3a3a3a;
}

/* 图标样式 */
.dark-icon {
  color: #666;
  transition: color 0.3s ease;
}
.dark-mode .dark-icon {
  color: #aaa;
}

/* 占位符样式（用于深色模式下的placeholder） */
.dark-placeholder {
  color: #aaa;
}
</style>