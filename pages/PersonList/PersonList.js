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
    // console.log('themes.onLoad');
    var that = this;
    // 加载数据
    wx.request({
      // url: 'http://news-at.zhihu.com/api/4/themes',
      url: 'https://www.todaynowork.group/wechat-du-1.0/user/all',
      header: { "Content-Type": "application/json" },
      success: function (res) {
        var data = res.data;
        console.log(data);
        // var temp = [];
        // temp.push(data);
        that.setData({ list: data });
      },
      fail: function (error) {
        console.log(error)
      }
    });
  }
})
