"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      step: 1,
      phone: "",
      verifyCode: "",
      newPassword: "",
      confirmPassword: "",
      codeBtnDisabled: false,
      codeBtnText: "获取验证码",
      countdown: 60,
      timer: null
    };
  },
  onLoad(options) {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    common_vendor.index.__f__("log", "at pages/forgot/forgot.vue:102", "忘记密码页面加载成功", options);
    if (options.phone) {
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
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    sendVerifyCode() {
      if (!this.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({ title: "手机号格式不正确", icon: "none" });
        return;
      }
      const registeredUsers = common_vendor.index.getStorageSync("registeredUsers") || [];
      const userExists = registeredUsers.find((user) => user.phone === this.phone);
      if (!userExists) {
        common_vendor.index.showModal({
          title: "提示",
          content: "该手机号未注册，请先注册",
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
      common_vendor.index.showLoading({ title: "发送中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const mockCode = "123456";
        common_vendor.index.setStorageSync("resetPasswordCode_" + this.phone, mockCode);
        common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
        this.step = 2;
        this.startCountdown();
      }, 1e3);
    },
    startCountdown() {
      this.codeBtnDisabled = true;
      this.countdown = 60;
      this.codeBtnText = "60秒后重发";
      this.timer = setInterval(() => {
        this.countdown--;
        this.codeBtnText = this.countdown + "秒后重发";
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.codeBtnDisabled = false;
          this.codeBtnText = "重新获取";
        }
      }, 1e3);
    },
    resetPassword() {
      if (!this.verifyCode) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return;
      }
      if (!this.newPassword) {
        common_vendor.index.showToast({ title: "请输入新密码", icon: "none" });
        return;
      }
      if (this.newPassword.length < 6) {
        common_vendor.index.showToast({ title: "密码至少6位", icon: "none" });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      const savedCode = common_vendor.index.getStorageSync("resetPasswordCode_" + this.phone);
      if (savedCode !== this.verifyCode) {
        common_vendor.index.showToast({ title: "验证码错误", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "重置中..." });
      setTimeout(() => {
        const registeredUsers = common_vendor.index.getStorageSync("registeredUsers") || [];
        const userIndex = registeredUsers.findIndex((user) => user.phone === this.phone);
        if (userIndex !== -1) {
          registeredUsers[userIndex].password = this.newPassword;
          common_vendor.index.setStorageSync("registeredUsers", registeredUsers);
        }
        common_vendor.index.removeStorageSync("resetPasswordCode_" + this.phone);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "密码重置成功", icon: "success" });
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
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: common_assets._imports_0,
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: $data.step === 1
  }, $data.step === 1 ? {
    f: $data.darkMode ? 1 : "",
    g: $data.phone,
    h: common_vendor.o(($event) => $data.phone = $event.detail.value),
    i: $data.darkMode ? 1 : "",
    j: common_vendor.o((...args) => $options.sendVerifyCode && $options.sendVerifyCode(...args))
  } : {}, {
    k: $data.step === 2
  }, $data.step === 2 ? {
    l: $data.darkMode ? 1 : "",
    m: $data.verifyCode,
    n: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    o: common_vendor.t($data.codeBtnText),
    p: $data.darkMode ? 1 : "",
    q: common_vendor.o((...args) => $options.sendVerifyCode && $options.sendVerifyCode(...args)),
    r: $data.codeBtnDisabled,
    s: $data.darkMode ? 1 : "",
    t: $data.newPassword,
    v: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    w: $data.darkMode ? 1 : "",
    x: $data.confirmPassword,
    y: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    z: $data.darkMode ? 1 : "",
    A: common_vendor.o((...args) => $options.resetPassword && $options.resetPassword(...args))
  } : {}, {
    B: $data.darkMode ? 1 : "",
    C: $data.darkMode ? 1 : "",
    D: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args)),
    E: $data.darkMode ? 1 : "",
    F: $data.darkMode ? 1 : "",
    G: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forgot/forgot.js.map
