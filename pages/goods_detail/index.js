// pages/goods_detail/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id:0,
    goodsDetail:{},
    goodsCart:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.setData({
      goods_id
    })
    request({
      url:'/api/public/v1/goods/detail',
      data:{
        goods_id
      }
    }).then(res=>{
      const {message} = res.data;
      this.setData({
        goodsDetail:message,
      })
    })
  },
  handleAddCart(event){
    // 点击添加到购物车时，就要把数据存到本地存储
    let obj = wx.getStorageSync("goods")||{};
    const {id} = event.target.dataset;
    let goods_number = 1;
    // 先把我们需要的数据给解构出来，然后再添加
    const { goods_id, goods_name, goods_price, goods_small_logo} = this.data.goodsDetail;
    // 先取后存，但是如果前面已经添加过了，那就直接把那个商品的数量添加1；所以要在这里去遍历,利用goods_id去判断
   
   if(Object.keys(obj).length>0){
     Object.keys(obj).map(v => {
       if (id==obj[v].goods_id) {
         // 数量加一
         goods_number = goods_number + 1;
       }
     })
   }

    // 先构造一个对象
    obj[goods_id] = {
      goods_id,
      goods_name,
      goods_price,
      goods_small_logo,
      // 先给一个默认的数值
      goods_number,
      selected: true,
    }
    console.log(obj);
    // 然后存到本地存储
    wx.setStorageSync("goods", obj)
    // 在给用户一个提示，已经添加到购物车了
    wx.showToast({
      title: '已添加',
      icon:"success"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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