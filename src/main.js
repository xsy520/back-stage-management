import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/styles/el-reset.css"
import "./assets/styles/base.css"
//导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false;


//路由前置钩子（导航守卫）
// next方向  to 从哪来  from到哪去
router.beforeEach((to, from, next) => {
  //    //用户登入之后，localStorage中有token
  let token = localStorage.getItem("2005-token")
  //  console.log(to);
  if (token) {
    //如果是注册页面或者是登入页面，直接放行
    next()
  }
  else { //没有token
    if (to.path === "/") {
      next()
    } else {
      //访问的不是登录也 就要跳转到登录页
      next({ path: "/" })
    }
  }

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
