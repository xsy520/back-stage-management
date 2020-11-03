<template>
  <div class="welcome">
    <el-table :data="welcomeData" border style="width: 100%">
      <el-table-column prop="username" label="登入账户" align="center" width="180">
      </el-table-column>
      <el-table-column prop="lastLogin.ip" label="上次登入IP" align="center" width="180">
      </el-table-column>
      <el-table-column prop="lastLogin.loginTime" align="center" label="上次时间">
      </el-table-column>
      <el-table-column prop="nowLogin.ip" label="本次登入IP" align="center"> </el-table-column>
      <el-table-column prop="nowLogin.loginTime" label="本次登入时间" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getLoginLog}  from "@/api"
export default {
  data() {
    return {
      welcomeData: []
    };
  },
  created () {
      getLoginLog()
      .then((res)=>{
          if(res.data&& res.data.state){
            this.welcomeData = res.data.data
          }
      })
  }
};
</script>
<style scoped>
.welcome{
    margin-top: 20px;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
}
</style>