//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    isNeedSign:false
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

    app.wxRequest("/courseSchedule/" + courseId, requestConf);

    app.getUserInfo(function(userInfo){
      let requestConf1 = {
        data: {
          courseId: courseId,
          userId: userInfo.userId
        },
        success: function (res) {
          var checkInValue = res.data.checkIn;
          
          if (checkInValue == 1){
            that.setData({ isNeedSign: false });
          }else{
            that.setData({ isNeedSign: true });
          }
        },
        fail: function (error) {
          console.log(error)
        }
      };

      app.wxRequest("/courseParticipant/is_checkin", requestConf1);
    });
    


  }
})
