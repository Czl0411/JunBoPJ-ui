<template>
  <div class="container">
    <div class="filter-section">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="margin-right: 10px;"
      ></el-date-picker>
      <el-button @click="fetchData" type="primary">查询</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px">
      <el-table-column prop="accountId" label="账户ID" min-width="120"></el-table-column>
      <el-table-column prop="accountName" label="账户名称" min-width="150"></el-table-column>
      <!-- 按实际数据补充其他列，如： -->
      <el-table-column prop="impression" label="展现量" min-width="100"></el-table-column>
      <el-table-column prop="click" label="点击量" min-width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name:"Account",
  data() {
    return {
      dateRange: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      tableData: [] // 后续通过接口获取数据填充
    };
  },
  methods: {
    fetchData() {
      // 模拟获取数据，实际替换为接口调用
      this.tableData = [
        { accountId: '1', accountName: '账户1', impression: '1000', click: '50' },
        // 补充更多数据行
      ];
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100vh; /* 占满视口高度 */
}
.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>