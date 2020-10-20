import axios from "axios";
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "/api" : "http://www.chst.vip"


axios.defaults.withCredentials = true;//允许请求携带认证

//创建请求拦截器可以给每一个请求都携带上想要传递的内容
axios.interceptors.request.use(config => {
    //登录&注册是不需要携带token
    if (config.url == "users/login") {
        return config
    }else{
        let token = localStorage.getItem("2005-token")
        config.headers['authorization'] = token
        console.log(config);//config是每一个请求对象
        //放行
        return config
    }
   

})

axios.create({
    timeout: 3000

})
export default axios