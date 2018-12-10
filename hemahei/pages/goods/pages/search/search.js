Page({
  data: {
    tp5: '',
    arr: [],
    inputValue: '',
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  // input输入
  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 搜索
  setSearchStorage: function () {
    let localStorageValue = [];
    if (this.data.inputValue != '') {
      //调用API从本地缓存中获取数据  
      var searchData = wx.getStorageSync('searchData') || []
      for (var i = 0; i < searchData.length; i++) {
        if (this.data.inputValue == searchData[i]) {
          searchData.splice(i, 1)
        }
      }
      searchData.unshift(this.data.inputValue)
      wx.setStorageSync('searchData', searchData)
      wx.navigateTo({
        url: '../result/result?value='+this.data.inputValue
      })
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    }
  },
  // 获取搜索历史
  getSearchHistory() {
    var array = wx.getStorageSync('searchData')
    if (array.length > 8) {
      var arr = array.slice(0, 8);
      this.setData({
        arr: arr
      })
    } else {
      this.setData({
        arr: array
      })
    }
  },
  // 删除搜索历史
  deleteHistory() {
    wx.removeStorageSync('searchData');
    this.getSearchHistory();
  },
  // 点击获取搜索内容
  getSearchValue(e) {
    console.log(e.currentTarget.dataset.searchvalue)
    this.setData({
      inputValue: e.currentTarget.dataset.searchvalue
    })
  },
  onLoad: function (options) {
    this.getname();
  },
  onReady: function () {

  },
  onShow: function () {
    this.getSearchHistory();
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})