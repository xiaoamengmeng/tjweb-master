<template>
  <div class="blood-pressure-record-container">
    <div class="treat-result-view">
      <div class="chart-box">
        <!-- 右边卡片图表  -->
        <div class="box box-right">
          <template>
            <div class="mb_20">
              <i
                v-if="weightKindRadio != '自定义'"
                @click="weightChartDateRangePrevClick"
                class="el-icon-arrow-left cursor_point"
              ></i>
              <el-date-picker
                v-model="weightChartDateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                readonly
                :clearable="false"
              > </el-date-picker>
              <i
                v-if="weightKindRadio != '自定义'"
                @click="weightChartDateRangeNextClick"
                class="el-icon-arrow-right cursor_point"
              ></i>
              <el-radio-group
                class="right year-right"
                @change="weightKindChange"
                v-model="weightKindRadio"
                size="small"
              >
                <el-radio-button label="周"></el-radio-button>
                <el-radio-button label="月"></el-radio-button>
                <el-radio-button label="年"></el-radio-button>
                <el-radio-button label="自定义"></el-radio-button>
                <div class="year-right-picker">
                  <el-date-picker
                    v-model="weightChartDateRange1"
                    type="daterange"
                    range-separator=""
                    start-placeholder=""
                    end-placeholder=""
                    @change="weightDateChange"
                    @focus="weightDateFocus"
                  > </el-date-picker>
                </div>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-wrapper">
            <v-chart
              ref="weightChart"
              :options="chartOptions"
              class="chart"
              autoresize
            ></v-chart>
          </div>
        </div>
        <!-- 右边卡片图表结束  -->
      </div>
      <div class="list-title">
        <span class="fontsize_20">历史记录</span>
      </div>
      <div class="history-table mt_20">
        <m-view-table
          ref="weightHistoryTable"
          height="303"
          :data="bloodPressureHistoryTableData"
          :total="bloodPressureHistoryTotal"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="bloodPressureHistoryPageSize"
          :current-page.sync="bloodPressureHistoryPage"
          :get-data-func="getBloodPressureRecords"
        >
          <el-table-column
            label="记录时间"
            align="center"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
         <el-table-column
            label="记录时间"
            align="center"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.date }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="心情状态"
            align="center"
            min-width="100"
          >
            <template v-slot="scope">
              {{ getMood(scope.row.emotion) }}
            </template>
          </el-table-column>
        </m-view-table>
      </div>
    </div>
    <el-dialog
      title="记录血压"
      :visible.sync="todayWeightRecordDialogVisible"
      class="today-record-dialog weight"
    >
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="测量日期"
              required
            >
              <el-date-picker
                type="date"
                v-model="todayDietRecordedDate"
                placeholder="请选择测量时间"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              > </el-date-picker>
            </el-form-item>
            <el-form-item
              label="收缩压"
              required
            >
              <el-input
                v-model="systolic"
                placeholder="请输入收缩压"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="测量时间"
              required
            >
              <el-time-picker
                v-model="todayDietRecordedAt"
                placeholder="请选择测量时间"
                value-format="HH:mm:ss"
                style="width: 100%"
              > </el-time-picker>
            </el-form-item>
            <el-form-item
              label="舒张压"
              required
            >
              <el-input
                v-model="diastolic"
                placeholder="请输入舒张压"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="todayWeightRecordDialogVisible = false"
        >关 闭</m-button>
        <m-button @click="saveTodayWeight">保 存</m-button>
      </span>
    </el-dialog>
    <calendar
      v-if="patient.user_id"
      ref="calendar"
      :patientId="patient.user_id"
      @change="changeDate"
    ></calendar>
  </div>
</template>

