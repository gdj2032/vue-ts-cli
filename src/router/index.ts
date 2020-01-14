import Vue from 'vue'
import VueRouter from 'vue-router'
import autoImport from './autoImport'
import { Home, Login, Register } from '../containers'
import pageRoutes from '@/views/pageRoutes'

Vue.use(VueRouter)

export const PathRoutes = {
  home: '/home',
  login: '/login',
  register: '/register',
  ...pageRoutes,
}

const routes = [
  {
    path: '/',
    redirect: PathRoutes.home
  },
  {
    path: PathRoutes.login,
    name: 'login',
    component: Login
  },
  {
    path: PathRoutes.register,
    name: 'register',
    component: Register
  },
  {
    path: PathRoutes.home,
    name: 'home',
    component: Home
  },
  ...autoImport(),
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ 'views/About/index.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
