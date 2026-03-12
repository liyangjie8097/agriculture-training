"use strict";
const common_vendor = require("../common/vendor.js");
const config = require("../config.js");
const _sfc_main = {
  name: "VideoPlayer",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    video: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      currentVideo: null,
      videoUrl: "",
      loading: false,
      error: "",
      isPlaying: false,
      currentTime: 0,
      progressReported: false,
      darkMode: false
    };
  },
  watch: {
    show: {
      handler(val) {
        common_vendor.index.__f__("log", "at components/VideoPlayer.vue:78", "VideoPlayer show 变化:", val);
        this.showModal = val;
        if (val && this.video) {
          this.currentVideo = this.video;
          this.loadVideoUrl();
          this.progressReported = false;
        }
      },
      immediate: true
    },
    video: {
      handler(val) {
        common_vendor.index.__f__("log", "at components/VideoPlayer.vue:90", "VideoPlayer video 变化:", val);
        this.currentVideo = val;
        if (this.showModal && val) {
          this.loadVideoUrl();
          this.progressReported = false;
        }
      },
      immediate: true
    }
  },
  created() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
  },
  beforeDestroy() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    closeModal() {
      common_vendor.index.__f__("log", "at components/VideoPlayer.vue:116", "关闭视频弹窗");
      this.showModal = false;
      this.videoUrl = "";
      this.error = "";
      this.isPlaying = false;
      this.currentTime = 0;
      this.progressReported = false;
      this.$emit("close");
    },
    async loadVideoUrl() {
      if (!this.currentVideo) {
        this.error = "没有视频数据";
        return;
      }
      this.loading = true;
      this.error = "";
      this.videoUrl = "";
      try {
        if (this.currentVideo.id && this.currentVideo.id.startsWith("bili_")) {
          const bvid = this.currentVideo.bvid || this.currentVideo.id.replace("bili_", "");
          common_vendor.index.__f__("log", "at components/VideoPlayer.vue:141", "解析B站视频:", bvid);
          const res = await common_vendor.index.request({
            url: config.baseUrl + "/video/parse/bilibili",
            method: "GET",
            data: { bvid },
            timeout: 15e3
          });
          common_vendor.index.__f__("log", "at components/VideoPlayer.vue:150", "解析结果:", res.data);
          if (res.data && res.data.success) {
            this.videoUrl = res.data.data.url;
            common_vendor.index.__f__("log", "at components/VideoPlayer.vue:154", "获取到真实视频地址");
            this.$emit("start", this.currentVideo);
          } else {
            this.playLocalTestVideo();
          }
        } else {
          this.playLocalTestVideo();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/VideoPlayer.vue:167", "加载视频失败:", error);
        this.playLocalTestVideo();
      } finally {
        this.loading = false;
      }
    },
    // 播放本地测试视频
    playLocalTestVideo() {
      common_vendor.index.__f__("log", "at components/VideoPlayer.vue:177", "播放本地测试视频");
      this.videoUrl = "/static/videos/test.mp4";
      common_vendor.index.__f__("log", "at components/VideoPlayer.vue:182", "视频地址:", this.videoUrl);
      this.$emit("start", this.currentVideo);
      common_vendor.index.showToast({
        title: "播放测试视频",
        icon: "none"
      });
    },
    onPlay() {
      this.isPlaying = true;
      common_vendor.index.__f__("log", "at components/VideoPlayer.vue:195", "视频开始播放");
    },
    onPause(e) {
      this.isPlaying = false;
      if (e && e.detail) {
        this.currentTime = e.detail.currentTime;
        common_vendor.index.__f__("log", "at components/VideoPlayer.vue:202", "视频暂停于:", this.currentTime);
      }
    },
    onEnded() {
      common_vendor.index.__f__("log", "at components/VideoPlayer.vue:207", "视频播放结束");
      this.isPlaying = false;
      this.$emit("complete", this.currentVideo);
    },
    onTimeUpdate(e) {
      if (!e || !e.detail)
        return;
      this.currentTime = e.detail.currentTime;
      const duration = e.detail.duration;
      if (duration > 0 && !this.progressReported && this.currentTime / duration > 0.3) {
        this.progressReported = true;
        this.$emit("progress", {
          video: this.currentVideo,
          progress: 30
        });
      }
    },
    onError(e) {
      common_vendor.index.__f__("error", "at components/VideoPlayer.vue:229", "视频播放错误:", e);
      this.error = "视频播放失败，请重试";
      if (this.videoUrl) {
        setTimeout(() => {
          this.playLocalTestVideo();
        }, 1e3);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return common_vendor.e({
    a: $data.showModal
  }, $data.showModal ? common_vendor.e({
    b: common_vendor.t(((_a = $data.currentVideo) == null ? void 0 : _a.title) || "视频播放"),
    c: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    d: $data.darkMode ? 1 : "",
    e: $data.loading
  }, $data.loading ? {
    f: $data.darkMode ? 1 : ""
  } : $data.videoUrl ? {
    h: $data.videoUrl,
    i: common_vendor.o((...args) => $options.onPlay && $options.onPlay(...args)),
    j: common_vendor.o((...args) => $options.onPause && $options.onPause(...args)),
    k: common_vendor.o((...args) => $options.onEnded && $options.onEnded(...args)),
    l: common_vendor.o((...args) => $options.onError && $options.onError(...args)),
    m: common_vendor.o((...args) => $options.onTimeUpdate && $options.onTimeUpdate(...args))
  } : $data.error ? {
    o: common_vendor.t($data.error),
    p: $data.darkMode ? 1 : "",
    q: common_vendor.o((...args) => $options.loadVideoUrl && $options.loadVideoUrl(...args))
  } : {}, {
    g: $data.videoUrl,
    n: $data.error,
    r: common_vendor.o(() => {
    }),
    s: $data.darkMode ? 1 : "",
    t: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/VideoPlayer.js.map
