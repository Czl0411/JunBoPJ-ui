<template>
  <div class="policy-management">
    <!-- 搜索过滤栏，使用 el-form 包裹 -->
    <el-row type="flex" justify="space-between" align="top">
      <el-col :span="22">
        <el-form
          :inline="true"
          class="filter-row"
          :model="filter"
          ref="filterForm"
        >
          <el-form-item label="策略">
            <!-- 修改为字符串类型 -->
            <el-select
              filterable
              size="mini"
              v-model="filter.strategy_ids"
              clearable
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in strategynameList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户">
            <el-select
              filterable
              clearable
              size="mini"
              v-model="filter.advertiser_ids"
              multiple
              collapse-tags
              style="margin-left: 20px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in advertiserList"
                :key="item.advertiser_id"
                :label="item.advertiser_name"
                :value="item.advertiser_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="showBatchInput">批量</el-button>
          </el-form-item>
          <el-form-item v-show="isBatchInputVisible">
            <el-input
              type="textarea"
              v-model="batchInput"
              placeholder="请换行输入账户 ID"
              :rows="3"
            ></el-input>
            <el-button size="mini" @click="handleBatchConfirm">确定</el-button>
            <el-button size="mini" @click="hideBatchInput">取消</el-button>
          </el-form-item>
          <el-form-item label="策略状态">
            <el-select
              v-model="filter.strategy_status"
              size="mini"
              placeholder="策略状态"
            >
              <el-option label="全部" value="2"></el-option>
              <el-option label="开启" value="1"></el-option>
              <el-option label="关闭" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleSearch"
              >搜索</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="handleReset" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-select
          v-model="selectAppid"
          @change="resetAppid"
          size="mini"
          placeholder=""
        >
          <el-option
            v-for="item in appidList"
            :key="item.app_id"
            :label="item.app_name"
            :value="item.app_id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- 数据表格（单元格宽度自适应） -->
    <el-table
      v-loading="isLoading"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :data="currentPolicyList"
      @selection-change="handleSummary"
      style="width: 100%; margin-top: 10px"
      border
      stripe
      header-align="center"
      align="left"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- 固定选择列宽度 -->
      <el-table-column prop="is_open" label="状态" align="left">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_open"
            :active-value="true"
            :inactive-value="false"
            active-color="#409EFF"
            inactive-color="#C0CCDA"
            size="mini"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="策略名称"
        align="left"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column label="操作" width="120" align="center">
        <!-- 固定操作列宽度 -->
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: #409eff"
            >分析</el-button
          >
          <el-button size="mini" type="text" style="color: #409eff" @click="goToTemplate(scope.row)">配置</el-button
          >
          <el-button size="mini" type="text" style="color: #409eff"
            >复制</el-button
          >
        </template>
      </el-table-column>
      <!-- 自适应 -->
      <el-table-column
        prop="stat_cost"
        sortable
        label="消耗"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        prop="show_cnt"
        sortable
        label="展示数"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="cpm_platform"
        label="平均千次展现费用"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="click_cnt"
        label="点击数"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="click_start_cnt"
        label="点击率"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="cpc_platform"
        label="平均点击单价"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="convert_cnt"
        label="转化数"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="conversion_rate"
        label="转化率"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
      <el-table-column
        sortable
        prop="conversion_cost"
        label="平均转化成本"
        align="right"
      ></el-table-column>
      <!-- 自适应 -->
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAppid } from "@/api/user";
import { getStrategy, Getadvertiser, getstrategyname } from "@/api/Strategy";
import { getTimeRange } from "@/utils/index";

