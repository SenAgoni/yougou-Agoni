//index.js
import request from '../../utils/request.js'
Page({

  data:{
    swiperData:[],
  },
  onLoad(){
    // 轮播图请求图片数据
    request({
      url:"/api/public/v1/home/swiperdata"
    }).then(res=>{
      const {message} = res.data;
      if(res.data.meta.status===200){
        this.setData({
          swiperData: message,
        })
      }
    })
  }
})
