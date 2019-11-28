// pages/order/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:null,
    goodsCart:null,
    allNum:0,
    allPrice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取收货地址
  handleAddress(){
    // 判断是否本地有收货地址
    if (!wx.getStorageSync("address")) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 在本地存储获取收货地址
   let address = wx.getStorageSync("address");
  //  获取选中的商品列表的数据
    let goodsCart = wx.getStorageSync("goods")
    Object.keys(goodsCart).filter(v=>{
      if (goodsCart[v].selected){
        return goodsCart[v]
      }
    })
    let { allNum, allPrice} = this.data;
    // 遍历取总数量
    Object.keys(goodsCart).forEach(v=>{
      if (goodsCart[v].selected) {
        allNum += goodsCart[v].goods_number;
        allPrice += goodsCart[v].goods_price;
      }
    })
    this.setData({
      address,
      goodsCart,
      allNum,
      allPrice
    })
  },
  // 点击支付生成支付二维码
  handleOrder(){
    let { address, allPrice, goodsCart} = this.data;
    let arr = [];
    Object.keys(goodsCart).forEach(v=>{
      if (goodsCart[v].selected){
        arr.push(goodsCart[v])
      }
    })
    // 先创建订单
    request({
      url:"/api/public/v1/my/orders/create",
      method:"POST",
      header:{
        Authorization:wx.getStorageSync("token"),
      },
      data:{
        order_price: allPrice,
        consignee_addr: address.provinceName + address.cityName + address.countyName + address.detailInfo,
        goods:arr,
      }
    }).then(res=>{
      // 把订单号结构出来
      const {order_number} = res.data.message;
      // 发送支付请求
      request({
        url:"/api/public/v1/my/orders/req_unifiedorder",
        method:"POST",
        header:{
          Authorization: wx.getStorageSync("token"),
        },
        data:{
          order_number
        }
      }).then(res=>{
        const {pay} = res.data.message;
        wx.requestPayment({
          ...pay,
          success:(res)=>{
            // 支付成功就给用户一个提示
          }
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})