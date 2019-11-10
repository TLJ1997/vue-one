<template>
<!--Login.vue是一个单文件组件，由结构，样式，行为三部分组成 -->
  <div class="login_container">
      <div class="login_box">
          <!-- 头像区域 -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt=""> 
        </div>
        <!-- 登陆表单 -->
        <!-- 添加ref属性 loginFormRef表单的实例化对象 -->
        <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
            <!-- 用户名 -->
            <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
      </div>

  </div>

</template>

<script>
import { log } from 'util';
export default {
    data(){
        return {
            // 这是登陆表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            // 表单的验证规则对象
            loginFormRules:{
                username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }  ],
                password:[
                  { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 重置按钮点击事件
        resetLoginForm(){
            // alert(123)
            // 这个方法是从 element中粘贴的
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // 这个方法是从 element中粘贴的 valid返回true或false  表单校验成功是返回true

            this.$refs.loginFormRef.validate(async valid=>{
                // alert(valid)
                if(!valid) return;
                // axios 发送请求  post请求方法 login请求地址 this.logForm请求参数
                const {data: res} =await this.$http.post('login',this.loginForm);
                console.log(res);
                if(res.meta.status !==200) return this.$message.error('登录失败')
                this.$message.success('登陆成功')
                // 把登录成功后的 token(令牌)， 保存到客户端的 sessionStorage 中
                window.sessionStorage.setItem("token",res.data.token);
                // 通过编程式导航跳转到后台页面
                this.$router.push("/home");

                
            });
        }
    }

}
</script>

<style lang="less" scoped>
// scoped vue的指令 控制组件样式生效空间，加上scoped这个样式值在当前组件生效，去掉在全局生效 必须加
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 水品垂直居中对齐
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%)
}
.avatar_box{
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0  10px #ddd;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box
}
</style>>
