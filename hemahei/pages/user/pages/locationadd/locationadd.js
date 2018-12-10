Page({
  data: {
    tp5: '',
    address_label: '0',
    name: '淮海花园',
    address: '小店区',
    latitude: null,
    longitude: null,
    labelFlag: 0
  },
  //获取域名
  getname() {
    var tp5 = getApp().globalData.host;
    this.setData({
      tp5: tp5
    })
  },
  //地图选择地址
  locationchoose: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  //切换标签
  labelChoose(e) {
    if (this.data.labelFlag == e.currentTarget.dataset.label) {
      this.setData({
        labelFlag: '0'
      })
    } else {
      this.setData({
        labelFlag: e.currentTarget.dataset.label
      })
    }
  },
  //提交
  formSubmit: function (e) {
    console.log('form表单发生点击事件，携带的数据为：', e.detail.value);
    console.log('电话：', e.detail.value.userphone);
    //表单点击提交的时候获取数据
    //正则匹配
    // var mobile = new RegExp('[0-9]','g'); //不严格
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    // var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话
    //检查
    var isMobile = mobile.exec(e.detail.value.userphone)
    //输入有误的话，弹出模态框提示
         if (!isMobile) {
      wx.showModal({
        title: '提示！！',
        content: '你输入的电话不符，请重新检查填写',
      })
    }else{
    wx.request({
      url: this.data.tp5 + '/appfront/Receivingaddress/locationAdd',
      data: {
        openId: wx.getStorageSync('openId'),
        data: e.detail.value,
        label: this.data.labelFlag
      },
      success: res => {
        if (res.data == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
         }
  },
  onLoad: function (options) {
    this.getname();
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})