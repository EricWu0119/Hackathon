//index.js
//获取应用实例
var util = require('../../utils/util.js')
var wsAPI = require('../../utils/wsAPI.js')
var app = getApp()

Page({
  data: {
    list: [],
    isNeedSign:false
  },
  ClockIn: function (e){
    var info = this.data.list[0];
    if(this.data.isNeedSign){
      let infoStr = JSON.stringify(info);
      // console.log(info);
      wx.navigateTo({
        url: '../timecard/normal/normal?infoStr=' + infoStr,
      })
    }else{
      let requestConf = {
        method: 'post',
        data: {
          "courseScheduleId": info.id,
          "participantId": app.globalData.userInfo.userId
        },
        success: function (res) {
          console.log(res.data)
          wx.reLaunch({
            url: "../PersonList/PersonList?scheduleId=" + info.id
          });
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 3000
          });
        }, fail: function (res) {
          console.log(res.data)
          wx.reLaunch({
            url: "../../index/index"
          });
          wx.showToast({
            title: '签到失败...',
            icon: 'loading',
            duration: 3000
          });
        }
      };

      app.wxRequest("/courseParticipant/checkout", requestConf);
    }

  },
  onLoad: function (options) {
    // console.log('themes.onLoad');
    var that = this;
    var courseId =12;
    if (options.id)
      courseId = options.id;
    // let requestConf = {
    //   success: function (res) {
    //     var data = res.data;
    //     console.log(data);
    //     var temp = [];
    //     temp.push(data);
    //     that.setData({ list: temp });
    //     var startTime = util.formatTime(new Date(res.data.startTime));
    //     var endEndtime = util.formatTime(new Date(res.data.endEndtime));
    //     that.setData({ 
    //       startTime: startTime,
    //       endEndtime: endEndtime
    //       });
    //     console.log(startTime);
    //   },
    //   fail: function (error) {
    //     console.log(error)
    //   }
    // };
  
    // app.wxRequest("/courseSchedule/" + courseId, requestConf);
    wx.showLoading({
      title: '正在初始化',
    })
    var courseP = app.wxRequestP("/courseSchedule/" + courseId, {}).then((res)=>{
      var data = res.data;
      console.log(data);
      var temp = [];
      temp.push(data);
      that.setData({ list: temp });
      var startTime = util.formatTime(new Date(res.data.startTime));
      var endEndtime = util.formatTime(new Date(res.data.endEndtime));
      that.setData({
        startTime: startTime,
        endEndtime: endEndtime
      });
      console.log(startTime);
    });

    // requestConf = {
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
    // };

    // app.wxRequestP("/courseSchedule/" + courseId, {}).then((res)=>{
    //   var data = res.data;
    //   console.log(data);
    //   var temp = [];
    //   temp.push(data);
    //   that.setData({ list: temp });
    // });

    var signP = app.getUserInfoP().then((userInfo) => {
      let requestConf1 = {
        data: {
          courseId: courseId,
          userId: userInfo.userId
        }
      }

      return app.wxRequestP("/courseParticipant/is_checkin", requestConf1);
    }).then((res)=>{
      var checkInValue = res.data.checkIn;

      if (checkInValue == 1) {
        that.setData({ isNeedSign: false });
      } else {
        that.setData({ isNeedSign: true });
      }
    });
    
    Promise.all([courseP,signP]).then((values)=>{
      wx.hideLoading()
    });

  }
})
