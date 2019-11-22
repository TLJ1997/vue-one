import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Right from './components/power/rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import Order from './components/order/Order.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    // redirect 路由重定向
    {path:'/',redirect:'/login'},
    // 用户访问'/login'路由是返回Login组件
    {path:'/login',component:Login},
    {path:'/home',component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Right},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/orders',component:Order},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add}
    ]}
  ]
})
// 挂载路由守卫
router.beforeEach((to, from, next )=>{
  // to将要访问的路径
  // from代表从哪个路径跳转来的
  // next是一个函数，表示放行 next（）放行 next（‘/login’）强制跳转
  if(to.path == '/login') return next();
  // 拿到token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

// // 暴露router路由
export default router