"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      phone: "",
      nickName: "",
      password: "",
      confirmPassword: ""
    };
  },
  onLoad(options) {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    common_vendor.index.__f__("log", "at pages/register/register.vue:89", "注册页面加载成功", options);
    if (options && options.phone) {
      this.phone = options.phone;
    }
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
    handleRegister() {
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      if (!this.nickName) {
        common_vendor.index.showToast({
          title: "请输入昵称",
          icon: "none"
        });
        return;
      }
      if (!this.password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      if (this.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码至少6位",
          icon: "none"
        });
        return;
      }
      if (this.password !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      const registeredUsers = common_vendor.index.getStorageSync("registeredUsers") || [];
      const userExists = registeredUsers.find((user) => user.phone === this.phone);
      setTimeout(() => {
        if (userExists) {
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "提示",
            content: "该手机号已注册，请直接登录",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.navigateBack();
              }
            }
          });
          return;
        }
        const newUser = {
          phone: this.phone,
          nickName: this.nickName,
          password: this.password,
          // 实际开发中应该加密存储
          userId: "user_" + (/* @__PURE__ */ new Date()).getTime(),
          createTime: (/* @__PURE__ */ new Date()).getTime()
        };
        registeredUsers.push(newUser);
        common_vendor.index.setStorageSync("registeredUsers", registeredUsers);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1e3);
    },
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.darkMode ? 1 : "",
    b: common_assets._imports_0,
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: $data.phone,
    g: common_vendor.o(($event) => $data.phone = $event.detail.value),
    h: $data.darkMode ? 1 : "",
    i: $data.nickName,
    j: common_vendor.o(($event) => $data.nickName = $event.detail.value),
    k: $data.darkMode ? 1 : "",
    l: $data.password,
    m: common_vendor.o(($event) => $data.password = $event.detail.value),
    n: $data.darkMode ? 1 : "",
    o: $data.confirmPassword,
    p: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    q: $data.darkMode ? 1 : "",
    r: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    s: $data.darkMode ? 1 : "",
    t: $data.darkMode ? 1 : "",
    v: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args)),
    w: $data.darkMode ? 1 : "",
    x: $data.darkMode ? 1 : "",
    y: $data.darkMode ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
