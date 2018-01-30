//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    typeBorC: '',
    loadingMoreHidden: true
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-detailss/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-detailss/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  scroll: function (e) {
    //  console.log(e) ;
    var that = this, scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },
  onLoad: function () {
    var that = this
    // console.log(that)
    // if (that.options.type === 'B') {
    //   that.setData({
    //     typeBorC: '?type=1'
    //   })
    // } else {
    //   that.setData({
    //     typeBorC: '?type=2'
    //   })
    // }
    wx.setNavigationBarTitle({
      title: '支付云之家'
    })
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    */
    wx.request({
      url: app.globalData.domains + '/api/banner/list',
      success: function (res) {
        that.setData({
          banners: res.data.bannerList
        });
      }
    })
    wx.request({
      url: app.globalData.domains + '/api/category/list',
      success: function (res) {
        var categories = [{ categoryId: 0, categoryName: "全部" }];
        for (var i = 0; i < res.data.categoryList.length; i++) {
          categories.push(res.data.categoryList[i]);
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
      }
    })

  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: app.globalData.domains + '/api/goods/list',
      data: {
        categoryId: categoryId
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.goodsList.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.goodsList.length; i++) {
          goods.push(res.data.goodsList[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  }
})
