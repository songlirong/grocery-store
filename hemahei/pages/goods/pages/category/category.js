Page({
  tapName: function(event) {
    // console.log(event.currentTarget.dataset.idxp)
  },
  data: {
    tp5: '',
    uid: null,
    num: 0,
    currentItem: 0,
    currentItem1: 0,
    currentItem2: 0,
    nowleft: 0,
    nowtop: 0,
    oldtop: 0,
    oldleft: 0,
    flag: false,
    flag1: false,
    moveleft: 0,
    movetop: 0,
    cartsnum: 0,
    dianid: 0,
    scrollTop: 0,
    array: [],
    titleInfo: '',
    goodsList: [],
    currentPage: 1,
    total: '',
    toView: '',
    height0: '',
    height1: '',
    height2: '',
    height3: '',
    height4: '',
  },
  //左侧选择二级分类
  tagChoose: function(options) {
    var that = this
    this.setData({
      currentItem: options.currentTarget.dataset.id,
    })
    if (options.currentTarget.dataset.id == 0) {

    } else {
      that.setData({
        currentPage: 1,
        goodsList: []
      })
      this.getGoods();
    }
  },
  //分页获取二级分类下的商品
  getGoods() {
    var that = this;
    wx.request({
      url: that.data.tp5 + '/appfront/Product/getGoods?categoryId=' + that.data.currentItem + '&page=' + that.data.currentPage + '&parentId=' + that.data.parentId,
      success: res => {
        //判断是否调用成功
        if (res.data.code == 0) {
          that.setData({
            total: res.data.total
          })
          //判断是否为第一次加载
          if (that.data.goodsList) {
            that.setData({
              goodsList: that.data.goodsList.concat(res.data.productInfo)
            })
          } else {
            that.setData({
              goodsList: res.data.productInfo
            })
          }
        } else {
          wx.showToast({
            title: '暂无商品',
            icon: 'none'
          })
        }
      }
    })
  },
  touchBottom(e) {
    //判断二级分类的ID
    if (this.data.currentItem == 0) {
      return;
    } else {
      //判断当前页与总页数的大小
      if (this.data.currentPage < this.data.total) {
        this.setData({
          currentPage: this.data.currentPage + 1
        })
        this.getGoods();
      } else {
        this.setData({
          currentPage: this.data.total
        })
        wx.showToast({
          title: '已加载全部商品',
          icon: 'none'
        })
      }

    }
  },
  //点击左右滑动效果
  tagChoose1: function(options) {
    var that = this
    var index = options.currentTarget.dataset.index;
    that.setData({
      currentItem1: index,
      num: 80 * (index - 1),
    })
  },
  tagFlag: function() {
    this.setData({
      flag: true,
      flag1: true
    })
  },
  tagFlag1: function() {
    this.setData({
      flag1: false,
      flag: false
    })
  },
  //添加到购物车
  addCar: function(options) {
    wx.request({
      url: this.data.tp5 + '/appfront/Cart/addCart',
      data: {
        productId: options.target.dataset.id,
        openId: wx.getStorageSync('openId')
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            cartsnum: this.data.cartsnum + 1,
            nowleft: options.detail.x,
            nowtop: options.detail.y,
            dianid: options.target.dataset.id
          })
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'none'
          })
        }
      }
    })
    var that = this;
    setTimeout(function() {
        wx.createSelectorQuery().select('#shop').boundingClientRect(function(rect) {
          that.setData({
            oldleft: rect.left,
            oldtop: rect.top,
          })
          var movelefts = that.data.nowleft - that.data.oldleft;
          var movetops = that.data.nowtop - that.data.oldtop
          var query = wx.createSelectorQuery().select('.c-item-mask')
          query._selectorQuery._defaultComponent.animation.translate(-movelefts, -movetops).step()
          that.setData({
            animation: that.animation.export(),
          })
          //小蓝点返回
          setTimeout(function() {
            query._selectorQuery._defaultComponent.animation.translate(0, 0).step({
              duration: 0
            })
            that.setData({
              animation: that.animation.export(),
            })
          }, 1000)
        }).exec()
      },
      300)
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  // 获取二级分类
  getCategory() {
    wx.request({
      url: this.data.tp5 + '/appfront/Category/getCategory?id=' + this.data.parentId,
      success: res => {
        this.setData({
          array: res.data.cate,
          titleInfo: res.data.titleInfo
        })
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
           cartsnum:res.data
         })
      }
    })
  },
  //滚动触发
  scrolling: function(e) {
    // 将当前的距离传入
    this.setData({
      scrollTop: e.detail.scrollTop,
    })
    let _this = this;
    var query = wx.createSelectorQuery()
    query.select('#title0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      _this.setData({
        height0: res[0].top,
      })
    })
    var query1 = wx.createSelectorQuery()
    query1.select('#title1').boundingClientRect()
    query1.selectViewport().scrollOffset()
    query1.exec(function(res) {
      _this.setData({
        height1: res[0].top,
      })
    })
    var query2 = wx.createSelectorQuery()
    query2.select('#title2').boundingClientRect()
    query2.selectViewport().scrollOffset()
    query2.exec(function(res) {
      _this.setData({
        height2: res[0].top,
      })
    })
    var query3 = wx.createSelectorQuery()
    query3.select('#title3').boundingClientRect()
    query3.selectViewport().scrollOffset()
    query3.exec(function(res) {
      _this.setData({
        height3: res[0].top,
      })
    })
    var query4 = wx.createSelectorQuery()
    query4.select('#title4').boundingClientRect()
    query4.selectViewport().scrollOffset()
    query4.exec(function(res) {
      _this.setData({
        height4: res[0].top,
      })
    })
    if (_this.data.height0 > 106) {
      _this.setData({
        currentItem1: 0,
        num: 80 * -1
      })
    } else if (_this.data.height0 < 106 && _this.data.height1 > 106) {
      _this.setData({
        currentItem1: 0,
        num: 80 * -1
      })
    } else if (_this.data.height1 < 106 && _this.data.height2 > 106) {
      _this.setData({
        currentItem1: 1,
        num: 80 * 0
      })
    } else if (_this.data.height2 < 106 && _this.data.height3 > 106) {
      _this.setData({
        currentItem1: 2,
        num: 80 * 1
      })
    } else if (_this.data.height3 < 106 && _this.data.height4 > 106) {
      _this.setData({
        currentItem1: 3,
        num: 80 * 2
      })
    } else if (_this.data.height4 < 106) {
      _this.setData({
        currentItem1: 4,
        num: 80 * 3
      })
    }
  },
  onLoad: function(options) {
    this.setData({
      parentId: options.id
    })
    this.getname()
  },
  onReady: function() {
    this.animation = wx.createAnimation();
  },

  onShow: function() {
    this.getCategory();
    this.getGoods();
    this.getCarNumber()
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})