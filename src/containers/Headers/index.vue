<template>
  <div class="g-header">
    <div class="h-top">
      <span v-if="isLogin">
        <span class="h-text h-top-username">{{username}}</span>
        <a class="h-text h-top-logout" @click="this.onLogout">登出</a>
        <a class="h-text h-top-logout" @click="this.onUpdate">修改密码</a>
      </span>
      <span v-if="!isLogin">
        <a class="h-text h-top-login" @click="this.onLogin">登录</a>
        <a class="h-text h-top-register" @click="this.onRegister">注册</a>
      </span>
    </div>
  </div>
</template>

<script>
import { PathRoutes } from '../../router'

export default {
  name: "headers",
  data() {
    return {
      isLogin: this.$store.state.user.isLogin,
      username: this.$store.state.user.username
    };
  },
  methods: {
    async onLogout() {
      // const [err, data] = await userService.logout(store.getState().user.id);
      // console.log("TCL: Login -> handleSubmit -> err, data", err, data);
      // if (data && data.code && data.code === 200) {
      //   store.dispatch(updateUser(userInit));
      //   message.success("登出成功");
      //   window.history.go();
      // } else {
      //   message.error(err.message);
      // }
    },
    onLogin() {
      this.$router.push(PathRoutes.login)
    },
    onRegister() {
      this.$router.push(PathRoutes.register)
    },
  },
};
</script>

<style lang='scss'>
.g-header {
  width: 100vw;
  min-width: $min-width;
  height: $header-height;
  text-align: center;
  .h-top {
    height: 24px;
    line-height: 24px;
    background-color: $background-gray;
    .h-top-login {
      color: $gray;
    }
    .h-top-login:hover {
      color: $red;
    }
    .h-top-register {
      color: $red;
    }
  }
  .h-text {
    margin-right: 10px;
  }
}
</style>
