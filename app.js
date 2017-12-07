App({
  onLaunch: function() {
    //进入应用时检查语言设置
    var language = wx.getStorageSync('selectedLanguage');
    if (language) {
      this.globalData.settings.language = language;
    } else {
      //使用系统语言设定 user-info COUNTRY, 暂时默认为中文 
      this.globalData.settings.language = 0;
    }
    //检查EMP ID设置
    var emp = wx.getStorageSync('employeeId')
    if (emp) {
      this.globalData.settings.employeeId = emp
    } else {
      this.globalData.settings.employeeId = null
    }
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      wx.login({
        success: function (res) {

          var code = res.code;
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              // 请求官方接口，获取openid和session_key
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxab931d22fde028bc&secret=e92a22aecc62fa522b73874ff959e671&js_code=code&grant_type=authorization_code',
                data: {
                  appid: "********",
                  secret: "*******",
                  js_code: that.globalData.js_code,
                  grant_type: "authorization_code"
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  // var openid = res.data.openid //返回openid
                  // console.log('openid为' + openid);
                  that.globalData.openid = res.data.openid;
                  that.globalData.session_key = res.data.session_key;

                },
                fail: function () {

                }
              })

            }
          })
        }
      })
    }

  },
  globalData: {
    settings: {
      language: null,
      employeeId: null
    },
    userInfo: null,
    js_code: "",
    openid: "",
    session_key: ""
  }
})