Page({
  data: {
    tp5: '',
    locationInfo: '',
    products: []
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //获取订单商品
  settlement() {
    wx.request({
      url: this.data.tp5 + '/appfront/Cart/settlement',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            products: res.data.carproduct
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none'
          })
        }
      }
    })
  },
  //获取收货地址
  getLocationInfo() {
    wx.request({
      url: this.data.tp5 + '/appfront/Receivingaddress/getLocationInfo',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            locationInfo: res.data.locationInfo
          })
        } else {
          wx.showToast({
            title: 'hh服务器错误',
            icon: 'none'
          })
        }
      }
    })
  },
  //提交订单
  placeOrder(e) {
    wx.request({
      url: this.data.tp5 + '/appfront/Orderinfo/placeOrder',
      data: {
        openId: wx.getStorageSync('openId'),
        addressId: this.data.locationInfo.address_id,
      },
      success: res => {
        // console.log(res.data)
        if (res.data.code == 0) {

        }
      }
    })
  },
  onLoad: function (options) {
    this.getname();
    this.settlement();
  },
  onReady: function () { },
  onShow: function () {
    this.getLocationInfo();
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})