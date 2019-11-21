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
        show-icon
        :closable="false"
      ></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="addParamsList"
            expand-trigger="hover"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染参数标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加参数的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="changeParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染参数标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加参数的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>            
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="changeParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="changeDialog"
      width="50%"
      @close="changeDialogClosed"
    >
      <el-form
        :model="changeForm"
        :rules="changeFormRules"
        ref="changeFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="changeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  返回的商品分类数据列表
      addParamsList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 默认选中的页签
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制添加属性对话框的显示和隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 修改参数的数据表单对象
      changeForm: {
        attr_name: ''
      },
      // 添加参数的表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, meaasge: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改参数的表单验证规则
      changeFormRules: {
        attr_name: [
          { required: true, meaasge: '请输入参数名称', trigger: 'blur' }
        ]
      },

      // 控制修改参数对话框的显示和隐藏
      changeDialog: false
    }
  },
  created() {
    this.getParamsList()
  },
  methods: {
    async getParamsList() {
      // console.log(this.$http.get('categories'));
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.addParamsList = res.data
      // console.log(this.addParamsList);
    },
    // 级联选择框选中项发生变化会触发这个函数
    handleChange() {
      this.getparamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getparamsData()
    },
    // 获取参数列表
    async getparamsData() {
      // console.log(this.selectedCateKeys)
      // this.selectedCateKeys.length !== 3证明选中的不是三级分类，把级联选择框中的数据清空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选中的是三级分类后  根据所选择分类的id 和当前所处的面板 获取对应的请求参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      console.log(res.data)

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 表单关闭事件 重置
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        return this.$message.success('添加成功')
      })
      this.addDialogVisible = false
      this.getparamsData()
    },
    // 根据id删除参数
    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirm);
      // console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getparamsData()
    },
    // 点击修改按钮 根据id获取参数信息
    async changeParams(attr_id) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.changeForm = res.data
      // console.log(this.changeForm); ok
      this.changeDialog = true
    },
    // 点击确定修改按钮
    async removeParams() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.changeForm.attr_id}`,
        {
          attr_name: this.changeForm.attr_name,
          attr_sel: this.activeName
          // params{
          //   {
          //     attr_name:this.changeForm.attr_name,
          //     attr_sel:this.activeName
          //   }
          // }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      // console.log(res.data);

      this.changeForm.attr_name = res.data
      this.$message.success('修改成功')
      this.getparamsData()
      this.changeDialog = false
    },
    // 修改参数表单重置事件
    changeDialogClosed() {
      this.$refs.changeFormRef.resetFields()
    },
    // 添加参数文本框焦点离开 或 按下enter键触发事件
    async handleInputConfirm(row) {
      // 输入内容为空
      if(row.inputValue.trim().length === 0){
      row.inputValue = ''
      row.inputVisible = false
      return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发送请求吧添加的参数保存到数据库中
       const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals:row.attr_vals.join('')
      })
      if(res.meta.status !== 200){
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')

    },
    // 点击参加参数按钮事件
    showInput(row) {
      // 这个要放在this.$nextTick前面，否则this.$nextTick不起作用
      row.inputVisible = true
      // 切换为文本框是自动获取焦点  this.$nextTick这个事件会在页面被重新渲染时触发
      this.$nextTick(_ => {
        // this.$refs.saveTagInput.$refs.input 获取到这个input框
        this.$refs.saveTagInput.$refs.input.focus()
      });
      
      row.inputValue = ''
    },
    // 删除参数
    async deleteClose(i,row){
      
       const confirmResult =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        row.attr_vals.splice(i,1)
        // 发送请求保留更改
         const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals:row.attr_vals.join('')
      })
        this.getparamsData()
    }
  },

  // 计算属性
  computed: {
    //  如果tab面板上的按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算添加属性对话框的表头信息
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 10px;
}
.input-new-tag {
  width: 130px;
}
</style>
