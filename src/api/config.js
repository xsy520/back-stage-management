import axios from "axios";
import router from "../router"

import ElementUI from "element-ui"
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "/api" : "http://www.chst.vip"

import NProgress from 'nprogress'
axios.defaults.withCredentials = true;//允许请求携带认证

//创建请求拦截器可以给每一个请求都携带上想要传递的内容
axios.interceptors.request.use(config => {
    //登录&注册是不需要携带token
    if (config.url == "/users/login") {
        return config
    }else{
        let token = localStorage.getItem("2005-token")
        config.headers['authorization'] = token
        // console.log(config);//config是每一个请求对象
        //放行
        return config
    }
})
//响应拦截
axios.interceptors.response.use(config =>{
   
    // console.log(config);
    let {data} = config
    if(data.code == "1004" || data.code == "10022"){
        //1004的code 这个code是后端定义的状态码
        //在当前的后台api中 1004代表token校验失败，表示错误，并且让页面跳转到登录页
        ElementUI.Message.error("重新登入")
        localStorage.removeItem("wf-token")
        localStorage.removeItem("2005-token")
        router.push("/login")
        window.location.reload()
    }
    return config
})

axios.create({
    timeout: 3000
})
export default axios