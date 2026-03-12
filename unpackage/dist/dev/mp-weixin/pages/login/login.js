"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      phone: "",
      password: ""
    };
  },
  onLoad() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    common_vendor.index.__f__("log", "at pages/login/login.vue:68", "登录页面加载成功");
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
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }
    },
    handleLogin() {
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
      if (!this.password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      const registeredUsers = common_vendor.index.getStorageSync("registeredUsers") || [];
      const userExists = registeredUsers.find((user) => user.phone === this.phone);
      setTimeout(() => {
        if (!userExists) {
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "提示",
            content: "账号未注册请先前往注册",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.navigateTo({
                  url: "/pages/register/register?phone=" + this.phone
                });
              }
            }
          });
          return;
        }
        if (userExists.password !== this.password) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "密码错误",
            icon: "none"
          });
          return;
        }
        const mockToken = "mock_token_" + (/* @__PURE__ */ new Date()).getTime();
        const mockUserInfo = {
          phone: this.phone,
          nickName: userExists.nickName || this.phone,
          userId: userExists.userId || "10001",
          avatarUrl: ""
        };
        common_vendor.index.setStorageSync("token", mockToken);
        common_vendor.index.setStorageSync("userInfo", mockUserInfo);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }, 1500);
      }, 1e3);
    },
    goToRegister() {
      common_vendor.index.__f__("log", "at pages/login/login.vue:186", "跳转到注册页面，手机号：", this.phone);
      common_vendor.index.navigateTo({
        url: "/pages/register/register?phone=" + this.phone,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:190", "跳转注册页面成功", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:193", "跳转注册页面失败", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    goToForgotPassword() {
      common_vendor.index.__f__("log", "at pages/login/login.vue:203", "跳转到忘记密码页面");
      common_vendor.index.navigateTo({
        url: "/pages/forgot/forgot?phone=" + this.phone,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:207", "跳转忘记密码页面成功", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:210", "跳转忘记密码页面失败", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
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
    i: $data.password,
    j: common_vendor.o(($event) => $data.password = $event.detail.value),
    k: $data.darkMode ? 1 : "",
    l: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    m: $data.darkMode ? 1 : "",
    n: common_vendor.o((...args) => $options.goToForgotPassword && $options.goToForgotPassword(...args)),
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args)),
    r: $data.darkMode ? 1 : "",
    s: $data.darkMode ? 1 : "",
    t: $data.darkMode ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
