// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    goodsCart:null,
    address:null,
    allSelected:true,
    // 计算总价
    allPrice:0,
    allNum:0,
  },
  // 获取收货人地址
  handleAddress(){
    wx.chooseAddress({
      success: (res) => {
        const { cityName, countyName, detailInfo, provinceName, telNumber, userName} =res;
        this.setData({
          address: { cityName, countyName, detailInfo, provinceName, telNumber, userName},
        })
        // 然后把地址数据存到本地存储
        wx.setStorageSync("address", this.data.address)
      }
    })
  },
  // 提交订单的方法
  handleOrder(){
    //点击之后就要跳转到授权页
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }else{
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
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
    // 在这里获取本地存储的数据，然后就渲染到页面中
    const goodsCart = wx.getStorageSync("goods") || null;
    // 然后就赋值给goodsCart
    this.setData({
      goodsCart
    })
    this.allSelected();
    this.allPrice();
    this.allNum();
  },
  // 按钮选中的方法
  handleSelect(event){
    // 选中之后就把selected数据改成false
    let goodsCart = this.data.goodsCart;
    let {id} = event.target.dataset
    let arr = Object.keys(goodsCart).map(v=>{
      if (goodsCart[v].goods_id==id){
        goodsCart[v].selected = !goodsCart[v].selected
        this.allSelected();
      }
      return goodsCart[v];
    })
    arr.forEach(v=>{
      goodsCart[v.goods_id] = v;
    })
    this.setData({
      goodsCart,
    })
    wx.setStorageSync("goods", goodsCart)
  },
  handleChange(event){
    let value = +event.detail.value || 1;
    let { id } = event.target.dataset;
    const goodsCart = this.data.goodsCart;
    let arr = Object.keys(goodsCart).map(v => {
      if (id === goodsCart[v].goods_id) {
        goodsCart[v].goods_number = value
      }
      return goodsCart[v];
    })
    // 修改number的值
    arr.forEach(v=>{
      goodsCart[v.goods_id] = v;
    })
    this.setData({
      goodsCart,
    })
    // 在存到本地存储中
    wx.setStorageSync("goods", goodsCart)
  },
  // 减少数量
  handleReduce(event){
    const { id } = event.target.dataset;
    this.addReduce(id, 'reduce');
  },
  // 添加数量
  handleAdd(event) {
    const {id} = event.target.dataset;
    this.addReduce(id,'add');
  },
  // 封装数量加和减的方法
  addReduce(id,type){
    let goodsCart = this.data.goodsCart;
    //在页面的显示要添加
    let arr = Object.keys(goodsCart).map(v => {
      if (goodsCart[v].goods_id == id) {
        if(type==='add'){
          goodsCart[v].goods_number = goodsCart[v].goods_number + 1;
        } else if (type === 'reduce'){
            if (goodsCart[v].goods_number == 1) {
              // 当商品只剩下最后一件，就询问用户是否确定要删除数据
              wx.showModal({
                title: '提示',
                content: '是否确定要删除商品',
                success: (res) => {
                  if (res.confirm) {
                    // 把选中的那一项删除
                    delete goodsCart[v];
                    if (Object.keys(goodsCart).length===0){
                      goodsCart = null
                    }
                    this.setData({
                      goodsCart,
                    })
                    // 再修改本地存储中的数值
                    wx.setStorageSync("goods", goodsCart)
                  }
                }
              })
            }else{
              goodsCart[v].goods_number = goodsCart[v].goods_number - 1;
            }
        }
      }
      return goodsCart[v];
    })
    // 修改完后再把数据存到data中
    arr.forEach(v => {
      goodsCart[v.goods_id] = v;
    })
    this.setData({
      goodsCart,
    })
    this.allPrice();
    this.allNum();
    // 再修改本地存储中的数值
    wx.setStorageSync("goods", goodsCart)
  },
  // 全选按钮的方法
  handleallSelected(){
    let { allSelected, goodsCart} = this.data;
    allSelected = !allSelected;
    this.setData({
      allSelected,
    })
    if(!allSelected){
     let arr = Object.keys(goodsCart).map(v => {
        goodsCart[v].selected = false;
        return goodsCart[v]
      })
      arr.forEach(v=>{
        goodsCart[v.goods_id] = v;
      })
      this.setData({
        goodsCart
      })
      wx.setStorageSync("goods", goodsCart)
    }else{
     let arr = Object.keys(goodsCart).map(v => {
        goodsCart[v].selected = true;
        return goodsCart[v]
      })
      arr.forEach(v => {
        goodsCart[v.goods_id] = v;
      })
      this.setData({
        goodsCart
      })
      wx.setStorageSync("goods", goodsCart)
    }
    this.allPrice();
    this.allNum();
  },
  // 封装全选与取消全选的方法
  allSelected(){
    let { goodsCart, allSelected} = this.data;
    // 遍历对象，如果有一项没被选中，则就会没被选中
    Object.keys(goodsCart).some(v=>{
        if (!goodsCart[v].selected){
          allSelected = false;
          return true;
        }
        allSelected = true;
      })
      this.setData({
        allSelected,
      })
    this.allNum();
    this.allPrice();
  },
  // 封装计算总价格的方法
  allPrice(){
    let { goodsCart, allPrice} = this.data;
    allPrice = 0;
    // 遍历对象，判断是否有被选中，如果有则算总价
    Object.keys(goodsCart).forEach(v=>{
      if(goodsCart[v].selected){
        allPrice += (+goodsCart[v].goods_price) * (+goodsCart[v].goods_number)
      }
    })
    this.setData({
      allPrice,
    })
  },
  // 封装计算总数量的方法
  allNum(){
    let {goodsCart,allNum} = this.data;
    allNum=0;
    Object.keys(goodsCart).forEach(v=>{
      if(goodsCart[v].selected){
        allNum += goodsCart[v].goods_number;
      }
    })
    this.setData({
      allNum,
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