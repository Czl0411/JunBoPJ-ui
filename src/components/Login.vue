<template>
  <div id="login">
    <h1>欢迎使用骏伯云天</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        v-model="username"
        placeholder="Username"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
// 修改导入路径为相对路径
import { Login } from '../api/user.js';
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log('Username:', this.username);
        console.log('Password:', this.password);
        // 发起登录请求
        const response = await Login({
          username: this.username,
          password: this.password
        });
        if (response.code === 0) {
          // 从响应中提取 token 和 tenant_id
          let { token, tenant_id } = response.data;
          // 去除 token 中的 'Bearer ' 前缀
          token = token.replace('Bearer ', ''); 
          // 保存到 localStorage
          localStorage.setItem('user_name',response.data.user_name );
          localStorage.setItem('token', token);
          localStorage.setItem('tenantid', tenant_id)
          localStorage.setItem('version', response.data.manage_version)
          this.$message({type: 'success',message: "登录成功"})
          // 登录成功后跳转到主页
          this.$router.push('/home');
        } else {
          console.error('登录失败:', response.message);
        }
      } catch (error) {
        // 处理登录失败的情况
        console.error('登录请求出错:', error);
      }
    }
  }
};
</script>

<style scoped>
#login {
  text-align: center;
  margin-top: 100px;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 200px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>