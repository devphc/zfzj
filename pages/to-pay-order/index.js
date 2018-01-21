//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    mallName:wx.getStorageSync('mallName'),
    goodsList:[],
    isNeedLogistics:1, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    curAddressData:null,
    goodsJsonStr:""
  },
  onShow : function () {
    this.initShippingAddress();
  },
  onLoad: function (e) {
    var that = this;
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    var isNeedLogistics = 1;
    var totalAmount = 0;

    var goodsJsonStr = "[";
    var goodsList = [];
    for (var i =0; i < shopList.length; i++) {
      var carShopBean = shopList[i];
      //console.log(carShopBean);
      if (carShopBean.logisticsType > 0) {
        isNeedLogistics = 1;
      }
      totalAmount += carShopBean.price * carShopBean.number

      var goodsJsonStrTmp = '';
      if (i > 0){
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":'+ carShopBean.goodsId +',"num":'+ carShopBean.number +',"propertyChildIds":"'+ carShopBean.propertyChildIds +'","logisticsType":'+ carShopBean.logisticsType +'}';
      goodsJsonStr += goodsJsonStrTmp;

      var goods = { goodsId: shopList[i].goodsId, num: shopList[i].number, pic: shopList[i].pic, price: shopList[i].price, name: shopList[i].name};
      goodsList.push(goods);
    }
    goodsJsonStr += "]";
    that.setData({
      goodsList: goodsList,
      isNeedLogistics:isNeedLogistics,
      allGoodsPrice:totalAmount,
      goodsJsonStr:goodsJsonStr
    });

  },
  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = e.detail.value.remark; // 备注信息

    var postData = {
      orderGoodsList: that.data.goodsList,
      remark: remark,
	    orderShipment: {},
      totalAmount: that.data.allGoodsPrice
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请选择您的收货地址',
          showCancel: false
        })
        return;
      }
      postData.orderShipment.provinceId = that.data.curAddressData.provinceId;
      postData.orderShipment.provinceName = that.data.curAddressData.provinceName;
      postData.orderShipment.cityId = that.data.curAddressData.cityId;
      postData.orderShipment.cityName = that.data.curAddressData.cityName;
      if (that.data.curAddressData.districtId) {
        postData.orderShipment.districtId = that.data.curAddressData.districtId;
        postData.orderShipment.districtName = that.data.curAddressData.districtName;
      }
      postData.orderShipment.address = that.data.curAddressData.address;
      postData.orderShipment.contacts = that.data.curAddressData.contacts;
      postData.orderShipment.mobile = that.data.curAddressData.mobile;
      postData.orderShipment.zipcode = that.data.curAddressData.zipcode;
    }


    wx.request({
      url: app.globalData.domain +'/api/order/createOrder',
      method:'POST',
      header:{
        token: loginToken
      },
      data: postData, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 清空购物车数据
        wx.removeStorageSync('shopCarInfo');
        // 下单成功，跳转到订单管理界面
        wx.navigateTo({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain +'/api/userAddress/dft',
      data: {
        token:app.globalData.token
      },
      success: (res) =>{
        if (res.data.code == 0) {
          that.setData({
            curAddressData:res.data.userAddress
          });
        }
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  }
})
