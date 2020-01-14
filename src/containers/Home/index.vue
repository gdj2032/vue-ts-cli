<template>
  <div class="home">
    <Headers></Headers>
    <div>主页</div>
    <button @click="increment">加1</button>
    <div>{{$store.state.count}}</div>
  </div>
</template>

<script>
import { shopService } from "@/service";
import Headers from '../Headers'

export default {
  name: "home",
  components: {
    Headers
  },
  data() {
    return {
    };
  },
  methods: {
    increment() {
      this.$store.commit("increment");
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
.home {
}
</style>