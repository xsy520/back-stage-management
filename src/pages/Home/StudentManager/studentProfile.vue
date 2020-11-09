<template>
  <div class="stu">
    <h1>学生详情信息</h1>
    <table :data="stuList" class="tb">
      <tr class="tr">
        <td>头像</td>
        <td><img :src="stuList.headimgurl" alt="" /></td>
      </tr>
      <tr>
        <td>姓名</td>
        <td>{{ stuList.name }}</td>
      </tr>
      <tr>
        <td>年龄</td>
        <td>{{ stuList.age }}</td>
      </tr>
      <tr>
        <td>班级</td>
        <td>{{ stuList.class }}</td>
      </tr>
      <tr>
        <td>城市</td>
        <td>{{ stuList.city }}</td>
      </tr>
      <tr>
        <td>项目地址</td>
        <td>{{ stuList.productUrl }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import { getStuList } from "@/api";
export default {
  data() {
    return {
      stuList: []
    };
  },
  mounted() {
    getStuList().then(res => {
      let a = res.data.data;
      let b = this.$route.params.id;
      a.forEach(item => {
        if (item._id === b) {
          this.stuList = item;
          console.log(item);
        }
      });
    });
  }
};
</script>
<style scoped>
.stu h1{
  line-height: 70px;
}
.tb,.tr,td{
border:1px solid #000
}

td img{
 width: 50px;
 height: 50px;
 position: relative;
 top: 18px;
}
</style>