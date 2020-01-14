import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import createPersistedState from "vuex-persistedstate"
import createLogger from 'vuex/dist/logger'
import { user } from './modules'
import { IRootState } from './index.d'

// 判断环境 vuex提示生产环境中不使用
const isProduction = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  plugins: isProduction ? [createPersistedState()] : [createPersistedState(), createLogger()],
  state: {
      count: 0,
  },
  mutations: {
    increment (state) {
      state.count++
    },
  },
  modules: {
      user
  }
};

export default new Vuex.Store(store)
