import Attendance from "../pages/Home/Attendance"
import Mine from "../pages/Home/Mine"
import Statistics from "../pages/Home/Statistics"
import Users from "../pages/Home/Users"
import Welcome from "../pages/Home/Welcome"
import StudentManager from "../pages/Home/StudentManager"
import studentProduct from "../pages/Home/StudentManager/studentProduct.vue"
import studentDormitory from "../pages/Home/StudentManager/studentDormitory.vue"
import studentProfile from "../pages/Home/StudentManager/studentProfile.vue"
//保证allRoutes是一个符合路由配置规则的数组
const allRoutes = [
    {
       path:"Welcome" ,
       name:"Welcome" ,
       component:Welcome,
       meta:{//储存一些临时的信息  数据缓存区
           name:'管理首页',//菜单名
           icon: 'iconfont icon-shouye',//菜单图标
           fullPath:"/Welcome" //用于跳转
       }
    },
    {
        path:"StudentManager" ,
        name:"StudentManager" ,
        redirect: '/StudentManager/studentProduct',
        component:StudentManager,
        meta:{
            name:'学员管理',
            icon:'iconfont icon-xueyuan',
        },
        children:[
            {
                path:'studentProduct',
                name:'studentProduct',
                component:studentProduct,
                meta:{
                    name:'学员项目管理',
                    icon:'iconfont icon-wode1'
                },
            },
            {
                path:'/StudentManager/studentProfile',
                name:'studentProfile',
                component:studentProfile,
                meta:{
                    name:'学员资料',
                    icon:'iconfont icon-kaoqin2'
                }, 
            },
            {
                path:'/StudentManager/studentDormitory',
                name:'studentDormitory',
                component:studentDormitory,
                meta:{
                    name:'学员宿舍',
                    icon:'iconfont icon-shuju2'
                }, 
            }
        ]
     },
     {
         path:'Attendance',
         name:'Attendance',
         component:Attendance,
         meta:{
             name:"考勤管理",
             icon:'iconfont icon-kaoqin'
         }
     },
     {
         path:"Users",
         name:"Users",
         component:Users,
         meta:{
             name:'用户管理',
             icon:'iconfont icon-yonghu'
         }
     },
     {
        path:"Statistics",
        name:"Statistics",
        component:Statistics,
        meta:{
            name:'数据统计',
            icon:'iconfont icon-shuju1'
        }
     },
     {
        path:"Mine",
        name:"Mine",
        component:Mine,
        meta:{
            name:'我的中心',
            icon:'iconfont icon-wode'
        }
     }
]
export default allRoutes
