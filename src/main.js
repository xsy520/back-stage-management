import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/styles/el-reset.css"
import "./assets/styles/base.css"
//引入iconfont
import "./assets/iconFonts/iconfont.css"
//导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false;

import qfSubMenu from "qf-sub-menu"
Vue.use(qfSubMenu)
//NProgress进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//eventBus
import bus from "./utils/bus"

Vue.prototype.$bus = bus

//引入鉴权方法
import has from "./utils/has"
Vue.prototype.$has = has
//定义全局自定义指令 判断是否具有相对权限
Vue.directive("hasPermission",{
  
  bind(el,binding,VNode){
    let buttons = localStorage.getItem("wf-permission-buttons");
      if( !has(buttons,binding.value)){
        //禁用按钮
        console.log(el.className);//el-button btn el-button--primary
       //先存储class类名  在这个基础上加上is-disabled禁用按钮
       let className = el.className
       el.className = className+" "+"is-disabled"
       el.disabled = true
        // console.log(el);
      }
     
  }
})

//路由前置钩子（导航守卫）
// next方向  to 从哪来  from到哪去
router.beforeEach((to, from, next) => {
  // NProgress.start(); //进度条出现
  NProgress.set(0.8);
  //    //用户登入之后，localStorage中有token
  let token = localStorage.getItem("2005-token") || null;
  //  console.log(to);
  if (token) {
    //如果是注册页面或者是登入页面，直接放行;
    if (store.state.menuList.length == 0) {
      //说明没有用户路由，触发action 获取用户路由
      store.dispatch('FETCH_MENULIST')
        .then(() => {

          //这里要注意，next里面要传参数，即要进入的页面的路由信息，因为next传参后，
          //当前要进入的路由会被禁止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保
          //addRoutes生效了
          next({ path: to.path })

        })
    } else {
      next()
    }
  }
  else { //没有token
    if (to.path === "/login") {
      next()
    } else {
      //访问的不是登录也 就要跳转到登录页
      next({ path: "/login" })
    }
  }

})

//使用路由后置钩子处理面包屑
router.afterEach((to,from)=>{
  // console.log(to);
  let crumblist = to.matched.slice(1)
  // console.log(crumblist);
  store.commit("SET_CRUMBS",crumblist)
  NProgress.done();  //进度条消失
})

//调试
// import "./utils/recursionRoutes"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
