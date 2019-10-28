//app.js
// 引入请求的js文件
import request from './utils/request.js'
App({
  onLaunch: function () {
    request.defaults.baseURL = 'https://api.zbztb.cn'
  },
  globalData: {
  }
})