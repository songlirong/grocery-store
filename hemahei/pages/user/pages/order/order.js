var app = getApp()
Page({
  data: {
    currentTab: 0,
    tp5: '',
    orderInfo: [],
    orderInfoFlag: false,
    remindFlag: false
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //获取订单
  getOrder() {
    wx.request({
      url: this.data.tp5 + '/appfront/Orderinfo/pendingPayment',
      data: {
        openId: wx.getStorageSync('openId'),
        orderStatus: this.data.currentTab
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            orderInfo: res.data.orderInfo,
            orderInfoFlag: true
          })
        } else {
          this.setData({
            orderInfoFlag: false
          })
        }
      }
    })
  },
  //提醒发货
  remindDelivery() {
    if (this.data.remindFlag) {
      wx.showToast({
        title: '请勿在半小时内多次提醒',
        icon: 'none'
      })
      return;
    } else {
      wx.showToast({
        title: '已提醒卖家尽快发货',
      })
      this.setData({
        remindFlag: true
      })
    }
    var that = this;
    setTimeout(function () {
      that.setData({
        remindFlag: false
      })
    }, 1800000)
  },
  // 确认收货
  confirmReceipt(e) {
    console.log(e)
    wx.request({
      url: this.data.tp5 + '/appfront/Orderinfo/confirmReceipt',
      data: {
        openId: wx.getStorageSync('openId'),
        orderId: e.currentTarget.dataset.orderid
      },
      success: res => {
        if (res.data.code == 0) {
          this.getOrder();
          wx.showToast({
            title: '收货成功',
          })
        } else if (res.data.code == 2) {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
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
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.getOrder();
  },
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.getOrder();
    }
  },
  onLoad: function (options) {
    this.getname();
    this.getOrder();
  },
  onShow: function () {
    if (app.globalData.currentLocation == '') {
      this.setData({
        currentTab: 0
      });
    } else {
      var i = app.globalData.currentLocation;
      this.setData({
        currentTab: i
      });
    }
  }
})