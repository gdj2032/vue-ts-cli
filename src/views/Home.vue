<template>
  <div class="home">
    <HelloWorld msg="aaaaa" />
    <button @click="increment">加1</button>
    <div>{{$store.state.count}}</div>
  </div>
</template>

<script>
export const RoutePath = '/home';
import { shopService } from "service";

export default {
  name: "home",
  components: {
    HelloWorld
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
