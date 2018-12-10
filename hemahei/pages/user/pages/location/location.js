Page({
  data: {
    tp5: '',
    choice: 0,
    addressInfo: '',
    latitude: null,
    longitude: null,
    locationInfo: []
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //点击切换地址
  choose: function (e) {
    wx.request({
      url: this.data.tp5 + '/appfront/Receivingaddress/locationChoose',
      data: {
        openId: wx.getStorageSync('openId'),
        beforeChoice: this.data.choice,
        currentChoice: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            choice: res.data.addressId,
            addressInfo: res.data.addressInfo
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
  //地图获取地址
  locationchoose: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          addressInfo: res.name + res.address,
        })
      }
    })
  },
  //获取全部地址
  getAllLocation() {
    wx.request({
      url: this.data.tp5 + '/appfront/Receivingaddress/getAllLocation',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.code == 0 && res.data.msg == 'success') {
          var that = this
          for (var i = 0; i < res.data.locationInfo.length; i++) {
            if (res.data.locationInfo[i].address_status == 1) {
              that.setData({
                addressInfo: res.data.locationInfo[i].address_info,
                choice: res.data.locationInfo[i].address_id
              })
            } else {

            }
          }
          this.setData({
            locationInfo: res.data.locationInfo
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.getname();
   
  },
  onReady: function () { },
  onShow: function () { this.getAllLocation(); },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})