var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0,
    addressData: {},
    url: '',
    id: '',
  },

  gotoShow: function () {
    let that = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        upload(that, tempFilePaths);
        // wx.uploadFile({
        //   url: app.globalData.domain + '/api/fileupload/uploadIdCard',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     console.log('upload file', res)
        //     var data = res.data
        //     console.log('data',data)
        //     that.setData({
        //       name: data.name,
        //       num:  data.num,
        //       src: data.url,
        //     })
        //     console.log(that.data.name)
        //     //do something
        //   },
        //   fail: function (e) {
        //     // fail
        //     console.log(e.errMsg)
        //   },
        //   complete: function (e) {
        //     // complete
        //     console.log(e)

        //   }
        // })
        // that.setData({
        //   src: res.tempFilePaths,
        //   name: res.name,
        //   num: res.num,
        // })
      },
      // fail: function (e) {
      //   // fail
      //   console.log(e.errMsg)
      // },
      // complete: function (e) {
      //   // complete
      //   console.log(e.errMsg)
      // }
    })
  },



  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    // var num = e.detail.value.num;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.addressData.provinceName == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.addressData.cityName == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict == "请选择") {
      districtId = cityId;
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url: app.globalData.domains + '/api/userAddress/' + apiAddoRuPDATE,
      data: {
        token: app.globalData.token,
        id: apiAddid,
        provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        provinceName: that.data.selProvince,
        cityId: cityId,
        cityName: that.data.selCity,
        districtId: districtId,
        districtName: that.data.selDistrict,
        contacts: linkMan,
        address: address,
        mobile: mobile,
        zipcode: code,
        url: that.data.url,
        num: that.data.num,
        name: that.data.name,
        isDefault: 'true'
      },
      success: function (res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },
  initCityData: function (level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      console.log(pinkArray);
      this.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }

  },
  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selDistrict: '请选择'
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择'
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
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
    this.initCityData(1);
    var id = e.id;
    that.data.id = id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: app.globalData.domains + '/api/userAddress/detail',
        data: {
          token: app.globalData.token,
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              id: id,
              addressData: res.data.userAddress,
              selProvince: res.data.userAddress.provinceName,
              selCity: res.data.userAddress.cityName,
              selDistrict: res.data.userAddress.districtName
            });
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
        }
      })
      // 
    }
  },
  selectCity: function () {

  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domains + '/api/userAddress/delete',
            data: {
              token: app.globalData.token,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})

function upload(page, path) {
  var that = this
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: app.globalData.domains + '/api/fileupload/uploadIdCard',
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        'user': 'test'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        var data = JSON.parse(res.data);
        console.log(data);
        page.setData({  //上传成功修改显示头像
          url: data.url,
          name: data.name,
          num: data.num,
        });
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}