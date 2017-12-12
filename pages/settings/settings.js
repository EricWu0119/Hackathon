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

    Collection: [],
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

    wx.showLoading({
      title: '正在初始化',
    })
    var that = this;
    app.getUserInfoP()
      .then((userInfo) => {
        console.log(userInfo)
        app.globalData.userInfo = userInfo

        return app.wxRequestP("/courseSchedule/all", {});
      }).then((res)=>{
      //将获取到的json数据，存在名字叫zhihu的这个数组中
      that.setData({
        Collection: res.data,
      })
      wx.hideLoading()
    });
  },
  generate2Dcode: function (e) {
    this.setData({
      showModal: true
    })
    var courseScheduleId = e.currentTarget.dataset.id
    var data = {
      wechatConf: {
        "path": "pages/index/index?id=" + courseScheduleId
      },
      objectId: courseScheduleId,
      scene: "CREG"
    };

    var that = this;
    app.generate2DCode(data, function (res) {
      that.setData({
        src: app.globalData.apiContextUrl + "/2_d_code/img/" + res.data.fileName + "/"
      });
    });
  },

  preventTouchMove: function () {

  },

  cancelDlg: function () {
    this.setData({
      showModal: false
    })
  },

  jumpToCourseDetail: function (e) {
    wx.navigateTo({
      url: '../index/index?id=' + e.currentTarget.dataset.id
    })
  },
  jumpToCourseDetail1: function (e) {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  gotoList:function(e){
    wx.reLaunch({
      url: '../PersonList/PersonList?scheduleId=' + e.currentTarget.dataset.id
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
})