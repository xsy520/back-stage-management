module.exports = {
  lintOnSave: false,
  //配置代理服务器
  devServer:{
    proxy:{
      '/api':{ //正则匹配到这个开头的时候 就用代理
        target:"http://www.chst.vip",//指向的是目标服务器
        changeOrigin:true,
        pathRewrite:{
          "^/api":""
        }
      }
    }
  }
};
