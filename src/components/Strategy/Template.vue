<template>
  <div class="container">
    <!-- 顶部返回路由和产品列表下拉选项 -->
    <div class="top-bar">
      <el-button @click="goBack" type="primary" size="mini">返回</el-button>
    </div>

    <!-- 基本信息区域 -->
    <div class="basic-info">
      <div class="info-group">
        <div class="info-item">策略名称：{{ templateInfo.name }}</div>
        <div class="info-item" style="width: 600px;" v-if="advList.length > 0">
          <el-popover trigger="hover" placement="top">
            <p style="width: 400px;"> {{ getAdvName(templateInfo.advertiser_ids) }}</p>
            <div slot="reference" class="popover-trigger">
              <span size="medium">操作账户：{{ getAdvName(templateInfo.advertiser_ids) }}</span>
            </div>
          </el-popover>


        </div>
        <div class="info-item">客户成本：{{ templateInfo.custom_convert_cost }}</div>
        <el-button size="mini" class="new-btn">修改基本信息</el-button>
      </div>
    </div>

    <!-- 搜索与操作按钮区域 -->
    <div class="search-operate">
      <el-input v-model="form.name" size="mini" type="text" placeholder="请输入模板名称" class="search-input" />
      <el-input v-model="form.channel_name" size="mini" type="text" placeholder="请输入渠道号名称" class="search-input" />

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-button size="mini" class="operate-btn el-icon-arrow-down el-icon--right">批量操作</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="bid" :disabled="selectedTemplates.length === 0">批量改价</el-dropdown-item>
          <el-dropdown-item command="packge" :disabled="selectedTemplates.length === 0">批量改定向</el-dropdown-item>
          <el-dropdown-item command="setTime" :disabled="selectedTemplates.length === 0">批量改时段</el-dropdown-item>
          <el-dropdown-item command="img" :disabled="selectedTemplates.length === 0">批量换素材</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button size="mini" class="new-btn">新增搭建模板</el-button> -->
    </div>

    <!-- 表格区域 -->
    <el-table :data="templateList" style="width: 100%; margin-top: 10px" v-loading="loading"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="状态" width="50">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_open"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" class="table-btn">分析</el-button>
          <el-button type="text" class="table-btn">编辑</el-button>
          <el-button type="text" class="table-btn">运行模板</el-button>
        </template>
      </el-table-column>
      <el-table-column label="模板名称" width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p> {{ scope.row.template_name }}</p>
            <div slot="reference" class="name-wrapper">
              <span class="popover-trigger" size="medium">{{ scope.row.template_name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="渠道号" width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p> {{ scope.row.channels }}</p>
            <div slot="reference" class="name-wrapper">
              <span class="popover-trigger" size="medium">{{ scope.row.channels }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="出价" prop="bid" width="60"></el-table-column>
      <el-table-column label="计划数" prop="inventory_ad_num" width="80"></el-table-column>
      <el-table-column label="投放包" prop="child_package_names" width="150"></el-table-column>
      <el-table-column label="单计划素材数(图片/视频)" prop="素材数" width="180">
        <template slot-scope="scope">

          {{ scope.row.use_image_num }}/{{ scope.row.use_video_num }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" width="180"></el-table-column>
      <el-table-column label="修改时间" prop="modify_time" width="180"></el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
        :page-sizes="[10, 20, 50, 100]" :page-size="form.page_size" layout="total, sizes, prev, pager, next, jumper"
        :total="24">
      </el-pagination>
    </div>
    <!-- 批量改价！！！！！！ -->
    <el-dialog v-loading="loading" :visible.sync="updateBid" width="30%">
      <el-row>
        <el-col :span="4" style="text-align: center;line-height: 20px;"> 新出价：</el-col>
        <el-col :span="20"><el-input v-model="newBid" width="400px"></el-input></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBid()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量改定向！！！！！！ -->
    <el-dialog v-loading="loading" :visible.sync="updatePackage" width="30%">
      <el-row>
        <el-col :span="4" style="text-align: center;line-height: 20px;"> 基础定向包：</el-col>
        <el-col :span="20"><el-select @change="handlepackageChange" v-model="newpackage_childID" filterable clearable
            placeholder="请选择">
            <el-option v-for="item in packageList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select></el-col>
      </el-row>
      <el-table height="450" @selection-change="childPackageChange" :data="childPackageList" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBid()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量改时段 -->
    <el-dialog v-loading="loading" :visible.sync="updatesetTime" width="50%">
      <TimeSlotSelector ref="timeSlotSelector" />
      <span class="dialog-footer">
        <el-button @click="updatesetTime = false">取消</el-button>
        <el-button type="primary" @click="submitBid()">确认</el-button>
      </span>
    </el-dialog>
    <!-- 批量换素材 -->
    <el-dialog :visible.sync="updateImage" width="70%" :close-on-click-modal="false">
      <div>

        <div style="margin-bottom: 40px;">
  <el-button type="primary" @click="exportRlueBOX = true">保存规则</el-button>
  <!-- 关键修改：按钮点击时触发文件输入框的点击事件 -->
  <el-button type="primary" @click="triggerFileInputClick">导入规则</el-button> 
  <input 
    type="file" 
    id="jsonFileInput" 
    accept=".json" 
    style="display: none;" 
    @change="handleFileChange" 
  />
</div>

        <div style="margin-bottom: 40px;">
          <el-row>
            <el-col :span="2" style="text-align: center;">
              统一选数据时间：
            </el-col>
            <el-col :span="3">
              <el-date-picker size="mini" style="width: 150px;" value-format="yyyy-MM-dd" v-model="data_start_date"
                type="date" placeholder="开始日期" />
            </el-col>
            <el-col :span="3">
              <el-date-picker size="mini" style="width: 150px;" value-format="yyyy-MM-dd" v-model="data_end_date"
                type="date" placeholder="结束日期" />
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" @click="setDate()">确认</el-button>
            </el-col>

          </el-row>
        </div>
        <el-row v-for="(item, indexPlus) in imageObjectList" :key="item.id" style="margin-bottom: 40px;">
          <el-col :span="24"
            style="text-align: left;line-height: 20px;margin-bottom: 10px;">模版名称：{{ item.template_name }}</el-col>

          <el-col :span="24" style="text-align: left;line-height: 20px;">
            <el-col :span="24" style=" text-align: left;line-height: 20px;margin-bottom: 40px;margin-left: 20px;"
              v-for="(options, index) in item.imageRuleList" :key="index">
              <el-col style="margin-bottom: 10px;" :span="24">
                规则：数据时间
                <span>
                  <el-date-picker size="mini" style="width: 150px;" value-format="yyyy-MM-dd"
                    v-model="options.data_start_date" type="date" placeholder="开始日期" />
                </span>
                <span>
                  <el-date-picker size="mini" style="width: 150px;" value-format="yyyy-MM-dd"
                    v-model="options.data_end_date" type="date" placeholder="结束日期" />
                </span>
              </el-col>
              <el-col :span="1" style="text-align: left;line-height: 20px;">
                <el-input v-model="options.page" size="mini" placeholder="批次"></el-input>
              </el-col>
              <el-col :span="2" style="text-align: left;line-height: 20px;">
                <el-select v-model="options.material_type" size="mini" placeholder="请选择">
                  <el-option v-for="item in imageType" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: left;line-height: 20px;">
                <el-select v-model="options.costValue" size="mini" placeholder="请选择">
                  <el-option v-for="item in costTpye" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col v-show="options.costValue != '介于'" :span="2" style="text-align: left;line-height: 20px;">
                <el-input v-model="options.imageNum1" size="mini" placeholder="请输入整数"></el-input>
              </el-col>
              <el-col v-show="options.costValue == '介于'" :span="4" style="text-align: left;line-height: 20px;">
                <el-col :span="11" style="text-align: left;line-height: 20px;">
                  <el-input v-model="options.imageNum2" size="mini" placeholder="请输入整数"></el-input>
                </el-col>
                <el-col :span="2" style="text-align: left;line-height: 20px;">
                  -
                </el-col>
                <el-col :span="11" style="text-align: left;line-height: 20px;">
                  <el-input v-model="options.imageNum3" size="mini" placeholder="请输入整数"></el-input>
                </el-col>
              </el-col>

              <el-col :span="3" style="text-align: left;line-height: 20px;">
                <el-select v-model="options.use_status" size="mini" placeholder="请选择">
                  <span>使用状态</span>
                  <el-option v-for="item in isUselist" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3" style="text-align: left;line-height: 20px;">
                <el-select v-model="options.tags" multiple filterable clearable size="mini" placeholder="请选择">
                  <span>标签</span>
                  <el-option  v-for="(item, index) in (options.material_type.includes('视频') ? viedoTagList : imageTagList)" :label="item.tag" :value="item.tag" >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3" style=" text-align: left;line-height: 20px;">
                <el-select v-model="options.exclude_tags" multiple filterable clearable size="mini" placeholder="请选择">
                  <span>排除标签</span>
                  <el-option  v-for="(item, index) in (options.material_type.includes('视频') ? viedoTagList : imageTagList)" :label="item.tag" :value="item.tag" >
                  </el-option>
                </el-select>
                
              </el-col>
              <el-col :span="3"  style="position: relative;text-align: left;line-height: 20px;">
                <el-input 
  v-model="options.material_name" 
  size="mini" 
  placeholder="素材名称（多个用逗号分隔）"
></el-input>
<div style="width: 40px;position: absolute;top: -10px;cursor :pointer;right: -25px; text-align: center;line-height: 20px;"
                  @click="Deleterule(indexPlus, index)" type="primary" size="mini" class="el-icon-error"></div>
              </el-col>
            </el-col>
          </el-col>
          <el-col :span="18" style="text-align: center;line-height: 20px;"><el-button @click="Addrule(indexPlus)"
              type="primary" size="mini" icon="el-icon-plus"></el-button></el-col>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitBid()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="exportRlueBOX" width="30%">
      <div>
        规则名称：
      </div>
      <div>
        <el-input v-model="RlueName" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="exportRlue">保 存</el-button>
      </div>
    </el-dialog>
    
    <el-dialog :visible.sync="loadImage" width="50%" :close-on-click-modal="false">
      <el-progress
    v-if="imageObjectList.length > 0" 
    :percentage="progress" 
    :text-inside="true" 
    :stroke-width="26" 
    :status="getProgressStatus()"
></el-progress>
  <div v-if="loadImagelist.length > 0" class="progress-list">
    <div class="progress-list">
  <div v-for="(item, index) in loadImagelist" :key="index" class="progress-item">
    <span>模板名称：{{ item.name }}</span>
    <span>{{ item.desc }}</span> <!-- 动态显示操作描述 -->
  </div>
</div>
  </div>
  <div v-else class="progress-empty">正在处理数据，请耐心等待...</div> <!-- 处理中提示 -->
</el-dialog>
  </div>
</template>

<script>
import { getTemplate, getTemplateInfo, getpackage, getpackageChild, getInfo, updateTemplateInfo,getVideoTag ,getImageTag,getMaterials} from "@/api/Strategy";
import { getTimeRange } from "@/utils/index";
import TimeSlotSelector from './TimeSlotSelector.vue';

export default {
  components: {
    TimeSlotSelector
  },
  data() {
    return {
      loading: false,
      form: {
        strategy_id: undefined,
        name: "",
        channel_name: "",
        page: 1,
        page_size: 20,
      },
      templateInfo: {},
      Appid: undefined,
      templateList: [],
      strategyId: undefined,
      advList: [],
      // 批量修改出价
      updateBid: false,
      newBid: '',
      // 批量修改定向
      batchType: null, // 当前操作类型（'bid'/'package'
      updatePackage: false,
      newpackage_childID: '',
      packageList: [],
      childPackageList: [],
      selectPacklst_ids: [],
      // 选择批量修改的模版
      selectedTemplates: [],
      // 批量改时段
      updatesetTime: false,
      // 批量换素材
      data_end_date: '',
      data_start_date: '',
      updateImage: false,
      RlueName: "",
      imageObjectList: [],
      // 批量修改素材列表
      imageRuleList: [],
      imageObjectList: [],
      loadImagelist: [],
      // 排序类型
      costTpye: ['TOP', '介于', '任选'],
      // 素材类型
      imageType: ['竖版视频', '横版视频', '横版大图', '竖版大图', '穿山甲开屏图片', '小图', '视频', '图片'],
      // 素材使用状态
      isUselist: [
        { name: '不限', value: -1 },
        { name: '已使用', value: 1 },
        { name: '未使用', value: 0 },
      ],
      // 标签页
      imageTagList:[],
      viedoTagList:[],
      // 单模板规则对象
      imageQuery: {
        fields: [
          "use_status",
          "tags",
          "create_time",
          "cost",
          "click_cnt",
          "convert_cnt",
          "conversion_cost",
          "material_name",
          "material_id",
          "type_name"
        ],
        exclude_tags: [],
        group_ids: [],
        app_id: '',
        data_end_date: '',
        data_start_date: '',
        is_exclude_tags_union: true,
        is_include_tags_union: true,
        material_name: [],
        material_source: [],
        material_type: '视频',
        page: 1,
        page_size: 200,
        sort: {
          key: "cost",
          val: 1
        },
        tags: [],
        use_status: -1,
        costValue: 'TOP',
        imageNum1:20,
        imageNum2: 0,
        imageNum3: 0
      },
      // 保存模版
      exportRlueBOX: false,
      // 换素材进度页
      loadImage: false

    }
  },
  created() {
    // 接收从 Strategy.vue 传递过来的参数
    this.form.strategy_id = this.$route.query.strategyId;
    this.Appid = this.$route.query.Appid;
    this.advList = JSON.parse(localStorage.getItem("adv_idlist"))
    this.getTemplateList();
    this.getTemplateInfo()
  },
  computed: {
    // 计算进度条的百分比
    progress() {
    if (this.imageObjectList.length === 0) return 0; // 防止空数组报错
    return parseFloat(((this.loadImagelist.length / this.imageObjectList.length) * 100).toFixed(2));
  }
  },
   
  methods: {
    getAdvName(advertiser_ids) {
      let list = []
      if (advertiser_ids) {
        advertiser_ids.forEach(advertiser_id => {
          let advName = this.advList.find(advName => advName.advertiser_id === advertiser_id);
          if(advName){
            list.push(advName.advertiser_name)
          }
          
        })
      }

      return list.join(',')
    },

    // 获取模版列表
    async getTemplateList() {
      this.loading = true
      try {
        const response = await getTemplate({
          ...this.form,
        });
        if (response.code === 0) {
          this.templateList = response.data.list;
          this.loading = false
        } else {
          console.error("请求出错:", response.message);
          this.loading = false
        }
      } catch (error) {
        console.error("请求出错:", error);
        this.loading = false
      }

    },

    // 获取策略信息
    async getTemplateInfo() {
      this.loading = true
      try {
        const response = await getTemplateInfo({
          id: this.form.strategy_id,
          app_id: this.Appid
        });
        if (response.code === 0) {
          this.templateInfo = response.data;
          this.loading = false
        } else {
          console.error("请求出错:", response.message);
          this.loading = false
        }
      } catch (error) {
        console.error("请求出错:", error);
        this.loading = false
      }

    },
    handleSelectionChange(rows) {
      this.selectedTemplates = rows.map(row => row._id); // ✅ 只保留 id; // 将选中的行赋值给 selectedRows
    },
    // 获取定向包列表
    async getpackageList() {
      try {
        const response = await getpackage({
          app_id: this.Appid
        });
        if (response.code === 0) {
          this.packageList = response.data;
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },
    // 获取子定向包
    async handlepackageChange() {
      if (this.newpackage_childID) {
        let [start_date, end_date] = getTimeRange(7);
        let data = {
          app_id: this.Appid,
          pid: this.newpackage_childID,
          start_date: start_date + " 00:00:00",
          end_date: end_date + " 23:59:59",
          child_name: ""
        }
        console.log(data)
        try {
          const response = await getpackageChild(data);
          if (response.code === 0) {
            this.childPackageList = response.data.list;
          } else {
            console.error("请求出错:", response.message);
          }
        } catch (error) {
          console.error("请求出错:", error);
        }
      }
    },
    // 选择子定向包
    async childPackageChange(val) {
      this.selectPacklst_ids = val.map(obj => obj.id)
      console.log(this.selectPacklst_ids)
    },
    getProgressStatus() {
        const failedCount = this.loadImagelist.filter(item => item.status === 'failed').length;
        if (failedCount > 0) {
            return 'exception'; // 失败状态显示为异常颜色
        }
        return 'success';
    },

   // 新增一个选取素材规则
   Addrule(indexPlus, index) {
        let data = JSON.parse(JSON.stringify(this.imageQuery))
        this.imageObjectList[indexPlus].imageRuleList.push(data)
      },
      // 删除某一个规则
      Deleterule(indexPlus, index) {
        this.imageObjectList[indexPlus].imageRuleList.splice(index, 1);
      },

    // 查询素材
    async fetchMaterials(options, appId) {
      options.app_id=this.Appid
      if(options.use_status==-1){
        delete  options.use_status
      }
  try {
    const response = await getMaterials(options);
    let materials = response.data.list || [];

        if (options.costValue === 'TOP') {
            materials = materials.slice(0, options.imageNum1);
        } else if (options.costValue === '任选') {
            const selectedMaterials = [];
            const totalMaterials = materials.length;
            const numToSelect = Math.min(options.imageNum1, totalMaterials);
            while (selectedMaterials.length < numToSelect) {
                const randomIndex = Math.floor(Math.random() * totalMaterials);
                const material = materials[randomIndex];
                if (!selectedMaterials.includes(material)) {
                    selectedMaterials.push(material);
                }
            }
            console.log(selectedMaterials)
            materials = selectedMaterials;
        } else if (options.costValue === '介于') {
            materials = materials.slice(options.imageNum2-1,options.imageNum3);
        }

        return materials;
  } catch (error) {
    console.error("素材查询失败", error);
    return [];
  }
},
   // 保存模版（仅保存每个模板的 imageRuleList，不包含 _id）
exportRlue() {
  if (!this.RlueName.trim()) {
    this.$message.error('请输入规则名称');
    return;
  }
  // 提取每个模板的 imageRuleList（忽略 _id 和其他字段）
  const rulesData = this.imageObjectList.map(template => template.imageRuleList);
  
  const jsonContent = JSON.stringify(rulesData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${this.RlueName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  this.$message.success('规则已保存为JSON文件');
  this.exportRlueBOX = false;
  this.RlueName = '';
},
    //  导入模版
    triggerFileInputClick() {
    const fileInput = document.getElementById('jsonFileInput');
    if (fileInput) {
      fileInput.click(); // 模拟点击文件输入框
    }
  },
  handleFileChange(e) {
    const target = e?.target || e?.srcElement;
    if (!target || target.type !== 'file' || !target.files || target.files.length === 0) {
        return;
    }
    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const importedRuleLists = JSON.parse(event.target.result);
            if (!Array.isArray(importedRuleLists) || 
                !importedRuleLists.every(ruleList => Array.isArray(ruleList))) {
                throw new Error('无效的规则格式，必须是一个包含多个规则列表的数组');
            }

            const selectedTemplateCount = this.selectedTemplates.length;
            if (importedRuleLists.length !== selectedTemplateCount) {
                throw new Error(`规则数量不匹配：需要 ${selectedTemplateCount} 条规则，实际导入 ${importedRuleLists.length} 条`);
            }

            const updatedImageObjectList = [];
            const selectedTemplateList = this.templateList.filter(template => 
                this.selectedTemplates.includes(template._id) 
            );

            selectedTemplateList.forEach((template, index) => {
                const importedRuleList = importedRuleLists[index];
                updatedImageObjectList.push({
                    _id: template._id,
                    template_name: template.template_name,
                    imageRuleList: importedRuleList,
                    creative_setting: { ...template.creative_setting }
                });
            });

            this.imageObjectList = updatedImageObjectList;
            this.$message.success('规则按顺序导入成功');
            // 强制更新
            this.$forceUpdate();

        } catch (error) {
            this.$message.error(`导入失败：${error.message}`);
            console.error('导入错误:', error);
        }
    };

    reader.readAsText(file);
},
    setDate() {
      let campaigns = this.imageObjectList
      campaigns = campaigns.map(campaign => {
        return {
          ...campaign,
          imageRuleList: campaign.imageRuleList.map(rule => ({
            ...rule,
            data_end_date: this.data_end_date,
            data_start_date: this.data_start_date
          }))
        };
      });
      console.log(campaigns)
      this.imageObjectList = JSON.parse(JSON.stringify(campaigns))
    },

    async submitBid() {
    this.loading = true;
    this.loadImage = true;
    this.loadImagelist = [];
    const failedTemplates = [];
    const templateFullDataList = []; // 存储完整模板数据

    // 1. 批量获取所有模板的完整数据
    for (const templateId of this.selectedTemplates) {
        try {
            const res = await getInfo({ id: templateId, appid: this.Appid });
            templateFullDataList.push(res.data); // 存储完整模板数据
        } catch (error) {
            console.error(`获取模板 ${templateId} 完整数据失败：`, error);
            failedTemplates.push(templateId); // 记录获取失败的模板
        }
    }

    // 过滤掉获取数据失败的模板
    const validTemplates = templateFullDataList.filter(t => !failedTemplates.includes(t._id));

    for (const template of validTemplates) {
        const templateId = template._id;
        const templateName = template.template_name;
        const updateData = { ...template }; // 复制完整数据

        try {
            // 根据操作类型修改对应字段（保持其他字段不变）
            if (this.batchType === 'bid') {
                if (!this.validateBid()) throw new Error('出价格式错误');
                updateData.bid = this.newBid; // 仅修改出价字段
            } else if (this.batchType === 'packge') {
                if (!this.validatePackage()) throw new Error('定向包未选择');
                updateData.local_package_id = this.newpackage_childID; // 更新基础定向包
                updateData.child_package_ids = this.selectPacklst_ids; // 更新子定向包
            } else if (this.batchType === 'setTime') {
                const timeSlotSelector = this.$refs.timeSlotSelector;
                const timeString = timeSlotSelector.getTimeString();
                if (!timeString) throw new Error('时段未选择');

                // 完整更新时段相关字段（假设接口需要这些完整字段）
                updateData.schedule_time = timeString;
                updateData.schedule_time_type = "CUSTOM";
                updateData.schedule_type = "SCHEDULE_FROM_NOW";
            } else if (this.batchType === 'img') {
                const templateRules = this.imageObjectList.find(t => t._id === templateId)?.imageRuleList || [];
                const materials = [];

                const processRules = new Promise((resolve, reject) => {
                    const processNextRule = (index) => {
                        if (index >= templateRules.length) {
                            // 所有规则处理完毕，替换素材
                            updateData.creative_setting = {
                                ...template.creative_setting,
                                adCreativeList: materials
                            };
                            resolve();
                            return;
                        }

                        const rule = templateRules[index];
                        this.fetchMaterials(rule, this.Appid)
                           .then(result => {
                                materials.push(...result);
                                // 处理下一条规则
                                processNextRule(index + 1);
                            })
                           .catch(error => {
                                console.error(`模板 ${templateId} 规则 ${index} 查询素材失败：`, error);
                                // 继续处理下一条规则
                                processNextRule(index + 1);
                            });
                    };

                    // 开始处理第一条规则
                    processNextRule(0);
                });

                // 等待所有规则处理完成
                await processRules;
            } else {
                throw new Error('未知操作类型');
            }

            // 提交完整数据到接口（包含所有字段）
            await updateTemplateInfo(updateData);

            // 生成成功描述（包含操作类型和修改内容）
            const desc = this.getOperationDesc(updateData);
            this.loadImagelist.push({ name: templateName, desc, status: 'success' });

        } catch (error) {
            console.error(`模板 ${templateId} 更新失败：`, error.message);
            failedTemplates.push(templateId);
            const desc = this.getOperationErrorDesc(this.batchType);
            this.loadImagelist.push({ name: templateName, desc, status: 'failed' });
        }
    }

    // 统一处理后续逻辑
    this.getTemplateList(); // 刷新列表
    this.closeBatchDialog(); // 关闭对话框

    // 消息提示（区分成功/失败数量）
    const successCount = this.loadImagelist.filter(item => item.status === 'success').length;
    const failCount = failedTemplates.length;
    this.$message[failCount === 0 ? 'success' : 'warning'](
        `批量${this.getOperationName()}完成：${successCount}个成功，${failCount}个失败`
    );
}    ,


// 辅助方法：获取操作描述（成功）
getOperationDesc(updateData) {
  switch (this.batchType) {
    case 'bid':
      return `出价改为 ${updateData.bid}`; // 假设原数据有originalBid（需提前保存）
    case 'packge':
      const originalPackage = this.packageList.find(p => p.id === updateData.local_package_id)?.name;
      const newPackage = this.packageList.find(p => p.id === this.newpackage_childID)?.name;
      return `定向包改为 ${newPackage}`;
    case 'setTime':
      const timeSlotSelector = this.$refs.timeSlotSelector;
      return `时段改为 ${timeSlotSelector.getTimeDesc()}`;
    case 'img':
      return `替换素材 ${updateData.creative_setting.adCreativeList.length} 条`;
    default:
      return '未知操作';
  }
},

// 辅助方法：获取操作错误描述
getOperationErrorDesc(type) {
  return {
    bid: '出价修改失败',
    packge: '定向包设置失败',
    setTime: '时段修改失败',
    img: '素材替换失败'
  }[type] || '操作失败';
},

// 辅助方法：获取操作名称（用于消息提示）
getOperationName() {
  return {
    bid: '改价',
    packge: '改定向',
    setTime: '改时段',
    img: '换素材'
  }[this.batchType] || '操作';
},

    // 出价校验（独立方法）
    validateBid() {
      const bid = parseFloat(this.newBid);
      if (isNaN(bid) || bid <= 0) {
        this.$message.error("请输入有效的正整数出价");
        return false;
      }
      return true;
    },

    // 定向校验（独立方法）
    validatePackage() {
      if (!this.newpackage_childID) {
        this.$message.error("请选择基础定向包");
        return false;
      }
      if (this.selectPacklst_ids.length === 0) {
        this.$message.error("请至少选择一个子定向包");
        return false;
      }
      return true;
    },

    // 关闭对话框并重置状态
    closeBatchDialog() {
      this.updateBid = false;
      this.updatePackage = false; 
      this.updatesetTime = false;
      this.updateImage = false;
      this.batchType = null;
      this.newBid = '';
      this.newpackage_childID = '';
      this.selectPacklst_ids = [];
      this.loading = false;
    },

    goBack() {
      this.$router.back();
    },
    handleSizeChange(val) {
      this.form.page_size = val;
      this.form.page = 1;
      this.getTemplateList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getTemplateList();
    },
    // 获取视频标签列表
    async getVideoTagList(){
      try {
        const response = await getVideoTag({
          app_ids: this.Appid,
          media_id:"ad00002"
        });
        if (response.code === 0) {
          this.viedoTagList = response.data.list;
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },
    // 获取图片标签列表
    async getImageTagList(){
      try {
        const response = await getImageTag({
          app_ids: this.Appid,
          media_id:"ad00002"
        });
        if (response.code === 0) {
          this.imageTagList = response.data.list;
        } else {
          console.error("请求出错:", response.message);
        }
      } catch (error) {
        console.error("请求出错:", error);
      }
    },

    // 点击批量按钮
    handleCommand(type) {
      this.batchType = type;
      if (type == 'bid') {
        this.updateBid = true
      } else if (type == "packge") {
        this.updatePackage = true
        this.getpackageList()
      } else if (type == "setTime") {
        this.updatesetTime = true
      } else if (type === "img") {
        this.getVideoTagList(); 
        this.getImageTagList();
        this.loadImagelist = [];
        const [data_start_date, data_end_date] = getTimeRange(7);
        this.data_end_date = this.imageQuery.data_end_date = data_end_date;
        this.data_start_date = this.imageQuery.data_start_date = data_start_date;
        const selectedTemplateList = this.templateList.filter(template => 
          this.selectedTemplates.includes(template._id) 
        );
        this.imageObjectList = selectedTemplateList.map(template => ({
          _id: template._id,
          template_name: template.template_name,
          imageRuleList: [JSON.parse(JSON.stringify(this.imageQuery))],
          creative_setting: { ...template.creative_setting }
        }));
        this.updateImage = true;
      }
    }
  },
};
</script>

<style scoped>
.container {
  padding: 10px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.info-item {
  margin-right: 20px;
}

.search-operate {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.search-input {
  margin-right: 10px;
  padding: 4px;
  width: 150px;
}

.operate-btn {
  margin-right: 5px;
}

.new-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
}

.table-btn {
  padding: 2px 4px;
  margin-right: 2px;
  font-size: 12px;
}

.pagination {
  margin-top: 10px;
  text-align: right;
}

.popover-trigger {
  display: inline-block;
  /* 必须，否则省略号不生效 */
  max-width: 100%;
  /* 单元格内最大宽度 */
  white-space: nowrap;
  /* 禁止换行，强制单行 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 显示省略号 */
}
.progress-list {
  padding: 20px;
  line-height: 2.5;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
}

.progress-empty {
  padding: 20px;
  color: #666;
  text-align: center;
}
</style>