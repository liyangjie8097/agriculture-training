"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      userInfo: {},
      formData: {
        nickName: "",
        phone: "",
        verifyCode: "",
        gender: 0,
        birthday: "",
        region: ["", "", ""],
        job: "",
        bio: ""
      },
      originalData: {},
      // 用于检测是否修改
      jobOptions: ["请选择职业", "农民", "养殖户", "农机手", "农技员", "农业专家", "学生", "其他"],
      jobIndex: 0,
      // 验证码相关
      showVerifyCode: false,
      codeBtnDisabled: false,
      codeBtnText: "获取验证码",
      countdown: 60,
      timer: null
    };
  },
  computed: {
    hasChanges() {
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
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
    this.loadUserData();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!token || !userInfo) {
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
    loadUserData() {
      const userProfiles = common_vendor.index.getStorageSync("userProfiles") || {};
      const userProfile = userProfiles[this.userInfo.userId] || {};
      this.formData = {
        nickName: this.userInfo.nickName || this.userInfo.username || "",
        phone: this.userInfo.phone || "",
        verifyCode: "",
        gender: userProfile.gender || 0,
        birthday: userProfile.birthday || "",
        region: userProfile.region || ["", "", ""],
        job: userProfile.job || "",
        bio: userProfile.bio || ""
      };
      if (this.formData.job) {
        const index = this.jobOptions.findIndex((j) => j === this.formData.job);
        this.jobIndex = index >= 0 ? index : 0;
      }
      this.originalData = JSON.parse(JSON.stringify(this.formData));
    },
    changeAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFile = res.tempFilePaths[0];
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          setTimeout(() => {
            common_vendor.index.hideLoading();
            this.userInfo.avatarUrl = tempFile;
            this.formData.avatarUrl = tempFile;
            common_vendor.index.setStorageSync("userInfo", this.userInfo);
            common_vendor.index.showToast({
              title: "头像已更新",
              icon: "success"
            });
          }, 1e3);
        }
      });
    },
    sendVerifyCode() {
      if (!this.formData.phone || !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发送中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const mockCode = "123456";
        common_vendor.index.setStorageSync("verifyCode_" + this.formData.phone, mockCode);
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "success"
        });
        this.showVerifyCode = true;
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
    onBirthdayChange(e) {
      this.formData.birthday = e.detail.value;
    },
    onRegionChange(e) {
      this.formData.region = e.detail.value;
    },
    onJobChange(e) {
      this.jobIndex = e.detail.value;
      this.formData.job = this.jobOptions[this.jobIndex];
    },
    saveProfile() {
      if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      if (this.showVerifyCode) {
        const savedCode = common_vendor.index.getStorageSync("verifyCode_" + this.formData.phone);
        if (savedCode !== this.formData.verifyCode) {
          common_vendor.index.showToast({
            title: "验证码错误",
            icon: "none"
          });
          return;
        }
      }
      common_vendor.index.showLoading({
        title: "保存中..."
      });
      setTimeout(() => {
        this.userInfo.nickName = this.formData.nickName;
        this.userInfo.phone = this.formData.phone;
        common_vendor.index.setStorageSync("userInfo", this.userInfo);
        const userProfiles = common_vendor.index.getStorageSync("userProfiles") || {};
        userProfiles[this.userInfo.userId] = {
          gender: this.formData.gender,
          birthday: this.formData.birthday,
          region: this.formData.region,
          job: this.formData.job,
          bio: this.formData.bio
        };
        common_vendor.index.setStorageSync("userProfiles", userProfiles);
        if (this.showVerifyCode) {
          common_vendor.index.removeStorageSync("verifyCode_" + this.formData.phone);
        }
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        this.originalData = JSON.parse(JSON.stringify(this.formData));
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: $data.darkMode ? 1 : "",
    c: $data.userInfo.avatarUrl || "/static/logo.png",
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: $data.darkMode ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: common_vendor.o((...args) => $options.changeAvatar && $options.changeAvatar(...args)),
    i: $data.darkMode ? 1 : "",
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.formData.nickName,
    m: common_vendor.o(($event) => $data.formData.nickName = $event.detail.value),
    n: common_vendor.t($data.formData.nickName.length),
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode ? 1 : "",
    s: $data.darkMode && !!$data.userInfo.phone ? 1 : "",
    t: !!$data.userInfo.phone,
    v: $data.formData.phone,
    w: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    x: !$data.userInfo.phone
  }, !$data.userInfo.phone ? {
    y: common_vendor.t($data.codeBtnText),
    z: $data.darkMode ? 1 : "",
    A: common_vendor.o((...args) => $options.sendVerifyCode && $options.sendVerifyCode(...args)),
    B: $data.codeBtnDisabled
  } : {}, {
    C: !$data.userInfo.phone
  }, !$data.userInfo.phone ? {
    D: $data.darkMode ? 1 : ""
  } : {}, {
    E: $data.showVerifyCode
  }, $data.showVerifyCode ? {
    F: $data.darkMode ? 1 : "",
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: $data.formData.verifyCode,
    J: common_vendor.o(($event) => $data.formData.verifyCode = $event.detail.value)
  } : {}, {
    K: $data.darkMode ? 1 : "",
    L: $data.darkMode ? 1 : "",
    M: $data.darkMode ? 1 : "",
    N: $data.darkMode ? 1 : "",
    O: $data.formData.gender === 1 ? 1 : "",
    P: $data.darkMode ? 1 : "",
    Q: $data.darkMode && $data.formData.gender === 1 ? 1 : "",
    R: common_vendor.o(($event) => $data.formData.gender = 1),
    S: $data.darkMode ? 1 : "",
    T: $data.darkMode ? 1 : "",
    U: $data.formData.gender === 2 ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: $data.darkMode && $data.formData.gender === 2 ? 1 : "",
    X: common_vendor.o(($event) => $data.formData.gender = 2),
    Y: $data.darkMode ? 1 : "",
    Z: $data.darkMode ? 1 : "",
    aa: $data.formData.gender === 0 ? 1 : "",
    ab: $data.darkMode ? 1 : "",
    ac: $data.darkMode && $data.formData.gender === 0 ? 1 : "",
    ad: common_vendor.o(($event) => $data.formData.gender = 0),
    ae: $data.darkMode ? 1 : "",
    af: $data.darkMode ? 1 : "",
    ag: $data.darkMode ? 1 : "",
    ah: common_vendor.t($data.formData.birthday || "请选择生日"),
    ai: $data.darkMode ? 1 : "",
    aj: $data.darkMode ? 1 : "",
    ak: $data.formData.birthday,
    al: common_vendor.o((...args) => $options.onBirthdayChange && $options.onBirthdayChange(...args)),
    am: $data.darkMode ? 1 : "",
    an: $data.darkMode ? 1 : "",
    ao: common_vendor.t($data.formData.region.join(" ") || "请选择地区"),
    ap: $data.darkMode ? 1 : "",
    aq: $data.darkMode ? 1 : "",
    ar: $data.formData.region,
    as: common_vendor.o((...args) => $options.onRegionChange && $options.onRegionChange(...args)),
    at: $data.darkMode ? 1 : "",
    av: $data.darkMode ? 1 : "",
    aw: common_vendor.t($data.jobOptions[$data.jobIndex]),
    ax: $data.darkMode ? 1 : "",
    ay: $data.darkMode ? 1 : "",
    az: common_vendor.o((...args) => $options.onJobChange && $options.onJobChange(...args)),
    aA: $data.jobIndex,
    aB: $data.jobOptions,
    aC: $data.darkMode ? 1 : "",
    aD: $data.darkMode ? 1 : "",
    aE: $data.darkMode ? 1 : "",
    aF: $data.formData.bio,
    aG: common_vendor.o(($event) => $data.formData.bio = $event.detail.value),
    aH: common_vendor.t($data.formData.bio.length),
    aI: $data.darkMode ? 1 : "",
    aJ: $data.darkMode ? 1 : "",
    aK: $data.darkMode ? 1 : "",
    aL: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args)),
    aM: !$options.hasChanges,
    aN: $data.darkMode ? 1 : "",
    aO: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
