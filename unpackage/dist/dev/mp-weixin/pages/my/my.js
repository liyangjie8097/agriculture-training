"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      isLogin: false,
      userInfo: {},
      totalUnreadMessages: 0,
      // 统计数据
      videoCount: 0,
      favoriteCount: 0,
      historyCount: 0,
      downloadCount: 0,
      questionCount: 0,
      answerCount: 0,
      noteCount: 0,
      // 学习进度
      weekStudyHours: 0,
      weekStudyVideos: 0,
      weekStudyDays: 0,
      weekProgress: 0
    };
  },
  onLoad() {
    const app = getApp();
    this.darkMode = app.globalData.darkMode || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
  },
  onShow() {
    const app = getApp();
    this.darkMode = app.globalData.darkMode || false;
    this.checkLoginStatus();
    if (this.isLogin) {
      this.loadUserStats();
      this.loadStudyProgress();
      this.loadUnreadMessages();
    }
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (token && userInfo) {
        this.isLogin = true;
        this.userInfo = userInfo;
      } else {
        this.isLogin = false;
        this.userInfo = {};
      }
    },
    loadUnreadMessages() {
      const total = common_vendor.index.getStorageSync("totalUnreadMessages") || 0;
      this.totalUnreadMessages = total;
    },
    async loadUserStats() {
      if (!this.userInfo.userId)
        return;
      try {
        const records = common_vendor.index.getStorageSync("learningRecords") || {};
        const userRecords = records[this.userInfo.userId] || {};
        this.videoCount = Object.keys(userRecords).length;
        this.historyCount = this.videoCount;
        const favorites = common_vendor.index.getStorageSync("favorites") || {};
        const userFavorites = favorites[this.userInfo.userId] || [];
        this.favoriteCount = userFavorites.length;
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: config.baseUrl + "/qa",
            method: "GET",
            success: (res2) => resolve(res2),
            fail: (err) => reject(err)
          });
        });
        if (res.data.success) {
          const allQuestions = res.data.data;
          this.questionCount = allQuestions.filter((q) => q.user_id == this.userInfo.userId).length;
        }
        this.downloadCount = 0;
        this.answerCount = 12;
        this.noteCount = 8;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:325", "加载用户统计数据失败:", error);
      }
    },
    loadStudyProgress() {
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userRecords = records[this.userInfo.userId] || {};
      const oneWeekAgo = (/* @__PURE__ */ new Date()).getTime() - 7 * 24 * 60 * 60 * 1e3;
      let weekTotalMinutes = 0;
      let weekCompletedVideos = 0;
      let studyDays = /* @__PURE__ */ new Set();
      Object.values(userRecords).forEach((record) => {
        if (record.lastWatchTime > oneWeekAgo) {
          weekTotalMinutes += 30;
          const date = new Date(record.lastWatchTime).toDateString();
          studyDays.add(date);
          if (record.progress === 100) {
            weekCompletedVideos++;
          }
        }
      });
      this.weekStudyHours = (weekTotalMinutes / 60).toFixed(1);
      this.weekStudyVideos = weekCompletedVideos;
      this.weekStudyDays = studyDays.size;
      this.weekProgress = Math.min(100, Math.round(weekTotalMinutes / (7 * 120) * 100));
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    goToProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/profile/profile"
      });
    },
    goToMessage() {
      common_vendor.index.navigateTo({
        url: "/pages/message/message"
      });
    },
    goToMyCourses() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/my-courses/my-courses"
      });
    },
    goToFavorites() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/favorites/favorites"
      });
    },
    goToHistory() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/history/history"
      });
    },
    goToDownloads() {
      common_vendor.index.showToast({
        title: "站外视频不支持下载",
        icon: "none"
      });
    },
    goToMyQuestions() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/my-questions/my-questions"
      });
    },
    goToMyAnswers() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.showToast({
        title: "我的回答开发中",
        icon: "none"
      });
    },
    goToMyNotes() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.showToast({
        title: "我的笔记开发中",
        icon: "none"
      });
    },
    goToSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/settings"
      });
    },
    goToFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/feedback"
      });
    },
    goToAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
      });
    },
    showLoginTip() {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            this.goToLogin();
          }
        }
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            this.isLogin = false;
            this.userInfo = {};
            common_vendor.index.showToast({
              title: "已退出",
              icon: "success"
            });
            setTimeout(() => {
              this.checkLoginStatus();
            }, 500);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_assets._imports_0,
    c: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : {
    d: $data.userInfo.avatarUrl || "/static/logo.png",
    e: common_vendor.t($data.userInfo.nickName || $data.userInfo.username || "微信用户"),
    f: common_vendor.t($data.userInfo.phone || "未绑定手机"),
    g: common_vendor.t($data.videoCount),
    h: common_vendor.o((...args) => $options.goToMyCourses && $options.goToMyCourses(...args)),
    i: common_vendor.t($data.favoriteCount),
    j: common_vendor.o((...args) => $options.goToFavorites && $options.goToFavorites(...args)),
    k: common_vendor.t($data.questionCount),
    l: common_vendor.o((...args) => $options.goToMyQuestions && $options.goToMyQuestions(...args)),
    m: common_vendor.o((...args) => $options.goToProfile && $options.goToProfile(...args))
  }, {
    n: $data.isLogin
  }, $data.isLogin ? common_vendor.e({
    o: $data.darkMode ? 1 : "",
    p: $data.totalUnreadMessages > 0
  }, $data.totalUnreadMessages > 0 ? {
    q: common_vendor.t($data.totalUnreadMessages)
  } : {}, {
    r: $data.darkMode ? 1 : "",
    s: $data.darkMode ? 1 : "",
    t: common_vendor.o((...args) => $options.goToMessage && $options.goToMessage(...args))
  }) : {}, {
    v: $data.isLogin
  }, $data.isLogin ? {
    w: $data.darkMode ? 1 : "",
    x: $data.darkMode ? 1 : "",
    y: common_vendor.o((...args) => $options.goToHistory && $options.goToHistory(...args)),
    z: common_vendor.t($data.weekStudyHours),
    A: $data.darkMode ? 1 : "",
    B: common_vendor.t($data.weekStudyVideos),
    C: $data.darkMode ? 1 : "",
    D: common_vendor.t($data.weekStudyDays),
    E: $data.darkMode ? 1 : "",
    F: $data.weekProgress + "%",
    G: $data.darkMode ? 1 : "",
    H: common_vendor.t($data.weekProgress),
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : ""
  } : {}, {
    K: $data.darkMode ? 1 : "",
    L: $data.darkMode ? 1 : "",
    M: common_vendor.t($data.videoCount),
    N: $data.darkMode ? 1 : "",
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : "",
    Q: common_vendor.o((...args) => $options.goToMyCourses && $options.goToMyCourses(...args)),
    R: $data.darkMode ? 1 : "",
    S: common_vendor.t($data.favoriteCount),
    T: $data.darkMode ? 1 : "",
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: common_vendor.o((...args) => $options.goToFavorites && $options.goToFavorites(...args)),
    X: $data.darkMode ? 1 : "",
    Y: common_vendor.t($data.historyCount),
    Z: $data.darkMode ? 1 : "",
    aa: $data.darkMode ? 1 : "",
    ab: $data.darkMode ? 1 : "",
    ac: common_vendor.o((...args) => $options.goToHistory && $options.goToHistory(...args)),
    ad: $data.darkMode ? 1 : "",
    ae: common_vendor.t($data.downloadCount),
    af: $data.darkMode ? 1 : "",
    ag: $data.darkMode ? 1 : "",
    ah: $data.darkMode ? 1 : "",
    ai: common_vendor.o((...args) => $options.goToDownloads && $options.goToDownloads(...args)),
    aj: $data.darkMode ? 1 : "",
    ak: $data.darkMode ? 1 : "",
    al: $data.darkMode ? 1 : "",
    am: common_vendor.t($data.questionCount),
    an: $data.darkMode ? 1 : "",
    ao: $data.darkMode ? 1 : "",
    ap: $data.darkMode ? 1 : "",
    aq: common_vendor.o((...args) => $options.goToMyQuestions && $options.goToMyQuestions(...args)),
    ar: $data.darkMode ? 1 : "",
    as: common_vendor.t($data.answerCount),
    at: $data.darkMode ? 1 : "",
    av: $data.darkMode ? 1 : "",
    aw: $data.darkMode ? 1 : "",
    ax: common_vendor.o((...args) => $options.goToMyAnswers && $options.goToMyAnswers(...args)),
    ay: $data.darkMode ? 1 : "",
    az: common_vendor.t($data.noteCount),
    aA: $data.darkMode ? 1 : "",
    aB: $data.darkMode ? 1 : "",
    aC: $data.darkMode ? 1 : "",
    aD: common_vendor.o((...args) => $options.goToMyNotes && $options.goToMyNotes(...args)),
    aE: $data.darkMode ? 1 : "",
    aF: $data.darkMode ? 1 : "",
    aG: $data.darkMode ? 1 : "",
    aH: $data.darkMode ? 1 : "",
    aI: $data.darkMode ? 1 : "",
    aJ: common_vendor.o((...args) => $options.goToProfile && $options.goToProfile(...args)),
    aK: $data.darkMode ? 1 : "",
    aL: $data.darkMode ? 1 : "",
    aM: $data.darkMode ? 1 : "",
    aN: common_vendor.o((...args) => $options.goToSettings && $options.goToSettings(...args)),
    aO: $data.darkMode ? 1 : "",
    aP: $data.darkMode ? 1 : "",
    aQ: $data.darkMode ? 1 : "",
    aR: common_vendor.o((...args) => $options.goToFeedback && $options.goToFeedback(...args)),
    aS: $data.darkMode ? 1 : "",
    aT: $data.darkMode ? 1 : "",
    aU: $data.darkMode ? 1 : "",
    aV: common_vendor.o((...args) => $options.goToAbout && $options.goToAbout(...args)),
    aW: $data.darkMode ? 1 : "",
    aX: $data.isLogin
  }, $data.isLogin ? {
    aY: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {}, {
    aZ: $data.darkMode ? 1 : "",
    ba: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
