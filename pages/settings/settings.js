var app = getApp()
Page({
  data: {
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '保存二维码到相册' },
      // { bindtap: 'Menu2', txt: '取消' },
    ],

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
      
    }).finally(()=>{
      wx.hideLoading()
    })
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
  longTap: function () {
    this.actionSheetTap()
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
    wx.navigateTo({
      url: '../PersonList/PersonList?scheduleId=' + e.currentTarget.dataset.id
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function () {
      wx.downloadFile({
      url: this.data.src,
      success:
      function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:
          function () {
          },
          fail:
          function (err) {
            console.log(err);
            if
 (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if
 (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  this.setData({
      showModal: false
    })
  }

})