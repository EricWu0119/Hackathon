//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  ClockIn: function (e){
    var info = this.data.list[0];
    let infoStr = JSON.stringify(info);
    // console.log(info);
    wx.navigateTo({
      url: '../timecard/normal/normal?infoStr=' + infoStr,
    })
  },

  onLoad: function (options) {
    // console.log('themes.onLoad');
    var that = this;
    var courseId =12;
    if (options.id)
      courseId = options.id;
    let requestConf = {
      success: function (res) {
        var data = res.data;
        console.log(data);
        var temp = [];
        temp.push(data);
        that.setData({ list: temp });
      },
      fail: function (error) {
        console.log(error)
      }
    };

    app.wxRequest("/courseSchedule/" + courseId, requestConf);
    // 加载数据

    // wx.request({
    //   // url: 'http://news-at.zhihu.com/api/4/themes',
    //   url: 'https://www.todaynowork.group/wechat-du-1.0/courseSchedule/12',
    //   header: { "Content-Type": "application/json" },
    //   success: function (res) {
    //     var data = res.data;
    //     console.log(data);
    //     var temp = [];
    //     temp.push(data);
    //     that.setData({ list: temp });
    //   },
    //   fail: function (error) {
    //     console.log(error)
    //   }
    // });
  }
})
