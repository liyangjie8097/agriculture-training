"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      typeIndex: 0,
      typeOptions: ["功能建议", "内容问题", "技术故障", "其他"],
      formData: {
        title: "",
        content: "",
        contact: ""
      },
      images: [],
      isLogin: false,
      userInfo: {},
      feedbackList: []
    };
  },
  computed: {
    canSubmit() {
      return this.formData.title.trim() && this.formData.content.trim();
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
    this.loadFeedbackHistory();
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
      const token = common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (token && userInfo) {
        this.isLogin = true;
        this.userInfo = userInfo;
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    onTypeChange(e) {
      this.typeIndex = e.detail.value;
    },
    getTypeName(type) {
      const types = ["", "功能建议", "内容问题", "技术故障", "其他"];
      return types[type] || "其他";
    },
    getStatusName(status) {
      const statuses = ["待处理", "处理中", "已处理", "已驳回"];
      return statuses[status] || "待处理";
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
    // 提交反馈
    submitFeedback() {
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
        var _a, _b;
        const newFeedback = {
          id: Date.now(),
          user_id: ((_a = this.userInfo) == null ? void 0 : _a.userId) || 0,
          user_name: ((_b = this.userInfo) == null ? void 0 : _b.nickName) || "匿名用户",
          type: this.typeIndex + 1,
          title: this.formData.title,
          content: this.formData.content,
          contact: this.formData.contact,
          images: this.images,
          status: 0,
          reply: "",
          create_time: this.formatDate(/* @__PURE__ */ new Date())
        };
        const feedbacks = common_vendor.index.getStorageSync("feedbacks") || [];
        feedbacks.unshift(newFeedback);
        common_vendor.index.setStorageSync("feedbacks", feedbacks);
        this.formData.title = "";
        this.formData.content = "";
        this.formData.contact = "";
        this.images = [];
        this.typeIndex = 0;
        this.loadFeedbackHistory();
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
      }, 1e3);
    },
    // 加载历史反馈
    loadFeedbackHistory() {
      const allFeedbacks = common_vendor.index.getStorageSync("feedbacks") || [];
      if (this.isLogin) {
        this.feedbackList = allFeedbacks.filter((f) => {
          var _a;
          return f.user_id === ((_a = this.userInfo) == null ? void 0 : _a.userId);
        }).slice(0, 5);
      } else {
        this.feedbackList = allFeedbacks.filter((f) => f.user_id === 0).slice(0, 5);
      }
    },
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: common_vendor.t($data.darkMode ? "📋" : "📋"),
    f: $data.darkMode ? 1 : "",
    g: common_vendor.t($data.typeOptions[$data.typeIndex]),
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : "",
    j: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    k: $data.typeIndex,
    l: $data.typeOptions,
    m: $data.darkMode ? 1 : "",
    n: $data.darkMode ? 1 : "",
    o: $data.formData.title,
    p: common_vendor.o(($event) => $data.formData.title = $event.detail.value),
    q: common_vendor.t($data.formData.title.length),
    r: $data.darkMode ? 1 : "",
    s: $data.darkMode ? 1 : "",
    t: $data.darkMode ? 1 : "",
    v: $data.formData.content,
    w: common_vendor.o(($event) => $data.formData.content = $event.detail.value),
    x: common_vendor.t($data.formData.content.length),
    y: $data.darkMode ? 1 : "",
    z: $data.darkMode ? 1 : "",
    A: $data.darkMode ? 1 : "",
    B: $data.formData.contact,
    C: common_vendor.o(($event) => $data.formData.contact = $event.detail.value),
    D: $data.darkMode ? 1 : "",
    E: $data.darkMode ? 1 : "",
    F: common_vendor.f($data.images, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.removeImage(index), index),
        c: index
      };
    }),
    G: $data.images.length < 3
  }, $data.images.length < 3 ? {
    H: $data.darkMode ? 1 : "",
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : "",
    K: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    L: $data.darkMode ? 1 : "",
    M: $data.darkMode ? 1 : "",
    N: $data.darkMode ? 1 : "",
    O: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    P: !$options.canSubmit,
    Q: $data.feedbackList.length > 0
  }, $data.feedbackList.length > 0 ? {
    R: $data.darkMode ? 1 : "",
    S: common_vendor.f($data.feedbackList, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getTypeName(item.type)),
        b: common_vendor.n("type-" + item.type),
        c: common_vendor.t($options.getStatusName(item.status)),
        d: common_vendor.n("status-" + item.status),
        e: common_vendor.t(item.title),
        f: common_vendor.t(item.content),
        g: item.reply
      }, item.reply ? {
        h: $data.darkMode ? 1 : "",
        i: common_vendor.t(item.reply),
        j: $data.darkMode ? 1 : "",
        k: $data.darkMode ? 1 : ""
      } : {}, {
        l: common_vendor.t(item.create_time),
        m: item.id
      });
    }),
    T: $data.darkMode ? 1 : "",
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: $data.darkMode ? 1 : "",
    X: $data.darkMode ? 1 : ""
  } : {}, {
    Y: $data.darkMode ? 1 : "",
    Z: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/feedback/feedback.js.map
