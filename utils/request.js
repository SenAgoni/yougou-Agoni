/**
 * @desc:请求接口的封装
 * @params：这一个函数会返回一个promise对象
 * @return：一个promise对象
 */
const request = (config) => {
  // 判断config是不是一个对象
  // if(!(config && typeof config === "object" &&　!Array.isArray(config))){
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    console.error("你所输入的参数不是一个对象");
    return;
  }

  // 判断调用的时候基准路径有没有加上去
  if (!config.url) {
    console.error("URL不能为空！");
    return;
  }
  const reg = /^http/;
  if (!reg.test(config.url)) {
    config.url = request.defaults.baseURL + config.url;
  }
  return new Promise((resolve, reject) => {
    wx: wx.request({
      ...config,
      success(res) {
        resolve(res);
      },
      fail(res) {
        // 请求发生错误时执行的代码
        reject(res);
      },
      complete(res) {
        // 这是请求之后都会执行的代码
        if (typeof request.errors === "function") {
          request.errors(res);
        }
      }
    })
  })
}

// 设置基准默认路径
request.defaults = {
  baseURL: "",
}
// 用来缓存拦截器的函数
request.errors = null;

// 配置错误拦截
request.onError = (callback) => {
  request.errors = callback;
}
export default request;