"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      historyList: [],
      userInfo: {},
      allCourses: []
    };
  },
  onLoad() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
  },
  onShow() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    this.loadHistory();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    loadHistory() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
        return;
      }
      this.userInfo = userInfo;
      this.loadAllCourses();
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userRecords = records[userInfo.userId] || {};
      this.historyList = Object.values(userRecords).sort((a, b) => {
        return b.lastWatchTime - a.lastWatchTime;
      });
    },
    loadAllCourses() {
      const pages = getCurrentPages();
      const indexPage = pages.find((p) => p.route === "pages/index/index");
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || [];
      }
    },
    getCourseImage(item) {
      if (item.type === "external") {
        return item.cover || "https://via.placeholder.com/200x150/2196F3/ffffff?text=站外视频";
      }
      const course = this.allCourses.find((c) => c.id == item.courseId);
      return course ? course.image : "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=课程";
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      if (date.toDateString() === now.toDateString()) {
        return "今天 " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
      }
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return "昨天 " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
      }
      return date.getMonth() + 1 + "-" + date.getDate();
    },
    goToCourse(item) {
      if (item.type === "external") {
        common_vendor.index.showModal({
          title: "提示",
          content: `跳转到${item.sourceName || "站外视频"}继续观看`,
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.setClipboardData({
                data: item.url || "https://www.bilibili.com",
                success: () => {
                  common_vendor.index.showToast({
                    title: "链接已复制",
                    icon: "none"
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/course-detail/course-detail?id=" + item.courseId
        });
      }
    },
    goToCourseList() {
      common_vendor.index.switchTab({
        url: "/pages/course/course"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.historyList.length),
    b: $data.darkMode ? 1 : "",
    c: $data.historyList.length > 0
  }, $data.historyList.length > 0 ? {
    d: common_vendor.f($data.historyList, (item, k0, i0) => {
      return common_vendor.e({
        a: $options.getCourseImage(item),
        b: common_vendor.t(item.courseTitle),
        c: item.type === "external"
      }, item.type === "external" ? {
        d: common_vendor.t(item.sourceName || "站外视频"),
        e: common_vendor.n("type-" + item.source),
        f: common_vendor.n({
          "dark-type": $data.darkMode
        })
      } : {}, {
        g: item.progress + "%",
        h: common_vendor.t(item.progress),
        i: common_vendor.t($options.formatTime(item.lastWatchTime)),
        j: item.courseId,
        k: common_vendor.o(($event) => $options.goToCourse(item), item.courseId)
      });
    }),
    e: $data.darkMode ? 1 : "",
    f: $data.darkMode ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : ""
  } : {
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.darkMode ? 1 : "",
    n: common_vendor.o((...args) => $options.goToCourseList && $options.goToCourseList(...args))
  }, {
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
