import { IUSerState } from './index.d'
import { Module } from 'vuex';
import { IRootState } from '../../index.d';

export const state: IUSerState = {
  isLogin: false,
  id: 0,
  username: null,
};

const getters = {
}
const actions = {
}
const mutations = {
}

const namespaced: boolean = true;

export const user: Module<IUSerState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
export default user;
