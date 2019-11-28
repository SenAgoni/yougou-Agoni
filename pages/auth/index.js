// pages/auth/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取登录数据
  handleAuth(res){
    // 结构数据
    const { encryptedData, iv, signature, rawData} = res.detail;
    // 获取code数据
    wx.login({
      success(value){
        const { code} = value;
        // 发送请求
        request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            encryptedData,
            iv,
            signature,
            code,
            rawData
          }
        }).then(res=>{
          // 然后就把token数据存到本地存储
          if(!wx.getStorageSync("token")){
            let token = res.data.message.token;
            wx.setStorageSync("token", token)
          }
          // 再跳转到首页
          wx.switchTab({
            url: '/pages/index/index',
          })
        })
      }
    })
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