export default {
  name: "Strategy",
  data() {
    return {
      total:20,
      isBatchInputVisible: false,
      batchInput: "",
      isLoading: false,
      // 产品列表
      appidList: [],
      // 选择的appid
      selectAppid: "",
      filter: {
        // 修改为字符串类型
        strategy_ids: [],
        advertiser_ids: [],
        strategy_status: "2",
        page: 1,
        page_size: 20,
      },
      // 获取的表格数据
      currentPolicyList: [],
      // 查询策略下拉数据
      advertiserList: [],
      strategynameList: [],
      currentPage: 1,
      pageSize: 20,
    };
  },
  created() {
    // 获取产品id
    this.getappid();
  },
  mounted() {},
  methods: {
    // 获取产品id
    async getappid() {
      try {
        this.isLoading = true;
        const response = await getAppid();
        if (response.code === 0) {
          this.appidList = response.data;
          this.selectAppid = response.data[0].app_id;
          // 获取策略列表
          await this.getStrategyList();
          await this.getAdvertiserList();
          await this.getstrategynameList();
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // 获取策略下拉列表
    async getstrategynameList() {
      const app_id = this.selectAppid;
      try {
        const response = await getstrategyname({
          app_id,
        });
        if (response.code === 0) {
          this.strategynameList = response.data.list;
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },
    // 获取策略下拉列表
    async getAdvertiserList() {
      const app_id = this.selectAppid;
      try {
        const response = await Getadvertiser({
          app_id,
          type: "OPERATE",
        });
        if (response.code === 0) {
          this.advertiserList = response.data;
          localStorage.setItem('adv_idlist', JSON.stringify(this.advertiserList))
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },
    // 获取策略列表
    async getStrategyList() {
      this.isLoading = true;
      const [start_date, end_date] = getTimeRange();
      const app_id = this.selectAppid;
      try {
        const response = await getStrategy({
          ...this.filter,
          app_id,
          start_date,
          end_date,
          page: this.currentPage,
          page_size: this.pageSize,
        });
        if (response.code === 0) {
          this.currentPolicyList = response.data.list;
          this.total=response.data.count
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
    },
    resetAppid() {
      this.getAdvertiserList();
      this.getstrategynameList();
      this.handleReset();
    },
    handleSearch() {
      this.currentPage = 1;
      this.getStrategyList();
    },
    goToTemplate(row) {
      let that=this
      // 这里可以传递必要的参数，例如策略 ID
      this.$router.push({ name: 'Template', query: { strategyId: row.id ,Appid:that.selectAppid} });
    },
    handleReset() {
      this.filter = {
        strategy_ids: [],
        advertiser_ids: [],
        strategy_status: "2",
        page: 1,
        page_size: 20, // 关键：保持页大小一致
      };
      (this.isBatchInputVisible = false),
        (this.batchInput = ""),
        this.$refs.filterForm.resetFields();
      this.currentPage = 1;
      this.getStrategyList(); // 必须调用，否则表格不刷新
    },
    handleSummary(param) {},
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.getStrategyList();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getStrategyList();
    },
    showBatchInput() {
      this.isBatchInputVisible = true;
    },
    hideBatchInput() {
      this.isBatchInputVisible = false;
      this.batchInput = "";
    },
    handleBatchConfirm() {
      const inputIds = this.batchInput.split("\n").map((id) => id.trim());
      const matchedIds = this.advertiserList
        .filter((item) => inputIds.includes(item.advertiser_id + ""))
        .map((item) => item.advertiser_id);
      this.filter.advertiser_ids = matchedIds;
      this.isBatchInputVisible = false;
      this.batchInput = "";
      this.handleSearch();
    },
  },
};
</script>

<style scoped>
.policy-management {
  padding: 10px;
  background-color: #fff;
  position: relative;
}

.filter-row {
  margin-bottom: 10px;
}

.action-buttons-row {
  margin-bottom: 10px;
}

.el-table {
  font-size: 12px;
  border-color: #e4e7ed;
}

.el-table__header {
  background-color: #f5f7fa;
  color: #606266;
}

.el-table__row--hover {
  background-color: #f5f7fa;
}

.el-table__summary {
  background-color: #f5f7fa;
  color: #606266;
}

.el-table__summary td {
  border-top: 1px solid #e4e7ed;
}

.el-switch--mini.is-active .el-switch__core {
  background-color: #409eff;
  border-color: #409eff;
}

.pagination-container {
  position: absolute;
  right: 10px;
  bottom: -50px;
}
</style>
