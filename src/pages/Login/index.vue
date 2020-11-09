<template>
  <div class="bg">
    <div class="left"></div>
    <div class="login-page">
      <div class="parent">
        <h1>学生管理系统</h1>
        <i
          :class="[
            'jiaobiao',
            'iconfont',
            isWechat ? 'icon-diannaojiaobiao' : 'icon-erweimajiaobiao'
          ]"
          @click="checkoutLoginType"
        ></i>
        <transition>
          <!-- 二维码 -->
          <div class="wechatLogin" v-if="isWechat">
            <div class="scancode">
              <div class="marsk" v-if="isScan">
                <i class="iconfont icon-saomachenggong"></i>
              </div>
              <img src="../../imgs/erwei.png" width="200" alt="" />
            </div>
            <p>请使用微信扫码登入</p>
          </div>
          <!-- ref标记引用 -->
          <el-form
            v-else
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
                @keydown.native.enter="submitForm('loginFrom')"
                v-model="loginFrom.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item label="验证码" prop="captcha">
              <el-input
                type="text"
                v-model="loginFrom.captcha"
                @keydown.native.enter="submitForm('loginFrom')"
                autocomplete="off"
                class="captcha"
              ></el-input>
              <span
                class="captcha-svg"
                v-html="captchaSvg"
                @click="refreshCaptcha"
              >
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginFrom')"
                >提交</el-button
              >
              <!-- <el-button @click="resetForm('loginFrom')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </transition>
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
import { login, getCaptcha, verifyCaptcha, wechatLogin } from "@/api";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import io from "socket.io-client";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    //jsDoc的注释
    /**
     * @param {Object} rule 就是一个表单验证对象
     * @param {String} value  输入的值
     * @param {Function} callback 校验通过不传参数，校验通过传参数
     */
    var validateUsername = (rule, value, callback) => {
      // console.log(rule);
      // console.log(value); //输入的值
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
    //校验验证码
    var validateCaptcha = (rule, value, callback) => {
      if (value.length !== 5) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      isScan: false, // 是否扫码
      isWechat: false,
      captchaSvg: "", //从服务器获取下来的验证码svg结构
      loginFrom: {
        username: "",
        password: "",
        captcha: ""
      },
      rules: {
        //validator 传入校验的函数  trigger触发的条件
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }]
      }
    };
  },

  mounted() {
    this.set_captcha();
  },
  methods: {
    //微信登入
    //点击切换登入方式
    checkoutLoginType() {
      this.isWechat = !this.isWechat;
      if (this.isWechat) {
        // 说明是微信登入
        // 通过socket.io和服务器建立socket连接
        const socket = io("ws://chst.vip");
        const _this = this;
        const r = fetch("/api/users/getScancode")
          .then(body => body.json())
          .then(res => {}); // 展示二维码
        socket.on("connect", function() {
          console.log("连接成功");
          socket.on("scancodeSuccess", data => {
            // 扫码成功事件
            console.log(data);
            console.log(this.isScan);
            if (data.state) {
              _this.isScan = true;
              const wechatCode = data.wechatCode;
              wechatLogin(wechatCode).then(res => {
                if (res.data && res.data.state) {
                  console.log(res);
                  if (data.state) {
                    // 登入成功
                    // 将token保存到loalstorage
                    localStorage.setItem("wf-token", res.data.token);
                    // 将userInfo存到localstorage
                    localStorage.setItem(
                      "wf-userInfo",
                      JSON.stringify(res.data.userInfo)
                    );
                    // 用户按钮
                    localStorage.setItem(
                      "wf-permission-buttons",
                      JSON.stringify(res.data.permission.buttons)
                    );
                    // 将用户信息储存到vuex中
                    _this.$store.commit("SET_USERINFO", res.data.userInfo);
                    // 将用户权限按钮保存在vuex中
                    _this.$store.commit(
                      "SET_PERMISSION_BUTTONS",
                      res.data.permission.buttons
                    );
                    // 页面跳转到欢迎页
                    _this.$router.push("/Welcome");
                  }
                }
              });
            }
          });
        });
        socket.on("getScancode", data => {
          // 切换成功微信登入事件 可以获得二维码
          console.log(data);
        });

        socket.on("wechatLoginSuccess", data => {
          //扫码登入成功
          console.log(data);
          if (data.state) {
            //登入成功
            //将token保存到loalstorage
            localStorage.setItem("wf-token", data.token);
            //将userInfo存到localstorage
            localStorage.setItem("wf-userInfo", JSON.stringify(data.userInfo));
            //页面跳转到欢迎页
            this.$router.push("/Welcome");
          }
        });

        //调用微信登入接口
        wechatLogin().then(res => {
          if (res.data && res.data.state) {
          }
          // console.log(res)
          //可以得到后端返回的二维码
        });
      }
    },
    //刷新验证码
    refreshCaptcha() {
      this.set_captcha();
    },
    //设置验证码
    set_captcha() {
      getCaptcha().then(res => {
        this.captchaSvg = res.data.img;
      });
    },
    ...mapMutations(["SET_USERINFO"]),
    //先本地校验通过之后再去服务器校验

    submitForm(formName) {
      // console.log(this.$refs[formName]);
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //代表本地校验通过
          //先验证验证码是否正确如果正确在发送登入请求
          // console.log(this);
          let verifyRes = await verifyCaptcha(this.loginFrom.captcha);
          if (!verifyRes.data.state) {
            //验证码不正确
            this.$message.error("验证码输入错误,请重新输入");
            this.set_captcha();
            return;
          }

          //打开加载动画
          const loading = this.$loading({
            lock: true,
            text: "页面加载中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          //发送登入请求
          let { username, password } = this.loginFrom; //解构
          login(username, password)
            .then(res => {
              // console.log(res);
              //服务器响应，关闭loading动画
              loading.close();
              if (res.data.state) {
                this.$message.success("登录成功");
                //用户密码正确
                localStorage.setItem("2005-token", res.data.token);
                localStorage.setItem(
                  "wf-userInfo",
                  JSON.stringify(res.data.userInfo)
                );
                localStorage.setItem(
                  "wf-permission-buttons",
                  JSON.stringify(res.data.permission.buttons)
                );
                //更改vuex中的state[“userInfo]的值
                this.SET_USERINFO(res.data.userInfo);
                //跳转到
                this.$router.push("/Welcome");
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
/*角标 */
.marsk i .icon-saomachenggong {
  font-size: 50px;
  color: #26c28f;
  line-height: 200px;
}
.scancode {
  position: relative;
  height: 220px;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave {
  opacity: 1;
}
.v-enter-active,
.v-leave-active {
  transition: all 2s;
}


.parent .wechatLogin {
  width: 100%;
  text-align: center;
  position: absolute;
  color: #fff;
}
.parent .jiaobiao {
  width: 80px;
  height: 80px;
  overflow: hidden;
  position: absolute;
  right: -1px;
  top: -2px;
  font-size: 50px;
  text-align: right;
  color: #e2e2e2;
  cursor: pointer;
}
.wechatLogin .marsk {
  position: absolute;
  width: 200px;
  height: 200px;
  left: 25%;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
}
.wechatLogin img {
  position: absolute;
  top: 5%;
  left: 28%;
}
.wechatLogin p {
  text-align: center;
}

.captcha-svg {
  background: #fff;
  display: inline-block;
  height: 40px;
  width: 140px;
  margin-left: 10px;
  border-radius: 5px;
  padding-bottom: 3px;
  cursor: pointer;
}
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
  /* text-align: center; */
}
.parent h1 {
  color: #fff;
  margin-top: 100px;
  margin-left: 30%;
}
.demo-loginFrom .el-button {
  width: 250px;
  background: linear-gradient(90deg, #1596fb, #002dff);
}
.parent .demo-loginFrom {
  position: absolute;
  padding-top: 50px;
  /* right: 30px; */
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
