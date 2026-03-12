"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_darkmode = require("./utils/darkmode.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/course/course.js";
  "./pages/qa/qa.js";
  "./pages/my/my.js";
  "./pages/news/news.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/forgot/forgot.js";
  "./pages/course-detail/course-detail.js";
  "./pages/history/history.js";
  "./pages/search/search.js";
  "./pages/favorites/favorites.js";
  "./pages/my-courses/my-courses.js";
  "./pages/news-detail/news-detail.js";
  "./pages/ask/ask.js";
  "./pages/qa-detail/qa-detail.js";
  "./pages/my-questions/my-questions.js";
  "./pages/message/message.js";
  "./pages/profile/profile.js";
  "./pages/about/about.js";
  "./pages/feedback/feedback.js";
  "./pages/settings/settings.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "农业技能培训小程序启动成功");
    common_vendor.index.__f__("log", "at App.vue:7", "开发者：李阳杰");
    common_vendor.index.__f__("log", "at App.vue:8", "学号：2227010134");
    const darkMode = utils_darkmode.getDarkMode();
    this.globalData.darkMode = darkMode;
    utils_darkmode.setNavigationBarColor(darkMode);
  },
  onShow: function() {
    const darkMode = utils_darkmode.getDarkMode();
    if (this.globalData.darkMode !== darkMode) {
      this.globalData.darkMode = darkMode;
      utils_darkmode.setNavigationBarColor(darkMode);
    }
  },
  globalData: {
    darkMode: false
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
