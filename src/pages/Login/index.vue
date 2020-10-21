<template>
  <div class="bg">
    <div class="left"></div>
    <div class="login-page">
      <div class="parent">
        <h1>学生管理系统</h1>
        <!-- ref标记引用 -->
        <el-form
          :model="loginFrom"
          status-icon
          :rules="rules"
          ref="loginFrom"
          label-width="100px"
          class="demo-loginFrom"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="loginFrom.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="loginFrom.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginFrom')"
              >提交</el-button
            >
            <!-- <el-button @click="resetForm('loginFrom')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </div>

      <video
        src="./../../video/bg.mp4"
        class="video-bg"
        muted
        autoplay
        loop
        preload="auto"
      ></video>
    </div>
  </div>
</template>
<script>
/**
  登入逻辑实现
  1、收集用户输入的username&password传递给后端
  2、登入通过之后，将后端返回的token存到本地，跳转到主页
  3、每次请求的时候，携带token到请求头authorization
  4、展示token校验正确的数据
  5、校验不通过，跳转至登入页
 */
import { login } from "@/api";
import {mapMutations} from "vuex"
export default {
  data() {
    //jsDoc的注释
    /**
     * @param {Object} rule 就是一个表单验证对象
     * @param {String} value  输入的值
     * @param {Function} callback 校验通过不传参数，校验通过传参数
     */
    var validateUsername = (rule, value, callback) => {
      console.log(rule);
      console.log(value); //输入的值
      //正则
      //  var user = /^[a-zA-Z]\w{3,15}$/;
      if (!value) {
        callback("请输入用户名");
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        callback("请输入密码");
      } else {
        callback();
      }
    };
    return {
      loginFrom: {
        username: "",
        password: ""
      },
      rules: {
        //validator 传入校验的函数  trigger触发的条件
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    //先本地校验通过之后再去服务器校验
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          //代表本地校验通过
          //打开加载动画
          const loading = this.$loading({
            lock: true,
            text: "页面加载中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let { username, password } = this.loginFrom; //解构
          // console.log(username,password);
          login(username, password)
            .then(res => {
              // console.log(res);
              //服务器响应，关闭loading动画
              loading.close();
              if (res.data.state) {
                this.$message.success("登录成功");
                //用户密码正确
                localStorage.setItem("2005-token", res.data.token);
                localStorage.setItem("wf-userInfo", JSON.stringify(res.data.userInfo));
                //更改vuex中的state[“userInfo]的值
                this.SET_USERINFO(res.data.userInfo)
                //跳转到主页
                this.$router.push("/home");
              } else {
                //用户或者密码错误
                this.$message.error("用户名或者密码错误");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
/*表单样式 */
.el-form {
  width: 400px;
}
.video-bg {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  background-size: cover;
  margin: 0 auto;
}
.videocontainer {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -100;
}
.bg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.parent {
  height: 490px;
  width: 400px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  position: absolute;
  right: 150px;
  top: 100px;
  z-index: 100;
  text-align: center;
}
.parent h1 {
  color: #fff;
  margin-top: 100px;
}
.demo-loginFrom .el-button {
  width: 250px;
  background: linear-gradient(90deg, #1596fb, #002dff);
}
.parent .demo-loginFrom {
  position: absolute;
  padding-top: 50px;
  right: 30px;
}
.left {
  width: 50%;
  height: 100%;
  position: absolute;
  opacity: 0.7;
  background-image: url("./../../imgs/bg2.fc58c850.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: 60% 65%;
  z-index: 10;
}
</style>
