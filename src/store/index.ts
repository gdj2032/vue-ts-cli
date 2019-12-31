import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import createLogger from 'vuex/dist/logger'

// 判断环境 vuex提示生产环境中不使用
const isProduction = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: isProduction ? [createPersistedState()] : [createPersistedState(), createLogger()],
  state: {
    count: 0,
  },
  mutations: {
    increment (state) {
      state.count++
    },
  },
  actions: {
  },
  modules: {
  }
})
