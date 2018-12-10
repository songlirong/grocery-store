Page({
  data: {
    product: null,
    index1: 1,
    distance: 0,
    currentid: 1,
    productId: '',
    tp5: '',
    detailsTop: '',
    exploreTop: '',
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //页面滚动
  onPageScroll: function(e) {
    this.setData({
      distance: e.scrollTop
    })
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#top-details-header').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      that.setData({
        detailsTop: res[0].top,
      })
    })
    var query = wx.createSelectorQuery()
    query.select('#explore-like').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      that.setData({
        exploreTop: res[0].top,
      })
    })
    var that = this;
    setTimeout(function() {
      if (that.data.detailsTop > 120) {
        that.setData({
          currentid: 1
        })
      } else if (that.data.detailsTop < 120 && that.data.exploreTop > 120) {
        that.setData({
          currentid: 2
        })
      } else if (that.data.exploreTop < 120) {
        that.setData({
          currentid: 4
        })
      }
    }, 300)
  },
  //点击头部的内容
  changeColor: function(e) {
    setTimeout(function() {
      if (e.currentTarget.dataset.id == 1) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else if (e.currentTarget.dataset.id == 2) {
        wx.pageScrollTo({
          scrollTop: 502,
          duration: 300
        })
      } else if (e.currentTarget.dataset.id == 4) {
        wx.pageScrollTo({
          scrollTop: 724,
          duration: 300
        })
      }
    }, 300)
    this.setData({
      currentid: e.currentTarget.dataset.id
    })

  },
  addIndex: function(e) {
    this.setData({
      index1: e.detail.current + 1,
    })
  },
  addCar: function() {
    wx.request({
      url: this.data.tp5 + '/appfront/Cart/addCart',
      data: {
        productId: this.data.productId,
        openId: wx.getStorageSync("openId")
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            cartsnum: this.data.cartsnum + 1,
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'none'
          })
        }
      }
    })
  },
  //获取商品详情
  getProduct() {
    wx.request({
      url: this.data.tp5 + '/appfront/Product/getProduct?productId=' + this.data.productId,
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            product: res.data.product
          })
        } else {
          wx.showToast({
            title: '暂无商品详情',
            icon: 'none'
          })
        }
      }
    })
  },
  //获取购物车的商品数量
  getCarNumber() {
    wx.request({
      url: this.data.tp5 + '/appfront/Category/getCarNumber',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        this.setData({
          cartsnum: res.data
        })
      }
    })
  },
  onLoad: function(options) {
    this.setData({
      productId: options.id
    })
    this.getname();
    this.getProduct();
    this.getCarNumber()
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})