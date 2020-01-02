<template>
  <div class="home">
    <div>主页</div>
    <button @click="increment">加1</button>
    <div>{{$store.state.count}}</div>
  </div>
</template>

<script>
import { shopService } from "../../service";

export default {
  name: "home",
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
    getShopList: async () => {
      const [err, info] = await shopService.ShopList({ id: 1 });
      console.log("TCL: err, info", err, info);
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
  text-align: center
}
</style>