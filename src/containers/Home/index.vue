<template>
  <div class="home">
    <Header />
    <div>主页</div>
    <button @click="increment">加1</button>
    <div>{{$store.state.count}}</div>
    <table border="1">
      <tr>
        <th>id</th>
        <th>UID</th>
        <th>名称</th>
        <th>num</th>
        <th>描述</th>
      </tr>
      <tr v-for="item in dataSource" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.userId}}</td>
        <td>{{item.name}}</td>
        <td>{{item.num}}</td>
        <td>{{item.description}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { shopService } from "@/service";
import Header from '../Header'

export default {
  name: "home",
  components: {
    Header
  },
  data() {
    return {
      dataSource: []
    };
  },
  methods: {
    async getShopList() {
      const [err, info] = await shopService.ShopList({ id: 1 });
      console.log("TCL: err, info", err, info);
      this.dataSource = info.data;
    },
    increment() {
      this.$store.commit("increment");
    }
  },
  mounted() {
    this.getShopList();
  }
};
</script>

<style lang="scss">
.home {
}
</style>