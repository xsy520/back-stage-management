import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../pages/Login"
import dynamicRoutes from "./../router/dynamicRoutes"
Vue.use(VueRouter);
//解决路由导航到统一路径重复报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  ...dynamicRoutes
];
// console.log(routes);//打印了三个一级路径
const router = new VueRouter({
  routes
});

export default router;
