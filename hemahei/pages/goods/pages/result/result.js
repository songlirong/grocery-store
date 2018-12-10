Page({
  data: {
    tp5: '',
    categoryFlag: false,
    allCateFlag: false,
    currentName: '全部分类',
    currentCate: '默认排序',
    searchdata: '',
    searchproduct: '',
    sort:0,
    category:0,
    value:''
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  // setSearch() {
  //   this.setData({
  //     searchdata: wx.getStorageSync("searchData")[0]
  //   })
  // },
  // 获取搜索的商品内容及分类内容
  getProduct() {
    wx.request({
      url: this.data.tp5 + '/appfront/Product/searchProduct',
      data: {
        keywords: this.data.value,
        sort:this.data.sort,
        category:this.data.category
      },
      success: res => {
        this.setData({
          searchcategory: res.data.category,
          searchproduct: res.data.product
        })
      },
    })
  },
  bindInput: function (e) {
    this.setData({
      value: e.detail.value
    })
    console.log(this.data.value);
  },
  //更换搜索内容
  set: function () {
    console.log(this.data.value)
    let localStorageValue = [];
    if (this.data.value != '') {
      //调用API从本地缓存中获取数据  
      var searchData = wx.getStorageSync('searchData') || []
      for (var i = 0; i < searchData.length; i++) {
        if (this.data.value == searchData[i]) {
          searchData.splice(i, 1)
        }
      }
      searchData.unshift(this.data.value)
      wx.setStorageSync('searchData', searchData)
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    }
    this.getProduct() 
  },
  //加入购物车
  addCar: function(options) {
    wx.request({
      url: this.data.tp5 + '/appfront/Cart/addCart',
      data: {
        productId: options.target.dataset.id,
        openId: wx.getStorageSync("openId")
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success'
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
  chooseCate: function() {
    this.setData({
      categoryFlag: false,
      allCateFlag: !this.data.allCateFlag
    })
    
  },
  chooseCategory: function() {
    this.setData({
      allCateFlag: false,
      categoryFlag: !this.data.categoryFlag
    })
  },
  chooseOne: function(e) {
    this.setData({
      currentName: e.currentTarget.dataset.name,
      allCateFlag: !this.data.allCateFlag,
      category: e.currentTarget.dataset.category,
    })
    this.getProduct()
  },
  choiceOne: function(e) {
    this.setData({
      currentCate: e.currentTarget.dataset.name,
      categoryFlag: !this.data.categoryFlag,
      sort: e.currentTarget.dataset.sort,
    })
    this.getProduct()
  },
  onLoad: function(options) {
    this.getname();
    this.setData({
      value: options.value
    })
  },
  onReady: function() {

  },
  onShow: function() {
    this.getProduct()
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