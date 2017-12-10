var wsAPI = require('utils/wsAPI.js')
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

    this.getUserInfoP().then((userInf)=>console.log(userInf));

  },
  getUserInfoP: function (cb) {
    var that = this;
    wsAPI.login()
    .then((res)=>{
      if (res.code) {

        //发起网络请求
        let openIdReqConf = {
          data: {
            code: res.code
          }
        };
        return that.wxRequestP("/login", openIdReqConf);
      }

    }).then((res)=>{
        that.globalData.token = res.data.sessionid;
        that.globalData.openId = res.data.openId;
        return wsAPI.getUserInfo({
                    withCredentials: true
                  });
    }).then((res)=>{
        that.globalData.userInfo = res.userInfo;
        let userReqConf = {
            data: {
              // openId: that.globalData.openId,
              avatarUrl: res.userInfo.avatarUrl,
              // email: '',
              nickName: res.userInfo.nickName
            },
            method: 'POST'
        };
        return that.wxRequestP("/user", userReqConf);
    },()=>wsAPI.stop()).then((res)=>{

      return new Promise((resolve, reject) => {
        if (res.data.errcode) {
          console.log(res.data);
          reject(res.data);
        } else {
          //get customize user info, image
          that.globalData.userInfo.email = res.data.email;
          that.globalData.userInfo.userId = res.data.id;
          resolve(that.globalData.userInfo);
        }
      });

    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
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
              success: function (res) {

                if (res.data.errcode) {
                  console.log(res.data);
                  console.log("did not get openid");
                  wx.hideLoading();
                } else {
                  that.globalData.token = res.data.sessionid;
                  that.globalData.openId = res.data.openId;
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
                          // wx.hideLoading();
                        },
                        complete: function (error) {
                          wx.hideLoading();
                        },
                        method: 'POST'
                      };
                      that.wxRequest("/user", userReqConf);
                    }
                  })
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
    }
  },
  wxRequestP: function (apiPath, requestConf) {
    let url = this.globalData.apiContextUrl + apiPath;
    requestConf.url = url;
    if (this.globalData.token) {
      requestConf.header = requestConf.header || {};
      requestConf.header['x-auth-token'] = this.globalData.token;
    }
    return wsAPI.request(requestConf);
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
    apiContextUrl: 'https://todaynowork.group/wechat-du-1.0',
    // apiContextUrl: 'http://localhost:8080',
    token: 'null',
    openId: null
  }
})


