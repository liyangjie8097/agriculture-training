"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false
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
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.darkMode ? 1 : "",
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: common_assets._imports_0,
    f: $data.darkMode ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : "",
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.darkMode ? 1 : "",
    n: $data.darkMode ? 1 : "",
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode ? 1 : ""
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/about/about.js.map
