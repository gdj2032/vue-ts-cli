import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { APPNAME, FAVICON } from './constants/appInfo'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

document.title = APPNAME;

const link = document.createElement('link');
link.rel = 'shortcut icon';
link.href = FAVICON;
link.type = 'image/png';
//@ts-ignore
document.getElementsByTagName('HEAD').item(0).appendChild(link);
