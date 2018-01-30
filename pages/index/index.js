//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewB: function () {
    if (!app.userInfo) {
      // wx.navigateTo({
      //   url: '../category/index'
      // })
      wx.switchTab({
        url: '../category/index'
      })
    } else {
      // TODO to login
      console.log('请先去登陆');
    }
  }
})
