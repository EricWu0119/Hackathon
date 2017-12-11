//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // list: []
  },
  ReturnHome: function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  onLoad: function (options) {
    // console.log(options.scheduleId);
    // var scheduleId = 12;
    var that = this;
    // if (options.scheduleId)
    var scheduleId = options.scheduleId;
    let requestConf = {
      success: function (res) {
        var data = res.data;
        console.log(data);
        that.setData({ list: data });
      },
      fail: function (error) {
        console.log(error)
      }
    };

    app.wxRequest("/courseParticipant/getCheckedinByScheduleId/" + scheduleId, requestConf);

    requestConf = {
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
  }
})
