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
/**
 * 
 * @param {Object} _this 一个组件实例 
 */
export const getLoginLog = () => axios.get("/getloginlog",{
    // cancelToken: new CancelToken(function (c) {
    //     //c就是一个方法,可以终止请求
    //     _this.cancel = c //相当于给组件实例 添加一个cancel属性
    // })
})

//获取用户菜单

export const getMenuList = () => axios.get("/permission/getMenuList")

//获取验证码
export const getCaptcha = () => axios.get("/users/getCaptcha")

//校验验证码
export const verifyCaptcha = (captcha) => axios.get(`/users/verifyCaptcha?captcha=${captcha}`)

// 获取学员信息
export const getStuList = (params = {}) => {
  console.log(params)
  return axios({
    url: '/students/getstulist',
    params
  })
}

//增加学员信息
export const addStuDetail = (stuDetail) => axios({
    url: '/students/addstu',
    method: 'post',
    data: stuDetail
  })

//删除学员
export const delStu = (sId) => axios.get( `/students/delstu?sId=${sId}`)

//编辑学员信息
export const updateStu = (updated={}) => axios({
    url: '/students/updatestu',
    method: 'post',
    data: updated
  })

// 搜索学员
export const searchStu = (params) => {
  return axios(
    {
      url: '/students/searchstu',
      params
    }
  )
}

// 获取班级 /students/getclasses
export const getClasses = () => axios.get('/students/getclasses')

//获取学员日志
export const getloginlog = () => axios.get('/getloginlog')