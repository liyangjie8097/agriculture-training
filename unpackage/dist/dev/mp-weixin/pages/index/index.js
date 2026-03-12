"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const VideoPlayer = () => "../../components/VideoPlayer.js";
const _sfc_main = {
  components: {
    VideoPlayer
  },
  data() {
    return {
      darkMode: false,
      currentDate: "",
      farmingReminder: "",
      showVideoModal: false,
      currentVideo: null,
      banners: [
        { image: "https://via.placeholder.com/750x300/2b5e2b/ffffff?text=农业技能培训" },
        { image: "https://via.placeholder.com/750x300/1e4b1e/ffffff?text=B站热门" },
        { image: "https://via.placeholder.com/750x300/3a773a/ffffff?text=腾讯视频" }
      ],
      hotVideos: [],
      topNews: [],
      learningVideos: [],
      currentUser: null
    };
  },
  onLoad() {
    const app = getApp();
    this.darkMode = app.globalData.darkMode || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.getCurrentDate();
    this.getFarmingReminder();
    this.loadHotVideos();
    this.loadTopNews();
    this.getCurrentUser();
    this.loadLearningVideos();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  onShow() {
    const app = getApp();
    this.darkMode = app.globalData.darkMode || false;
    this.getCurrentUser();
    this.loadLearningVideos();
  },
  methods: {
    getCurrentDate() {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const weekday = weekdays[date.getDay()];
      this.currentDate = `${year}年${month}月${day}日 ${weekday}`;
    },
    getFarmingReminder() {
      const month = (/* @__PURE__ */ new Date()).getMonth() + 1;
      if (month >= 3 && month <= 5) {
        this.farmingReminder = "春季是播种关键期，推荐搜索“春耕”视频";
      } else if (month >= 6 && month <= 8) {
        this.farmingReminder = "夏季高温多雨，推荐搜索“田间管理”视频";
      } else if (month >= 9 && month <= 11) {
        this.farmingReminder = "秋季是收获季节，推荐搜索“收割”视频";
      } else {
        this.farmingReminder = "冬季推荐搜索“农机保养”视频";
      }
    },
    async loadHotVideos() {
      try {
        const res = await common_vendor.index.request({
          url: config.baseUrl + "/video/hot",
          method: "GET"
        });
        if (res.data.success) {
          this.hotVideos = res.data.data;
          common_vendor.index.__f__("log", "at pages/index/index.vue:246", "热门视频加载成功:", this.hotVideos.length);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:249", "加载热门视频失败:", error);
      }
    },
    loadTopNews() {
      this.topNews = [
        {
          id: 1,
          title: "2024年中央一号文件发布：全面推进乡村振兴",
          thumb: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=政策",
          source: "农业农村部",
          time: "2小时前",
          commentCount: 12
        },
        {
          id: 2,
          title: "生猪价格连续上涨，养殖户迎来盈利期",
          thumb: "https://via.placeholder.com/200x150/FF9800/ffffff?text=生猪",
          source: "中国农业信息网",
          time: "昨天",
          commentCount: 8
        },
        {
          id: 3,
          title: "无人机植保技术：效率提升80%",
          thumb: "https://via.placeholder.com/200x150/2196F3/ffffff?text=无人机",
          source: "农业科技报",
          time: "3天前",
          commentCount: 15
        }
      ];
    },
    loadLearningVideos() {
      if (!this.currentUser)
        return;
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userRecords = records[this.currentUser.userId] || {};
      this.learningVideos = Object.values(userRecords).sort((a, b) => b.lastWatchTime - a.lastWatchTime).slice(0, 3);
    },
    getCurrentUser() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.currentUser = userInfo;
      }
    },
    quickSearch(keyword) {
      common_vendor.index.navigateTo({
        url: "/pages/search/search?keyword=" + encodeURIComponent(keyword)
      });
    },
    playVideo(video) {
      this.currentVideo = video;
      this.showVideoModal = true;
    },
    closeVideoModal() {
      this.showVideoModal = false;
      this.currentVideo = null;
    },
    onVideoStart(video) {
      this.saveLearningRecord(video);
    },
    onVideoComplete(video) {
      this.updateLearningProgress(video, 100);
    },
    onVideoProgress(data) {
      if (data && data.video && data.progress) {
        this.updateLearningProgress(data.video, data.progress);
      }
    },
    onVideoTitleUpdated(data) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:331", "视频标题更新:", data);
    },
    saveLearningRecord(video) {
      if (!this.currentUser)
        return;
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userId = this.currentUser.userId;
      if (!records[userId]) {
        records[userId] = {};
      }
      if (!records[userId][video.id]) {
        records[userId][video.id] = {
          courseId: video.id,
          courseTitle: video.title,
          source: video.source,
          sourceName: video.sourceName,
          lastWatchTime: (/* @__PURE__ */ new Date()).getTime(),
          progress: 0,
          type: "external",
          cover: video.cover,
          url: video.url,
          author: video.author,
          duration: video.duration
        };
      } else {
        records[userId][video.id].lastWatchTime = (/* @__PURE__ */ new Date()).getTime();
      }
      common_vendor.index.setStorageSync("learningRecords", records);
    },
    updateLearningProgress(video, progress) {
      if (!this.currentUser)
        return;
      const records = common_vendor.index.getStorageSync("learningRecords") || {};
      const userId = this.currentUser.userId;
      if (records[userId] && records[userId][video.id]) {
        records[userId][video.id].progress = progress;
        records[userId][video.id].lastWatchTime = (/* @__PURE__ */ new Date()).getTime();
        common_vendor.index.setStorageSync("learningRecords", records);
      }
    },
    formatTime(timestamp) {
      if (!timestamp)
        return "未知时间";
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      if (date.toDateString() === now.toDateString()) {
        return "今天 " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
      }
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return "昨天 " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
      }
      return date.getMonth() + 1 + "-" + date.getDate();
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    },
    goToVideoList() {
      common_vendor.index.switchTab({
        url: "/pages/course/course"
      });
    },
    goToQa() {
      common_vendor.index.switchTab({
        url: "/pages/qa/qa"
      });
    },
    goToMyCourses() {
      if (!this.currentUser) {
        this.showLoginTip();
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/my-courses/my-courses"
      });
    },
    goToNews() {
      common_vendor.index.switchTab({
        url: "/pages/news/news"
      });
    },
    goToNewsDetail(news) {
      common_vendor.index.navigateTo({
        url: "/pages/news-detail/news-detail?id=" + news.id
      });
    },
    showLoginTip() {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_VideoPlayer = common_vendor.resolveComponent("VideoPlayer");
  _component_VideoPlayer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: $data.darkMode ? 1 : "",
    c: $data.darkMode ? 1 : "",
    d: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    e: common_vendor.f($data.banners, (banner, index, i0) => {
      return {
        a: banner.image,
        b: index
      };
    }),
    f: $data.darkMode ? 1 : "",
    g: common_vendor.o(($event) => $options.quickSearch("种植")),
    h: $data.darkMode ? 1 : "",
    i: common_vendor.o(($event) => $options.quickSearch("养殖")),
    j: $data.darkMode ? 1 : "",
    k: common_vendor.o(($event) => $options.quickSearch("农机")),
    l: $data.darkMode ? 1 : "",
    m: common_vendor.o(($event) => $options.quickSearch("病虫害")),
    n: $data.darkMode ? 1 : "",
    o: common_vendor.o(($event) => $options.quickSearch("加工")),
    p: $data.darkMode ? 1 : "",
    q: common_vendor.o((...args) => $options.goToQa && $options.goToQa(...args)),
    r: $data.darkMode ? 1 : "",
    s: $data.hotVideos.length > 0
  }, $data.hotVideos.length > 0 ? {
    t: $data.darkMode ? 1 : "",
    v: $data.darkMode ? 1 : "",
    w: common_vendor.o((...args) => $options.goToVideoList && $options.goToVideoList(...args)),
    x: common_vendor.f($data.hotVideos, (video, k0, i0) => {
      return {
        a: video.cover,
        b: common_vendor.t(video.title),
        c: common_vendor.t(video.sourceName),
        d: common_vendor.n("source-" + video.source),
        e: common_vendor.t(video.author),
        f: common_vendor.t(video.playCount),
        g: video.id,
        h: common_vendor.o(($event) => $options.playVideo(video), video.id)
      };
    }),
    y: $data.darkMode ? 1 : "",
    z: $data.darkMode ? 1 : ""
  } : {}, {
    A: $data.learningVideos.length > 0
  }, $data.learningVideos.length > 0 ? {
    B: $data.darkMode ? 1 : "",
    C: $data.darkMode ? 1 : "",
    D: common_vendor.o((...args) => $options.goToMyCourses && $options.goToMyCourses(...args)),
    E: common_vendor.f($data.learningVideos, (video, k0, i0) => {
      return {
        a: video.cover,
        b: common_vendor.t(video.courseTitle),
        c: (video.progress || 0) + "%",
        d: common_vendor.t(video.progress || 0),
        e: common_vendor.t($options.formatTime(video.lastWatchTime)),
        f: video.courseId,
        g: common_vendor.o(($event) => $options.playVideo(video), video.courseId)
      };
    }),
    F: $data.darkMode ? 1 : "",
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: $data.darkMode ? 1 : ""
  } : {}, {
    J: $data.darkMode ? 1 : "",
    K: $data.darkMode ? 1 : "",
    L: common_vendor.o((...args) => $options.goToNews && $options.goToNews(...args)),
    M: $data.topNews.length > 0
  }, $data.topNews.length > 0 ? {
    N: common_vendor.f($data.topNews, (news, k0, i0) => {
      return {
        a: news.thumb || news.image,
        b: common_vendor.t(news.title),
        c: common_vendor.t(news.source),
        d: common_vendor.t(news.time),
        e: common_vendor.t(news.commentCount || 0),
        f: news.id,
        g: common_vendor.o(($event) => $options.goToNewsDetail(news), news.id)
      };
    }),
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : ""
  } : {}, {
    Q: $data.darkMode ? 1 : "",
    R: common_vendor.o($options.closeVideoModal),
    S: common_vendor.o($options.onVideoStart),
    T: common_vendor.o($options.onVideoComplete),
    U: common_vendor.o($options.onVideoProgress),
    V: common_vendor.o($options.onVideoTitleUpdated),
    W: common_vendor.p({
      show: $data.showVideoModal,
      video: $data.currentVideo
    }),
    X: $data.darkMode ? 1 : "",
    Y: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
