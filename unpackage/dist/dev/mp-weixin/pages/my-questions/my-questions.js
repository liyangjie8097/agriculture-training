"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      questions: [],
      userInfo: {}
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
    this.checkLoginStatus();
    this.loadMyQuestions();
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
    loadMyQuestions() {
      const allQuestions = common_vendor.index.getStorageSync("allQuestions") || [];
      this.questions = allQuestions.filter(
        (q) => q.author.id === this.userInfo.userId || q.author.id === "anonymous" && q.isAnonymous && this.userInfo.userId
      ).sort((a, b) => b.id - a.id);
    },
    goToQaDetail(question) {
      common_vendor.index.navigateTo({
        url: "/pages/qa-detail/qa-detail?id=" + question.id
      });
    },
    goToAsk() {
      common_vendor.index.navigateTo({
        url: "/pages/ask/ask"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.questions.length),
    b: $data.darkMode ? 1 : "",
    c: $data.questions.length > 0
  }, $data.questions.length > 0 ? {
    d: common_vendor.f($data.questions, (question, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(question.categoryName || question.category || "其他"),
        b: common_vendor.n("category-" + (question.category || "other")),
        c: common_vendor.t(question.answers > 0 ? "已有回答" : "等待回答"),
        d: question.answers > 0 ? 1 : "",
        e: $data.darkMode && question.answers > 0 ? 1 : "",
        f: common_vendor.t(question.title),
        g: common_vendor.t(question.content),
        h: question.images && question.images.length > 0
      }, question.images && question.images.length > 0 ? common_vendor.e({
        i: common_vendor.f(question.images.slice(0, 3), (img, idx, i1) => {
          return {
            a: idx,
            b: img
          };
        }),
        j: question.images.length > 3
      }, question.images.length > 3 ? {
        k: common_vendor.t(question.images.length - 3),
        l: $data.darkMode ? 1 : ""
      } : {}) : {}, {
        m: common_vendor.t(question.views || 0),
        n: common_vendor.t(question.answers || 0),
        o: common_vendor.t(question.likes || 0),
        p: common_vendor.t(question.time),
        q: question.isNew
      }, question.isNew ? {} : {}, {
        r: question.id,
        s: common_vendor.o(($event) => $options.goToQaDetail(question), question.id)
      });
    }),
    e: common_vendor.n({
      "dark-category": $data.darkMode
    }),
    f: $data.darkMode ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : "",
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.darkMode ? 1 : "",
    n: $data.darkMode ? 1 : ""
  } : {
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode ? 1 : "",
    s: common_vendor.o((...args) => $options.goToAsk && $options.goToAsk(...args))
  }, {
    t: $data.darkMode ? 1 : "",
    v: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my-questions/my-questions.js.map
