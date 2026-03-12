"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      courseId: "",
      showVideo: false,
      videoUrl: "/static/videos/test.mp4",
      isFullscreen: false,
      videoContext: null,
      // 倍速相关
      showSpeedMenu: false,
      currentSpeed: 1,
      speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2],
      // 画质相关
      showQualityMenu: false,
      currentQuality: "自动",
      qualityOptions: ["自动", "360P", "480P", "720P", "1080P", "4K"],
      // 画面比例相关
      showRatioMenu: false,
      videoFit: "contain",
      ratioOptions: [
        { name: "原始比例", value: "contain" },
        { name: "铺满画面", value: "fill" },
        { name: "16:9", value: "cover" },
        { name: "4:3", value: "contain" }
      ],
      // 课程数据
      course: {
        title: "水稻高产种植技术",
        cover: "https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c",
        playCount: "23.4万",
        likes: 1234,
        comments: 89,
        author: "农业科普频道",
        authorAvatar: "",
        authorDesc: "优质农业领域创作者",
        description: "从选种到收割，30年经验老农手把手教学。本视频详细讲解了水稻种植的每一个环节，包括选种技巧、育苗方法、田间管理、病虫害防治、收割时机等。",
        publishTime: "2026-01-15"
      },
      tags: ["水稻种植", "农业技术", "农作物"],
      isLiked: false,
      isFavorited: false,
      isFollowed: false,
      showFullDesc: false,
      commentContent: "",
      userAvatar: "",
      comments: [
        {
          name: "新农人小王",
          avatar: "",
          content: "讲得太好了，终于明白为什么我家水稻总是产量不高了",
          time: "2小时前",
          likes: 56,
          replies: [
            { name: "老张", content: "确实，病虫害防治这块很关键" }
          ]
        },
        {
          name: "种植大户老李",
          avatar: "",
          content: "每年都看你的视频，学到了很多实用技巧",
          time: "昨天",
          likes: 23
        },
        {
          name: "农业专业学生",
          avatar: "",
          content: "作为农学生，老师的讲解非常专业，比课本生动多了",
          time: "3天前",
          likes: 89
        }
      ],
      sortBy: "hot",
      page: 1,
      pageSize: 10,
      hasMoreComments: true,
      recommendVideos: [
        {
          id: 2,
          title: "大棚蔬菜管理技巧",
          cover: "https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u",
          author: "蔬菜种植大全",
          playCount: "12.8万"
        },
        {
          id: 3,
          title: "拖拉机操作入门",
          cover: "https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p",
          author: "农机手老李",
          playCount: "34.2万"
        },
        {
          id: 4,
          title: "养猪技术大全",
          cover: "https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h",
          author: "猪司令",
          playCount: "67.3万"
        }
      ]
    };
  },
  computed: {
    sortText() {
      return this.sortBy === "hot" ? "最热" : "最新";
    },
    displayedComments() {
      return this.comments.slice(0, this.page * this.pageSize);
    },
    currentRatioText() {
      const ratio = this.ratioOptions.find((r) => r.value === this.videoFit);
      return ratio ? ratio.name : "原始比例";
    }
  },
  onLoad(options) {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.courseId = options.id;
    const courseData = {
      1: { title: "水稻高产种植技术", author: "农业科普频道", playCount: "23.4万", publishTime: "2026-01-15" },
      2: { title: "大棚蔬菜管理技巧", author: "蔬菜种植大全", playCount: "12.8万", publishTime: "2026-01-10" },
      3: { title: "拖拉机操作入门", author: "农机手老李", playCount: "34.2万", publishTime: "2026-01-05" },
      4: { title: "养猪技术大全", author: "猪司令", playCount: "67.3万", publishTime: "2026-01-12" },
      5: { title: "病虫害防治", author: "农技推广站", playCount: "18.2万", publishTime: "2026-01-08" },
      6: { title: "农产品电商", author: "电商讲师", playCount: "23.1万", publishTime: "2026-01-18" },
      7: { title: "玉米密植技术", author: "玉米专家", playCount: "18.9万", publishTime: "2026-01-20" },
      8: { title: "果树修剪大全", author: "园艺师", playCount: "21.3万", publishTime: "2026-01-22" },
      9: { title: "西瓜种植技术", author: "西瓜王", playCount: "14.7万", publishTime: "2026-01-25" },
      10: { title: "水产养殖技术", author: "水产达人", playCount: "19.4万", publishTime: "2026-01-28" }
    };
    const data = courseData[this.courseId] || courseData[1];
    this.course.title = data.title;
    this.course.author = data.author;
    this.course.playCount = data.playCount;
    this.course.publishTime = data.publishTime;
  },
  onShow() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  onReady() {
    this.videoContext = common_vendor.index.createVideoContext("courseVideo");
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    playVideo() {
      this.showVideo = true;
    },
    // 全屏状态变化事件
    onFullscreenChange(e) {
      this.isFullscreen = e.detail.fullScreen;
      common_vendor.index.__f__("log", "at pages/course-detail/course-detail.vue:438", "全屏状态变化:", this.isFullscreen);
      if (this.isFullscreen) {
        common_vendor.index.hideTabBar();
        common_vendor.index.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#000000"
        });
        common_vendor.index.setNavigationBarTitle({ title: "" });
      } else {
        common_vendor.index.showTabBar();
        common_vendor.index.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#F8F8F8"
        });
        common_vendor.index.setNavigationBarTitle({ title: this.course.title });
      }
    },
    // 选择倍速
    selectSpeed(speed) {
      this.currentSpeed = speed;
      this.showSpeedMenu = false;
      if (this.videoContext) {
        this.videoContext.playbackRate({
          rate: speed
        });
      }
    },
    // 选择画质
    selectQuality(quality) {
      this.currentQuality = quality;
      this.showQualityMenu = false;
      common_vendor.index.showToast({
        title: "画质切换: " + quality,
        icon: "none"
      });
    },
    // 选择画面比例
    selectRatio(ratio) {
      this.videoFit = ratio.value;
      this.showRatioMenu = false;
      common_vendor.index.showToast({
        title: "画面比例: " + ratio.name,
        icon: "none"
      });
    },
    // 点赞视频
    likeVideo() {
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        this.course.likes++;
        common_vendor.index.showToast({ title: "点赞成功", icon: "none" });
      } else {
        this.course.likes--;
      }
    },
    // 收藏视频
    favoriteVideo() {
      this.isFavorited = !this.isFavorited;
      common_vendor.index.showToast({
        title: this.isFavorited ? "已收藏" : "已取消收藏",
        icon: "none"
      });
    },
    shareVideo() {
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信", "分享到朋友圈", "复制链接"]
      });
    },
    downloadVideo() {
      common_vendor.index.showToast({ title: "缓存功能开发中", icon: "none" });
    },
    toggleFollow() {
      this.isFollowed = !this.isFollowed;
    },
    toggleDesc() {
      this.showFullDesc = !this.showFullDesc;
    },
    toggleSort() {
      this.sortBy = this.sortBy === "hot" ? "time" : "hot";
    },
    // 提交评论
    submitComment() {
      if (!this.commentContent.trim()) {
        common_vendor.index.showToast({ title: "请输入评论内容", icon: "none" });
        return;
      }
      const newComment = {
        name: "当前用户",
        avatar: this.userAvatar,
        content: this.commentContent,
        time: "刚刚",
        likes: 0
      };
      this.comments.unshift(newComment);
      this.commentContent = "";
      common_vendor.index.showToast({ title: "评论成功", icon: "success" });
    },
    likeComment(comment) {
      comment.likes = (comment.likes || 0) + 1;
    },
    replyComment(comment) {
      common_vendor.index.showToast({ title: "回复功能开发中", icon: "none" });
    },
    loadMoreComments() {
      this.page++;
      if (this.page * this.pageSize >= this.comments.length + 5) {
        this.hasMoreComments = false;
      }
    },
    goToVideo(item) {
      common_vendor.index.navigateTo({
        url: "/pages/course-detail/course-detail?id=" + item.id
      });
    },
    onPlay() {
      common_vendor.index.__f__("log", "at pages/course-detail/course-detail.vue:576", "视频开始播放");
    },
    onPause() {
      common_vendor.index.__f__("log", "at pages/course-detail/course-detail.vue:580", "视频暂停");
    },
    onEnded() {
      common_vendor.index.__f__("log", "at pages/course-detail/course-detail.vue:584", "视频播放结束");
    },
    onVideoError(e) {
      common_vendor.index.__f__("error", "at pages/course-detail/course-detail.vue:588", "视频错误", e);
      common_vendor.index.showToast({ title: "视频加载失败", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isFullscreen
  }, !$data.isFullscreen ? {
    b: $data.darkMode ? 1 : "",
    c: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    d: $data.darkMode ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: $data.darkMode ? 1 : ""
  } : {}, {
    g: $data.showVideo
  }, $data.showVideo ? {
    h: $data.videoUrl,
    i: $data.course.cover,
    j: common_vendor.o((...args) => $options.onPlay && $options.onPlay(...args)),
    k: common_vendor.o((...args) => $options.onPause && $options.onPause(...args)),
    l: common_vendor.o((...args) => $options.onEnded && $options.onEnded(...args)),
    m: common_vendor.o((...args) => $options.onVideoError && $options.onVideoError(...args)),
    n: common_vendor.o((...args) => $options.onFullscreenChange && $options.onFullscreenChange(...args)),
    o: $data.videoFit
  } : {
    p: $data.course.cover,
    q: common_vendor.o((...args) => $options.playVideo && $options.playVideo(...args))
  }, {
    r: $data.isFullscreen ? 1 : "",
    s: !$data.isFullscreen
  }, !$data.isFullscreen ? {
    t: common_vendor.t($data.course.title),
    v: $data.darkMode ? 1 : "",
    w: $data.darkMode ? 1 : ""
  } : {}, {
    x: !$data.isFullscreen
  }, !$data.isFullscreen ? common_vendor.e({
    y: $data.isLiked ? 1 : "",
    z: $data.darkMode && !$data.isLiked ? 1 : "",
    A: $data.course.likes > 0
  }, $data.course.likes > 0 ? {
    B: common_vendor.t($data.course.likes),
    C: $data.darkMode ? 1 : ""
  } : {}, {
    D: $data.isLiked ? 1 : "",
    E: $data.darkMode && !$data.isLiked ? 1 : "",
    F: common_vendor.o((...args) => $options.likeVideo && $options.likeVideo(...args)),
    G: $data.isFavorited ? 1 : "",
    H: $data.darkMode && !$data.isFavorited ? 1 : "",
    I: $data.isFavorited ? 1 : "",
    J: $data.darkMode && !$data.isFavorited ? 1 : "",
    K: common_vendor.o((...args) => $options.favoriteVideo && $options.favoriteVideo(...args)),
    L: $data.darkMode ? 1 : "",
    M: $data.darkMode ? 1 : "",
    N: common_vendor.o((...args) => $options.shareVideo && $options.shareVideo(...args)),
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : "",
    Q: common_vendor.o((...args) => $options.downloadVideo && $options.downloadVideo(...args)),
    R: $data.darkMode ? 1 : ""
  }) : {}, {
    S: !$data.isFullscreen
  }, !$data.isFullscreen ? {
    T: common_vendor.t($data.course.playCount || "0"),
    U: $data.darkMode ? 1 : "",
    V: common_vendor.t($data.course.likes || "0"),
    W: $data.darkMode ? 1 : "",
    X: common_vendor.t($data.course.comments || "0"),
    Y: $data.darkMode ? 1 : "",
    Z: $data.darkMode ? 1 : "",
    aa: $data.darkMode ? 1 : ""
  } : {}, {
    ab: $data.isFullscreen
  }, $data.isFullscreen ? {
    ac: common_vendor.t($data.currentSpeed),
    ad: common_vendor.o(($event) => $data.showSpeedMenu = true),
    ae: common_vendor.t($data.currentQuality),
    af: common_vendor.o(($event) => $data.showQualityMenu = true),
    ag: common_vendor.t($options.currentRatioText),
    ah: common_vendor.o(($event) => $data.showRatioMenu = true)
  } : {}, {
    ai: $data.showSpeedMenu
  }, $data.showSpeedMenu ? {
    aj: common_vendor.o(($event) => $data.showSpeedMenu = false)
  } : {}, {
    ak: $data.showSpeedMenu
  }, $data.showSpeedMenu ? {
    al: $data.darkMode ? 1 : "",
    am: common_vendor.f($data.speedOptions, (speed, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(speed),
        b: $data.currentSpeed === speed
      }, $data.currentSpeed === speed ? {} : {}, {
        c: speed,
        d: common_vendor.o(($event) => $options.selectSpeed(speed), speed)
      });
    }),
    an: $data.darkMode ? 1 : "",
    ao: $data.darkMode ? 1 : "",
    ap: $data.isFullscreen ? 1 : "",
    aq: $data.darkMode ? 1 : ""
  } : {}, {
    ar: $data.showQualityMenu
  }, $data.showQualityMenu ? {
    as: common_vendor.o(($event) => $data.showQualityMenu = false)
  } : {}, {
    at: $data.showQualityMenu
  }, $data.showQualityMenu ? {
    av: $data.darkMode ? 1 : "",
    aw: common_vendor.f($data.qualityOptions, (quality, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(quality),
        b: $data.currentQuality === quality
      }, $data.currentQuality === quality ? {} : {}, {
        c: quality,
        d: common_vendor.o(($event) => $options.selectQuality(quality), quality)
      });
    }),
    ax: $data.darkMode ? 1 : "",
    ay: $data.darkMode ? 1 : "",
    az: $data.isFullscreen ? 1 : "",
    aA: $data.darkMode ? 1 : ""
  } : {}, {
    aB: $data.showRatioMenu
  }, $data.showRatioMenu ? {
    aC: common_vendor.o(($event) => $data.showRatioMenu = false)
  } : {}, {
    aD: $data.showRatioMenu
  }, $data.showRatioMenu ? {
    aE: $data.darkMode ? 1 : "",
    aF: common_vendor.f($data.ratioOptions, (ratio, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(ratio.name),
        b: $data.videoFit === ratio.value
      }, $data.videoFit === ratio.value ? {} : {}, {
        c: ratio.value,
        d: common_vendor.o(($event) => $options.selectRatio(ratio), ratio.value)
      });
    }),
    aG: $data.darkMode ? 1 : "",
    aH: $data.darkMode ? 1 : "",
    aI: $data.isFullscreen ? 1 : "",
    aJ: $data.darkMode ? 1 : ""
  } : {}, {
    aK: !$data.isFullscreen
  }, !$data.isFullscreen ? {
    aL: $data.darkMode ? 1 : ""
  } : {}, {
    aM: !$data.isFullscreen
  }, !$data.isFullscreen ? common_vendor.e({
    aN: $data.course.authorAvatar || "/static/logo.png",
    aO: common_vendor.t($data.course.author || "UP主"),
    aP: $data.darkMode ? 1 : "",
    aQ: common_vendor.t($data.course.authorDesc || "农业领域创作者"),
    aR: $data.darkMode ? 1 : "",
    aS: common_vendor.t($data.isFollowed ? "已关注" : "+ 关注"),
    aT: $data.isFollowed ? 1 : "",
    aU: $data.darkMode && !$data.isFollowed ? 1 : "",
    aV: common_vendor.o((...args) => $options.toggleFollow && $options.toggleFollow(...args)),
    aW: common_vendor.t($data.course.description || "暂无描述"),
    aX: $data.darkMode ? 1 : "",
    aY: $data.showFullDesc
  }, $data.showFullDesc ? {
    aZ: $data.darkMode ? 1 : "",
    ba: common_vendor.o((...args) => $options.toggleDesc && $options.toggleDesc(...args))
  } : {
    bb: $data.darkMode ? 1 : "",
    bc: common_vendor.o((...args) => $options.toggleDesc && $options.toggleDesc(...args))
  }, {
    bd: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    be: $data.darkMode ? 1 : "",
    bf: common_vendor.t($data.course.publishTime || "2026-01-01 发布"),
    bg: $data.darkMode ? 1 : "",
    bh: $data.darkMode ? 1 : ""
  }) : {}, {
    bi: !$data.isFullscreen
  }, !$data.isFullscreen ? common_vendor.e({
    bj: $data.darkMode ? 1 : "",
    bk: common_vendor.t($data.comments.length),
    bl: $data.darkMode ? 1 : "",
    bm: common_vendor.t($options.sortText),
    bn: $data.darkMode ? 1 : "",
    bo: common_vendor.o((...args) => $options.toggleSort && $options.toggleSort(...args)),
    bp: $data.userAvatar || "/static/logo.png",
    bq: $data.darkMode ? 1 : "",
    br: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    bs: $data.commentContent,
    bt: common_vendor.o(($event) => $data.commentContent = $event.detail.value),
    bv: $data.darkMode ? 1 : "",
    bw: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    bx: common_vendor.f($options.displayedComments, (comment, index, i0) => {
      return common_vendor.e({
        a: comment.avatar || "/static/logo.png",
        b: common_vendor.t(comment.name),
        c: common_vendor.t(comment.time),
        d: common_vendor.t(comment.content),
        e: common_vendor.t(comment.likes || 0),
        f: common_vendor.o(($event) => $options.likeComment(comment), index),
        g: common_vendor.o(($event) => $options.replyComment(comment), index),
        h: comment.replies && comment.replies.length > 0
      }, comment.replies && comment.replies.length > 0 ? {
        i: common_vendor.f(comment.replies, (reply, idx, i1) => {
          return {
            a: common_vendor.t(reply.name),
            b: common_vendor.t(reply.content),
            c: idx
          };
        }),
        j: $data.darkMode ? 1 : "",
        k: $data.darkMode ? 1 : "",
        l: $data.darkMode ? 1 : ""
      } : {}, {
        m: index
      });
    }),
    by: $data.darkMode ? 1 : "",
    bz: $data.darkMode ? 1 : "",
    bA: $data.darkMode ? 1 : "",
    bB: $data.darkMode ? 1 : "",
    bC: $data.darkMode ? 1 : "",
    bD: $data.darkMode ? 1 : "",
    bE: $data.hasMoreComments
  }, $data.hasMoreComments ? {
    bF: $data.darkMode ? 1 : "",
    bG: common_vendor.o((...args) => $options.loadMoreComments && $options.loadMoreComments(...args))
  } : {}, {
    bH: $data.darkMode ? 1 : ""
  }) : {}, {
    bI: !$data.isFullscreen
  }, !$data.isFullscreen ? {
    bJ: $data.darkMode ? 1 : "",
    bK: common_vendor.f($data.recommendVideos, (item, index, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.author),
        d: common_vendor.t(item.playCount),
        e: index,
        f: common_vendor.o(($event) => $options.goToVideo(item), index)
      };
    }),
    bL: $data.darkMode ? 1 : "",
    bM: $data.darkMode ? 1 : "",
    bN: $data.darkMode ? 1 : "",
    bO: $data.darkMode ? 1 : "",
    bP: $data.darkMode ? 1 : ""
  } : {}, {
    bQ: !$data.isFullscreen
  }, !$data.isFullscreen ? {} : {}, {
    bR: $data.darkMode ? 1 : "",
    bS: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course-detail/course-detail.js.map
