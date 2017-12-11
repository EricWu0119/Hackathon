//index.js
//获取应用实例
var util = require('../../utils/util.js')
var wsAPI = require('../../utils/wsAPI.js')
var app = getApp()

Page({
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
  data: {
    list: [],
    isNeedSign:false,
    isLoading:false
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
    // this.data.isLoading = true;
    this.setData({
      isLoading:true
    })
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

    let  requestConf2 = {
      success: function (res) {
        var data = res.data[0].nickName;
        console.log(data);
        // var temp = [];
        // temp.push(data);
        that.setData({ name: data });
      },
      fail: function (error) {
        console.log(error)
      }
    };

    app.wxRequest("/courseParticipant/getTeacherByScheduleId/" + courseId, requestConf2);

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
      // that.data.isLoading = false;
      that.setData({
        isLoading:false
      })
    });

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  preventTouchMove: function () {

  },
  go: function () {
    this.setData({
      showModal: false
    })
  }
})
