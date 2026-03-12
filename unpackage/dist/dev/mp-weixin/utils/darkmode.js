"use strict";
const common_vendor = require("../common/vendor.js");
function getDarkMode() {
  try {
    const settings = common_vendor.index.getStorageSync("appSettings") || {};
    return settings.darkMode || false;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/darkmode.js:9", "获取深色模式失败:", error);
    return false;
  }
}
function saveDarkMode(darkMode) {
  try {
    const settings = common_vendor.index.getStorageSync("appSettings") || {};
    settings.darkMode = darkMode;
    common_vendor.index.setStorageSync("appSettings", settings);
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/darkmode.js:22", "保存深色模式失败:", error);
    return false;
  }
}
function setNavigationBarColor(darkMode) {
  try {
    if (darkMode) {
      common_vendor.index.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#1a1a1a"
      });
    } else {
      common_vendor.index.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#F8F8F8"
      });
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/darkmode.js:42", "设置导航栏颜色失败:", error);
  }
}
function updateGlobalDarkMode(darkMode) {
  const app = getApp();
  if (app) {
    app.globalData.darkMode = darkMode;
  }
  common_vendor.index.$emit("darkModeChange", darkMode);
}
function toggleDarkMode(darkMode) {
  saveDarkMode(darkMode);
  updateGlobalDarkMode(darkMode);
  setNavigationBarColor(darkMode);
  return darkMode;
}
exports.getDarkMode = getDarkMode;
exports.setNavigationBarColor = setNavigationBarColor;
exports.toggleDarkMode = toggleDarkMode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/darkmode.js.map
