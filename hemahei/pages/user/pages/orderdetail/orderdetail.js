var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: [],
    ordernum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  getOrderInfo() {
    wx.request({    
      url: this.data.tp5 + '/appfront/Orderinfo/pendingPayment1',
      data: {
        openId: wx.getStorageSync('openId'),
        ordernum: this.data.order_sn
      },
      success: res => {
        console.log(res.data.orderInfo)
        if (res.data.code == 0) {
          this.setData({
            orderInfo: res.data.orderInfo,
          })
        } else {
          this.setData({
           
          })
        }
      }
    })
  },

  onLoad: function(options) {
    this.setData({
      order_sn: options.order_sn
    })

    this.getname();
    this.getOrderInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})