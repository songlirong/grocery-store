// pages/user/pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tp5:'',
    currentIdx: '',
    orderSn: '',
    order: '',
    product: []
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  // 选择好评 中评 差评
  chooseEvaluate(e) {
    if (this.data.currentIdx == e.currentTarget.dataset.idx) {
      this.setData({
        currentIdx: 0
      })
    } else {
      this.setData({
        currentIdx: e.currentTarget.dataset.idx
      })
    }
  },
  // 发布评价
  formSubmit(e) {
    console.log(e.detail.value)
    wx.request({
      url: this.data.tp5 + '/appfront/orderinfo/release',
      data: {
        openId: wx.getStorageSync('openId'),
        currentIdx: this.data.currentIdx,
        content: e.detail.value.content,
        orderSn:this.data.order.order_sn
      },
      success: res => {
        if(res.data.code == 0){
          wx.showToast({
            title: res.data.msg,
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
          },400)
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  // 获取当前订单信息
  getOrder() {
    wx.request({
      url: this.data.tp5 + '/appfront/orderinfo/getOrder',
      data: {
        openId: wx.getStorageSync('openId'),
        orderSn: this.data.orderSn
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            order: res.data.order,
            product: res.data.product
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderSn: options.orderSn
    })
    this.getname();
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
    this.getOrder();
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