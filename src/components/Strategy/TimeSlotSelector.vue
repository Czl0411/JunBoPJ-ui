<template>
  <div class="time-slot-container">
    <el-radio-group v-model="timeType" class="radio-group">
      <el-radio label="all">不限</el-radio>
      <el-radio label="specified">指定时间段</el-radio>
    </el-radio-group>
    <div v-if="timeType ==='specified'">
      <div class="tip" >
      <el-tag type="warning">
        云定向包和模板内投放时段都配置的情况下优先使用模板内所配置的投放时段
      </el-tag>
    </div>

    <table class="time-table"> 
      <thead>
        <tr>
          <th class="week-col">星期/时间</th>
          <th colspan="24">00:00 - 12:00</th>
          <th colspan="24">12:00 - 24:00</th>
        </tr>
        <tr>
          <th class="week-col"></th>
          <!-- 生成 00:00 - 12:00 的表头 -->
          <th v-for="i in 12" :key="i" colspan="2">{{ i - 1 }}</th>
          <!-- 生成 12:00 - 24:00 的表头 -->
          <th v-for="i in 12" :key="i + 100" colspan="2">{{ i + 11 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, dayIndex) in days" :key="dayIndex">
          <td class="week-col">{{ dayNames[dayIndex] }}</td>
          <td
            v-for="(slot, slotIndex) in day"
            :key="slotIndex"
            class="time-slot"
            :class="{ selected: slot }"
            @mousedown="startSelect(dayIndex, slotIndex)"
            @mouseover="handleMouseOver(dayIndex, slotIndex)"
            @mouseup="endSelect"
          ></td>
        </tr>
      </tbody>
    </table>

    <div class="operation">
      <span>可拖动鼠标选择时间段</span>
      <el-button size="mini" @click="clearSelection">清空选择</el-button>
    </div>

    <el-card class="selected-time-card">
      <div slot="header">已选择时间段</div>
      <div v-for="(slot, index) in selectedTimeSlots" :key="index">
        {{ slot.day }}：{{ slot.startTime }}-{{ slot.endTime }}
      </div>
    </el-card>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeType: 'all',
      days: [],
      dayNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      isSelecting: false,
      startDay: 0,
      startSlot: 0,
      endDay: 0,
      endSlot: 0,
      initialSelectState: false,
      selectedTimeSlots: []
    };
  },
  mounted() {
    this.initDays();
  },
  methods: {
    initDays() {
      for (let i = 0; i < 7; i++) {
        this.days[i] = new Array(48).fill(false);
      }
    },
    startSelect(dayIndex, slotIndex) {
      this.isSelecting = true;
      this.startDay = dayIndex;
      this.startSlot = slotIndex;
      this.endDay = dayIndex;
      this.endSlot = slotIndex;
      this.initialSelectState = this.days[dayIndex][slotIndex];
      this.days[dayIndex][slotIndex] =!this.initialSelectState;
      this.$forceUpdate();
    },
    handleMouseMove(e) {
      if (!this.isSelecting) return;
      const target = e.target;
      if (target.classList.contains('time-slot')) {
        const dayIndex = Array.from(target.parentNode.children).indexOf(target);
        const rowIndex = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);
        this.endDay = rowIndex;
        this.endSlot = dayIndex - 1;
        this.updateSelection();
      }
    },
    endSelect() {
      this.isSelecting = false;
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.endSelect);
    },
    clearSelection() {
      this.days = this.days.map(day => new Array(48).fill(false));
      this.selectedTimeSlots = [];
      this.$forceUpdate();
    },
    handleMouseOver(dayIndex, slotIndex) {
      if (this.isSelecting) {
        this.endDay = dayIndex;
        this.endSlot = slotIndex;
        this.updateSelection();
      }
    },
    updateSelection() {
      const startDay = Math.min(this.startDay, this.endDay);
      const endDay = Math.max(this.startDay, this.endDay);
      const startSlot = Math.min(this.startSlot, this.endSlot);
      const endSlot = Math.max(this.startSlot, this.endSlot);
      for (let day = startDay; day <= endDay; day++) {
        for (let slot = startSlot; slot <= endSlot; slot++) {
          this.days[day][slot] =!this.initialSelectState;
        }
      }
      this.refreshSelectedTimeSlots();
      this.$forceUpdate();
    },
    refreshSelectedTimeSlots() {
      this.selectedTimeSlots = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        let startSlot = -1;
        for (let slotIndex = 0; slotIndex < 48; slotIndex++) {
          if (this.days[dayIndex][slotIndex] && startSlot === -1) {
            startSlot = slotIndex;
          } else if (!this.days[dayIndex][slotIndex] && startSlot!== -1) {
            this.addTimeSlot(dayIndex, startSlot, slotIndex - 1);
            startSlot = -1;
          }
        }
        if (startSlot!== -1) {
          this.addTimeSlot(dayIndex, startSlot, 47);
        }
      }
    },
    addTimeSlot(dayIndex, start, end) {
      const dayName = this.dayNames[dayIndex];
      const startTime = this.formatTimeSlot(start);
      const endTime = this.formatTimeSlot(end + 1); // 修正结束时间
      this.selectedTimeSlots.push({
        day: dayName,
        startTime: startTime,
        endTime: endTime
      });
    },
    formatTimeSlot(slotIndex) {
      const hour = Math.floor(slotIndex / 2);
      const minute = (slotIndex % 2) * 30;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    },
    getTimeString() {
      if (this.timeType === 'all') {
        return 'all';
      }
      let timeString = '';
      for (let day of this.days) {
        for (let slot of day) {
          timeString += slot? '1' : '0';
        }
      }
      return timeString;
    },
    // 新增 getTimeDesc 方法
    getTimeDesc() {
      if (this.timeType === 'all') {
        return '每天 00:00-24:00';
      }
      if (this.selectedTimeSlots.length === 0) {
        return '无选择时段';
      }
      let desc = '';
      const groupedByDay = {};
      this.selectedTimeSlots.forEach(slot => {
        if (!groupedByDay[slot.day]) {
          groupedByDay[slot.day] = [];
        }
        groupedByDay[slot.day].push(`${slot.startTime}-${slot.endTime}`);
      });
      for (const day in groupedByDay) {
        desc += `${day}：${groupedByDay[day].join('、')}；`;
      }
      return desc;
    }
  }
};
</script>

<style scoped>
.time-slot-container {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.radio-group {
  margin-bottom: 15px;
  text-align: center;
}

.tip {
  margin-bottom: 20px;
  text-align: center;
}

.time-table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 15px;
}

.time-table th,
.time-table td {
  border: 1px solid #ccc;
  width: 130px;
  height: 24px;
  padding: 0;
  text-align: center;
  user-select: none;
}

.week-col {
  width: 130px;
  background: #f5f7fa;
}

.time-slot {
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-slot.selected {
  background-color: #0080ff;
}

.operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #606266;
}

.el-button {
  padding: 4px 12px;
  font-size: 12px;
  border-color: #dcdfe6;
  color: #0080ff;
  background-color: #ffffff;
}

.el-button:hover {
  color: #0080ff;
  border-color: #0080ff;
}

.selected-time-card {
  margin-top: 20px;
}
</style>    