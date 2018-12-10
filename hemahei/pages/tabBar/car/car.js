Page({
  data: {
    tp5: '',
    currentPage: 1,
    cartProduct: [],
    selectAllStatus: false
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //获取购物车商品
  getProduct() {
    wx.request({
      url: this.data.tp5 + '/appfront/Cart/getProduct',
      data: {
        currentPage: this.data.currentPage,
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.code == 0) {
          console.log(3);
          this.setData({
            selectAllStatus: true
          })
          for (var i = 0; i < res.data.cartProduct.length; i++) {
            if (res.data.cartProduct[i].goods_status == 0) {
              this.setData({
                selectAllStatus: false
              })
            }
          }
          this.setData({
            cartProduct: res.data.cartProduct
          })
        } else {
          console.log(4);
          wx.showToast({
            title: '饿既是空，空既是饿',
            icon: 'none'
          })
        }
      }
    })
  },

  onLoad: function(options) {
    this.getname();
   
  },
  onReady: function() {},
  onShow: function () { this.getProduct();},
  onHide: function() {},
  onUnload: function() {},
  //下拉刷新
  onPullDownRefresh: function() {
  },
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})