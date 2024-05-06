<template>
  <el-dialog :visible.sync="dialogVisible" title="选择记录日期">
    <el-calendar v-model="currentDate">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="day">
          {{ $Day(date).format('DD') }}
          <div class="dot-wrap">
            <div :class="['dot', dot]" v-for="dot in showRecordTips(date)" :key="dot"></div>
          </div>
        </div>
      </template>
    </el-calendar>
    <div class="dot-dec">
      <div class="item">
        <div class="dot green-dot"></div>
        <div class="name">体重</div>
      </div>
      <div class="item">
        <div class="dot orange-dot"></div>
        <div class="name">饮食</div>
      </div>
      <div class="item">
        <div class="dot red-dot"></div>
        <div class="name">运动</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <m-button type="default" @click="dialogVisible = false">关 闭</m-button>
      <m-button @click="affirmDate">确 定</m-button>
    </span>
  </el-dialog>
</template>

<script>
import { Calendar } from 'element-ui'
export default {
  components: { 'el-calendar': Calendar },
  props: {
    patientId: {},
  },

  data() {
    return {
      dialogVisible: false,
      recordInfo: {},
      currentDate: '',
    }
  },
  methods: {
    open(date) {
      this.currentDate = date
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    affirmDate() {
      this.$emit('change', this.$Day(this.currentDate).format('YYYY-MM-DD'))
      this.close()
    },
    getPstatusDate() {
      let params = {
        kind: 'day',
      }
      this.$api.patients
        .getStat(this.patientId, params)
        .then((res) => {
          this.recordInfo = res.data
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    showRecordTips(day) {
      let date = this.$Day(day).format('YYYY-MM-DD')
      let recordList = []
      try {
        let weightArr = this.recordInfo.weight_stats.stats.map((v) => this.$Day(v.date).format('YYYY-MM-DD'))
        if (weightArr.includes(date)) {
          recordList.push('green-dot')
        }
      } catch (error) {}
      try {
        let dietArr = this.recordInfo.diet_stats.stats.map((v) => this.$Day(v.date).format('YYYY-MM-DD'))
        if (dietArr.includes(date)) {
          recordList.push('orange-dot')
        }
      } catch (error) {}
      try {
        let exerciseArr = this.recordInfo.exercise_stats.stats.map((v) => this.$Day(v.date).format('YYYY-MM-DD'))
        if (exerciseArr.includes(date)) {
          recordList.push('red-dot')
        }
      } catch (error) {}
      return recordList
    },
  },
  beforeMount() {
    this.getPstatusDate()
  },
}
</script>

<style lang="less" scoped>
::v-deep {
  .el-dialog {
    height: 520px !important;
  }
  .el-calendar-day {
    padding: 0;
    height: auto !important;
    .day {
      padding: 0;
      padding-top: 5px;
      text-align: center;
      margin: 0;
      height: 40px;
      box-sizing: border-box;
      position: relative;
      .dot-wrap {
        width: 100%;
        height: 20px;
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 2px;
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
.dot-dec {
  display: flex;
  align-items: center;
  .item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}
.green-dot {
  background-color: green;
}
.orange-dot {
  background-color: orange;
}
.red-dot {
  background-color: red;
}
</style>
