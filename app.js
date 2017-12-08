// App({
//   onLaunch: function() {
//     //进入应用时检查语言设置
//     var language = wx.getStorageSync('selectedLanguage');
//     if (language) {
//       this.globalData.settings.language = language;
//     } else {
//       //使用系统语言设定 user-info COUNTRY, 暂时默认为中文 
//       this.globalData.settings.language = 0;
//     }
//     //检查EMP ID设置
//     var emp = wx.getStorageSync('employeeId')
//     if (emp) {
//       this.globalData.settings.employeeId = emp
//     } else {
//       this.globalData.settings.employeeId = null
//     }
//     //调用API从本地缓存中获取数据
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)
//   },
//   getUserInfo: function (cb) {
//     var that = this;
//     if (that.globalData.userInfo) {
//       typeof cb == "function" && cb(that.globalData.userInfo)
//     } else {
//       wx.login({
//         success: function (res) {

//           var code = res.code;
//           wx.getUserInfo({
//             success: res => {
//               that.globalData.userInfo = res.userInfo;
//               typeof cb == "function" && cb(that.globalData.userInfo);
//               // 请求官方接口，获取openid和session_key
//               wx.request({
//                 url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxab931d22fde028bc&secret=e92a22aecc62fa522b73874ff959e671&js_code=code&grant_type=authorization_code',
//                 data: {
//                   appid: "********",
//                   secret: "*******",
//                   js_code: that.globalData.js_code,
//                   grant_type: "authorization_code"
//                 },
//                 header: {
//                   'content-type': 'application/json'
//                 },
//                 success: function (res) {
//                   // var openid = res.data.openid //返回openid
//                   // console.log('openid为' + openid);
//                   that.globalData.openid = res.data.openid;
//                   that.globalData.session_key = res.data.session_key;

//                 },
//                 fail: function () {

//                 }
//               })

//             }
//           })
//         }
//       })
//     }

//   },
//   globalData: {
//     settings: {
//       language: null,
//       employeeId: null
//     },
//     userInfo: null,
//     js_code: "",
//     openid: "",
//     session_key: ""
//   }
// })


//app.js
App({
  onLaunch: function () {


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
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.showLoading({
              title: '加载中'
          });
          //发起网络请求
          let openIdReqConf = {
            // url: '/loginPostTest',
            data: {
              code: res.code
            },
            // header:{
            //   'Content-Type':'application/x-www-form-urlencoded'
            // },
            // header: {
            //   'Content-Type': 'application/json'
            // },
            success: function (res) {

              if (res.data.errcode) {
                console.log(res.data);
                console.log("did not get openid");
                wx.hideLoading();
              } else {
                that.globalData.token = res.data.sessionid;
                that.globalData.openId = res.data.openId;
                that.getUserInfo(function(){
                  wx.hideLoading();
                });
              }
            },
            fail: function (error) {
              wx.hideLoading();
            },
            method: 'POST'
          };
          that.wxRequest("/login", openIdReqConf);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
          wx.hideLoading();
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          let userReqConf = {
            // url: '/loginPostTest',
            data: {
              // openId: that.globalData.openId,
              avatarUrl: res.userInfo.avatarUrl,
              // email: '',
              nickName: res.userInfo.nickName
            },
            success: function (res) {

              if (res.data.errcode) {
                console.log(res.data);
              } else {
                //get customize user info, image
                that.globalData.userInfo.email = res.data.email;
                that.globalData.userInfo.userId = res.data.id;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
              wx.hideLoading();
            },
            fail: function (error) {
              wx.hideLoading();
            },
            method: 'POST'
          };
          that.wxRequest("/user", userReqConf);
          
        }
      })
    }
  },
  wxRequest: function (apiPath, requestConf) {
    let url = this.globalData.apiContextUrl + apiPath;
    requestConf.url = url;
    if (this.globalData.token) {
      requestConf.header = requestConf.header || {};
      requestConf.header['x-auth-token'] = this.globalData.token;
    }
    wx.request(requestConf);
  },

  globalData: {
    settings: {
      language: null,
      employeeId: null
    },
    userInfo: null,
    hasLogin: false,
    apiContextUrl: 'https://todaynowork.group/wechat-prod-1.0',
    // apiContextUrl: 'http://localhost:8080',
    token: 'null',
    openId: null
  }
})


