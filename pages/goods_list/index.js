// pages/search/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopLists:[],
    query:'',
    pagenum:1,
    loadingMore:true,
    // 阻止当数据没有的时候再次发送请求，
    aginRequest:false,
    // 还有要当上一次请求完之后再发送第二次请求
    secondRequest:false,
  },
  getList(){
    // 发送请求获取数据
    request({
      url: "/api/public/v1/goods/search",
      data: {
        pagenum: this.data.pagenum,
        pagesize: 10,
        query:this.data.query
      }
    }).then(res => {
      const { goods } = res.data.message;
      var newGoods = goods.map(v => {
        // 给价格添加两位小数
        v.goods_price = Number(v.goods_price).toFixed(2);
        return v;
      })
      // 把获取到的数据保存到data中
      this.setData({
        shopLists: [...newGoods, ...this.data.shopLists],
        // 完成第一页的请求后要把页码加1
        pagenum: this.data.pagenum + 1,
        // 把下拉的第二次请求限制成先等前一次请求完成
        secondRequest:true,
      })
      // 每次请求都要判断获取到的数组的长度是否小于10 ，如果小于就代表是最后一页
      if (newGoods.length<10){
        this.setData({
          loadingMore:false,
          aginRequest:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {query} = options;
    this.setData({
      query
    })
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    // 用户下拉的时候就会触发的方法，所以会再次发送请求请求下一页的数据
    if (this.data.aginRequest){
      return
    }
    if (this.data.secondRequest){
      this.getList();
      // 请求好这一次后就有把他的值改成false
      this.setData({
        secondRequest:false,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})