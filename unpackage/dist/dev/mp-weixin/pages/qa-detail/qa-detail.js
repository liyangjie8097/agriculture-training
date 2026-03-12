"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      questionId: "",
      loading: true,
      question: {
        id: "",
        category: "",
        title: "",
        content: "",
        images: [],
        author: {
          name: "",
          avatar: "",
          title: ""
        },
        views: 0,
        likes: 0,
        time: "",
        isTop: false
      },
      answers: [],
      answerContent: "",
      isLogin: false,
      userInfo: {},
      categories: [
        { name: "种植技术", value: "plant" },
        { name: "养殖技术", value: "breed" },
        { name: "农机操作", value: "machine" },
        { name: "病虫害防治", value: "pest" },
        { name: "农产品加工", value: "process" },
        { name: "农业电商", value: "ecommerce" }
      ],
      // 排序相关
      sortBy: "time",
      // 'time' 或 'hot'
      // 回复相关
      activeReplyAnswerId: null,
      replyToAnswerId: null,
      replyToReplyId: null,
      replyToUser: "",
      replyContent: ""
    };
  },
  computed: {
    sortText() {
      return this.sortBy === "time" ? "最新" : "最热";
    },
    sortedAnswers() {
      if (this.sortBy === "hot") {
        return [...this.answers].sort((a, b) => b.likes - a.likes);
      }
      return this.answers;
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
    this.questionId = options.id;
    this.checkLoginStatus();
    this.loadQuestionDetail();
    this.loadAnswers();
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
    getCategoryName(value) {
      const category = this.categories.find((c) => c.value === value);
      return category ? category.name : value;
    },
    loadQuestionDetail() {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.$vm) {
        const allQuestions = prevPage.$vm.questions || [];
        const question = allQuestions.find((q) => q.id == this.questionId);
        if (question) {
          this.question = { ...question, views: (question.views || 0) + 1 };
          common_vendor.index.setNavigationBarTitle({
            title: question.title.substring(0, 15) + "..."
          });
        }
      }
    },
    // 加载回答数据（从本地存储）
    loadAnswers() {
      const qaAnswers = common_vendor.index.getStorageSync("qaAnswers") || {};
      const savedAnswers = qaAnswers[this.questionId];
      if (savedAnswers && savedAnswers.length > 0) {
        this.answers = savedAnswers;
      } else {
        this.answers = [
          {
            id: 1,
            author: {
              name: "王教授",
              avatar: "https://via.placeholder.com/100x100/2b5e2b/ffffff?text=王",
              title: "种植专家"
            },
            content: "水稻育苗期要注意以下几点：1. 温度控制：白天25-30℃，夜间15-20℃；2. 水分管理：保持土壤湿润但不要积水；3. 光照充足；4. 预防病害，可适当喷施多菌灵。",
            images: [],
            likes: 15,
            time: "1小时前",
            replies: [
              {
                id: 101,
                author: {
                  name: "新农人小李",
                  avatar: "https://via.placeholder.com/100x100/4CAF50/ffffff?text=李"
                },
                content: "非常感谢王教授的详细解答！",
                time: "50分钟前",
                likes: 2
              },
              {
                id: 102,
                author: {
                  name: "老张",
                  avatar: "https://via.placeholder.com/100x100/FF9800/ffffff?text=张"
                },
                content: "补充一点：育苗盘底部要留孔，避免积水烂根。",
                time: "30分钟前",
                likes: 3
              }
            ]
          },
          {
            id: 2,
            author: {
              name: "李老师",
              avatar: "https://via.placeholder.com/100x100/FF9800/ffffff?text=李",
              title: "农技员"
            },
            content: "除了温度管理，还要注意育苗土的选择。最好用专门的育苗基质，透气性好，保水性适中。播种不要太密，一般每穴2-3粒种子即可。",
            images: [],
            likes: 8,
            time: "3小时前",
            replies: []
          }
        ];
      }
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 保存回答数据到本地存储
    saveAnswers() {
      const qaAnswers = common_vendor.index.getStorageSync("qaAnswers") || {};
      qaAnswers[this.questionId] = this.answers;
      common_vendor.index.setStorageSync("qaAnswers", qaAnswers);
      const pages = getCurrentPages();
      const qaPage = pages.find((p) => p.route === "pages/qa/qa");
      if (qaPage && qaPage.$vm) {
        qaPage.$vm.refreshQuestions && qaPage.$vm.refreshQuestions();
      }
    },
    previewImage(index, type = "question") {
      let urls = [];
      if (type === "question" && this.question.images) {
        urls = this.question.images;
      } else if (type === "answer") {
        urls = this.answers.flatMap((a) => a.images || []);
      }
      common_vendor.index.previewImage({
        current: index,
        urls
      });
    },
    toggleSort() {
      this.sortBy = this.sortBy === "time" ? "hot" : "time";
    },
    likeQuestion() {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      this.question.likes++;
      common_vendor.index.showToast({
        title: "点赞成功",
        icon: "none"
      });
    },
    likeAnswer(answer) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      answer.likes++;
      this.saveAnswers();
    },
    likeReply(reply) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      reply.likes = (reply.likes || 0) + 1;
      this.saveAnswers();
    },
    showReplyInput(answer, reply = null) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      this.activeReplyAnswerId = answer.id;
      if (reply) {
        this.replyToAnswerId = answer.id;
        this.replyToReplyId = reply.id;
        this.replyToUser = reply.author.name;
      } else {
        this.replyToAnswerId = answer.id;
        this.replyToReplyId = null;
        this.replyToUser = answer.author.name;
      }
    },
    cancelReply() {
      this.activeReplyAnswerId = null;
      this.replyToAnswerId = null;
      this.replyToReplyId = null;
      this.replyToUser = "";
      this.replyContent = "";
    },
    submitReply(answer) {
      if (!this.replyContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none"
        });
        return;
      }
      const newReply = {
        id: Date.now(),
        author: {
          name: this.userInfo.nickName || this.userInfo.username || "用户",
          avatar: this.userInfo.avatarUrl || "/static/logo.png"
        },
        content: this.replyContent,
        time: "刚刚",
        likes: 0
      };
      if (!answer.replies) {
        answer.replies = [];
      }
      answer.replies.push(newReply);
      this.saveAnswers();
      this.cancelReply();
      common_vendor.index.showToast({
        title: "回复成功",
        icon: "success"
      });
    },
    submitAnswer() {
      if (!this.answerContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入回答内容",
          icon: "none"
        });
        return;
      }
      const newAnswer = {
        id: Date.now(),
        author: {
          name: this.userInfo.nickName || this.userInfo.username || "用户",
          avatar: this.userInfo.avatarUrl || "/static/logo.png",
          title: "普通用户"
        },
        content: this.answerContent,
        images: [],
        likes: 0,
        time: "刚刚",
        replies: []
      };
      this.answers.unshift(newAnswer);
      this.saveAnswers();
      this.answerContent = "";
      common_vendor.index.showToast({
        title: "回答已发布",
        icon: "success"
      });
    },
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
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
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
    c: $data.question.isTop
  }, $data.question.isTop ? {
    d: $data.darkMode ? 1 : ""
  } : {}, {
    e: common_vendor.t($options.getCategoryName($data.question.category)),
    f: common_vendor.n("category-" + ($data.question.category || "other")),
    g: common_vendor.n({
      "dark-category": $data.darkMode
    }),
    h: common_vendor.t($data.question.title),
    i: $data.darkMode ? 1 : "",
    j: common_vendor.t($data.question.content),
    k: $data.darkMode ? 1 : "",
    l: $data.question.images && $data.question.images.length > 0
  }, $data.question.images && $data.question.images.length > 0 ? {
    m: common_vendor.f($data.question.images, (img, index, i0) => {
      return {
        a: index,
        b: img,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    })
  } : {}, {
    n: $data.question.author.avatar,
    o: common_vendor.t($data.question.author.name),
    p: $data.darkMode ? 1 : "",
    q: common_vendor.t($data.question.author.title),
    r: $data.darkMode ? 1 : "",
    s: common_vendor.t($data.question.likes),
    t: $data.darkMode ? 1 : "",
    v: common_vendor.o((...args) => $options.likeQuestion && $options.likeQuestion(...args)),
    w: common_vendor.t($data.question.views),
    x: $data.darkMode ? 1 : "",
    y: common_vendor.t($data.question.time),
    z: $data.darkMode ? 1 : "",
    A: $data.darkMode ? 1 : "",
    B: $data.darkMode ? 1 : "",
    C: common_vendor.t($data.answers.length),
    D: $data.darkMode ? 1 : "",
    E: common_vendor.t($options.sortText),
    F: $data.darkMode ? 1 : "",
    G: common_vendor.o((...args) => $options.toggleSort && $options.toggleSort(...args)),
    H: common_vendor.f($options.sortedAnswers, (answer, k0, i0) => {
      return common_vendor.e({
        a: answer.author.avatar,
        b: common_vendor.t(answer.author.name),
        c: common_vendor.t(answer.author.title || "普通用户"),
        d: common_vendor.t(answer.time),
        e: common_vendor.o(($event) => $options.showReplyInput(answer), answer.id),
        f: common_vendor.t(answer.content),
        g: answer.images && answer.images.length > 0
      }, answer.images && answer.images.length > 0 ? {
        h: common_vendor.f(answer.images, (img, idx, i1) => {
          return {
            a: idx,
            b: img,
            c: common_vendor.o(($event) => $options.previewImage(idx, "answer"), idx)
          };
        })
      } : {}, {
        i: common_vendor.t(answer.likes),
        j: common_vendor.o(($event) => $options.likeAnswer(answer), answer.id),
        k: answer.replies && answer.replies.length > 0
      }, answer.replies && answer.replies.length > 0 ? {
        l: common_vendor.f(answer.replies, (reply, k1, i1) => {
          return {
            a: reply.author.avatar,
            b: common_vendor.t(reply.author.name),
            c: common_vendor.t(reply.time),
            d: common_vendor.t(reply.content),
            e: common_vendor.t(reply.likes || 0),
            f: common_vendor.o(($event) => $options.likeReply(reply), reply.id),
            g: common_vendor.o(($event) => $options.showReplyInput(answer, reply), reply.id),
            h: reply.id
          };
        }),
        m: $data.darkMode ? 1 : "",
        n: $data.darkMode ? 1 : "",
        o: $data.darkMode ? 1 : "",
        p: $data.darkMode ? 1 : "",
        q: $data.darkMode ? 1 : "",
        r: $data.darkMode ? 1 : ""
      } : {}, {
        s: $data.activeReplyAnswerId === answer.id
      }, $data.activeReplyAnswerId === answer.id ? common_vendor.e({
        t: $data.replyToUser
      }, $data.replyToUser ? {
        v: common_vendor.t($data.replyToUser),
        w: $data.darkMode ? 1 : ""
      } : {}, {
        x: $options.replyPlaceholder,
        y: $data.darkMode ? 1 : "",
        z: $data.replyContent,
        A: common_vendor.o(($event) => $data.replyContent = $event.detail.value, answer.id),
        B: $data.darkMode ? 1 : "",
        C: common_vendor.o((...args) => $options.cancelReply && $options.cancelReply(...args), answer.id),
        D: $data.darkMode ? 1 : "",
        E: common_vendor.o(($event) => $options.submitReply(answer), answer.id),
        F: $data.darkMode ? 1 : ""
      }) : {}, {
        G: answer.id
      });
    }),
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : "",
    K: $data.darkMode ? 1 : "",
    L: $data.darkMode ? 1 : "",
    M: $data.darkMode ? 1 : "",
    N: $data.darkMode ? 1 : "",
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : "",
    Q: $data.darkMode ? 1 : "",
    R: $data.darkMode ? 1 : "",
    S: $data.isLogin
  }, $data.isLogin ? {
    T: $data.darkMode ? 1 : "",
    U: $data.answerContent,
    V: common_vendor.o(($event) => $data.answerContent = $event.detail.value),
    W: $data.darkMode ? 1 : "",
    X: common_vendor.o((...args) => $options.submitAnswer && $options.submitAnswer(...args)),
    Y: $data.darkMode ? 1 : ""
  } : {
    Z: $data.darkMode ? 1 : "",
    aa: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    ab: $data.darkMode ? 1 : ""
  }), {
    ac: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/qa-detail/qa-detail.js.map
