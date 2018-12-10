Page({
  data: {
    tp5: '',
    imgUrls: ['red', 'blue', 'yellow', 'green'],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    picture: [],
    userInfo: '',
    userInfoFlag: true
  },
  morecate: function() {
    console.log(1)
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
      url: this.data.tp5 + '/appfront/Category/getCate',
      success: res => {
        this.setData({
          picture: res.data
        })
      }
    })
  },
  //获取用户信息
  getUserInfo(e) {
    var openId = wx.getStorageSync('openId')
    if (openId) {
      this.setData({
        userInfoFlag: false
      })
    } else {
      wx.getUserInfo({
        success: res => {
          this.setData({
            userInfo: res.userInfo
          })
          console.log(res.userInfo)
          this.toLogin();
        }
      })
    }
  },
  //登录
  toLogin() {
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: this.data.tp5 + '/appfront/Userinfo/getUserInfo',
            data: {
              code: res.code,
              userInfo: this.data.userInfo
            },
            success: res => {
              console.log(res.data)
              if (res.data.code == 0) {
                wx.setStorageSync('openId', res.data.openId);
                wx.setStorageSync('session_key', res.data.session_key);
                wx.setStorageSync('phone', res.data.phone);
                this.setData({
                  userInfoFlag: false
                })
              } else {
                wx.showToast({
                  title: '请重新登录',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      }
    })
  },
  onLoad: function(options) {
    this.getname();
    this.getCategory();
    var openId = wx.getStorageSync('openId')
    if (openId) {
      this.setData({
        userInfoFlag: false
      })
    }
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