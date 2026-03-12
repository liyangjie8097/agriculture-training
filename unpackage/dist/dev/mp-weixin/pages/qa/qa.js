"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      currentCategory: "all",
      categories: [
        { name: "种植技术", value: "plant" },
        { name: "养殖技术", value: "breed" },
        { name: "农机操作", value: "machine" },
        { name: "病虫害防治", value: "pest" },
        { name: "农产品加工", value: "process" },
        { name: "农业电商", value: "ecommerce" }
      ],
      questions: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      loadingText: "加载中...",
      isLogin: false,
      userInfo: {},
      myQuestionsCount: 0,
      // 菜单相关
      showMenuPopup: false,
      selectedQuestion: null,
      menuPosition: { top: 0, left: 0 }
    };
  },
  computed: {
    // 过滤后的问题
    filteredQuestions() {
      if (this.currentCategory === "all") {
        return this.questions;
      }
      return this.questions.filter((q) => q.category === this.currentCategory);
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
    this.loadQuestions();
  },
  onShow() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    this.checkLoginStatus();
    this.refreshQuestions();
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
    // 刷新问题列表
    refreshQuestions() {
      this.page = 1;
      this.hasMore = true;
      this.questions = [];
      this.loadQuestions();
    },
    // 加载问题列表
    async loadQuestions() {
      var _a;
      if (this.loading)
        return;
      this.loading = true;
      this.loadingText = "加载中...";
      try {
        const res = await common_vendor.index.request({
          url: config.baseUrl + "/qa",
          method: "GET"
        });
        if (res.data.success) {
          const allQuestions = res.data.data;
          const start = (this.page - 1) * this.pageSize;
          const end = this.page * this.pageSize;
          const pageQuestions = allQuestions.slice(start, end);
          const userId = (_a = this.userInfo) == null ? void 0 : _a.userId;
          const markedQuestions = pageQuestions.map((q) => ({
            ...q,
            isMine: q.user_id === userId,
            hotScore: this.calculateHotScore(q)
          }));
          this.questions = [...this.questions, ...markedQuestions];
          this.hasMore = end < allQuestions.length;
          this.page++;
          this.myQuestionsCount = allQuestions.filter((q) => q.user_id === userId).length;
        } else {
          this.useMockData();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/qa/qa.vue:271", "加载问答失败，使用模拟数据", error);
        this.useMockData();
      } finally {
        this.loading = false;
      }
    },
    // 使用模拟数据
    useMockData() {
      const mockQuestions = [
        {
          id: 1,
          category: "plant",
          title: "水稻育苗期需要注意什么？",
          content: "我是第一次种水稻，现在正是育苗期，想请教一下育苗期间需要注意哪些问题？比如温度、湿度、病虫害防治等。",
          view_count: 1234,
          like_count: 56,
          answer_count: 8,
          author: { name: "新农人小王", avatar: "/static/logo.png" },
          create_time: "2026-03-10T08:30:00Z",
          hotScore: 92
        },
        {
          id: 2,
          category: "plant",
          title: "大棚蔬菜冬季管理技巧",
          content: "冬天大棚蔬菜容易受冻，有哪些保温措施？除了加温，还有什么经济实惠的方法？",
          view_count: 987,
          like_count: 43,
          answer_count: 6,
          author: { name: "蔬菜种植户老张", avatar: "/static/logo.png" },
          create_time: "2026-03-09T14:20:00Z",
          hotScore: 88
        },
        {
          id: 3,
          category: "breed",
          title: "猪舍温度控制的最佳范围是多少？",
          content: "最近天气变化大，猪舍温度不太好控制，想知道不同生长阶段的最佳温度范围。仔猪、育肥猪、母猪分别需要多少度？",
          view_count: 756,
          like_count: 32,
          answer_count: 5,
          author: { name: "养猪专业户", avatar: "/static/logo.png" },
          create_time: "2026-03-08T09:15:00Z",
          hotScore: 85
        },
        {
          id: 4,
          category: "breed",
          title: "鸡舍通风怎么设计最合理？",
          content: "新建鸡舍，想请教通风系统怎么设计？夏天降温和冬天保温如何平衡？",
          view_count: 623,
          like_count: 28,
          answer_count: 4,
          author: { name: "养鸡大户", avatar: "/static/logo.png" },
          create_time: "2026-03-07T16:45:00Z",
          hotScore: 82
        },
        {
          id: 5,
          category: "machine",
          title: "拖拉机保养周期是多久？",
          content: "刚买了一台新拖拉机，想知道多久保养一次比较合适，保养项目有哪些？机油、滤芯多久换一次？",
          view_count: 891,
          like_count: 37,
          answer_count: 6,
          author: { name: "农机手老李", avatar: "/static/logo.png" },
          create_time: "2026-03-06T11:30:00Z",
          hotScore: 86
        },
        {
          id: 6,
          category: "machine",
          title: "收割机常见故障及排除方法",
          content: "收割机作业时经常出现堵塞、跑粮等问题，有没有经验丰富的老师傅分享一下解决方法？",
          view_count: 712,
          like_count: 31,
          answer_count: 5,
          author: { name: "农机维修师", avatar: "/static/logo.png" },
          create_time: "2026-03-05T13:50:00Z",
          hotScore: 83
        },
        {
          id: 7,
          category: "pest",
          title: "水稻稻瘟病怎么防治最有效？",
          content: "今年水稻稻瘟病比较严重，有什么特效药？预防和治疗的最佳时机是什么时候？",
          view_count: 1345,
          like_count: 67,
          answer_count: 9,
          author: { name: "植保专家", avatar: "/static/logo.png" },
          create_time: "2026-03-04T10:20:00Z",
          hotScore: 95
        },
        {
          id: 8,
          category: "pest",
          title: "果园红蜘蛛防治方法",
          content: "苹果园红蜘蛛爆发，打了药效果不好，有没有什么好办法？",
          view_count: 567,
          like_count: 24,
          answer_count: 4,
          author: { name: "果农老陈", avatar: "/static/logo.png" },
          create_time: "2026-03-03T15:40:00Z",
          hotScore: 78
        },
        {
          id: 9,
          category: "process",
          title: "农产品初加工设备怎么选？",
          content: "想搞农产品加工，但不知道选什么设备。主要做粮食烘干、脱壳、包装，有没有性价比高的推荐？",
          view_count: 445,
          like_count: 19,
          answer_count: 3,
          author: { name: "加工户小李", avatar: "/static/logo.png" },
          create_time: "2026-03-02T08:10:00Z",
          hotScore: 74
        },
        {
          id: 10,
          category: "ecommerce",
          title: "农产品电商怎么起步？",
          content: "想在网上卖自家种的农产品，但不知道怎么开始。需要办什么手续？怎么引流？",
          view_count: 1023,
          like_count: 48,
          answer_count: 7,
          author: { name: "新农人小芳", avatar: "/static/logo.png" },
          create_time: "2026-03-01T19:30:00Z",
          hotScore: 89
        },
        {
          id: 11,
          category: "plant",
          title: "果树修剪最佳时间",
          content: "家里有几亩苹果树，不知道什么时候修剪最合适？冬剪和夏剪有什么区别？",
          view_count: 678,
          like_count: 29,
          answer_count: 5,
          author: { name: "果农老王", avatar: "/static/logo.png" },
          create_time: "2026-02-28T14:25:00Z",
          hotScore: 81
        },
        {
          id: 12,
          category: "breed",
          title: "牛羊饲料配比技巧",
          content: "自家养了十几头牛，想知道精饲料和粗饲料的最佳配比，育肥期和繁殖期有什么区别？",
          view_count: 834,
          like_count: 36,
          answer_count: 6,
          author: { name: "养殖专业户", avatar: "/static/logo.png" },
          create_time: "2026-02-27T09:55:00Z",
          hotScore: 84
        }
      ];
      this.questions = mockQuestions.sort((a, b) => b.hotScore - a.hotScore);
      this.hasMore = false;
      this.myQuestionsCount = 0;
    },
    // 计算热度分数
    calculateHotScore(question) {
      const views = question.view_count || 0;
      const answers = question.answer_count || 0;
      const likes = question.like_count || 0;
      const timeWeight = this.getTimeWeight(question.create_time);
      return Math.round(views * 0.3 + answers * 2 + likes * 1.5 + timeWeight);
    },
    // 计算时间权重
    getTimeWeight(timeStr) {
      if (!timeStr)
        return 10;
      const createTime = new Date(timeStr).getTime();
      const now = (/* @__PURE__ */ new Date()).getTime();
      const hoursDiff = (now - createTime) / (1e3 * 60 * 60);
      if (hoursDiff < 1)
        return 50;
      if (hoursDiff < 24)
        return 40;
      if (hoursDiff < 48)
        return 30;
      if (hoursDiff < 72)
        return 20;
      return Math.max(10, 30 - Math.floor(hoursDiff / 24) * 2);
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
    getCategoryName(value) {
      const category = this.categories.find((c) => c.value === value);
      return category ? category.name : value;
    },
    switchCategory(category) {
      this.currentCategory = category;
      this.refreshQuestions();
    },
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadQuestions();
      }
    },
    // 显示菜单
    showMenu(question, event) {
      if (!this.isLogin) {
        this.showLoginTip();
        return;
      }
      this.selectedQuestion = question;
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".qa-menu").boundingClientRect((data) => {
        if (data) {
          this.menuPosition = {
            top: data.top + 40,
            left: data.left - 150
          };
        }
      }).exec();
      this.showMenuPopup = true;
    },
    closeMenu() {
      this.showMenuPopup = false;
      this.selectedQuestion = null;
    },
    setTopQuestion(question) {
      common_vendor.index.showToast({
        title: question.isTop ? "已取消置顶" : "已置顶",
        icon: "none"
      });
      this.closeMenu();
    },
    deleteQuestion(question) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个问题吗？",
        success: (res) => {
          if (res.confirm) {
            this.questions = this.questions.filter((q) => q.id !== question.id);
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
            this.closeMenu();
          }
        }
      });
    },
    shareQuestion(question) {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
      this.closeMenu();
    },
    reportQuestion(question) {
      common_vendor.index.showToast({
        title: "举报功能开发中",
        icon: "none"
      });
      this.closeMenu();
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search?type=qa"
      });
    },
    goToAsk() {
      if (!this.isLogin) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再提问",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ask/ask"
      });
    },
    goToQaDetail(question) {
      common_vendor.index.navigateTo({
        url: "/pages/qa-detail/qa-detail?id=" + question.id
      });
    },
    goToMyQuestions() {
      common_vendor.index.navigateTo({
        url: "/pages/my-questions/my-questions"
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: $data.darkMode ? 1 : "",
    c: $data.darkMode ? 1 : "",
    d: $data.darkMode ? 1 : "",
    e: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    f: $data.currentCategory === "all" ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode && $data.currentCategory === "all" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchCategory("all")),
    j: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.currentCategory === item.value ? 1 : "",
        c: $data.darkMode && $data.currentCategory === item.value ? 1 : "",
        d: item.value,
        e: common_vendor.o(($event) => $options.switchCategory(item.value), item.value)
      };
    }),
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode ? 1 : "",
    m: $data.isLogin && $data.myQuestionsCount > 0
  }, $data.isLogin && $data.myQuestionsCount > 0 ? {
    n: $data.darkMode ? 1 : "",
    o: common_vendor.t($data.myQuestionsCount),
    p: $data.darkMode ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode ? 1 : "",
    s: common_vendor.o((...args) => $options.goToMyQuestions && $options.goToMyQuestions(...args))
  } : {}, {
    t: $data.darkMode ? 1 : "",
    v: common_vendor.o((...args) => $options.goToAsk && $options.goToAsk(...args)),
    w: $data.loading && $data.questions.length === 0
  }, $data.loading && $data.questions.length === 0 ? {
    x: $data.darkMode ? 1 : "",
    y: $data.darkMode ? 1 : ""
  } : {}, {
    z: common_vendor.f($options.filteredQuestions, (question, k0, i0) => {
      var _a2, _b2;
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.showMenu(question, $event), question.id),
        b: question.isTop
      }, question.isTop ? {
        c: $data.darkMode ? 1 : ""
      } : {}, {
        d: common_vendor.t($options.getCategoryName(question.category)),
        e: common_vendor.n("category-" + (question.category || "other")),
        f: question.isMine
      }, question.isMine ? {
        g: $data.darkMode ? 1 : ""
      } : {}, {
        h: common_vendor.t(question.title),
        i: common_vendor.o(($event) => $options.goToQaDetail(question), question.id),
        j: question.hotScore > 80
      }, question.hotScore > 80 ? {
        k: common_vendor.t(question.hotScore),
        l: $data.darkMode ? 1 : "",
        m: common_vendor.o(($event) => $options.goToQaDetail(question), question.id)
      } : {}, {
        n: common_vendor.t(question.content),
        o: common_vendor.o(($event) => $options.goToQaDetail(question), question.id),
        p: ((_a2 = question.author) == null ? void 0 : _a2.avatar) || "/static/logo.png",
        q: common_vendor.t(((_b2 = question.author) == null ? void 0 : _b2.name) || "匿名用户"),
        r: common_vendor.t(question.view_count || 0),
        s: common_vendor.t(question.answer_count || 0),
        t: common_vendor.t(question.like_count || 0),
        v: common_vendor.o(($event) => $options.goToQaDetail(question), question.id),
        w: common_vendor.t($options.formatTime(question.create_time)),
        x: common_vendor.o(($event) => $options.goToQaDetail(question), question.id),
        y: question.id,
        z: question.isMine ? 1 : "",
        A: $data.darkMode && question.isMine ? 1 : ""
      });
    }),
    A: $data.darkMode ? 1 : "",
    B: common_vendor.n({
      "dark-category": $data.darkMode
    }),
    C: $data.darkMode ? 1 : "",
    D: $data.darkMode ? 1 : "",
    E: $data.darkMode ? 1 : "",
    F: $data.darkMode ? 1 : "",
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : "",
    K: $data.hasMore
  }, $data.hasMore ? {
    L: common_vendor.t($data.loadingText),
    M: $data.darkMode ? 1 : ""
  } : {}, {
    N: !$data.hasMore && $data.questions.length > 0
  }, !$data.hasMore && $data.questions.length > 0 ? {
    O: $data.darkMode ? 1 : ""
  } : {}, {
    P: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    Q: $data.showMenuPopup
  }, $data.showMenuPopup ? {
    R: common_vendor.o((...args) => $options.closeMenu && $options.closeMenu(...args))
  } : {}, {
    S: $data.showMenuPopup
  }, $data.showMenuPopup ? common_vendor.e({
    T: $data.darkMode ? 1 : "",
    U: common_vendor.t(((_a = $data.selectedQuestion) == null ? void 0 : _a.isTop) ? "取消置顶" : "置顶问题"),
    V: $data.darkMode ? 1 : "",
    W: $data.darkMode ? 1 : "",
    X: common_vendor.o(($event) => $options.setTopQuestion($data.selectedQuestion)),
    Y: (_b = $data.selectedQuestion) == null ? void 0 : _b.isMine
  }, ((_c = $data.selectedQuestion) == null ? void 0 : _c.isMine) ? {
    Z: $data.darkMode ? 1 : "",
    aa: $data.darkMode ? 1 : "",
    ab: $data.darkMode ? 1 : "",
    ac: common_vendor.o(($event) => $options.deleteQuestion($data.selectedQuestion))
  } : {}, {
    ad: $data.darkMode ? 1 : "",
    ae: $data.darkMode ? 1 : "",
    af: $data.darkMode ? 1 : "",
    ag: common_vendor.o(($event) => $options.shareQuestion($data.selectedQuestion)),
    ah: $data.darkMode ? 1 : "",
    ai: $data.darkMode ? 1 : "",
    aj: $data.darkMode ? 1 : "",
    ak: common_vendor.o(($event) => $options.reportQuestion($data.selectedQuestion)),
    al: $data.darkMode ? 1 : "",
    am: $data.menuPosition.top + "px",
    an: $data.menuPosition.left + "px"
  }) : {}, {
    ao: $data.darkMode ? 1 : "",
    ap: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/qa/qa.js.map
