import Vue from 'vue'
// import { Button } from 'element-ui'
// // 导入form表单组件
// import {Form,FormItem}from 'element-ui'
// // 导入input框组件
// import {Input} from 'element-ui'
// // 导入弹框提示组件 特殊需要挂载到vue原型上，成为全局组件
// import {Message} from 'element-ui'

import{
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Alert,
    Cascader,
    Tree,
    Timeline,
    TimelineItem,
    Tabs,
    TabPane,
    Step,
    Steps,
    Upload

} from 'element-ui'
// 注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Upload)



Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

 

