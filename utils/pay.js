function wxpay(app, money, orderId, redirectUrl) {
  wx.request({
    header: { "token": app.globalData.token},
    url: app.globalData.domain + '/api/wechat/pay/unifiedOrder',
    data: {
      orderNumber:orderId,
      totalAmount:money,
      remark:"支付订单 ：" + orderId
    },
    method:'POST',
    success: function(res){
      console.log('api result:');
      console.log(res.data);
      if(res.data.code == 0){
        // 发起支付
        wx.requestPayment({
          timeStamp:res.data.data.timeStamp,
          nonceStr:res.data.data.nonceStr,
          package: res.data.data.package,
          signType:'MD5',
          paySign: res.data.data.paySign,
          fail:function (aaa) {
            wx.showToast({title: '支付失败:' + aaa})
          },
          success:function () {
            wx.showToast({title: '支付成功'})
            wx.reLaunch({
              url: redirectUrl
            });
          }
        })
      } else {
        wx.showToast({title: '服务器忙' + res.data.code})
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
