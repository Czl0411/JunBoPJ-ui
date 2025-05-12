<template>
  <div class="container">
    <div class="filter-bar">
      <el-button size="mini">更多筛选</el-button>
      <el-select v-model="account" placeholder="账户" size="mini" style="width: 120px;">
        <el-option label="请选择" value=""></el-option>
      </el-select>
      <el-select v-model="nameId" placeholder="名称ID" size="mini" style="width: 120px;">
        <el-option label="请选择" value=""></el-option>
      </el-select>
      <el-select v-model="selectAccount" placeholder="请选择账户" size="mini" style="width: 150px;">
        <el-option label="请选择" value=""></el-option>
      </el-select>
      <el-button size="mini">批量</el-button>
      <el-select v-model="adStatus" placeholder="广告状态" size="mini" style="width: 120px;">
        <el-option label="投放中" value="running"></el-option>
      </el-select>
      <el-input v-model="adName" placeholder="请输入广告名称" size="mini" style="width: 180px; margin-right: 10px;"></el-input>
      <el-input v-model="adId" placeholder="广告ID" size="mini" style="width: 120px; margin-right: 10px;"></el-input>
      <el-button type="primary" size="mini" @click="search">搜索</el-button>
      <el-button size="mini" @click="reset">重置</el-button>
    </div>
    <div class="table-actions">
      <el-button size="mini" icon="el-icon-view" @click="toggleView"></el-button>
      <el-button size="mini" icon="el-icon-menu" @click="toggleMenu"></el-button>
      <el-button type="primary" size="mini" @click="exportData">导出</el-button>
      <el-button type="primary" size="mini" @click="exportDaily">导出分日</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%; margin-top: 10px;">
      <el-table-column type="selection" width="18"></el-table-column>
      <el-table-column prop="adName" label="广告名称" min-width="120"></el-table-column>
      <el-table-column prop="adId" label="广告ID" min-width="120"></el-table-column>
      <el-table-column prop="accountName" label="账户" min-width="120"></el-table-column>
      <el-table-column prop="adStatusText" label="广告状态" min-width="80"></el-table-column>
      <el-table-column label="操作" min-width="60">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewLog(scope.row)">日志</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="消耗" min-width="80"></el-table-column>
      <el-table-column prop="conversion" label="转化数" min-width="80"></el-table-column>
      <el-table-column prop="budget" label="预算" min-width="80"></el-table-column>
      <el-table-column prop="impression" label="展示数" min-width="80"></el-table-column>
      <el-table-column prop="cpm" label="cpm" min-width="80"></el-table-column>
      <el-table-column prop="clickCount" label="点击数" min-width="80"></el-table-column>
      <el-table-column prop="clickRate" label="点击率" min-width="80"></el-table-column>
      <el-table-column prop="cpc" label="cpc" min-width="80"></el-table-column>
      <el-table-column prop="conversionRate" label="转化率" min-width="80"></el-table-column>
      <el-table-column prop="avgCost" label="平均转化成本" min-width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      nameId: '',
      selectAccount: '',
      adStatus: 'running',
      adName: '',
      adId: '',
      tableData: [
        {
          adName: '0417-快手-流量质检-4s-手动',
          adId: '76480381490234181',
          accountName: 'HLXY-YW-快手-北京快手-06',
          adStatusText: '投放中',
          cost: '712.13',
          conversion: '40',
          budget: '88888.00',
          impression: '28132',
          cpm: '25.31',
          clickCount: '1245',
          clickRate: '4.43%',
          cpc: '0.57',
          conversionRate: '3.21%',
          avgCost: '17.80'
        }
        // 可根据实际需求添加更多数据行
      ]
    };
  },
  methods: {
    search() {
      console.log('执行搜索操作');
    },
    reset() {
      this.account = '',
      this.nameId = '',
      this.selectAccount = '',
      this.adStatus = 'running',
      this.adName = '',
      this.adId = '';
      console.log('执行重置操作');
    },
    viewLog(row) {
      console.log('查看日志', row);
    },
    exportData() {
      console.log('执行导出操作');
    },
    exportDaily() {
      console.log('执行导出分日操作');
    },
    toggleView() {
      console.log('切换视图');
    },
    toggleMenu() {
      console.log('切换菜单');
    }
  }
};
</script>

<style scoped>
.container {
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-bar el-button,
.filter-bar el-select,
.filter-bar el-input {
  margin-right: 10px;
}

.table-actions {
  margin-bottom: 10px;
  text-align: right;
}

.table-actions el-button {
  margin-left: 5px;
}
</style>