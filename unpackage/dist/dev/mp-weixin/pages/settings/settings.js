"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_darkmode = require("../../utils/darkmode.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      autoPlay: false,
      wifiOnly: false,
      // 字体大小设置
      fontSizeIndex: 1,
      fontSizes: [
        { name: "小", value: 14 },
        { name: "中", value: 16 },
        { name: "大", value: 18 },
        { name: "特大", value: 20 }
      ],
      showFontModal: false,
      // 通知设置
      systemNotice: true,
      commentNotice: true,
      likeNotice: true,
      // 缓存设置
      cacheSize: "0 MB",
      // 隐私设置
      dataCollection: true
    };
  },
  computed: {
    fontSizeText() {
      return this.fontSizes[this.fontSizeIndex].name;
    },
    fontSizeValue() {
      return this.fontSizes[this.fontSizeIndex].value;
    }
  },
  onLoad() {
    this.darkMode = utils_darkmode.getDarkMode();
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.loadSettings();
    this.calculateCacheSize();
    this.applyFontSize();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 加载设置
    loadSettings() {
      const settings = common_vendor.index.getStorageSync("appSettings") || {};
      this.autoPlay = settings.autoPlay ?? false;
      this.wifiOnly = settings.wifiOnly ?? false;
      this.fontSizeIndex = settings.fontSize ?? 1;
      this.systemNotice = settings.systemNotice ?? true;
      this.commentNotice = settings.commentNotice ?? true;
      this.likeNotice = settings.likeNotice ?? true;
      this.dataCollection = settings.dataCollection ?? true;
    },
    // 保存设置
    saveSettings() {
      const settings = {
        darkMode: this.darkMode,
        autoPlay: this.autoPlay,
        wifiOnly: this.wifiOnly,
        fontSize: this.fontSizeIndex,
        systemNotice: this.systemNotice,
        commentNotice: this.commentNotice,
        likeNotice: this.likeNotice,
        dataCollection: this.dataCollection
      };
      common_vendor.index.setStorageSync("appSettings", settings);
    },
    // 应用字体大小
    applyFontSize() {
      common_vendor.index.$emit("fontSizeChange", this.fontSizeValue);
    },
    // 深色模式切换
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.saveSettings();
      utils_darkmode.toggleDarkMode(this.darkMode);
      common_vendor.index.showToast({
        title: this.darkMode ? "深色模式已开启" : "深色模式已关闭",
        icon: "none"
      });
    },
    // 自动连播切换
    toggleAutoPlay() {
      this.autoPlay = !this.autoPlay;
      this.saveSettings();
      common_vendor.index.showToast({
        title: this.autoPlay ? "自动连播已开启" : "自动连播已关闭",
        icon: "none"
      });
    },
    // WiFi only切换
    toggleWiFiOnly() {
      this.wifiOnly = !this.wifiOnly;
      this.saveSettings();
      common_vendor.index.showToast({
        title: this.wifiOnly ? "仅在WiFi下播放" : "所有网络均可播放",
        icon: "none"
      });
    },
    // 显示字体大小选择器
    showFontSizePicker() {
      this.showFontModal = true;
    },
    // 选择字体大小
    selectFontSize(index) {
      this.fontSizeIndex = index;
      this.saveSettings();
      this.applyFontSize();
      this.showFontModal = false;
      common_vendor.index.showToast({
        title: "字体大小已设置为" + this.fontSizes[index].name,
        icon: "none"
      });
    },
    // 通知设置切换
    toggleSystemNotice() {
      this.systemNotice = !this.systemNotice;
      this.saveSettings();
    },
    toggleCommentNotice() {
      this.commentNotice = !this.commentNotice;
      this.saveSettings();
    },
    toggleLikeNotice() {
      this.likeNotice = !this.likeNotice;
      this.saveSettings();
    },
    // 数据收集切换
    toggleDataCollection() {
      this.dataCollection = !this.dataCollection;
      this.saveSettings();
    },
    // 计算缓存大小
    calculateCacheSize() {
      const records = common_vendor.index.getStorageSync("learningRecords");
      const favorites = common_vendor.index.getStorageSync("favorites");
      const history = common_vendor.index.getStorageSync("searchHistory");
      let totalSize = 0;
      if (records)
        totalSize += JSON.stringify(records).length;
      if (favorites)
        totalSize += JSON.stringify(favorites).length;
      if (history)
        totalSize += JSON.stringify(history).length;
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      this.cacheSize = sizeInMB > 0 ? sizeInMB + " MB" : "0 MB";
    },
    // 显示缓存大小
    showCacheSize() {
      common_vendor.index.showToast({
        title: "缓存大小: " + this.cacheSize,
        icon: "none"
      });
    },
    // 清除缓存
    clearCache() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定清除所有缓存吗？清除后不会影响您的学习记录和收藏。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("searchHistory");
            this.calculateCacheSize();
            common_vendor.index.showToast({
              title: "缓存已清除",
              icon: "success"
            });
          }
        }
      });
    },
    // 隐私政策
    goToPrivacyPolicy() {
      common_vendor.index.showModal({
        title: "隐私政策",
        content: "本应用尊重并保护所有用户的个人隐私。您在使用本应用时，我们不会收集您的任何个人信息。",
        showCancel: false,
        confirmText: "知道了"
      });
    },
    // 用户协议
    goToUserAgreement() {
      common_vendor.index.showModal({
        title: "用户协议",
        content: "欢迎使用农业技能培训应用。使用本应用即表示您同意遵守本协议的所有条款。",
        showCancel: false,
        confirmText: "知道了"
      });
    },
    // 关于我们
    goToAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
      });
    },
    // 检查更新
    checkUpdate() {
      common_vendor.index.showToast({
        title: "当前已是最新版本",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: common_vendor.t($data.darkMode ? "☀️" : "🌙"),
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : "",
    j: common_vendor.o((...args) => $options.toggleDarkMode && $options.toggleDarkMode(...args)),
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.autoPlay ? 1 : "",
    n: $data.autoPlay ? 1 : "",
    o: common_vendor.o((...args) => $options.toggleAutoPlay && $options.toggleAutoPlay(...args)),
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.wifiOnly ? 1 : "",
    s: $data.wifiOnly ? 1 : "",
    t: common_vendor.o((...args) => $options.toggleWiFiOnly && $options.toggleWiFiOnly(...args)),
    v: $data.darkMode ? 1 : "",
    w: $data.darkMode ? 1 : "",
    x: common_vendor.t($options.fontSizeText),
    y: $data.darkMode ? 1 : "",
    z: $data.darkMode ? 1 : "",
    A: $data.darkMode ? 1 : "",
    B: common_vendor.o((...args) => $options.showFontSizePicker && $options.showFontSizePicker(...args)),
    C: $data.darkMode ? 1 : "",
    D: $data.darkMode ? 1 : "",
    E: $data.darkMode ? 1 : "",
    F: $data.systemNotice ? 1 : "",
    G: $data.systemNotice ? 1 : "",
    H: common_vendor.o((...args) => $options.toggleSystemNotice && $options.toggleSystemNotice(...args)),
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : "",
    K: $data.commentNotice ? 1 : "",
    L: $data.commentNotice ? 1 : "",
    M: common_vendor.o((...args) => $options.toggleCommentNotice && $options.toggleCommentNotice(...args)),
    N: $data.darkMode ? 1 : "",
    O: $data.darkMode ? 1 : "",
    P: $data.likeNotice ? 1 : "",
    Q: $data.likeNotice ? 1 : "",
    R: common_vendor.o((...args) => $options.toggleLikeNotice && $options.toggleLikeNotice(...args)),
    S: $data.darkMode ? 1 : "",
    T: $data.darkMode ? 1 : "",
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: common_vendor.t($data.cacheSize),
    X: $data.darkMode ? 1 : "",
    Y: $data.darkMode ? 1 : "",
    Z: $data.darkMode ? 1 : "",
    aa: common_vendor.o((...args) => $options.showCacheSize && $options.showCacheSize(...args)),
    ab: $data.darkMode ? 1 : "",
    ac: $data.darkMode ? 1 : "",
    ad: $data.darkMode ? 1 : "",
    ae: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    af: $data.darkMode ? 1 : "",
    ag: $data.darkMode ? 1 : "",
    ah: $data.darkMode ? 1 : "",
    ai: $data.darkMode ? 1 : "",
    aj: $data.darkMode ? 1 : "",
    ak: common_vendor.o((...args) => $options.goToPrivacyPolicy && $options.goToPrivacyPolicy(...args)),
    al: $data.darkMode ? 1 : "",
    am: $data.darkMode ? 1 : "",
    an: $data.darkMode ? 1 : "",
    ao: common_vendor.o((...args) => $options.goToUserAgreement && $options.goToUserAgreement(...args)),
    ap: $data.darkMode ? 1 : "",
    aq: $data.dataCollection ? 1 : "",
    ar: $data.dataCollection ? 1 : "",
    as: common_vendor.o((...args) => $options.toggleDataCollection && $options.toggleDataCollection(...args)),
    at: $data.darkMode ? 1 : "",
    av: $data.darkMode ? 1 : "",
    aw: $data.darkMode ? 1 : "",
    ax: $data.darkMode ? 1 : "",
    ay: $data.darkMode ? 1 : "",
    az: $data.darkMode ? 1 : "",
    aA: common_vendor.o((...args) => $options.goToAbout && $options.goToAbout(...args)),
    aB: $data.darkMode ? 1 : "",
    aC: $data.darkMode ? 1 : "",
    aD: $data.darkMode ? 1 : "",
    aE: $data.darkMode ? 1 : "",
    aF: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    aG: $data.darkMode ? 1 : "",
    aH: $data.showFontModal
  }, $data.showFontModal ? {
    aI: common_vendor.o(($event) => $data.showFontModal = false)
  } : {}, {
    aJ: $data.showFontModal
  }, $data.showFontModal ? {
    aK: $data.darkMode ? 1 : "",
    aL: common_vendor.f($data.fontSizes, (size, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(size.name),
        b: $data.fontSizeIndex === index
      }, $data.fontSizeIndex === index ? {} : {}, {
        c: index,
        d: common_vendor.o(($event) => $options.selectFontSize(index), index)
      });
    }),
    aM: $data.darkMode ? 1 : "",
    aN: $data.darkMode ? 1 : "",
    aO: $data.darkMode ? 1 : "",
    aP: $options.fontSizeValue + "px",
    aQ: $data.darkMode ? 1 : "",
    aR: $data.darkMode ? 1 : "",
    aS: common_vendor.o(($event) => $data.showFontModal = false),
    aT: $data.darkMode ? 1 : ""
  } : {}, {
    aU: $data.darkMode ? 1 : "",
    aV: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/settings.js.map
