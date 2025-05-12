<template>
  <div>
    <div class="form-view">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="飞书配置:" name="1">
          <form :model="feishuForm" ref="feishuForm">
            <!-- <el-form-item label="选择飞书通知群聊" prop="chatID"> -->
                <el-select
                @change="getUserList()"
              filterable
              size="mini"
              v-model="feishuForm.chatID"
              placeholder="请选择"
            >
              <el-option
                v-for="item in chatList"
                :key="item.chat_id"
                :label="item.name"
                :value="item.chat_id"
              >
              </el-option>
            </el-select>
            <!-- </el-form-item> -->
            
          </form>
          <div class="selected-users" v-if="chatUserList.length > 0">
  当前群聊成员：{{ chatUserList.map(user => user.name).join('，') }}
</div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse v-model="activeNames">
        <el-collapse-item title="请求参数配置:" name="1">
          <el-form :model=" formData" label-width="120px" ref="form">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model=" formData.username"
                placeholder="请输入用户名"
                size="mini"
                required
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model=" formData.password"
                size="mini"
                type="password"
                placeholder="请输入密码"
                required
              ></el-input>
            </el-form-item>
            <el-form-item label="页码">
              <el-input
                v-model=" formData.page"
                size="mini"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="每页数量">
              <el-select v-model=" formData.pageSize" size="mini">
                <el-option label="10" value="10"></el-option>
                <el-option label="20" value="20"></el-option>
                <el-option label="30" value="30"></el-option>
                <el-option label="40" value="40"></el-option>
                <el-option label="50" value="50"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="定时任务（分钟）">
              <el-input
                v-model=" formData.timer"
                size="mini"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item class="flex gap-2">
                <el-button
                :loading="isLoading"
                type="success"
                @click="updateForm"
                size="mini"
                class="flex-1"
                >保存配置</el-button>
                <el-button
  type="primary"
  @click="toggleTimer"
  size="mini"
  :loading="isStarting"  
  :disabled="isStarting"  
  class="flex-1"
>
  {{ getButtonText() }}