<script>
import emotionMixin from "../emotionMixin";
import calendar from "./calendar.vue";
import { mapGetters } from "vuex";
export default {
  mixins: [emotionMixin],
  components: {
    calendar,
  },
  props: ["ppInfo"],
  data() {
    return {
      chartOptions: {},
      todayDietRecordedAt: "",
      systolic: "",
      diastolic: "",
      todayDietRecordedDate: "",
      moodList: [
        { type: 'HAPPY', name: '超级开心'},
        { type: 'FINE', name: '心情不错' },
        { type: 'SOSO', name: '一般般' },
        { type: 'BAD', name: '不开心' },
      ],
    };
  },
  created() {
    this.initWeightData();
  },
  methods: {
    getMood(type) {
        const item = this.moodList.find(ele => ele.type == type)
        if (item) {
            return item.name
        }
        return ""
    },
    getWeightRecordsChange(val) {
      this.weightHistoryPage = 1;
      this.$nextTick(() => {
        this.weightHistoryRadioChange(this.weightHistoryRadio);
      });
    },
    /**
     * 获取患者统计数据（子模块渲染图表时使用）
     * @param kind 统计粒度
     * @param gte 大于等于
     * @param lte 小于等于
     */
    getPatientStatByChart(kind = "month", gte = "", lte = "") {
      const params = {
        kind: kind,
        patient: this.patient.user_id,
      };
      if (gte !== "" && new Date(gte).toString() !== "Invalid Date") {
        params.recorded_at__gte = gte + " 00:00:00";
      }
      if (gte !== "" && new Date(lte).toString() !== "Invalid Date") {
        params.recorded_at__lte = lte + " 23:59:59";
      }
      return new Promise((resolve, reject) => {
        this.$api.emotionRecord
          .statistics(params)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
            resolve(null);
          });
      });
    },
    /**
     * 获取患者统计数据（页面加载时使用）
     * @param kind 统计粒度
     * @param gte 大于等于
     * @param lte 小于等于
     */
    getPatientStat(kind = "month", gte = "", lte = "") {
      const params = {
        kind: kind,
      };
      this.$api.patients
        .getStat(this.patient.user_id, params)
        .then((res) => {
          this.patientStat = res.data;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    historyTableIsMyLiked(likes) {
      if (likes.length === 0) {
        return false;
      }
      if (likes.find((item) => item.creator.id === this.userInfo.id)) {
        return true;
      }
      return false;
    },
    historyTableIsMyCreator(creator) {
      return creator && creator.id === this.userInfo.id;
    },
    changeDate(e) {
      this.todayWeightDatePicker = e;
      this.getTodayWeightRecord();
    },
    openCalendar(filed) {
      this.$refs["calendar"].open(this[filed]);
    },
  },
  computed: {
    ...mapGetters(["userInfo", "token"]),
    userId() {
      return this.patient.user_id;
    },
    patient() {
      if (
        this.ppInfo &&
        Object.keys(this.ppInfo).length !== 0 &&
        this.ppInfo.patient
      ) {
        return this.ppInfo.patient;
      } else {
        return {
          avatar_url: "",
          user_profile: {},
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.blood-pressure-record-container {
  .treat-result-view {
    width: 100%;
    .chart-box {
      padding: 0 20px;
      margin-top: 10px;
      width: calc(100%);
      min-width: 1000px;
      position: relative;
      left: -18px;
      display: flex;

      .box:first-child {
        margin-right: 8px;
      }

      .box {
        box-sizing: border-box;
        padding: 20px;
        width: calc(50% - 6px);
        height: 458px;
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        border: 1px solid #d3d6e9;
      }

      .box.box-left {
        position: relative;

        .number-view {
          display: flex;
          justify-content: space-between;

          .number-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 60px;
            min-width: 80px;

            .num {
              font-size: 24px;
              font-weight: bold;
              color: #344563;

              .unit {
                width: 36px;
                font-size: 16px;
                font-weight: bold;
                color: #a1a7c4;
              }
            }

            .desc {
              font-size: 14px;
              font-weight: 400;
              color: #344563;
            }
          }
        }

        .weight-waistline-unit-text {
          position: absolute;
          right: 20px;
          font-size: 12px;
          color: #a1a7c4;
        }
      }
    }

    .box.box-right {
      .el-date-editor {
        width: 247px;
      }

      .chart-wrapper {
        height: calc(100% - 20px - 20px - 20px);

        .echarts {
          width: 100%;
          height: 100%;
        }
      }
    }

    .today-weight-record-table {
      :deep(.el-table__body-wrapper) {
        overflow-x: auto;
      }
    }

    .year-right {
      position: relative;
      .year-right-picker {
        position: absolute;
        top: 0;
        right: 0;
        width: 67px;
        height: 32px;
        opacity: 0;

        .el-date-editor {
          width: 67px !important;
          height: 32px !important;
        }
      }
    }
  }
}
.today-record-dialog {
  :deep(.el-dialog) {
    width: 900px;
    height: 660px;
  }

  .food-table {
    .record-btn {
      float: right;
      position: relative;
      bottom: 10px;
    }
  }
}

.today-record-dialog.weight {
  :deep(.el-dialog) {
    width: 700px;
    height: 460px;
  }
}

.diet-edit-dialog {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 900px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
      color: #5a6d86 !important;
    }
  }

  .mtext {
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: #5a6d86 !important;
    line-height: 40px;
  }

  .date {
  }

  .date-time {
  }

  .diet-image {
    display: flex;

    .box {
      width: 160px;
      height: 120px;
      background-color: #ebeef5;

      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    .box.empty {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .remake {
    width: 400px;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #5a6d86;
    line-height: 20px;
  }

  .comment-num {
    display: flex;
    justify-content: space-between;
    width: 200px;
    height: 24px;
    line-height: 24px;

    .comment {
      line-height: inherit;
    }

    .like {
      line-height: inherit;

      .icon {
        float: right;
        zoom: 0.8;
      }
    }
  }

  .comment-list {
    .comment-item {
      .role-name {
      }

      .content {
        word-wrap: break-word;
        white-space: pre-line;
      }
    }
  }

  .comment-text-box {
    width: 460px;
    position: relative;

    .submit-btn {
      background-color: @primaryColor;
      color: #fff;
      border-radius: 6px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .food-table {
    position: relative;

    .record-btn {
      position: absolute;
      top: -50px;
      right: 0;
    }
  }
}

.diet-edit-dialog.exercise {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 780px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
      color: #5a6d86 !important;
    }
  }
}

.diet-comment-dialog {
  :deep(.el-dialog) {
    width: 560px;
    height: 360px;
  }

  .submit-btn {
    background-color: @primaryColor;
    color: #fff;
    border-radius: 6px;
    float: right;
    margin-top: 4px;
  }
}
</style>
