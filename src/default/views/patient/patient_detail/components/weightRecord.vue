<template>
  <div class="weight-record-container">
    <div class="treat-result-view">
      <div class="chart-box">
        <!-- 左边卡片内容  -->
        <div class="box box-left">
          <template>
            <div class="mb_20">
              <el-date-picker
                readonly
                v-model="todayWeightDatePicker"
                @click.native="openCalendar('todayWeightDatePicker')"
                style="cursor: pointer"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :clearable="false"
              > </el-date-picker>
              <m-button
                @click="todayWeightRecordClick"
                class="right"
                w="100px"
                h="36px"
              >记录</m-button>
            </div>
            <div class="weight-waistline-unit-text">
              体重
              <br />
              单位：公斤
            </div>
            <div class="number-view mb_20">
              <div class="number-item">
                <div
                  class="num"
                  style="font-size: 30px"
                >{{ todayWeight }} <span class="unit">kg</span></div>
                <div class="desc">今日体重</div>
              </div>
            </div>
            <div class="number-view">
              <div class="number-item">
                <div class="num">{{ todayInitWeight }} <span class="unit">kg</span></div>
                <div class="desc">初始体重</div>
              </div>
              <div class="number-item">
                <div class="num">{{ todayTargetWeight }} <span class="unit">kg</span></div>
                <div class="desc">目标值</div>
              </div>
              <div class="number-item">
                <div class="num">{{ todayWeightToTarget }} <span class="unit">kg</span></div>
                <div class="desc">距目标</div>
              </div>
            </div>

            <m-view-table
              ref="todayWeightRecordTable"
              class="today-weight-record-table mt_20 mb_20"
              :data="todayWeightRecordTable"
              height="116"
              hide-loading
              hide-pagination
            >
              <el-table-column
                prop="date"
                label="日期"
                align="center"
                min-width="70"
              > </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="empty_stomach"
                label="起床空腹"
                align="center"
                min-width="78"
              > </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="before_breakfast"
                label="早餐前"
                align="center"
                min-width="68"
              > </el-table-column>
              <el-table-column
                prop="after_breakfast"
                label="早餐后"
                width="68"
                align="center"
              > </el-table-column>
              <el-table-column
                prop="before_lunch"
                label="午餐前"
                width="68"
                align="center"
              > </el-table-column>
              <el-table-column
                prop="after_lunch"
                label="午餐后"
                width="68"
                align="center"
              > </el-table-column>
              <el-table-column
                prop="before_dinner"
                label="晚餐前"
                width="68"
                align="center"
              > </el-table-column>
              <el-table-column
                prop="after_dinner"
                label="晚餐后"
                width="68"
                align="center"
              > </el-table-column>
              <el-table-column
                prop="before_sleep"
                label="睡前"
                width="68"
                align="center"
              > </el-table-column>
            </m-view-table>

            <div class="number-view">
              <div class="number-item">
                <div class="num">{{ todayBMI }} <span class="unit">%</span></div>
                <div class="desc">BMI</div>
              </div>
              <div class="number-item">
                <div class="num">{{ todayFatPer }} <span class="unit">%</span></div>
                <div class="desc">体脂率</div>
              </div>
              <div class="number-item">
                <div class="num">{{ todayBMR }} <span class="unit">千卡</span></div>
                <div class="desc">基础代谢率</div>
              </div>
            </div>
          </template>
        </div>
        <!-- 左边卡片内容结束  -->

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
        <m-checkbox
          class="ml_30"
          :check.sync="weightHistoryOnlyShowNotComment"
          @change="getWeightRecordsChange"
        > 仅展示未点评 </m-checkbox>
      </div>
      <div class="history-table mt_20">
        <m-view-table
          ref="weightHistoryTable"
          height="303"
          :data="weightHistoryTableData"
          :total="weightHistoryTotal"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="weightHistoryPageSize"
          :current-page.sync="weightHistoryPage"
          :get-data-func="getWeightRecords"
        >
          <el-table-column
            label="测量时间"
            align="center"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.recorded_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数值（kg）"
            align="center"
            min-width="100"
          >
            <template v-slot="scope">
              <div style="position: relative">
                <span style="position: absolute; top: -4px; left: 2px; font-size: 12px; color: #ccc">
                  {{ scope.row.source != "患者" ? scope.row.creator.name : scope.row.source }}
                </span>
                {{ Math.round(scope.row.weight) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="场景"
            align="center"
            min-width="80"
          >
            <template v-slot="scope">
              {{ $dict.weightRecordTimePeriod.getLabel(scope.row.time_period) }}
            </template>
          </el-table-column>
          <el-table-column
            label="点赞"
            min-width="50"
            align="center"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box
                  v-if="historyTableIsMyLiked(scope.row.likes)"
                  icon-name="is_liked_true"
                  w="21"
                  h="21"
                  w-box="21 h-box=20"
                  style="cursor: pointer"
                  @click.native="weightUnlike(scope.row)"
                ></icon-box>
                <icon-box
                  v-else
                  icon-name="is_liked_false"
                  w="21"
                  h="21"
                  w-box="21 h-box=20"
                  style="cursor: pointer"
                  @click.native="weightLike(scope.row)"
                ></icon-box>
                <span class="ml_4">
                  {{ scope.row.likes.length }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="评论"
            min-width="120"
            align="center"
          >
            <template v-slot="scope">
              <span v-if="scope.row.comments && scope.row.comments.length === 0">暂无</span>
              <template v-else>
                {{ scope.row.comments | showComments }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160px"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box
                  icon-name="table_comment"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="发表评论"
                  @click.native="weightCommentClick(scope.row)"
                ></icon-box>
                <icon-box
                  icon-name="table_edit"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="编辑"
                  @click.native="weightEditClick(scope.row)"
                ></icon-box>
                <icon-box
                  v-if="historyTableIsMyCreator(scope.row.creator)"
                  icon-name="table_delete"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="删除"
                  @click.native="deleteWeightRecord(scope.row)"
                ></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
    </div>
    <el-dialog
      title="记录体重"
      :visible.sync="todayWeightRecordDialogVisible"
      class="today-record-dialog weight"
    >
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="选择时段"
              required
            >
              <el-select
                v-model="todayWeightRecordTimerPeriod"
                placeholder="请选择时段"
                style="width: 100%"
              >
                <el-option
                  v-for="(period, index) in $dict.weightRecordTimePeriod.data"
                  :key="'period' + index"
                  :label="period.label"
                  :value="period.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="体重"
              required
            >
              <el-input
                v-model="todayWeightRecordWeightValue"
                placeholder="请输入体重"
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
    <el-dialog
      title="体重记录详情"
      :visible.sync="weightDetailDialogVisible"
      class="diet-edit-dialog exercise"
    >
      <div class="date mtext">
        <span>{{ weightRecord.recorded_at | dateFormatCN }}</span>
      </div>
      <div class="date-time mtext">测量时间：{{ weightRecord.recorded_at | dateFormatHhmmss }}</div>
      <div class="date-time mtext">测量场景：{{ $dict.weightRecordTimePeriod.getLabel(weightRecord.time_period) }}</div>
      <div class="date-time mtext">体重：{{ Number(weightRecord.weight).toFixed(2) }} kg</div>
      <div class="comment-num">
        <div class="comment mtext">点评（{{ weightRecord.comments.length }}）</div>
        <div class="like mtext">
          点赞
          <span class="mr_6">
            {{ weightRecord.likes.length }}
          </span>
          <icon-box
            class="icon"
            v-if="weightRecordLikedIsActive"
            icon-name="is_liked_true"
            w="21"
            h="21"
            w-box="21 h-box=20"
            style="cursor: pointer"
            @click.native="weightUnlike(weightRecord)"
          ></icon-box>
          <icon-box
            class="icon"
            v-else
            icon-name="is_liked_false"
            w="21"
            h="21"
            w-box="21 h-box=20"
            style="cursor: pointer"
            @click.native="weightLike(weightRecord)"
          ></icon-box>
        </div>
      </div>
      <div class="comment-list">
        <div
          class="comment-item"
          v-for="comment in weightRecord.comments"
          :key="comment.id"
        >
          <div class="role-name mtext">
            【{{ comment.creator.role_name }} - {{ comment.creator.name }}】
            <el-link
              class="delete-link"
              v-if="comment.creator.id === userInfo.id"
              @click="weightDeleteComment(comment.id)"
            >删除 </el-link>
          </div>
          <div class="content">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div class="comment-text-box">
        <el-input
          class="mt_20"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入点评内容"
          v-model="weightCommentContent"
          style="width: 400px"
        > </el-input>
        <el-button
          size="small"
          class="submit-btn"
          @click="weightAddComment"
        >发送</el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="weightDetailDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加体重评论"
      :visible.sync="weightCommentDialogVisible"
      class="diet-comment-dialog"
      width="600px"
    >
      <el-input
        class="mt_20"
        type="textarea"
        :rows="5"
        resize="none"
        placeholder="请输入内容"
        v-model="weightCommentContent"
      > </el-input>
      <el-button
        size="small"
        class="submit-btn"
        @click="weightAddComment"
      >发表</el-button>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="weightCommentDialogVisible = false"
        >关 闭</m-button>
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
import weightMixin from "../weightMixin";
import calendar from "./calendar.vue";
import { mapGetters } from "vuex";
export default {
  mixins: [weightMixin],
  components: {
    calendar,
  },
  props: ["ppInfo"],
  data() {
    return {
      chartOptions: {},
      todayDietRecordedAt: "",
    };
  },
  created() {
    this.initWeightData();
  },
  methods: {
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
      };
      if (gte !== "" && new Date(gte).toString() !== "Invalid Date") {
        params.recorded_at__gte = gte + " 00:00:00";
      }
      if (gte !== "" && new Date(lte).toString() !== "Invalid Date") {
        params.recorded_at__lte = lte + " 23:59:59";
      }
      return new Promise((resolve, reject) => {
        this.$api.patients
          .getStat(this.patient.user_id, params)
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
.weight-record-container {
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
