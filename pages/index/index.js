//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewB: function() {
    if (!app.userInfo) {
      wx.navigateTo({
        url: '../category/index?type=B'
      })
    } else {
      // TODO to login
      console.log('请先去登陆');
    }
  },
  bindViewC: function () {
    wx.navigateTo({
      url: '../category/index?type=C'
    })
  },
  
})
