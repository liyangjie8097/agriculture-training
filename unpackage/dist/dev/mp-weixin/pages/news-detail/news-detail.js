"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      newsId: "",
      loading: true,
      news: {
        id: "",
        category: "",
        title: "",
        summary: "",
        content: "",
        cover_image: "",
        source: "",
        author: "",
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        is_top: 0,
        publish_time: ""
      },
      allNews: [],
      relatedNews: [],
      comments: [],
      commentContent: "",
      isLogin: false,
      userInfo: {},
      isLiked: false,
      isFavorited: false,
      // 排序相关
      sortBy: "time",
      // 'time' 或 'hot'
      // 回复相关
      activeReplyCommentId: null,
      replyToCommentId: null,
      replyToReplyId: null,
      replyToUser: "",
      replyContent: ""
    };
  },
  computed: {
    sortText() {
      return this.sortBy === "time" ? "最新" : "最热";
    },
    sortedComments() {
      if (this.sortBy === "hot") {
        return [...this.comments].sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      }
      return this.comments;
    },
    replyPlaceholder() {
      return this.replyToUser ? `回复 @${this.replyToUser}` : "写下你的回复...";
    }
  },
  onLoad(options) {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.newsId = options.id;
    this.checkLoginStatus();
    this.loadNewsDetail();
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
      } else {
        this.isLogin = false;
        this.userInfo = {};
      }
    },
    // 加载资讯详情
    async loadNewsDetail() {
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: config.baseUrl + "/news/" + this.newsId,
            method: "GET",
            success: (res2) => resolve(res2),
            fail: (err) => reject(err)
          });
        });
        if (res.data.success) {
          this.news = res.data.data;
          this.comments = res.data.data.comments || [];
          this.loadRelatedNews();
          this.checkFavoriteStatus();
          common_vendor.index.setNavigationBarTitle({
            title: this.news.title.substring(0, 15) + "..."
          });
        }
        this.loading = false;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/news-detail/news-detail.vue:290", "加载资讯详情失败:", error);
        this.loading = false;
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    },
    // 加载相关推荐
    loadRelatedNews() {
      const pages = getCurrentPages();
      const newsPage = pages.find((p) => p.route === "pages/news/news");
      if (newsPage && newsPage.$vm) {
        this.allNews = newsPage.$vm.newsList || [];
        this.relatedNews = this.allNews.filter((n) => n.category === this.news.category && n.id != this.news.id).slice(0, 3);
      }
    },
    // 检查收藏状态
    checkFavoriteStatus() {
      if (!this.isLogin)
        return;
      const favorites = common_vendor.index.getStorageSync("newsFavorites") || {};
      const userFavorites = favorites[this.userInfo.userId] || [];
      this.isFavorited = userFavorites.includes(parseInt(this.newsId));
    },
    // 切换排序
    toggleSort() {
      this.sortBy = this.sortBy === "time" ? "hot" : "time";
    },
    // 点赞资讯
    async likeNews() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      try {
        await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: config.baseUrl + "/news/" + this.newsId + "/like",
            method: "POST",
            data: { user_id: this.userInfo.userId },
            success: (res) => resolve(res),
            fail: (err) => reject(err)
          });
        });
        if (this.isLiked) {
          this.news.like_count--;
        } else {
          this.news.like_count++;
        }
        this.isLiked = !this.isLiked;
        common_vendor.index.showToast({
          title: this.isLiked ? "点赞成功" : "已取消点赞",
          icon: "none"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/news-detail/news-detail.vue:356", "点赞失败:", error);
      }
    },
    // 收藏资讯
    favoriteNews() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      const favorites = common_vendor.index.getStorageSync("newsFavorites") || {};
      const userId = this.userInfo.userId;
      if (!favorites[userId]) {
        favorites[userId] = [];
      }
      const newsIdNum = parseInt(this.newsId);
      if (this.isFavorited) {
        favorites[userId] = favorites[userId].filter((id) => id != newsIdNum);
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "none"
        });
      } else {
        if (!favorites[userId].includes(newsIdNum)) {
          favorites[userId].push(newsIdNum);
          common_vendor.index.showToast({
            title: "收藏成功",
            icon: "success"
          });
        }
      }
      common_vendor.index.setStorageSync("newsFavorites", favorites);
      this.isFavorited = !this.isFavorited;
    },
    // 分享资讯
    shareNews() {
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信好友", "分享到朋友圈", "复制链接"],
        success: (res) => {
          if (res.tapIndex === 2) {
            common_vendor.index.setClipboardData({
              data: "http://81.71.93.186:3000/pages/news-detail/news-detail?id=" + this.newsId,
              success: () => {
                common_vendor.index.showToast({
                  title: "链接已复制",
                  icon: "success"
                });
              }
            });
          } else {
            common_vendor.index.showToast({
              title: "分享功能开发中",
              icon: "none"
            });
          }
        }
      });
    },
    // 点赞评论
    likeComment(comment) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      comment.like_count = (comment.like_count || 0) + 1;
      this.saveComments();
    },
    // 点赞回复
    likeReply(reply) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      reply.like_count = (reply.like_count || 0) + 1;
      this.saveComments();
    },
    // 保存评论到本地存储（临时方案，后续可改为后端接口）
    saveComments() {
      const newsComments = common_vendor.index.getStorageSync("newsComments") || {};
      newsComments[this.newsId] = this.comments;
      common_vendor.index.setStorageSync("newsComments", newsComments);
    },
    // 显示回复输入框
    showReplyInput(comment, reply = null) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      this.activeReplyCommentId = comment.id;
      if (reply) {
        this.replyToCommentId = comment.id;
        this.replyToReplyId = reply.id;
        this.replyToUser = reply.author_name;
      } else {
        this.replyToCommentId = comment.id;
        this.replyToReplyId = null;
        this.replyToUser = comment.author_name;
      }
    },
    // 取消回复
    cancelReply() {
      this.activeReplyCommentId = null;
      this.replyToCommentId = null;
      this.replyToReplyId = null;
      this.replyToUser = "";
      this.replyContent = "";
    },
    // 提交回复
    submitReply(comment) {
      if (!this.replyContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none"
        });
        return;
      }
      const newReply = {
        id: Date.now(),
        author_name: this.userInfo.nickName || this.userInfo.username || "用户",
        author_avatar: this.userInfo.avatarUrl || "/static/logo.png",
        content: this.replyContent,
        create_time: (/* @__PURE__ */ new Date()).toISOString(),
        like_count: 0
      };
      if (!comment.replies) {
        comment.replies = [];
      }
      comment.replies.push(newReply);
      this.saveComments();
      this.cancelReply();
      common_vendor.index.showToast({
        title: "回复成功",
        icon: "success"
      });
    },
    // 提交评论
    async submitComment() {
      if (!this.commentContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          icon: "none"
        });
        return;
      }
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: config.baseUrl + "/news/" + this.newsId + "/comments",
            method: "POST",
            data: {
              user_id: this.userInfo.userId,
              content: this.commentContent
            },
            success: (res2) => resolve(res2),
            fail: (err) => reject(err)
          });
        });
        if (res.data.success) {
          const newComment = {
            id: res.data.data.id,
            author_name: this.userInfo.nickName || this.userInfo.username || "用户",
            author_avatar: this.userInfo.avatarUrl || "/static/logo.png",
            content: this.commentContent,
            create_time: (/* @__PURE__ */ new Date()).toISOString(),
            like_count: 0,
            replies: []
          };
          this.comments.unshift(newComment);
          this.news.comment_count = (this.news.comment_count || 0) + 1;
          this.commentContent = "";
          common_vendor.index.showToast({
            title: "评论已发布",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/news-detail/news-detail.vue:555", "发表评论失败:", error);
        common_vendor.index.showToast({
          title: "评论失败",
          icon: "none"
        });
      }
    },
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr)
        return "未知时间";
      const date = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / (1e3 * 60));
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (minutes < 1)
        return "刚刚";
      if (minutes < 60)
        return minutes + "分钟前";
      if (hours < 24)
        return hours + "小时前";
      if (days < 30)
        return days + "天前";
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },
    // 显示登录提示
    showLoginTip() {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录",
        success: (res) => {
          if (res.confirm) {
            this.goToLogin();
          }
        }
      });
    },
    // 跳转到登录
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    // 跳转到资讯详情
    goToNewsDetail(news) {
      common_vendor.index.redirectTo({
        url: "/pages/news-detail/news-detail?id=" + news.id
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {
    b: $data.darkMode ? 1 : ""
  } : common_vendor.e({
    c: common_vendor.t($data.news.title),
    d: $data.darkMode ? 1 : "",
    e: common_vendor.t($data.news.source),
    f: $data.darkMode ? 1 : "",
    g: common_vendor.t($options.formatTime($data.news.publish_time)),
    h: $data.darkMode ? 1 : "",
    i: common_vendor.t($data.news.view_count || 0),
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.news.cover_image || "https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c",
    n: common_vendor.t($data.news.content),
    o: $data.darkMode ? 1 : "",
    p: $data.darkMode ? 1 : "",
    q: $data.isLiked ? 1 : "",
    r: $data.darkMode && !$data.isLiked ? 1 : "",
    s: common_vendor.t($data.isLiked ? "已点赞" : "点赞"),
    t: $data.isLiked ? 1 : "",
    v: $data.darkMode && !$data.isLiked ? 1 : "",
    w: $data.news.like_count > 0
  }, $data.news.like_count > 0 ? {
    x: common_vendor.t($data.news.like_count),
    y: $data.darkMode ? 1 : ""
  } : {}, {
    z: common_vendor.o((...args) => $options.likeNews && $options.likeNews(...args)),
    A: $data.isFavorited ? 1 : "",
    B: $data.darkMode && !$data.isFavorited ? 1 : "",
    C: common_vendor.t($data.isFavorited ? "已收藏" : "收藏"),
    D: $data.isFavorited ? 1 : "",
    E: $data.darkMode && !$data.isFavorited ? 1 : "",
    F: common_vendor.o((...args) => $options.favoriteNews && $options.favoriteNews(...args)),
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: common_vendor.o((...args) => $options.shareNews && $options.shareNews(...args)),
    J: $data.darkMode ? 1 : "",
    K: common_vendor.t($data.comments.length),
    L: $data.darkMode ? 1 : "",
    M: common_vendor.t($options.sortText),
    N: $data.darkMode ? 1 : "",
    O: common_vendor.o((...args) => $options.toggleSort && $options.toggleSort(...args)),
    P: common_vendor.f($options.sortedComments, (comment, k0, i0) => {
      return common_vendor.e({
        a: comment.author_avatar || "/static/logo.png",
        b: common_vendor.t(comment.author_name || "匿名用户"),
        c: common_vendor.t($options.formatTime(comment.create_time)),
        d: common_vendor.o(($event) => $options.showReplyInput(comment), comment.id),
        e: common_vendor.t(comment.content),
        f: common_vendor.t(comment.like_count || 0),
        g: common_vendor.o(($event) => $options.likeComment(comment), comment.id),
        h: comment.replies && comment.replies.length > 0
      }, comment.replies && comment.replies.length > 0 ? {
        i: common_vendor.f(comment.replies, (reply, k1, i1) => {
          return {
            a: reply.author_avatar || "/static/logo.png",
            b: common_vendor.t(reply.author_name),
            c: common_vendor.t($options.formatTime(reply.create_time)),
            d: common_vendor.t(reply.content),
            e: common_vendor.t(reply.like_count || 0),
            f: common_vendor.o(($event) => $options.likeReply(reply), reply.id),
            g: common_vendor.o(($event) => $options.showReplyInput(comment, reply), reply.id),
            h: reply.id
          };
        }),
        j: $data.darkMode ? 1 : "",
        k: $data.darkMode ? 1 : "",
        l: $data.darkMode ? 1 : "",
        m: $data.darkMode ? 1 : "",
        n: $data.darkMode ? 1 : ""
      } : {}, {
        o: $data.activeReplyCommentId === comment.id
      }, $data.activeReplyCommentId === comment.id ? common_vendor.e({
        p: $data.replyToUser
      }, $data.replyToUser ? {
        q: common_vendor.t($data.replyToUser),
        r: $data.darkMode ? 1 : ""
      } : {}, {
        s: $options.replyPlaceholder,
        t: $data.darkMode ? 1 : "",
        v: $data.replyContent,
        w: common_vendor.o(($event) => $data.replyContent = $event.detail.value, comment.id),
        x: $data.darkMode ? 1 : "",
        y: common_vendor.o((...args) => $options.cancelReply && $options.cancelReply(...args), comment.id),
        z: $data.darkMode ? 1 : "",
        A: common_vendor.o(($event) => $options.submitReply(comment), comment.id),
        B: $data.darkMode ? 1 : ""
      }) : {}, {
        C: comment.id
      });
    }),
    Q: $data.darkMode ? 1 : "",
    R: $data.darkMode ? 1 : "",
    S: $data.darkMode ? 1 : "",
    T: $data.darkMode ? 1 : "",
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: $data.darkMode ? 1 : "",
    X: $data.darkMode ? 1 : "",
    Y: $data.isLogin
  }, $data.isLogin ? {
    Z: $data.darkMode ? 1 : "",
    aa: $data.commentContent,
    ab: common_vendor.o(($event) => $data.commentContent = $event.detail.value),
    ac: $data.darkMode ? 1 : "",
    ad: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args))
  } : {
    ae: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args)),
    af: $data.darkMode ? 1 : ""
  }, {
    ag: $data.darkMode ? 1 : "",
    ah: $data.relatedNews.length > 0
  }, $data.relatedNews.length > 0 ? {
    ai: $data.darkMode ? 1 : "",
    aj: common_vendor.f($data.relatedNews, (item, k0, i0) => {
      return {
        a: item.cover_image || "https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u",
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.summary || item.description),
        d: item.id,
        e: common_vendor.o(($event) => $options.goToNewsDetail(item), item.id)
      };
    }),
    ak: $data.darkMode ? 1 : "",
    al: $data.darkMode ? 1 : "",
    am: $data.darkMode ? 1 : "",
    an: $data.darkMode ? 1 : ""
  } : {}, {
    ao: $data.darkMode ? 1 : ""
  }), {
    ap: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news-detail/news-detail.js.map
