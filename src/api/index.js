import axios from "./config"

//登入请求
export const login = (username,password) => axios({
    url:"/users/login",
    method:"post",
    data:{
        username,
        password
    }
})

//获取登录日志

export const getLoginLog = () => axios.get("/getloginlog")