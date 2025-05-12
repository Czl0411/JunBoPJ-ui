<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!-- 折叠控制按钮 -->
    <el-aside 
      :width="isCollapsed ? '64px' : '200px'" 
      style="background-color: #001529; transition: width 0.3s ease"
    >
      <!-- 折叠状态下显示简化菜单 -->
      <div class="menu-toggle" @click="isCollapsed = !isCollapsed">
        <i class="el-icon-s-fold" v-show="!isCollapsed">骏伯云天</i>
        <i class="el-icon-s-unfold" v-show="isCollapsed"></i>
      </div>
      
      <el-menu 
        :default-openeds="['1', '3']" 
        :collapse="isCollapsed" 
        :collapse-width="64"
        background-color="#001529" 
        text-color="#fff" 
        active-text-color="#1890ff" 
        @select="handleMenuSelect"
      >
        <!-- 菜单内容保持不变，折叠功能由Element UI自动处理 -->
        <el-submenu index="1">
          <template #title><i class="el-icon-menu"></i><span v-show="!isCollapsed">头条</span></template>
          <el-menu-item-group>
            <el-menu-item index="1-1"><span v-show="!isCollapsed">策略管理</span></el-menu-item>
            <el-menu-item index="1-2"><span v-show="!isCollapsed">账户管理</span></el-menu-item>
            <el-menu-item index="1-3"><span v-show="!isCollapsed">广告管理</span></el-menu-item>
            <el-menu-item index="1-4"><span v-show="!isCollapsed">渠道号</span></el-menu-item>
            <el-menu-item index="1-5"><span v-show="!isCollapsed">监控工具</span></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template #title><i class="el-icon-menu"></i><span v-show="!isCollapsed">广点通</span></template>
        </el-submenu>
        <el-submenu index="3">
          <template #title><i class="el-icon-menu"></i><span v-show="!isCollapsed">快手</span></template>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; position: relative">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/" style="float: left;  padding: 10px">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 右上角功能区保持不变 -->
        <el-dropdown @command="handleLogout" trigger="click">
          <i class="el-icon-setting" style="margin-right: 15px;"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">查看</el-dropdown-item>
              <el-dropdown-item  command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{ user_name }}</span>
      </el-header>

      <el-main style="margin-left: 20px">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  color: rgb(15, 14, 14);
  line-height: 60px;
  position: relative; /* 用于定位折叠按钮 */
}

.el-aside {
  background-color: #001529;
  color: white;
  position: relative;
}

/* 折叠控制按钮样式 */
.menu-toggle {
  text-align: center;
  padding: 10px;
  cursor: pointer;
  color: white;
}

/* 内容区域边距调整 */
.el-main {
  transition: margin-left 0.3s ease;
}
</style>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapsed: false, // 控制折叠状态
      breadcrumbList: [],
      // 媒体列表
      mediaList: [],
      user_name: ''
    };
  },
  created() {
    this.user_name = localStorage.getItem('user_name');
  },
  methods: {
    handleLogout(command) {
      if(command=="b"){
        console.log('handleLogout 方法被调用');
      // 清理缓存
      localStorage.clear();
      // 刷新页面
      location.reload();
      }
      
    },
    handleMenuSelect(key, keyPath) {
      this.breadcrumbList = keyPath.map(k => {
        switch (k) {
          case '1': return '头条';
          case '2': return '广点通';
          case '3': return '快手';
          case '1-1': return '策略管理';
          case '1-2': return '账户管理';
          case '1-3': return '广告管理';
          case '1-4': return '渠道号';
          case '1-5': return '监控工具';
          default: return '';
        }
      }).filter(item => item); // 过滤无效项

      // 根据菜单项的 index 进行路由跳转
      switch (key) {
        case '1-1':
          this.$router.push({ name: 'Strategy' });
          break;
        case '1-2':
          this.$router.push({ name: 'Account' });
          break;
        case '1-3':
          this.$router.push({ name: 'Ad' });
          break;
        case '1-4':
          this.$router.push({ name: 'Channel' });
          break;
        case '1-5':
          this.$router.push({ name: 'Toutiao' });
          break;
        default:
          break;
      }
    }
  }
};
</script>