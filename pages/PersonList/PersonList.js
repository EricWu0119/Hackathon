//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // list: []
  },
  ReturnHome: function(){
    // wx.redirectTo({
    //   url: '../settings/settings',
    // })

    wx.navigateBack({
      delta: getCurrentPages().length
    })

  },
  onLoad: function (options) {
    // console.log(options.scheduleId);
    // var scheduleId = 12;
    var that = this;
    // if (options.scheduleId)
    var scheduleId = options.scheduleId;
    var flagSign = options.flagSign;

    this.setData({
      listType: (flagSign == 2 ? 0 : 1)
    });
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

    app.wxRequest("/courseParticipant/getCheckedinByScheduleId/" + scheduleId + "?listType=" + this.data.listType, requestConf);

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
