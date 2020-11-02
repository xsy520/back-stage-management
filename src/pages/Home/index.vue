<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200">
        <h1 class="logo"></h1>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :router="true"
          :collapse="isCollapse"
        >
          <qf-sub-menu :sideMenu="menuList"></qf-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 顶部栏 -->
      <el-container>
        <el-header>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <i
                  :class="[
                    'iconfont',
                    isCollapse ? 'icon-fold-right' : 'icon-shouqi'
                  ]"
                  @click="isCollapse = !isCollapse"
                ></i>
              </div>
            </el-col>
            <el-col :span="6"
              ><div class="grid-content bg-purple-light">
                <b>后台管理系统</b>
              </div></el-col
            >
            <el-col :span="6">
              <div class="grid-content bg-purple right">
                <div class="demo-basic--circle">
                  <el-avatar
                    :size="40"
                    fit="fit"
                    src="https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1689053532,4230915864&fm=26&gp=0.jpg"
                  ></el-avatar>

                  <span style="color:#e9eef3 ;fontWeight:600"
                    >欢迎您&nbsp;：</span
                  >
                  <b class="nickname">{{ userInfo.nickname }}</b>
                  <span class="quit" @click="quit">退出</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主体部分-->
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Welcome' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item
              :to="{ path: crumb.path }"
              v-for="crumb in crumbs"
              :key="crumb.id"
            >
              {{ crumb.meta.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLoginLog } from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapState(["userInfo", "menuList", "crumbs"])
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    quit() {
      //退出登入
      //1.清除token和userInfo
      //2.跳转到登入页

      localStorage.removeItem("2005-token");
      localStorage.removeItem("wf-userInfo");
      this.$router.push("/login");
      //刷新页面
      window.location.reload();
    }
  }
};
</script>
<style scoped>
.el-aside .logo {
  height: 60px;
  background: #5635df;
  background-image: url("../../imgs/logo.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.iconfont {
  color: blue;
}
/* .bg-purple-light {
  margin-left: 200px;
} */
.nickname {
  margin: 0 5px;
  color: #e9eef3;
}
.bg-purple-light {
  color: #e9eef3;
}
.icon-fold-right,
.icon-shouqi {
  font-size: 20px;
  color: #e9eef3;
  cursor: pointer;
  position: absolute;
  left: 5px;
}
.quit {
  cursor: pointer;
  color: #e9eef3;
  font-weight: 600;
}
.el-avatar {
  vertical-align: middle;
  margin-right: 10px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-header {
  background: blue;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.right {
  position: absolute;
  right: 20px;
}

 .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .grid-content {
    border-radius: 4px;
    /* min-height: 36px; */
  }
</style>


