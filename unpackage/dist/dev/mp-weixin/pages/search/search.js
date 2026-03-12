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
      keyword: "",
      searchPerformed: false,
      searching: false,
      refreshing: false,
      loadingMore: false,
      hasMore: true,
      showBackToTop: false,
      scrollTop: 0,
      historyList: [],
      hotSearches: [
        "水稻种植",
        "大棚蔬菜",
        "拖拉机操作",
        "病虫害防治",
        "果树修剪",
        "农产品电商",
        "养猪技术",
        "养鸡技术",
        "施肥技巧"
      ],
      allVideos: [],
      // 所有历史视频
      paginatedVideos: [],
      // 当前页显示的视频
      currentPage: 1,
      pageSize: 10,
      // 每页显示数量
      totalVideos: 0,
      showPagination: true,
      // 是否显示分页控件（true显示分页，false显示上滑加载）
      showVideoModal: false,
      currentVideo: null,
      currentUser: null
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.allVideos.length / this.pageSize);
    }
  },
  onLoad(options) {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    common_vendor.index.$on("darkModeChange", (darkMode) => {
      this.darkMode = darkMode;
    });
    this.loadSearchHistory();
    this.getCurrentUser();
    if (options.keyword) {
      this.keyword = options.keyword;
      this.handleSearch();
    }
  },
  onUnload() {
    common_vendor.index.$off("darkModeChange");
  },
  methods: {
    getCurrentUser() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.currentUser = userInfo;
      }
    },
    async handleSearch() {
      if (!this.keyword.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索关键词",
          icon: "none"
        });
        return;
      }
      this.saveSearchHistory(this.keyword);
      this.searchPerformed = true;
      this.searching = true;
      this.allVideos = [];
      this.paginatedVideos = [];
      this.currentPage = 1;
      this.hasMore = true;
      try {
        const res = await common_vendor.index.request({
          url: config.baseUrl + "/video/search",
          method: "GET",
          data: { keyword: this.keyword }
        });
        if (res.data.success) {
          this.allVideos = res.data.data || [];
          this.totalVideos = this.allVideos.length;
          this.updatePaginatedVideos();
          common_vendor.index.__f__("log", "at pages/search/search.vue:265", "搜索到农业视频:", this.allVideos.length);
          if (this.allVideos.length === 0) {
            common_vendor.index.showToast({
              title: "没有找到相关农业视频",
              icon: "none"
            });
          }
        } else {
          this.useMockData();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:278", "搜索请求失败，使用模拟数据", error);
        this.useMockData();
      } finally {
        this.searching = false;
      }
    },
    // 使用模拟数据
    useMockData() {
      const mockAll = [
        // 种植类
        { id: 1, title: "水稻高产种植技术", cover: "https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c", author: "农业科普频道", playCount: "23.4万", description: "从选种到收割全流程，30年经验老农手把手教学", duration: "45分钟", category: "plant" },
        { id: 2, title: "大棚蔬菜冬季管理技巧", cover: "https://img.ixigua.com/4f6g3h2i-9j0k-1l2m-3n4o-5p6q7r8s9t0u", author: "蔬菜种植大全", playCount: "12.8万", description: "冬季大棚保温、通风、浇水全攻略", duration: "32分钟", category: "plant" },
        { id: 3, title: "玉米密植高产栽培技术", cover: "https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p", author: "玉米种植专家", playCount: "18.9万", description: "玉米密植技术，提高产量30%", duration: "38分钟", category: "plant" },
        { id: 4, title: "小麦返青期田间管理", cover: "https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f", author: "小麦研究所", playCount: "15.2万", description: "返青期水肥管理、病虫害防治", duration: "29分钟", category: "plant" },
        { id: 5, title: "果树修剪技术大全", cover: "https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v", author: "园艺师老张", playCount: "21.3万", description: "苹果、梨、桃树修剪技巧", duration: "52分钟", category: "plant" },
        { id: 6, title: "西瓜种植技术", cover: "https://img.ixigua.com/3w2x1y0z-9a8b-7c6d-5e4f-3g2h1i0j9k8l", author: "西瓜大王", playCount: "14.7万", description: "西瓜育苗、移栽、水肥管理", duration: "41分钟", category: "plant" },
        { id: 7, title: "草莓种植技术", cover: "https://img.ixigua.com/7m6n5o4p-3q2r-1s0t-9u8v-7w6x5y4z3a2b", author: "草莓达人", playCount: "16.8万", description: "草莓大棚种植，全年结果技巧", duration: "37分钟", category: "plant" },
        { id: 8, title: "葡萄种植技术", cover: "https://img.ixigua.com/1c2d3e4f-5g6h-7i8j-9k0l-1m2n3o4p5q6r", author: "葡萄大王", playCount: "19.2万", description: "葡萄修剪、施肥、病虫害防治", duration: "48分钟", category: "plant" },
        { id: 9, title: "土豆高产栽培技术", cover: "https://img.ixigua.com/7s8t9u0v-1w2x-3y4z-5a6b-7c8d9e0f1g2h", author: "土豆专家", playCount: "13.5万", description: "土豆种植、施肥、收获技巧", duration: "33分钟", category: "plant" },
        { id: 10, title: "蔬菜育苗技术", cover: "https://img.ixigua.com/3i4j5k6l-7m8n-9o0p-1q2r-3s4t5u6v7w8x", author: "育苗专家", playCount: "11.2万", description: "各类蔬菜育苗方法", duration: "27分钟", category: "plant" },
        // 养殖类
        { id: 11, title: "生猪科学养殖技术", cover: "https://img.ixigua.com/9y0z1a2b-3c4d-5e6f-7g8h-9i0j1k2l3m4n", author: "猪司令", playCount: "67.3万", description: "从仔猪到出栏，科学喂养", duration: "68分钟", category: "breed" },
        { id: 12, title: "家禽生态养殖技术", cover: "https://img.ixigua.com/5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d", author: "养鸡大户", playCount: "34.2万", description: "鸡鸭鹅生态养殖方法", duration: "56分钟", category: "breed" },
        { id: 13, title: "牛羊育肥技术", cover: "https://img.ixigua.com/1e2f3g4h-5i6j-7k8l-9m0n-1o2p3q4r5s6t", author: "养殖专家", playCount: "28.9万", description: "肉牛、肉羊快速育肥", duration: "49分钟", category: "breed" },
        { id: 14, title: "水产养殖技术", cover: "https://img.ixigua.com/7u8v9w0x-1y2z-3a4b-5c6d-7e8f9g0h1i2j", author: "水产达人", playCount: "19.4万", description: "鱼、虾、蟹养殖技术", duration: "43分钟", category: "breed" },
        { id: 15, title: "蜜蜂养殖技术", cover: "https://img.ixigua.com/3k4l5m6n-7o8p-9q0r-1s2t-3u4v5w6x7y8z", author: "蜂农老陈", playCount: "11.2万", description: "蜜蜂养殖、取蜜技巧", duration: "35分钟", category: "breed" },
        { id: 16, title: "兔子养殖技术", cover: "https://img.ixigua.com/9a0b1c2d-3e4f-5g6h-7i8j-9k0l1m2n3o4p", author: "兔业专家", playCount: "14.8万", description: "肉兔、宠物兔养殖", duration: "31分钟", category: "breed" },
        // 农机类
        { id: 17, title: "拖拉机操作与维护", cover: "https://img.ixigua.com/5q6r7s8t-9u0v-1w2x-3y4z-5a6b7c8d9e0f", author: "农机手老李", playCount: "34.2万", description: "拖拉机驾驶、保养、故障排除", duration: "55分钟", category: "machine" },
        { id: 18, title: "收割机使用指南", cover: "https://img.ixigua.com/1g2h3i4j-5k6l-7m8n-9o0p-1q2r3s4t5u6v", author: "陈师傅", playCount: "28.7万", description: "联合收割机操作技巧", duration: "48分钟", category: "machine" },
        { id: 19, title: "无人机植保技术", cover: "https://img.ixigua.com/7w8x9y0z-1a2b-3c4d-5e6f-7g8h9i0j1k2l", author: "飞手小王", playCount: "42.1万", description: "无人机喷洒农药技术", duration: "36分钟", category: "machine" },
        { id: 20, title: "插秧机操作技巧", cover: "https://img.ixigua.com/3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b", author: "农机培训", playCount: "16.8万", description: "插秧机使用、调试", duration: "29分钟", category: "machine" },
        { id: 21, title: "烘干机使用维护", cover: "https://img.ixigua.com/9c0d1e2f-3g4h-5i6j-7k8l-9m0n1o2p3q4r", author: "粮食加工", playCount: "13.5万", description: "粮食烘干机操作", duration: "32分钟", category: "machine" },
        // 病虫害防治
        { id: 22, title: "常见病虫害识别与防治", cover: "https://img.ixigua.com/5s6t7u8v-9w0x-1y2z-3a4b-5c6d7e8f9g0h", author: "农技推广站", playCount: "18.2万", description: "30种常见病虫害识别与防治", duration: "52分钟", category: "pest" },
        { id: 23, title: "水稻稻瘟病防治技术", cover: "https://img.ixigua.com/1i2j3k4l-5m6n-7o8p-9q0r-1s2t3u4v5w6x", author: "植保专家", playCount: "22.3万", description: "稻瘟病识别、预防、治疗", duration: "41分钟", category: "pest" },
        { id: 24, title: "果树病虫害防治", cover: "https://img.ixigua.com/7y8z9a0b-1c2d-3e4f-5g6h-7i8j9k0l1m2n", author: "果农之友", playCount: "19.7万", description: "苹果、梨树病虫害", duration: "44分钟", category: "pest" },
        { id: 25, title: "蔬菜病害识别", cover: "https://img.ixigua.com/3o4p5q6r-7s8t-9u0v-1w2x-3y4z5a6b7c8d", author: "蔬菜医生", playCount: "15.4万", description: "蔬菜常见病害防治", duration: "36分钟", category: "pest" },
        // 加工类
        { id: 26, title: "农产品初加工技术", cover: "https://img.ixigua.com/9e0f1g2h-3i4j-5k6l-7m8n-9o0p1q2r3s4t", author: "加工专家", playCount: "11.3万", description: "粮食烘干、脱壳、包装", duration: "39分钟", category: "process" },
        { id: 27, title: "粮食烘干技术", cover: "https://img.ixigua.com/5u6v7w8x-9y0z-1a2b-3c4d-5e6f7g8h9i0j", author: "粮食加工厂", playCount: "9.8万", description: "粮食烘干设备使用", duration: "28分钟", category: "process" },
        { id: 28, title: "果蔬保鲜技术", cover: "https://img.ixigua.com/1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z", author: "保鲜专家", playCount: "14.2万", description: "果蔬保鲜方法", duration: "33分钟", category: "process" },
        // 电商类
        { id: 29, title: "农产品电商运营指南", cover: "https://img.ixigua.com/7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p", author: "电商讲师", playCount: "23.1万", description: "从开店到爆款打造", duration: "47分钟", category: "ecommerce" },
        { id: 30, title: "直播带货技巧", cover: "https://img.ixigua.com/3q4r5s6t-7u8v-9w0x-1y2z-3a4b5c6d7e8f", author: "带货达人", playCount: "31.5万", description: "农产品直播销售技巧", duration: "43分钟", category: "ecommerce" },
        { id: 31, title: "农产品品牌打造", cover: "https://img.ixigua.com/9g8h7i6j-5k4l-3m2n-1o0p-9q8r7s6t5u4v", author: "品牌专家", playCount: "17.8万", description: "农产品品牌建设", duration: "38分钟", category: "ecommerce" }
      ];
      const keywordLower = this.keyword.toLowerCase();
      this.allVideos = mockAll.filter(
        (v) => v.title.includes(this.keyword) || v.title.includes(keywordLower) || v.description.includes(this.keyword) || v.description.includes(keywordLower) || v.author.includes(this.keyword) || v.author.includes(keywordLower) || v.category.includes(this.keyword) || v.category.includes(keywordLower)
      );
      if (this.allVideos.length === 0) {
        this.allVideos = mockAll;
      }
      this.totalVideos = this.allVideos.length;
      this.updatePaginatedVideos();
      this.hasMore = false;
    },
    async refreshSearch() {
      if (this.refreshing)
        return;
      this.refreshing = true;
      this.scrollTop = 0;
      try {
        const res = await common_vendor.index.request({
          url: config.baseUrl + "/video/refresh",
          method: "GET",
          data: { keyword: this.keyword }
        });
        if (res.data.success) {
          this.allVideos = res.data.data || [];
          this.totalVideos = this.allVideos.length;
          this.currentPage = 1;
          this.updatePaginatedVideos();
          common_vendor.index.showToast({
            title: "刷新成功",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:380", "刷新失败", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      } finally {
        this.refreshing = false;
      }
    },
    // 更新当前页显示的视频
    updatePaginatedVideos() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.paginatedVideos = this.allVideos.slice(start, end);
    },
    // 跳转到指定页
    goToPage(page) {
      if (page < 1 || page > this.totalPages)
        return;
      this.currentPage = page;
      this.updatePaginatedVideos();
      this.scrollTop = 0;
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    // 上滑加载更多（兼容模式）
    async loadMore() {
      if (this.showPagination)
        return;
      if (this.loadingMore || !this.hasMore)
        return;
      this.loadingMore = true;
      setTimeout(() => {
        const nextPage = this.currentPage + 1;
        const start = (nextPage - 1) * this.pageSize;
        const end = nextPage * this.pageSize;
        const newVideos = this.allVideos.slice(start, end);
        if (newVideos.length > 0) {
          this.paginatedVideos = [...this.paginatedVideos, ...newVideos];
          this.currentPage = nextPage;
          this.hasMore = end < this.allVideos.length;
        } else {
          this.hasMore = false;
        }
        this.loadingMore = false;
      }, 300);
    },
    // 切换分页模式
    togglePaginationMode() {
      this.showPagination = !this.showPagination;
      this.currentPage = 1;
      this.updatePaginatedVideos();
    },
    onScroll(e) {
      this.showBackToTop = e.detail.scrollTop > 500;
    },
    scrollToTop() {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
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
          lastWatchTime: (/* @__PURE__ */ new Date()).getTime(),
          progress: 0,
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
    loadSearchHistory() {
      const history = common_vendor.index.getStorageSync("searchHistory") || [];
      this.historyList = history;
    },
    saveSearchHistory(keyword) {
      if (!keyword.trim())
        return;
      let history = common_vendor.index.getStorageSync("searchHistory") || [];
      history = history.filter((item) => item !== keyword);
      history.unshift(keyword);
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      common_vendor.index.setStorageSync("searchHistory", history);
      this.historyList = history;
    },
    clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定清空搜索历史吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("searchHistory");
            this.historyList = [];
          }
        }
      });
    },
    searchHistory(keyword) {
      this.keyword = keyword;
      this.handleSearch();
    },
    clearKeyword() {
      this.keyword = "";
      this.searchPerformed = false;
    },
    goBack() {
      common_vendor.index.navigateBack();
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
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: $data.keyword,
    e: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    f: $data.keyword
  }, $data.keyword ? {
    g: $data.darkMode ? 1 : "",
    h: common_vendor.o((...args) => $options.clearKeyword && $options.clearKeyword(...args))
  } : {}, {
    i: $data.darkMode ? 1 : "",
    j: $data.darkMode ? 1 : "",
    k: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    l: $data.darkMode ? 1 : "",
    m: !$data.searchPerformed && $data.historyList.length > 0
  }, !$data.searchPerformed && $data.historyList.length > 0 ? {
    n: $data.darkMode ? 1 : "",
    o: $data.darkMode ? 1 : "",
    p: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    q: common_vendor.f($data.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.searchHistory(item), index)
      };
    }),
    r: $data.darkMode ? 1 : "",
    s: $data.darkMode ? 1 : "",
    t: $data.darkMode ? 1 : ""
  } : {}, {
    v: !$data.searchPerformed
  }, !$data.searchPerformed ? {
    w: $data.darkMode ? 1 : "",
    x: common_vendor.f($data.hotSearches, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.n("hot-tag-" + (index % 4 + 1)),
        d: common_vendor.o(($event) => $options.searchHistory(item), index)
      };
    }),
    y: common_vendor.n({
      "dark-hot-tag": $data.darkMode
    }),
    z: $data.darkMode ? 1 : ""
  } : {}, {
    A: $data.searchPerformed
  }, $data.searchPerformed ? common_vendor.e({
    B: common_vendor.t($data.totalVideos),
    C: $data.darkMode ? 1 : "",
    D: $data.refreshing ? 1 : "",
    E: $data.darkMode ? 1 : "",
    F: common_vendor.t($data.refreshing ? "刷新中" : "刷新"),
    G: $data.darkMode ? 1 : "",
    H: common_vendor.o((...args) => $options.refreshSearch && $options.refreshSearch(...args)),
    I: $data.refreshing,
    J: common_vendor.f($data.paginatedVideos, (video, k0, i0) => {
      return {
        a: video.cover || "https://img.ixigua.com/3e5f2a1b-8c9d-4e7f-9b3c-1d2e3f4a5b6c",
        b: common_vendor.t(video.title || "无标题"),
        c: common_vendor.t(video.description || video.title || "暂无描述"),
        d: common_vendor.t(video.author || "未知作者"),
        e: common_vendor.t(video.duration || "15分钟"),
        f: common_vendor.t(video.playCount || "0"),
        g: video.id,
        h: common_vendor.o(($event) => $options.playVideo(video), video.id)
      };
    }),
    K: $data.darkMode ? 1 : "",
    L: $data.darkMode ? 1 : "",
    M: $data.darkMode ? 1 : "",
    N: $data.darkMode ? 1 : "",
    O: $data.darkMode ? 1 : "",
    P: $data.darkMode ? 1 : "",
    Q: $data.darkMode ? 1 : "",
    R: $options.totalPages > 1
  }, $options.totalPages > 1 ? {
    S: common_vendor.t($data.currentPage),
    T: common_vendor.t($options.totalPages),
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: $data.darkMode && $data.currentPage === 1 ? 1 : "",
    X: common_vendor.o(($event) => $options.goToPage($data.currentPage - 1)),
    Y: $data.currentPage === 1,
    Z: $data.darkMode ? 1 : "",
    aa: $data.darkMode && $data.currentPage === $options.totalPages ? 1 : "",
    ab: common_vendor.o(($event) => $options.goToPage($data.currentPage + 1)),
    ac: $data.currentPage === $options.totalPages
  } : {}, {
    ad: $data.hasMore && !$data.showPagination
  }, $data.hasMore && !$data.showPagination ? {
    ae: common_vendor.t($data.loadingMore ? "加载中..." : "上滑加载更多"),
    af: $data.darkMode ? 1 : ""
  } : {}, {
    ag: !$data.hasMore && !$data.showPagination && $data.paginatedVideos.length > 0
  }, !$data.hasMore && !$data.showPagination && $data.paginatedVideos.length > 0 ? {
    ah: $data.darkMode ? 1 : ""
  } : {}, {
    ai: $data.paginatedVideos.length === 0 && !$data.searching
  }, $data.paginatedVideos.length === 0 && !$data.searching ? {
    aj: $data.darkMode ? 1 : "",
    ak: $data.darkMode ? 1 : "",
    al: $data.darkMode ? 1 : ""
  } : {}, {
    am: $data.searching
  }, $data.searching ? {
    an: $data.darkMode ? 1 : ""
  } : {}, {
    ao: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    ap: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    aq: $data.scrollTop
  }) : {}, {
    ar: $data.showBackToTop
  }, $data.showBackToTop ? {
    as: $data.darkMode ? 1 : "",
    at: common_vendor.o((...args) => $options.scrollToTop && $options.scrollToTop(...args))
  } : {}, {
    av: common_vendor.o($options.closeVideoModal),
    aw: common_vendor.o($options.onVideoStart),
    ax: common_vendor.o($options.onVideoComplete),
    ay: common_vendor.p({
      show: $data.showVideoModal,
      video: $data.currentVideo
    }),
    az: $data.darkMode ? 1 : "",
    aA: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
