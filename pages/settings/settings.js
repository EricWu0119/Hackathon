var app = getApp()
Page({
  data: {
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
    plain: false,
    slider: [
      { picUrl: '../../image/vue.jpg' },
      { picUrl: '../../image/ionic.jpg' },
      { picUrl: '../../image/java.jpg' },
    ],
    contentItems: ['', '', '', ''],
  },// 触摸开始时间

  touchStartTime: 0,

  // 触摸结束时间

  touchEndTime: 0,

  // 最后一次单击事件点击发生时间

  lastTapTime: 0,

  // 单击事件点击后要触发的函数

  lastTapTimeoutFunc: null,







  /// 按钮触摸开始触发的事件

  touchStart: function (e) {

    this.touchStartTime = e.timeStamp

  },



  /// 按钮触摸结束触发的事件

  touchEnd: function (e) {

    this.touchEndTime = e.timeStamp

  },
  onLoad: function () {
    var that = this//不要漏了这句，很重要
    wx.request({
      url: 'https://www.todaynowork.group/wechat-du-1.0/course/all',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          Collection: res.data,
          //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories

        })
      }
    })

  },
  generate2Dcode: function (e) {
    this.setData({
      showModal: true
    })

    var data = {
      wechatConf: {
        "path": "pages/My_management/My_management?index=678dd99"
      },
      objectId: "12345678",
      scene: "CREG",
      replace: true
    };

    var that = this;
    app.generate2DCode(data, function (res) {
      that.setData({
        src: app.globalData.apiContextUrl + "/2_d_code/" + res.data.fileName + "/"
      });
    });
  },

  preventTouchMove: function () {

  },

  go: function () {
    this.setData({
      showModal: false
    })
  },

  jumpToCourseDetail: function (e) {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  jumpToCourseDetail1: function (e) {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
})