<template>
  <div>
       <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
         <el-alert
    title="注意： 只允许为第三级分类设置相关参数！"
    type="warning"
    show-icon :closable= "false">
  </el-alert>
  <span><h4>选择商品分类:</h4></span>
  <el-cascader
    placeholder="试试搜索：指南"
    :options="options"
    filterable
  ></el-cascader>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
         options:[{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]  
         }
         ]}
      
            },
    created() {},
    methods: {}
}
</script>

<style lang="less" scoped>

</style>