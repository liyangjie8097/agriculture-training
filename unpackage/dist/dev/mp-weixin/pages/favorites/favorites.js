"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      favoritesList: [],
      userInfo: {},
      allCourses: []
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
    common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:74", "收藏页面显示");
    this.checkLoginStatus();
    this.loadAllCourses();
    this.loadFavorites();
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
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
      common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:97", "当前用户:", userInfo);
    },
    loadAllCourses() {
      const pages = getCurrentPages();
      const indexPage = pages.find((p) => p.route === "pages/index/index");
      if (indexPage && indexPage.$vm) {
        this.allCourses = indexPage.$vm.allCourses || [];
        common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:106", "从首页加载课程数据:", this.allCourses.length);
      } else {
        this.allCourses = [
          {
            id: 1,
            title: "水稻高产种植技术",
            desc: "从选种到收割，全方位讲解水稻种植技巧",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=水稻种植",
            studentCount: 1234,
            teacher: "王教授"
          },
          {
            id: 2,
            title: "大棚蔬菜种植技术",
            desc: "大棚蔬菜全年种植管理指南",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=大棚蔬菜",
            studentCount: 892,
            teacher: "李老师"
          },
          {
            id: 3,
            title: "生猪科学养殖技术",
            desc: "现代化生猪养殖全流程",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=生猪养殖",
            studentCount: 1567,
            teacher: "张教授"
          },
          {
            id: 4,
            title: "家禽生态养殖技术",
            desc: "鸡鸭鹅生态养殖方法",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=家禽养殖",
            studentCount: 678,
            teacher: "赵老师"
          },
          {
            id: 5,
            title: "拖拉机操作与维护",
            desc: "拖拉机使用技巧和日常保养",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=拖拉机",
            studentCount: 2345,
            teacher: "刘师傅"
          },
          {
            id: 6,
            title: "收割机使用指南",
            desc: "联合收割机操作技巧",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=收割机",
            studentCount: 1123,
            teacher: "陈师傅"
          },
          {
            id: 7,
            title: "常见病虫害识别与防治",
            desc: "图文并茂讲解30种常见病虫害",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=病虫害",
            studentCount: 1890,
            teacher: "周教授"
          },
          {
            id: 8,
            title: "农产品初加工技术",
            desc: "粮食、果蔬的初加工方法",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=农产品加工",
            studentCount: 567,
            teacher: "吴老师"
          },
          {
            id: 9,
            title: "农产品电商运营",
            desc: "从开店到爆款打造",
            image: "https://via.placeholder.com/200x150/2b5e2b/ffffff?text=农业电商",
            studentCount: 2341,
            teacher: "郑老师"
          }
        ];
        common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:183", "使用默认课程数据:", this.allCourses.length);
      }
    },
    loadFavorites() {
      const favorites = common_vendor.index.getStorageSync("favorites") || {};
      const userId = this.userInfo.userId;
      if (!userId) {
        common_vendor.index.__f__("error", "at pages/favorites/favorites.vue:193", "用户ID不存在");
        return;
      }
      const userFavorites = favorites[userId] || [];
      common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:199", "用户收藏ID列表:", userFavorites);
      common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:200", "所有课程数据:", this.allCourses.map((c) => ({ id: c.id, title: c.title })));
      const favoriteIds = userFavorites.map((id) => parseInt(id));
      this.favoritesList = this.allCourses.filter((course) => {
        const courseId = parseInt(course.id);
        return favoriteIds.includes(courseId);
      });
      common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:211", "过滤后的收藏课程:", this.favoritesList.map((c) => ({ id: c.id, title: c.title })));
    },
    removeFavorite(courseId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消收藏吗？",
        success: (res) => {
          if (res.confirm) {
            const favorites = common_vendor.index.getStorageSync("favorites") || {};
            const userId = this.userInfo.userId;
            if (favorites[userId]) {
              const courseIdNum = parseInt(courseId);
              favorites[userId] = favorites[userId].filter((id) => parseInt(id) != courseIdNum);
              common_vendor.index.setStorageSync("favorites", favorites);
              this.favoritesList = this.favoritesList.filter((c) => parseInt(c.id) != courseIdNum);
              common_vendor.index.showToast({
                title: "已取消收藏",
                icon: "none"
              });
              common_vendor.index.__f__("log", "at pages/favorites/favorites.vue:237", "取消收藏后列表:", favorites[userId]);
            }
          }
        }
      });
    },
    goToCourseDetail(courseId) {
      common_vendor.index.navigateTo({
        url: "/pages/course-detail/course-detail?id=" + courseId
      });
    },
    goToCourseList() {
      common_vendor.index.switchTab({
        url: "/pages/course/course"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.favoritesList.length),
    b: $data.darkMode ? 1 : "",
    c: $data.favoritesList.length > 0
  }, $data.favoritesList.length > 0 ? {
    d: common_vendor.f($data.favoritesList, (course, k0, i0) => {
      return {
        a: course.image,
        b: common_vendor.t(course.title),
        c: common_vendor.t(course.desc),
        d: common_vendor.t(course.teacher),
        e: common_vendor.t(course.studentCount),
        f: common_vendor.o(($event) => $options.removeFavorite(course.id), course.id),
        g: course.id,
        h: common_vendor.o(($event) => $options.goToCourseDetail(course.id), course.id)
      };
    }),
    e: $data.darkMode ? 1 : "",
    f: $data.darkMode ? 1 : "",
    g: $data.darkMode ? 1 : "",
    h: $data.darkMode ? 1 : "",
    i: $data.darkMode ? 1 : "",
    j: $data.darkMode ? 1 : "",
    k: $data.darkMode ? 1 : ""
  } : {
    l: $data.darkMode ? 1 : "",
    m: $data.darkMode ? 1 : "",
    n: $data.darkMode ? 1 : "",
    o: $data.darkMode ? 1 : "",
    p: common_vendor.o((...args) => $options.goToCourseList && $options.goToCourseList(...args))
  }, {
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/favorites/favorites.js.map
