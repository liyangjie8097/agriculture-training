"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      categories: [
        { name: "种植技术", value: "plant" },
        { name: "养殖技术", value: "breed" },
        { name: "农机操作", value: "machine" },
        { name: "病虫害防治", value: "pest" },
        { name: "农产品加工", value: "process" },
        { name: "农业电商", value: "ecommerce" },
        { name: "其他", value: "other" }
      ],
      categoryIndex: 0,
      customCategory: "",
      title: "",
      content: "",
      images: [],
      isAnonymous: false,
      userInfo: {}
    };
  },
  computed: {
    categoryNames() {
      return this.categories.map((c) => c.name);
    },
    isCustomCategory() {
      var _a;
      return ((_a = this.categories[this.categoryIndex]) == null ? void 0 : _a.value) === "other";
    },
    finalCategory() {
      var _a;
      if (this.isCustomCategory && this.customCategory) {
        return this.customCategory;
      }
      return ((_a = this.categories[this.categoryIndex]) == null ? void 0 : _a.value) || "other";
    },
    finalCategoryName() {
      var _a;
      if (this.isCustomCategory && this.customCategory) {
        return this.customCategory;
      }
      return ((_a = this.categories[this.categoryIndex]) == null ? void 0 : _a.name) || "其他";
    },
    canSubmit() {
      if (this.isCustomCategory && !this.customCategory) {
        return false;
      }
      return this.title.trim() && this.content.trim();
    }
  },
  onLoad() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.checkLoginStatus();
  },
  onShow() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
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
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value;
    },
    onAnonymousChange(e) {
      this.isAnonymous = e.detail.value;
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 3 - this.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths];
        }
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },
    submitQuestion() {
      if (!this.canSubmit) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const newQuestion = {
          id: Date.now(),
          category: this.finalCategory,
          categoryName: this.finalCategoryName,
          title: this.title,
          content: this.content,
          images: this.images,
          isAnonymous: this.isAnonymous,
          author: this.isAnonymous ? {
            id: "anonymous",
            name: "匿名用户",
            avatar: "/static/logo.png",
            title: ""
          } : {
            id: this.userInfo.userId || Date.now(),
            name: this.userInfo.nickName || this.userInfo.username || "用户",
            avatar: this.userInfo.avatarUrl || "/static/logo.png",
            title: "普通用户"
          },
          views: 0,
          answers: 0,
          likes: 0,
          time: "刚刚",
          isTop: false,
          isNew: true,
          status: "normal"
        };
        const questions = common_vendor.index.getStorageSync("allQuestions") || [];
        questions.unshift(newQuestion);
        common_vendor.index.setStorageSync("allQuestions", questions);
        common_vendor.index.setStorageSync("latestQuestionId", newQuestion.id);
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/qa/qa"
          });
        }, 1500);
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: $data.darkMode ? 1 : "",
    c: common_vendor.t($options.categoryNames[$data.categoryIndex]),
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    g: $data.categoryIndex,
    h: $options.categoryNames,
    i: $options.isCustomCategory
  }, $options.isCustomCategory ? {
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.customCategory,
    m: common_vendor.o(($event) => $data.customCategory = $event.detail.value)
  } : {}, {
    n: $data.darkMode ? 1 : "",
    o: $data.darkMode ? 1 : "",
    p: $data.title,
    q: common_vendor.o(($event) => $data.title = $event.detail.value),
    r: common_vendor.t($data.title.length),
    s: $data.darkMode ? 1 : "",
    t: $data.darkMode ? 1 : "",
    v: $data.darkMode ? 1 : "",
    w: $data.content,
    x: common_vendor.o(($event) => $data.content = $event.detail.value),
    y: common_vendor.t($data.content.length),
    z: $data.darkMode ? 1 : "",
    A: $data.darkMode ? 1 : "",
    B: common_vendor.f($data.images, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.removeImage(index), index),
        c: index
      };
    }),
    C: $data.images.length < 3
  }, $data.images.length < 3 ? {
    D: $data.darkMode ? 1 : "",
    E: $data.darkMode ? 1 : "",
    F: $data.darkMode ? 1 : "",
    G: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    H: $data.darkMode ? 1 : "",
    I: common_vendor.o((...args) => $options.onAnonymousChange && $options.onAnonymousChange(...args)),
    J: $data.isAnonymous,
    K: $data.darkMode ? 1 : "",
    L: common_vendor.o((...args) => $options.submitQuestion && $options.submitQuestion(...args)),
    M: !$options.canSubmit,
    N: $data.darkMode ? 1 : "",
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ask/ask.js.map