</el-button>
              <el-button
                type="warning"
                @click="openRuleDialog"
                size="mini"
                class="flex-1"
                >设置规则</el-button
              >
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog :visible.sync="ruleDialogVisible" title="设置规则">
      <!-- 添加 ref 和 rules 绑定 -->
      <el-form
        :model="currentRule"
        :rules="ruleFormRules"
        ref="ruleForm"
        label-width="120px"
        class="space-y-4"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="currentRule.name" class="w-full"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="At_user">
          <el-select
            v-model="currentRule.At_user"
            size="mini"
            placeholder="请选择负责人"
            multiple 
          >
            <el-option
              v-for="user in chatUserList"
              :key="user.member_id" 
              :label="user.name" 
              :value="user.member_id" 
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 将 v-for 保留在 <template> 上，但把 :key 移到内部的真实元素 -->
        <template v-for="(condition, index) in currentRule.conditions" >
          <div class="rule-condition-row" >
            <el-form-item label-width="0">
              <el-select
                v-model="condition.field"
                @change="clearConditionValue(condition)"
                class="w-full"
              >
                <el-option label="消耗" value="stat_cost"></el-option>
                <el-option label="转化数" value="convert_cnt"></el-option>
                <el-option label="转化成本" value="conversion_cost"></el-option>
                <el-option label="余额" value="total_balance"></el-option>
                <el-option
                  label="共享钱包余额"
                  value="sharedSubWalletTotalBalance"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0">
              <el-select
                v-model="condition.operator"
                class="w-full"
                @change="handleOperatorChange(condition)"
              >
                <el-option label="大于" value=">"></el-option>
                <el-option label="大于等于" value=">="></el-option>
                <el-option label="等于" value="="></el-option>
                <el-option label="小于等于" value="<="></el-option>
                <el-option label="小于" value="<"></el-option>
                <el-option
                  v-if="condition.field === 'convert_cnt'"
                  label="介于"
                  value="between"
                ></el-option>
                <el-option
                  v-if="['stat_cost', 'convert_cnt'].includes(condition.field)"
                  label="增幅大于"
                  value="increase>"
                ></el-option>
                <el-option
                  v-if="['stat_cost', 'convert_cnt'].includes(condition.field)"
                  label="增幅大于等于"
                  value="increase>="
                ></el-option>
                <el-option
                  v-if="condition.field === 'conversion_cost'"
                  label="增幅大于"
                  value="increase>"
                ></el-option>
                <el-option
                  v-if="condition.field === 'conversion_cost'"
                  label="增幅大于等于"
                  value="increase>="
                ></el-option>
                <el-option
                  v-if="condition.field === 'conversion_cost'"
                  label="降幅大于"
                  value="decrease>"
                ></el-option>
                <el-option
                  v-if="condition.field === 'conversion_cost'"
                  label="降幅大于等于"
                  value="decrease>="
                ></el-option>
                <el-option
                  v-if="['stat_cost'].includes(condition.field)"
                  label="较昨日上涨大于"
                  value="day_increase>"
                ></el-option>
                <el-option
                  v-if="['stat_cost'].includes(condition.field)"
                  label="较昨日上涨大于等于"
                  value="day_increase>="
                ></el-option>
                <el-option
                  v-if="['stat_cost'].includes(condition.field)"
                  label="较昨日下跌大于"
                  value="day_decrease>"
                ></el-option>
                <el-option
                  v-if="['stat_cost'].includes(condition.field)"
                  label="较昨日下跌大于等于"
                  value="day_decrease>="
                ></el-option>
                <!-- 新增倍数比较选项 -->
                <el-option
                  v-if="condition.field === 'total_balance'"
                  label="小于消耗的倍数"
                  value="less_than_multiple"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="0"
              :prop="'conditions.' + index + '.value'"
              :rules="conditionValueRules"
            >
              <template v-if="condition.operator === 'between'">
                <div class="flex gap-2">
                  <el-input
                    v-model="condition.valueRange.start"
                    @blur="formatConditionValue(condition, 'start')"
                    placeholder="起始值"
                    class="w-full"
                  ></el-input>
                  <el-input
                    v-model="condition.valueRange.end"
                    @blur="formatConditionValue(condition, 'end')"
                    placeholder="结束值"
                    class="w-full"
                  ></el-input>
                </div>
              </template>
              <el-input
                v-else
                v-model="condition.value"
                @blur="formatConditionValue(condition, 'value')"
                class="w-full"
              ></el-input>
            </el-form-item>
            <el-button
              style="height: 30px; margin-top: 5px"
              v-if="index > 0"
              type="danger"
              size="mini"
              @click="removeCondition(index)"
              >删除</el-button
            >
          </div>
        </template>
        <div class="add-condition-button">
          <el-button type="primary" size="mini" @click="addCondition"
            >新增条件</el-button
          >
        </div>
        <el-form-item label="规则触发时间区间(小时)" label-width="180px">
          <el-select v-model="currentRule.beginHour">
            <el-option
              v-for="hour in hours"
              :key="hour"
              :label="hour"
              :value="hour"
            ></el-option>
          </el-select>
          <span class="mx-2">-</span>
          <el-select v-model="currentRule.endHour">
            <el-option
              v-for="hour in hours"
              :key="hour"
              :label="hour"
              :value="hour"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer flex justify-end gap-2">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 规则列表 -->
    <div class="mt-8">
      <h2 style="float: left">规则列表</h2>
      <el-table :data="rules" stripe class="w-full">
        <el-table-column label="规则编号" prop="id"></el-table-column>
        <el-table-column label="负责人">
          <template #default="scope">
            <div v-if="scope.row.At_user.length > 0">
              <span v-for="memberId in scope.row.At_user" :key="memberId">
                {{ getUserName(memberId) }}
              </span>
            </div>
            <div v-else>
              无
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规则名称" prop="name"></el-table-column>
        <el-table-column label="条件">
          <template #default="scope">
            <div
              v-for="(condition, index) in scope.row.conditions"
              :key="index"
            >
              {{ getLabel(condition.field) }}
              {{ getOperatorLabel(condition.operator) }}
              {{
                condition.operator === "between"
                  ? condition.valueRange.start + "和" + condition.valueRange.end
                  : condition.value
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规则触发时间区间（小时）">
          <template #default="scope">
            {{ scope.row.beginHour }} - {{ scope.row.endHour }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editRule(scope.row)"
              class="mr-2"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteRuleById(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash"; // 顶部引入
import { getTimeRange } from "@/utils/index";
import { Chat,chatUsers,updateFormDate,getFormDate,startTimer, stopTimer, getAllTimers, saveRules, deleteRule, getRulesByUserName } from "@/api/toutiao";
export default {
  name: "Toutiao",
  data() {
    return {
      debouncedStartTimer: null, // 防抖函数引用
      // 启动按钮
      isStarting: false, // 新增：启动加载状态标志
      isLoading: false,
    //   a按钮状态
      timerStatus:0,
      //   折叠
      activeNames: ["1"],
      //   飞书配置
      feishuForm: {
        chatID: "",
      },
    //   群聊列表
      chatList:[],
      chatUserList:[],
      //   请求参数
       formData: {
        username: "",
        password: "",
        advClassifyType: "2",
        page: 1,
        pageSize: "10",
        sortField: "stat_cost",
        sortOrder: "DESC",
        metricFields: [
          "total_balance",
          "stat_cost",
          "convert_cnt",
          "conversion_cost",
          "yes_b2d_cash_cost_rate",
          "yes_dth_cost",
        ],
        dimensions: [
          "followStatus",
          "advId",
          "advName",
          "sharedSubWalletTotalBalance",
        ],
        beginDate: undefined,
        endDate: undefined,
        timer: 10,
      },
      //   规则配置必选项
      ruleFormRules: {
        name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
        beginHour: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endHour: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        At_user: [
          { required: true, message: "请选择负责人", trigger: "change" },
        ],
      },
      //   条件值
      conditionValueRules: [
        { required: true, message: "请输入条件值", trigger: "blur" },
      ],
      // 规则设置弹窗相关数据
      ruleDialogVisible: false,
      //   规则对象
      currentRule: {
        id: null,
        name: "",
        At_user: [],
        conditions: [
          {
            field: "stat_cost",
            operator: ">",
            value: "",
            valueRange: { start: "", end: "" },
          },
        ],
        beginHour: 0,
        endHour: 24,
        chatID: ""
      },
      // 小时列表
      hours: Array.from({ length: 25 }, (_, i) => i),
      // 规则列表
      rules: [],
      lastResponseData: [],
      responseData: [],
      timerId:1
    };
  },
  created() {
    const [startDate, endDate] = getTimeRange();
    this.formData.beginDate = startDate;
    this.formData.endDate = endDate;
  },
  mounted() {
    // 初始化防抖函数（延迟 300ms，可根据需求调整）
    this.debouncedStartTimer = debounce(this.handleStartTimer, 300);
    // 从 localStorage 中读取缓存数据
    const lastResponseData = localStorage.getItem("lastResponseData");
    const responseData = localStorage.getItem("responseData");
    if (lastResponseData) {
      this.lastResponseData = JSON.parse(lastResponseData);
    }
    if (responseData) {
      this.responseData = JSON.parse(responseData);
      this.handleCurrentChange(1);
    }
    // 从后端获取规则配置
    this.getForm();
    this.getChatList();
    this.getAllTimersStatus()
    this.getRulesByUserName();
  },
  beforeDestroy() {
    // 组件销毁时取消防抖，避免内存泄漏
    this.debouncedStartTimer?.cancel();
  },
  methods: {
     // 拆分启动定时器的具体逻辑（独立方法）
     async handleStartTimer() {
      this.isStarting = true; // 开始加载
      try {
        const response = await startTimer({
          timer_id: this.timerId,
          user: localStorage.getItem("user_name"),
          timer: this.formData.timer,
        });
        if (response.code === 0) {
          this.$message({ type: "success", message: response.message });
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isStarting = false; // 加载结束
        this.getAllTimersStatus();
      }
    },
    // 获取负责人名称
    getUserName(memberId) {
      const user = this.chatUserList.find(user => user.member_id === memberId);
      return user ? user.name : "";
    },
    // 定时任务
    async toggleTimer() {
      if (this.timerStatus === 1) {
        // 停止定时器逻辑（保持不变）
        try {
          const response = await stopTimer({
            timer_id: this.timerId,
            user: localStorage.getItem("user_name"),
            timer: this.formData.timer,
          });
          if (response.code === 0) {
            this.$message({ type: "success", message: response.message });
          } else {
            console.error("请求出错:", response.message);
          }
        } catch (error) {
          console.error("请求出错:", error);
        }
        this.getAllTimersStatus();
      } else {
        // 启动定时器时触发防抖函数
        this.debouncedStartTimer();
      }
    },
    // 获取定时任务状态
    async getAllTimersStatus() {
      try {
        const response = await getAllTimers({timer_id:this.timerId, user: localStorage.getItem('user_name') ,timer:this.formData.timer});
        if (response.code === 0) {
            if(response.data){
                this.timerStatus=response.data.status
            }else{
                this.timerStatus=0  
            }
            
          console.log("所有定时器状态:", response.data);
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },
    // 获取配置信息
    async getForm(){
        const chat_id=this.feishuForm.chatID
        try {
        const response = await getFormDate({user:localStorage.getItem('user_name')});
        if (response.code === 0) {
          this.formData=response.data.form
          this.feishuForm.chatID=response.data.chatID
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 获取群聊信息
    async getChatList() {
      try {
        const response = await Chat();
        if (response.code === 0) {
          this.chatList = response.data.items;
          this.getUserList()
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 获取群组用户
    async getUserList(){
      if(this.feishuForm.chatID!=undefined&&this.feishuForm.chatID!=''){
        const chat_id=this.feishuForm.chatID
        try {
        const response = await chatUsers({chat_id:chat_id});
        if (response.code === 0) {
          this.chatUserList = response.data.items;
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
      }
        
    },
    // 更新请求配置
    async updateForm(){
        const data={form:this.formData,user:localStorage.getItem('user_name'),chatID:this.feishuForm.chatID}
        try {
        const response = await updateFormDate(data);
        if (response.code === 0) {
          this.$message({type:'success',message:response.message})
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 补零函数
    padZero(num) {
      return num < 10 ? `0${num}` : num;
    },
    
    // 获取按钮文本
    getButtonText() {
  if (this.isStarting) {
    return "启动中..."; // 新增：处理加载中的状态
  } else if (this.timerStatus === 1) {
    return "停止定时任务";
  } else {
    return "启动定时任务"; // 补充：明确显示完整的按钮名称
  }
},
    // 获取字段标签
    getLabel(field) {
      const checkboxMap = {
        total_balance: "总余额",
        stat_cost: "消耗",
        convert_cnt: "转化数量",
        conversion_cost: "转化成本",
        yes_b2d_cash_cost_rate: "昨日 B2D 现金成本率",
        yes_dth_cost: "昨日当前时段消耗",
        followStatus: "跟进状态",
        advId: "广告 ID",
        advName: "广告名称",
        sharedSubWalletTotalBalance: "共享子钱包总余额",
      };
      return checkboxMap[field];
    },
    // 获取操作符标签
    getOperatorLabel(operator) {
      const operatorMap = {
        ">": "大于",
        ">=": "大于等于",
        "=": "等于",
        "<=": "小于等于",
        "<": "小于",
        between: "介于",
        "increase>": "增幅大于",
        "increase>=": "增幅大于等于",
        "decrease>": "降幅大于",
        "decrease>=": "降幅大于等于",
        less_than_multiple: "小于消耗的倍数",
        "day_increase>": "较昨日上涨大于",
        "day_increase>=": "较昨日上涨大于等于",
        "day_decrease>": "较昨日下跌大于",
        "day_decrease>=": "较昨日下跌大于等于",
      };
      return operatorMap[operator];
    },
    // 处理每页数量变化
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.handleCurrentChange(1);
    },
    // 处理当前页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      const start = (newPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.pagedData = this.responseData
        ? this.responseData.slice(start, end)
        : [];
    },
    // 打开规则设置弹窗
    openRuleDialog() {
      if (!this.feishuForm.chatID) {
        this.$message.warning("请先选择飞书配置的群聊");
        return;
      }
      this.currentRule = {
        chatID: this.feishuForm.chatID,
        id: null,
        name: "",
        conditions: [
          {
            field: "stat_cost",
            operator: ">",
            value: "",
            valueRange: { start: "", end: "" },
          },
        ],
        beginHour: 0,
        endHour: 24,
      };
      this.ruleDialogVisible = true;
    },
    // 从后端获取规则配置
    async getRulesByUserName() {
      const userName = localStorage.getItem('user_name');
      const data = {
        user: userName
      };
      try {
        const response = await getRulesByUserName(data);
        if (response.code === 0) {
          if(response.data){
            this.rules = response.data;
          }else{
            this.rules=[]
          }
          
          // this.$message({ type: 'success', message: '规则列表获取成功' });
        } else {
          console.error("请求出错:", response.message);
          // this.$message.error("规则列表获取失败1");
        }
      } catch (error) {
        console.error('获取规则列表出错:', error);  
      }
    },
    // 保存规则
    async saveRule() {
      const valid = await new Promise((resolve) => {
        this.$refs.ruleForm.validate((valid) => {
          resolve(valid);
        });
      });
      if (valid) {
        if (this.currentRule.id) {
          this.currentRule.chatID = this.feishuForm.chatID;
          // 编辑规则
          const index = this.rules.findIndex(
            (rule) => rule.id === this.currentRule.id
          );
          if (index !== -1) {
            this.rules.splice(index, 1, this.currentRule);
          }
        } else {
          // 新增规则
          this.currentRule.id = Date.now();
          this.rules.push(this.currentRule);
        }
        this.ruleDialogVisible = false;

        // 获取缓存中的 user_name
        const userName = localStorage.getItem('user_name');

        // 构建保存规则的数据
        const data = {
          user: userName,
          rules: this.rules
        };

        // 保存规则到后端
        try {
          const response = await saveRules(data);
          if (response.code === 0) {
            this.$message({ type: 'success', message: '规则保存成功' });
          } else {
            console.error("请求出错:", response.message);
            this.$message.error("规则保存失败");
          }
        } catch (error) {
          console.error('保存规则出错:', error);
          this.$message.error("规则保存出错");
        }
      } else {
        // 验证失败，提示用户
        this.$message.error("请检查表单信息是否完整");
      }
    },
    // 编辑规则
    editRule(rule) {
      this.currentRule = { ...rule,
        chatID: rule.chatID || this.feishuForm.chatID
       };
      this.ruleDialogVisible = true;
      
    },
    // 删除规则
    async deleteRuleById(id) {
      // 获取缓存中的 user_name
      const userName = localStorage.getItem('user_name');

      // 构建删除规则的数据
      const data = {
        user: userName,
        id: id
      };

      // 删除规则
      try {
        const response = await deleteRule(data);
        if (response.code === 0) {
          this.$message({ type: 'success', message: '规则删除成功' });
          // 从前端规则列表中删除规则
          this.rules = this.rules.filter(rule => rule.id !== id);
        } else {
          console.error("请求出错:", response.message);
          this.$message.error("规则删除失败");
        }
      } catch (error) {
        console.error('删除规则出错:', error);
        this.$message.error("规则删除出错");
      }
    },
    // 新增条件
    addCondition() {
      this.currentRule.conditions.push({
        field: "stat_cost",
        operator: ">",
        value: "",
        valueRange: { start: "", end: "" }, // 新增初始化
      });
    },
    // 删除条件
    removeCondition(index) {
      this.currentRule.conditions.splice(index, 1);
    },
    // 格式化规则设置输入值
    formatConditionValue(condition, key) {
      const rawValue =
        condition.operator === "between"
          ? condition.valueRange[key]
          : condition.value;
      if (!rawValue) return;
      if (condition.operator === "less_than_multiple") {
        const input = condition.value.replace(/[^\d.]/g, "");
        const num = parseFloat(input);
        // 强制保留两位小数
        condition.value = isNaN(num) ? "" : num.toFixed(2);
        // 添加自动补全提示
        if (num <= 0) {
          this.$message.warning("倍数必须大于0");
          condition.value = "";
        }
      }
      if (
        [
          "stat_cost",
          "conversion_cost",
          "sharedSubWalletTotalBalance",
        ].includes(condition.field)
      ) {
        const input = rawValue.replace(/[^\d.-]/g, "");
        if (input === "") {
          condition[key] = "";
          return;
        }
        const num = parseFloat(input);
        if (!isNaN(num)) {
          condition[key] = num.toFixed(2);
        } else {
          condition[key] = "";
        }
      } else if (["convert_cnt", "total_balance"].includes(condition.field)) {
        const input = rawValue.replace(/[^\d]/g, "");
        if (input === "") {
          condition[key] = "";
          return;
        }
        const num = parseInt(input);
        if (!isNaN(num)) {
          condition[key] = num;
        } else {
          condition[key] = "";
        }
      }
    },
    // 清空条件值
    clearConditionValue(condition) {
      if (
        [
          "day_increase>",
          "day_increase>=",
          "day_decrease>",
          "day_decrease>=",
        ].includes(condition.operator)
      ) {
        condition.value = ""; // 清空数值输入
        condition.valueRange = { start: "", end: "" }; // 清空区间值
      }
      // 当切换字段时，根据新字段的运算符初始化数据结构
      if (condition.operator === "between") {
        condition.valueRange = condition.valueRange || { start: "", end: "" };
      } else {
        condition.value = "";
      }
    },
    // 验证数字输入
    validateNumber(value, defaultValue) {
      let num = parseInt(value);
      if (isNaN(num) || num <= 0) {
        return defaultValue;
      }
      return num;
    },
    
    // 获取字段值
    getFieldValues(item, field) {
      let fieldValue;
      let lastFieldValue;
      if (
        [
          "stat_cost",
          "conversion_cost",
          "total_balance",
          "sharedSubWalletTotalBalance",
        ].includes(field)
      ) {
        // 去除逗号并转换为浮点数
        fieldValue = parseFloat(
          (
            item.metrics.find((m) => m.field === field)?.value || item[field]
          ).replace(/,/g, "")
        );
        if (this.lastResponseData) {
          const lastItem = this.lastResponseData.find(
            (last) => last.advId === item.advId
          );
          lastFieldValue = lastItem
            ? parseFloat(
                (
                  lastItem.metrics.find((m) => m.field === field)?.value ||
                  lastItem[field]
                ).replace(/,/g, "")
              )
            : 0;
        }
      } else if (field === "convert_cnt") {
        fieldValue = parseInt(
          item.metrics.find((m) => m.field === field)?.value || item[field]
        );
        if (this.lastResponseData) {
          const lastItem = this.lastResponseData.find(
            (last) => last.advId === item.advId
          );
          lastFieldValue = lastItem
            ? parseInt(
                lastItem.metrics.find((m) => m.field === field)?.value ||
                  lastItem[field]
              )
            : 0;
        }
      }
      return { fieldValue, lastFieldValue };
    },
    handleOperatorChange(condition) {
      if (condition.operator === "between") {
        condition.valueRange = condition.valueRange || { start: "", end: "" };
        condition.value = ""; // 清空单值
      } else {
        condition.value = condition.value || "";
        condition.valueRange = { start: "", end: "" }; // 清空范围值
      }
    },
    async autoSaveConfig() {
    try {
      const data = {
        form: this.formData,
        user: localStorage.getItem('user_name'),
        chatID: this.feishuForm.chatID
      }
      
      const response = await updateFormDate(data)
      if (response.code === 0) {
        this.$message.success('配置已自动保存')
      }
    } catch (error) {
      console.error('自动保存失败:', error)
    }
  }
  },
  watch: {
  
},
};
</script>

<style scoped>
.form-view {
  width: 100%;
  display: flex;
  justify-content: start;
  /* align-items: center; */
  > div {
    /* border: 1px solid black; */
    width: 45%;
    margin-right: 40px;
    > h1 {
      float: left;
    }
  }
}
.rule-condition-row {
  display: flex;
  margin-left: 40px;
  justify-content: start;
}
.add-condition-button {
  margin-bottom: 20px;
}
</style>
