Component({
  properties: {
    carts: Array,
    tp5: String,
    selectAllStatus: Boolean
  },
  data: {
    carts: [],
    currentNumber: null,
    currentPage: 1,
    cartsHot: null,
    selectAllStatus: false
  },
  methods: {
    deleteList(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/deleteList',
        data: {
          goods_id: e.currentTarget.dataset.id,
          openId: wx.getStorageSync('openId')
        },
        success: res => {
          if (res.data.code == 1) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }

        }
      })
      const index = e.currentTarget.dataset.index;
      let carts = this.data.carts;
      carts.splice(index, 1);
      this.setData({
        carts: carts
      });
      if (!carts.length) {
        this.setData({
          hasList: false
        });
      } else {

      }
    },
    delAll(e) {
      if (this.data.selectAllStatus) {
        wx.request({
          url: this.data.tp5 + '/appfront/Cart/delAll',
          data: {
            openId: wx.getStorageSync('openId')
          },
          success: res => {
            if (res.data.code) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        })
        this.setData({
          carts: [],
          selectAllStatus: false
        })
      } else {
        wx.request({
          url: this.data.tp5 + '/appfront/Cart/delAll',
          data: {
            openId: wx.getStorageSync('openId')
          },
          success: res => {
            if (res.data.code) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              this.getProduct()
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        })
      }
    },
    getProduct() {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/getProduct',
        data: {
          currentPage: this.data.currentPage,
          openId: wx.getStorageSync('openId')
        },
        success: res => {
          if (res.data.code == 0) {
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
              carts: res.data.cartProduct
            })
          } else {
            wx.showToast({
              title: '饿既是空，空既是饿',
              icon: 'none'
            })
          }
        }
      })
    },

    minusCount(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/minusCount?cartProductId=' + e.currentTarget.dataset.id,
        success: res => {
          if (res.data.code == 0) {
            this.getProduct()
          } else if (res.data.code == 1 && res.data.msg == "warning") {
            console.log(res.data.msg)
          } else if (res.data.code == 1 && res.data.msg == "fail") {
            console.log(res.data.msg)
          }
        }
      })
    },

    addCount(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/addCount?cartProductId=' + e.currentTarget.dataset.id,
        success: res => {
          if (res.data.code == 0) {
            this.getProduct()
          } else if (res.data.code == 1 && res.data.msg == "fail") {
            console.log(res.data.msg)
          }
        }
      })
    },

    bindManual(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/bindManual',
        data: {
          cartProductId: e.currentTarget.dataset.id,
          goodsNumber: e.detail.value
        },
        success: res => {
          if (res.data.code == 0) {
            this.getProduct()
          } else if (res.data.code == 1 && res.data.msg == "fail") {
            console.log(res.data.msg)
          }
        }
      })
    },

    selectList(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/selectList',
        data: {
          cartProductId: e.currentTarget.dataset.id,
          productStatus: e.currentTarget.dataset.productstatus,
          openId: wx.getStorageSync('openId')
        },
        success: res => {
          if (res.data.code == 0) {
            this.getProduct()
          } else {
            console.log(res.data.msg)
          }
        }
      })
    },

    selectAll(e) {
      wx.request({
        url: this.data.tp5 + '/appfront/Cart/selectAll',
        data: {
          goodsStatus: this.data.selectAllStatus ? 0 : 1,
          openId: wx.getStorageSync('openId')   
        },
        success: res => {
          this.setData({
            selectAllStatus: res.data.goodsStatus
          })
          this.getProduct()
        }
      })
    },

  }
})