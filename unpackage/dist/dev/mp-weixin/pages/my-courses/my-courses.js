"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      currentTab: "all",
      courseList: [],
      userInfo: {},
      allCourses: []
      // 所有课程数据（用于获取图片和章节数）
    };
  },
  computed: {
    filteredCourses() {
      let filtered = this.courseList;
      if (this.currentTab === "local") {
        filtered = filtered.filter((c) => c.type !== "external");
      } else if (this.currentTab === "external") {
        filtered = filtered.filter((c) => c.type === "external");
      } else if (this.currentTab === "in-progress") {
        filtered = filtered.filter((c) => c.progress > 0 && c.progress < 100);
      } else if (this.currentTab === "completed") {
        filtered = filtered.filter((c) => c.progress === 100);
      }
      return filtered;
    }
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
    this.checkLoginStatus();
    this.loadAllCourses();
    this.loadMyCourses();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    checkLoginStatus() {
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
    },
    loadAllCourses() {
      const pages = getCurrentPages();
      const indexPage = pages.find((p) => p.route === "pages/index/index");
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || [];
      } else {
        this.allCourses = [
          { id: 1, title: "水稻高产种植技术", image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=水稻种植", chapters: [{}, {}, {}, {}] },
          { id: 2, title: "大棚蔬菜种植技术", image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=大棚蔬菜", chapters: [{}, {}, {}] },
          { id: 3, title: "生猪科学养殖技术", image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=生猪养殖", chapters: [{}, {}, {}, {}] },
          { id: 4, title: "家禽生态养殖技术", image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=家禽养殖", chapters: [{}, {}, {}] },
          { id: 5, title: "拖拉机操作与维护", image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=拖拉机", chapters: [{}, {}, {}, {}] }
        ];
      }
    },
    loadMyCourses() {
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userRecords = records[this.userInfo.userId] || {};
      this.courseList = Object.values(userRecords).sort((a, b) => {
        return b.lastWatchTime - a.lastWatchTime;
      });
    },
    getCourseImage(course) {
      if (course.type === "external") {
        return course.cover || "https://via.placeholder.com/200x150/2196F3/ffffff?text=站外视频";
      }
      const c = this.allCourses.find((c2) => c2.id == course.courseId);
      return c ? c.image : "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=课程";
    },
    getTotalChapters(courseId) {
      var _a;
      const course = this.allCourses.find((c) => c.id == courseId);
      return course ? ((_a = course.chapters) == null ? void 0 : _a.length) || 0 : 0;
    },
    getStatusClass(progress) {
      if (progress === 100)
        return "status-completed";
      if (progress > 0)
        return "status-progress";
      return "status-not-started";
    },
    getStatusText(progress) {
      if (progress === 100)
        return "已完成";
      if (progress > 0)
        return "学习中";
      return "未开始";
    },
    getEmptyDesc() {
      if (this.currentTab === "all")
        return "你还没有学习任何课程";
      if (this.currentTab === "local")
        return "还没有学习平台课程";
      if (this.currentTab === "external")
        return "还没有观看站外视频";
      if (this.currentTab === "in-progress")
        return "没有进行中的课程";
      if (this.currentTab === "completed")
        return "还没有完成的课程";
      return "快去学习吧";
    },
    switchTab(tab) {
      this.currentTab = tab;
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
    goToCourseDetail(course) {
      if (course.type === "external") {
        common_vendor.index.showModal({
          title: "提示",
          content: `跳转到${course.sourceName || "站外视频"}观看`,
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.setClipboardData({
                data: course.url || "https://www.bilibili.com",
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
          url: "/pages/course-detail/course-detail?id=" + course.courseId
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
    a: common_vendor.t($data.courseList.length),
    b: $data.darkMode ? 1 : "",
    c: $data.currentTab === "all" ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode && $data.currentTab === "all" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchTab("all")),
    g: $data.currentTab === "local" ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode && $data.currentTab === "local" ? 1 : "",
    j: common_vendor.o(($event) => $options.switchTab("local")),
    k: $data.currentTab === "external" ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.darkMode && $data.currentTab === "external" ? 1 : "",
    n: common_vendor.o(($event) => $options.switchTab("external")),
    o: $data.currentTab === "in-progress" ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode && $data.currentTab === "in-progress" ? 1 : "",
    r: common_vendor.o(($event) => $options.switchTab("in-progress")),
    s: $data.currentTab === "completed" ? 1 : "",
    t: $data.darkMode ? 1 : "",
    v: $data.darkMode && $data.currentTab === "completed" ? 1 : "",
    w: common_vendor.o(($event) => $options.switchTab("completed")),
    x: $data.darkMode ? 1 : "",
    y: $options.filteredCourses.length > 0
  }, $options.filteredCourses.length > 0 ? {
    z: common_vendor.f($options.filteredCourses, (course, k0, i0) => {
      var _a;
      return common_vendor.e({
        a: $options.getCourseImage(course),
        b: common_vendor.t(course.courseTitle),
        c: course.type === "external"
      }, course.type === "external" ? {
        d: common_vendor.t(course.sourceName || "站外视频"),
        e: common_vendor.n("badge-" + course.source),
        f: common_vendor.n({
          "dark-badge": $data.darkMode
        })
      } : {
        g: $data.darkMode ? 1 : ""
      }, {
        h: course.progress + "%",
        i: common_vendor.t(course.progress),
        j: common_vendor.t(((_a = course.chapters) == null ? void 0 : _a.length) || 0),
        k: common_vendor.t($options.getTotalChapters(course.courseId)),
        l: common_vendor.t($options.formatTime(course.lastWatchTime)),
        m: common_vendor.t($options.getStatusText(course.progress)),
        n: common_vendor.n($options.getStatusClass(course.progress)),
        o: course.courseId,
        p: common_vendor.o(($event) => $options.goToCourseDetail(course), course.courseId)
      });
    }),
    A: $data.darkMode ? 1 : "",
    B: $data.darkMode ? 1 : "",
    C: $data.darkMode ? 1 : "",
    D: $data.darkMode ? 1 : "",
    E: common_vendor.n({
      "dark-status": $data.darkMode
    }),
    F: $data.darkMode ? 1 : ""
  } : {
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: common_vendor.t($options.getEmptyDesc()),
    J: $data.darkMode ? 1 : "",
    K: $data.darkMode ? 1 : "",
    L: common_vendor.o((...args) => $options.goToCourseList && $options.goToCourseList(...args))
  }, {
    M: $data.darkMode ? 1 : "",
    N: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my-courses/my-courses.js.map
