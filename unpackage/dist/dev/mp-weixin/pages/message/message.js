"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      darkMode: false,
      currentTab: "system",
      messages: [],
      page: 1,
      pageSize: 20,
      hasMore: true,
      loadingText: "加载中...",
      isLogin: false,
      userInfo: {},
      unreadCount: {
        system: 0,
        interact: 0,
        comment: 0,
        like: 0
      }
    };
  },
  computed: {
    filteredMessages() {
      return this.messages.filter((m) => m.type === this.currentTab);
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
    this.loadMessages();
  },
  onShow() {
    var _a;
    const app = getApp();
    this.darkMode = ((_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.darkMode) || false;
    this.checkLoginStatus();
    this.loadMessages();
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
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    },
    getMessageIcon(type) {
      const icons = {
        system: "🔔",
        interact: "💬",
        comment: "📝",
        like: "❤️"
      };
      return icons[type] || "📩";
    },
    loadMessages() {
      setTimeout(() => {
        const allMessages = [
          // 系统通知
          {
            id: 1,
            type: "system",
            title: "系统维护通知",
            content: "亲爱的用户，为了提供更稳定的服务，系统将于2026年3月15日凌晨2:00-4:00进行例行维护，期间可能无法正常访问，敬请谅解。",
            time: "2小时前",
            isRead: false,
            extra: null
          },
          {
            id: 2,
            type: "system",
            title: "版本更新通知",
            content: "农业技能培训小程序v2.0版本已发布，新增问答社区、专家库等功能，快来体验吧！",
            time: "昨天",
            isRead: true,
            extra: null
          },
          {
            id: 3,
            type: "system",
            title: "春节放假通知",
            content: "春节期间（2月10日-2月17日）专家答疑服务暂停，2月18日恢复正常，祝您春节快乐！",
            time: "3天前",
            isRead: true,
            extra: null
          },
          // 互动消息
          {
            id: 4,
            type: "interact",
            title: "王教授回答了您的问题",
            content: '您在"水稻育苗期需要注意什么？"问题中收到了新的回答。',
            time: "1小时前",
            isRead: false,
            extra: "水稻育苗期要注意温度控制在25-30℃之间...",
            targetId: 1,
            targetType: "question"
          },
          {
            id: 5,
            type: "interact",
            title: "张师傅回复了您的评论",
            content: '您在"拖拉机保养周期"课程下的评论收到了回复。',
            time: "昨天",
            isRead: false,
            extra: "张师傅回复：说得对，还要注意定期更换机油",
            targetId: 5,
            targetType: "course"
          },
          // 评论回复
          {
            id: 6,
            type: "comment",
            title: "新评论",
            content: '李老师评论了您的课程笔记："总结得很详细，赞！"',
            time: "3小时前",
            isRead: false,
            extra: null,
            targetId: 3,
            targetType: "note"
          },
          {
            id: 7,
            type: "comment",
            title: "新评论",
            content: '赵师傅评论了您的回答："这个方案很实用，我也试过"',
            time: "昨天",
            isRead: true,
            extra: null,
            targetId: 2,
            targetType: "answer"
          },
          {
            id: 8,
            type: "comment",
            title: "新评论",
            content: '刘教授评论了您的问题："很好的问题，建议补充具体情况"',
            time: "2天前",
            isRead: true,
            extra: null,
            targetId: 1,
            targetType: "question"
          },
          // 点赞收藏
          {
            id: 9,
            type: "like",
            title: "点赞通知",
            content: "您的回答获得了5个新的点赞",
            time: "1天前",
            isRead: false,
            extra: "累计获得15个点赞",
            targetId: 2,
            targetType: "answer"
          },
          {
            id: 10,
            type: "like",
            title: "收藏通知",
            content: "您的课程笔记被3位用户收藏",
            time: "2天前",
            isRead: true,
            extra: "《水稻种植要点》笔记",
            targetId: 3,
            targetType: "note"
          },
          {
            id: 11,
            type: "like",
            title: "点赞通知",
            content: "您的问题被8位用户点赞",
            time: "3天前",
            isRead: true,
            extra: "《猪舍温度控制》问题",
            targetId: 2,
            targetType: "question"
          }
        ];
        this.messages = allMessages;
        this.calculateUnreadCount();
        common_vendor.index.setStorageSync("messages", allMessages);
        this.hasMore = false;
      }, 500);
    },
    calculateUnreadCount() {
      this.unreadCount = {
        system: this.messages.filter((m) => m.type === "system" && !m.isRead).length,
        interact: this.messages.filter((m) => m.type === "interact" && !m.isRead).length,
        comment: this.messages.filter((m) => m.type === "comment" && !m.isRead).length,
        like: this.messages.filter((m) => m.type === "like" && !m.isRead).length
      };
      const totalUnread = Object.values(this.unreadCount).reduce((a, b) => a + b, 0);
      common_vendor.index.setStorageSync("totalUnreadMessages", totalUnread);
    },
    switchTab(tab) {
      this.currentTab = tab;
      this.page = 1;
    },
    loadMore() {
      if (this.hasMore) {
        this.loadingText = "加载中...";
        setTimeout(() => {
          this.page++;
        }, 500);
      }
    },
    markAsRead(message) {
      if (!message.isRead) {
        message.isRead = true;
        this.calculateUnreadCount();
        const messages = common_vendor.index.getStorageSync("messages") || [];
        const index = messages.findIndex((m) => m.id === message.id);
        if (index !== -1) {
          messages[index].isRead = true;
          common_vendor.index.setStorageSync("messages", messages);
        }
      }
    },
    markAllAsRead() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定将所有消息标记为已读吗？",
        success: (res) => {
          if (res.confirm) {
            this.messages.forEach((m) => {
              if (m.type === this.currentTab) {
                m.isRead = true;
              }
            });
            this.calculateUnreadCount();
            const messages = common_vendor.index.getStorageSync("messages") || [];
            messages.forEach((m) => {
              if (m.type === this.currentTab) {
                m.isRead = true;
              }
            });
            common_vendor.index.setStorageSync("messages", messages);
            common_vendor.index.showToast({
              title: "已全部标记为已读",
              icon: "none"
            });
          }
        }
      });
    },
    deleteMessage(message) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除这条消息吗？",
        success: (res) => {
          if (res.confirm) {
            this.messages = this.messages.filter((m) => m.id !== message.id);
            this.calculateUnreadCount();
            const messages = common_vendor.index.getStorageSync("messages") || [];
            const updatedMessages = messages.filter((m) => m.id !== message.id);
            common_vendor.index.setStorageSync("messages", updatedMessages);
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
          }
        }
      });
    },
    clearAllMessages() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定清空所有消息吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            this.messages = this.messages.filter((m) => m.type !== this.currentTab);
            this.calculateUnreadCount();
            const messages = common_vendor.index.getStorageSync("messages") || [];
            const updatedMessages = messages.filter((m) => m.type !== this.currentTab);
            common_vendor.index.setStorageSync("messages", updatedMessages);
            common_vendor.index.showToast({
              title: "已清空",
              icon: "success"
            });
          }
        }
      });
    },
    goToMessageDetail(message) {
      this.markAsRead(message);
      switch (message.targetType) {
        case "question":
          common_vendor.index.navigateTo({
            url: "/pages/qa-detail/qa-detail?id=" + message.targetId
          });
          break;
        case "course":
          common_vendor.index.navigateTo({
            url: "/pages/course-detail/course-detail?id=" + message.targetId
          });
          break;
        case "answer":
          common_vendor.index.navigateTo({
            url: "/pages/qa-detail/qa-detail?id=" + message.targetId
          });
          break;
        case "note":
          common_vendor.index.showToast({
            title: "笔记详情开发中",
            icon: "none"
          });
          break;
        default:
          common_vendor.index.showToast({
            title: "消息详情",
            icon: "none"
          });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.darkMode ? 1 : "",
    b: $data.unreadCount.system > 0
  }, $data.unreadCount.system > 0 ? {
    c: common_vendor.t($data.unreadCount.system)
  } : {}, {
    d: $data.currentTab === "system" ? 1 : "",
    e: $data.darkMode ? 1 : "",
    f: $data.darkMode && $data.currentTab === "system" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchTab("system")),
    h: $data.unreadCount.interact > 0
  }, $data.unreadCount.interact > 0 ? {
    i: common_vendor.t($data.unreadCount.interact)
  } : {}, {
    j: $data.currentTab === "interact" ? 1 : "",
    k: $data.darkMode ? 1 : "",
    l: $data.darkMode && $data.currentTab === "interact" ? 1 : "",
    m: common_vendor.o(($event) => $options.switchTab("interact")),
    n: $data.unreadCount.comment > 0
  }, $data.unreadCount.comment > 0 ? {
    o: common_vendor.t($data.unreadCount.comment)
  } : {}, {
    p: $data.currentTab === "comment" ? 1 : "",
    q: $data.darkMode ? 1 : "",
    r: $data.darkMode && $data.currentTab === "comment" ? 1 : "",
    s: common_vendor.o(($event) => $options.switchTab("comment")),
    t: $data.unreadCount.like > 0
  }, $data.unreadCount.like > 0 ? {
    v: common_vendor.t($data.unreadCount.like)
  } : {}, {
    w: $data.currentTab === "like" ? 1 : "",
    x: $data.darkMode ? 1 : "",
    y: $data.darkMode && $data.currentTab === "like" ? 1 : "",
    z: common_vendor.o(($event) => $options.switchTab("like")),
    A: $data.darkMode ? 1 : "",
    B: $options.filteredMessages.length === 0
  }, $options.filteredMessages.length === 0 ? {
    C: $data.darkMode ? 1 : "",
    D: $data.darkMode ? 1 : ""
  } : {}, {
    E: common_vendor.f($options.filteredMessages, (message, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getMessageIcon(message.type)),
        b: common_vendor.n("icon-" + message.type),
        c: common_vendor.t(message.title),
        d: common_vendor.t(message.time),
        e: common_vendor.t(message.content),
        f: message.extra
      }, message.extra ? {
        g: common_vendor.t(message.extra),
        h: $data.darkMode ? 1 : "",
        i: $data.darkMode ? 1 : ""
      } : {}, {
        j: !message.isRead
      }, !message.isRead ? {} : {}, {
        k: common_vendor.o(($event) => $options.deleteMessage(message), message.id),
        l: message.id,
        m: !message.isRead ? 1 : "",
        n: $data.darkMode && !message.isRead ? 1 : "",
        o: common_vendor.o(($event) => $options.goToMessageDetail(message), message.id)
      });
    }),
    F: common_vendor.n({
      "dark-icon": $data.darkMode
    }),
    G: $data.darkMode ? 1 : "",
    H: $data.darkMode ? 1 : "",
    I: $data.darkMode ? 1 : "",
    J: $data.darkMode ? 1 : "",
    K: $data.darkMode ? 1 : "",
    L: $data.darkMode ? 1 : "",
    M: $data.hasMore
  }, $data.hasMore ? {
    N: common_vendor.t($data.loadingText),
    O: $data.darkMode ? 1 : ""
  } : {}, {
    P: !$data.hasMore && $options.filteredMessages.length > 0
  }, !$data.hasMore && $options.filteredMessages.length > 0 ? {
    Q: $data.darkMode ? 1 : ""
  } : {}, {
    R: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    S: $options.filteredMessages.length > 0
  }, $options.filteredMessages.length > 0 ? {
    T: $data.darkMode ? 1 : "",
    U: $data.darkMode ? 1 : "",
    V: $data.darkMode ? 1 : "",
    W: common_vendor.o((...args) => $options.markAllAsRead && $options.markAllAsRead(...args)),
    X: $data.darkMode ? 1 : "",
    Y: $data.darkMode ? 1 : "",
    Z: $data.darkMode ? 1 : "",
    aa: common_vendor.o((...args) => $options.clearAllMessages && $options.clearAllMessages(...args)),
    ab: $data.darkMode ? 1 : ""
  } : {}, {
    ac: $data.darkMode ? 1 : "",
    ad: $data.darkMode ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
