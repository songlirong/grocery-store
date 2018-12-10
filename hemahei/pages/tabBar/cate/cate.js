Page({
  data: {
    'picture':[]
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  // 获取一级分类
  getCategory() {
    wx.request({
      url: this.data.tp5 + '/appfront/Category/getAllCate',
      success: res => {
        this.setData({
          picture: res.data
        })
      }
    })
  },
  onLoad: function(options) {
    this.getname();
    this.getCategory();
  },

  onReady: function() {

  },

  onShow: function() {

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