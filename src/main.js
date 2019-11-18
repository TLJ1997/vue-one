// main.js整个项目的入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios包 用于发起请求（发起的第一个请求是登录，看登录按钮的点击事件）
import axios from 'axios'
// 导入vue-table-with-tree-grid插件 用于展示商品分类列表
import TreeTable from 'vue-table-with-tree-grid'
// 处理时间
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 通过axios 请求拦截器为除登录意外的请求添加添加token，保证有获取数据的权限
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  
  // 处理后的请求头
  return config
})

// 把axios挂载到全局
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
new Vue({
  router,
  // 把App根组件渲染到页面中
  render: h => h(App)
}).$mount('#app')
