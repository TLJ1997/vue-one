import Vue from 'vue'
// import { Button } from 'element-ui'
// // 导入form表单组件
// import {Form,FormItem}from 'element-ui'
// // 导入input框组件
// import {Input} from 'element-ui'
// // 导入弹框提示组件 特殊需要挂载到vue原型上，成为全局组件
// import {Message} from 'element-ui'

import{Button,Form,FormItem,Input,Message} from 'element-ui'
// 注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

 

