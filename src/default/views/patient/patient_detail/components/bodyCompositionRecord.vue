<template>
  <div class="blood-pressure-record-container">
    <div class="treat-result-view">
      <div class="chart-box">
        <div class="box box-left" style="height: 660px">
          <el-select v-model="selectedValue" placeholder="请选择">
            <el-option
              v-for="item in bloodPressureHistoryTableData"
              :key="item.id"
              :label="item.time"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <div v-if="selectedItem" class="info">
            <div style="width: 100%">
              <div class="body-section">
                <div class="body-item">
                  <div class="body-title">健康评分</div>
                  <div class="body-detail" style="color: red">
                    {{ selectedItem.score }}
                  </div>
                </div>
                <div class="body-item">
                  <div class="body-title">实际年龄</div>
                  <div class="body-detail">{{ selectedItem.age }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">身体年龄</div>
                  <div class="body-detail">{{ selectedItem.body_age }}</div>
                </div>
              </div>
              <div class="body-section">
                <div class="body-item">
                  <div class="body-title">身高（cm）</div>
                  <div class="body-detail">{{ selectedItem.height }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">体重（kg）</div>
                  <div class="body-detail">{{ selectedItem.weight }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">BMI（kg/㎡）</div>
                  <div class="body-detail">{{ selectedItem.bmi }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">体脂率（%）</div>
                  <div class="body-detail">{{ selectedItem.body_fat }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">皮下脂肪（%）</div>
                  <div class="body-detail">{{ selectedItem.subfat }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">内脏脂肪（%）</div>
                  <div class="body-detail">{{ selectedItem.visfat }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">去脂体重（kg）</div>
                  <div class="body-detail">{{ selectedItem.lbm }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">骨量（kg）</div>
                  <div class="body-detail">{{ selectedItem.bone }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">体水分（%）</div>
                  <div class="body-detail">
                    {{ selectedItem.water.toFixed(2) }}
                  </div>
                </div>
                <div class="body-item">
                  <div class="body-title">肌肉量（kg）</div>
                  <div class="body-detail">{{ selectedItem.muscle_mass }}</div>
                </div>
                <div class="body-item">
                  <div class="body-title">基础代谢（kcal）</div>
                  <div class="body-detail">{{ selectedItem.bmr }}</div>
                </div>
              </div>
            </div>
            <m-button @click="toDetail">
              <span style="line-height: 23px; margin-left: 5px"
                >查看完整报告</span
              >
            </m-button>
          </div>
          <div
            v-else
            class="info"
            style="height: 500px; line-height: 500px; color: #666"
          >
            暂无数据
          </div>
        </div>

        <!-- 右边卡片图表  -->
        <div class="box box-right">
          <div style="margin-bottom: 20px">
            <el-radio-group
              @change="bodyChange"
              v-model="bodyRadio"
              size="small"
            >
              <el-radio-button label="BMI"></el-radio-button>
              <el-radio-button label="体脂率"></el-radio-button>
              <el-radio-button label="内脏脂肪"></el-radio-button>
              <el-radio-button label="肌肉量"></el-radio-button>
            </el-radio-group>
          </div>
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
              >
              </el-date-picker>
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
                  >
                  </el-date-picker>
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
    </div>
  </div>
</template>

<script>
import bodyCompositionMixin from "../bodyCompositionMixin";
import calendar from "./calendar.vue";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
export default {
  mixins: [bodyCompositionMixin],
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
      selectedValue: "",
      bodyRadio: "BMI",
    };
  },
  created() {
    this.initWeightData();
  },
  methods: {
    toDetail() {
      let selectedItem = this.selectedItem;
      let measureData = {
        name: this.patient.real_name,
        age: selectedItem.age,
        local_updated_at: dayjs(selectedItem.time).format("YYYY-MM-DD HH:mm"),
        gender: selectedItem.gender,
        birthday: selectedItem.birthday,
        height: selectedItem.height,
        bmi: selectedItem.bmi,
        bmr: selectedItem.bmr,
        body_age: selectedItem.body_age,
        bodyfat: selectedItem.body_fat,
        bodyfat_left_arm: selectedItem.fat_lh,
        bodyfat_left_leg: selectedItem.fat_lf,
        bodyfat_right_arm: selectedItem.fat_rh,
        bodyfat_right_leg: selectedItem.fat_rf,
        bodyfat_trunk: selectedItem.fat_t,
        bone: selectedItem.bone,
        lbm: selectedItem.lbm,
        muscle: selectedItem.muscle,
        protein: selectedItem.protein,
        subfat: selectedItem.subfat,
        visfat: selectedItem.visfat,
        water: selectedItem.water,
        weight: selectedItem.weight,
        sinew: selectedItem.muscle_mass,
        sinew_left_arm: selectedItem.muscle_lh,
        sinew_left_leg: selectedItem.muscle_lf,
        sinew_right_arm: selectedItem.muscle_rh,
        sinew_right_leg: selectedItem.muscle_rf,
        sinew_trunk: selectedItem.muscle_t,
        score: selectedItem.score,
      };
      let measureDataStr = JSON.stringify(measureData);
      let config = {
        weightUnit: "kg",
        lang: "zh_CN",
        fallbackLang: "en",
      };
      let configStr = JSON.stringify(config);
      let params = `measureData=${measureDataStr}&config=${configStr}`;
      let src = "/bodyComposition/h5/report.html?" + decodeURIComponent(params);
      window.open(src, "_blank");
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
        params.created_at__gte = gte + " 00:00:00";
      }
      if (gte !== "" && new Date(lte).toString() !== "Invalid Date") {
        params.created_at__lte = lte + " 23:59:59";
      }
      return new Promise((resolve, reject) => {
        this.$api.bodyComposition
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
    selectedItem() {
      const item = this.bloodPressureHistoryTableData.find(
        (ele) => ele.id == this.selectedValue
      );
      return item;
    },
  },
};
</script>

<style lang="less" scoped>
.blood-pressure-record-container {
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .body-section {
    background-color: #fff;
    padding: 8px 0;
    border-radius: 14px;

    .body-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;

      .body-title {
        color: #7f7f7f;
        font-size: 14px;
      }

      .body-detail {
        color: #333333;
        font-size: 14px;
      }
    }
  }
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
</style>
