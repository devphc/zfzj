//app.js
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url: that.globalData.domain +'/api/settings/getInfo',
      success: function(res) {
        wx.setStorageSync('mallName', res.data.settings.mallName);
      }
    })
    this.login();
  },
  login : function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {
      wx.request({
        url: that.globalData.domain + '/api/checkToken',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: that.globalData.domain +'/api/wechat/user/login',
          data: {
            code: res.code
          },
          success: function(res) {
            if (res.data.code == 1) {
              that.globalData.sessionKey = res.data.sessionKey; //暂时，不应该在网络传输
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel:false
              })
              return;
            }
            that.globalData.token = res.data.token;
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            var rawData = res.rawData;
            var signature = res.signature;
            // 下面开始调用注册接口
            wx.request({
              url: that.globalData.domain +'/api/wechat/user/register',
              data: { code: code, encryptedData: encryptedData, iv: iv, rawData: rawData, signature: signature, sessionKey: that.globalData.sessionKey}, // 设置请求的 参数
              success: (res) =>{
                if(res.data.code == 0){
                  wx.hideLoading();
                  that.login();
                }else{
                  // 登录错误 
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '无法登录，请重试',
                    showCancel: false
                  })
                }
                
              }
            })
          }
        })
      }
    })
  },
  globalData:{
    userInfo:null,
    subDomain:"mall",
    domain:"https://www.wfcschool.com"
  }
})