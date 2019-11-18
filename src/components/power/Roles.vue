<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getRolesList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRolesList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色·</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe weith="300px">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="9">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="15">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRoleById()"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="writeRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"

              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form ref="addFormRef" label-width="80px" :model="addForm">
        <el-form-item label="角色id" prop="roleId">
          <el-input v-model="addForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRoles">创建</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="writeDialogVisible" width="50%">
      <!-- 内容主题区 -->
      <el-form ref="editFormRef" label-width="80px" :model="editForm">
        <el-form-item label="角色id" prop="roleId">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="writeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">创建</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showRightDialog"
      width="50%"
      @close="setRightDialogClosed"
    >
    <!-- 树形控件 -->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 控制角色对话框的显示与隐藏
      writeDialogVisible: false,
      // 控制分配权限对话框的显示与隐藏
      showRightDialog: false,
      // 获取到的所有权限的数据
      rightslist:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      } ,
      // 默认选中的节点id值数组
      defkeys:[],
      // 添加角色的数据表单
      addForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 根据id获取角色的数据表单
      editForm: {},
      // 获取角色列表的参数对象 input的输入值
      queryInfo: {
        quert: ''
      }
    }
  },

  // 生命周期函数
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      // 发送请求获取角色信息
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }

      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    // 重置添加角色对话框
    addDialogClosed() {
      // console.log(this.$refs.addFormRef);
      // console.log(123);
      this.$refs.addFormRef.resetFields()
    },
    async getRoles() {
      console.log(123)

      if (this.addForm.roleId == '') {
        alert('请输入角色Id')
        return
      }
      if (this.addForm.roleName == '') {
        alert('请输入角色名称')
        return
      }

      const { data: res } = await this.$http.post('roles', this.addForm)
      if (res.meta.status !== 201) {
        this.$message.error('添加角色失败')
        return
      }
      this.$message.success('添加角色成功')
      this.addDialogVisible = false
      this.getRolesList()
    },
    // 删除角色
    async removeRolesById(id) {
      console.log(id + '12')

      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色,是否继续？',
        '提示',
        {
          conformButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 点击修改按钮
    async writeRole(id) {
      // console.log(id); ok
      this.writeDialogVisible = !this.writeDialogVisible
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.editForm = res.data
    },
    // 确定修改
    async editRoles() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.writeDialogVisible = !this.writeDialogVisible
      this.getRolesList()
      return this.$message.success('修改成功')
    },
     // 删除角色的某个权限
  async removeRoleById() {
    console.log(123)

    const confirmResult = await this.$confirm(
      '此操作将永久删除该权限, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(err => err)
    if (confirmResult !== 'confirm') {
      return this.$message.info('取消了删除')
    }
    alert(123)
  },
  // 分配权限
  async showSetRightDialog(role) {
    // 获取所有权限的数据
    const {data:res} = await this.$http.get('rights/tree')
    if(res.meta.status !== 200){
      return this.$message.error('获取失败')
    }
    this.rightslist = res.data;
    // 递归获取三级节点的id
    this.getLeafkeys(role,this.defkeys)
    this.showRightDialog = true
  },
  // 通过递归的形式，获取角色下所有三级权限的id，并保存在defkeys数组中
  getLeafkeys(node,arr){
    // 如果当前 node 节点不包括children属性，则是三级节点
    if(!node.children) {
      return arr.push(node.id)
    }
    node.children.forEach(item => this.getLeafkeys(item,arr))
  },
  // 分配权限对话框关闭事件
  setRightDialogClosed(){
    this.defkeys = []
  },
  // 分配权限对话框的确定按钮事件
  allotRights(){
    const keys = [
      this.$refs.treeRef.getCheckedkeys(),
      this.$refs.treeRef.getHalfCheckedkeys()
    ]
     const idStr = keys.join(',') 
     this.$http.post('roles/:roleId/rights',{rids:idStr})
  }
  }
 
}
</script>

<style>
.el-tag {
  margin: 6px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
