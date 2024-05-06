<template>
  <div class="exercise-record-container">
    <div class="treat-result-view">
      <div class="chart-box">
        <!-- 左边卡片内容  -->
        <div class="box box-left">
          <template>
            <div class="mb_20">
              <el-date-picker
                readonly
                @click.native="openCalendar('todayExerciseDatePicker')"
                v-model="todayExerciseDatePicker"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :clearable="false"
              > </el-date-picker>
            </div>
            <div style="font-size: 14px; font-weight: 600; color: #5a6d86">
              今日消耗：<span class="mr_20">{{ todayExerciseCalories }}千卡</span>
              <span
                v-if="dataSyncInfo"
                class="mr_20"
              >手环同步数据消耗{{ parseInt(dataSyncInfo.calories) }}千卡</span>
            </div>
            <div style="margin-top: 10px">
              <template>
                <el-radio-group
                  v-model="topHistoryRadio"
                  size="small"
                  @change="topHistoryRadioChange"
                >
                  <el-radio-button label="手工记录"></el-radio-button>
                  <el-radio-button label="处方运动"></el-radio-button>
                  <el-radio-button label="手环运动"></el-radio-button>
                </el-radio-group>
              </template>
            </div>
            <div>
              <template v-if="topHistoryRadio=='手工记录'">
                <m-view-table
                  key="topHistoryRadio1"
                  class="mt_10 mb_20"
                  :data="todayExerciseRecord"
                  height="283"
                  hide-pagination
                  hide-loading
                  empty-text="暂无记录"
                >
                  <el-table-column
                    label="日期"
                    align="center"
                    min-width="70"
                  >
                    {{ $Day(todayExerciseDatePicker).format('M/D') }}
                  </el-table-column>
                  <el-table-column
                    label="运动时间"
                    align="center"
                    min-width="120"
                  >
                    <template v-slot="scope">
                      {{ scope.row.recorded_at | dateFormatHhmm }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="exercise.name"
                    label="运动项目"
                    align="center"
                    min-width="68"
                  > </el-table-column>
                  <el-table-column
                    prop="duration"
                    label="运动时长"
                    min-width="80"
                    align="center"
                  >
                    <template v-slot="scope"> {{ scope.row.duration }}分钟 </template>
                  </el-table-column>
                  <el-table-column
                    prop="calories"
                    label="消耗热量"
                    min-width="80"
                    align="center"
                  > </el-table-column>
                </m-view-table>
              </template>
              <template v-if="topHistoryRadio=='处方运动'">
                <m-view-table
                  key="topHistoryRadio2"
                  class="mt_10 mb_20"
                  :data="todayPrescriptionExerciseRecord"
                  height="283"
                  hide-pagination
                  hide-loading
                  empty-text="暂无记录"
                >
                  <el-table-column
                    label="日期"
                    align="center"
                    min-width="70"
                  >
                    {{ $Day(todayExerciseDatePicker).format('M/D') }}
                  </el-table-column>
                  <el-table-column
                    label="记录时间"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.recorded_at | dateFormatHhmmss }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="运动时长"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.duration | durationFilter }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="有效运动时长"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.effective_duration | durationFilter }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="消耗热量"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{  parseInt(scope.row.calories) + '千卡' }}
                    </template>
                  </el-table-column>
                </m-view-table>
              </template>
              <template v-if="topHistoryRadio=='手环运动'">
                <m-view-table
                  key="topHistoryRadio3"
                  class="mt_10 mb_20"
                  :data="todayBraceletExercise"
                  height="283"
                  hide-pagination
                  hide-loading
                  empty-text="暂无记录"
                >
                  <el-table-column
                    label="日期"
                    align="center"
                    min-width="70"
                  >
                    {{ $Day(todayExerciseDatePicker).format('M/D') }}
                  </el-table-column>
                  <el-table-column
                    label="记录时间"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.recorded_at | dateFormatHhmmss }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="运动类型"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.exercise_type_name }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="运动时长"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ scope.row.duration | durationFilter }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="消耗热量"
                    align="center"
                    min-width="80"
                  >
                    <template v-slot="scope">
                      {{ parseInt(scope.row.calorie / 1000) + '千卡' }}
                    </template>
                  </el-table-column>
                </m-view-table>
              </template>
            </div>

          </template>
        </div>
        <!-- 左边卡片内容结束  -->

        <!-- 右边卡片图表  -->
        <div class="box box-right">
          <template>
            <div class="mb_20">
              <i
                v-if="exerciseKindRadio != '自定义'"
                @click="exerciseChartDateRangePrevClick"
                class="el-icon-arrow-left cursor_point"
              ></i>
              <el-date-picker
                v-model="exerciseChartDateRange"
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
                v-if="exerciseKindRadio != '自定义'"
                @click="exerciseChartDateRangeNextClick"
                class="el-icon-arrow-right cursor_point"
              ></i>
              <el-radio-group
                class="right year-right"
                @change="exerciseKindChange"
                v-model="exerciseKindRadio"
                size="small"
              >
                <el-radio-button label="周"></el-radio-button>
                <el-radio-button label="月"></el-radio-button>
                <el-radio-button label="年"></el-radio-button>
                <el-radio-button label="自定义"></el-radio-button>
                <div class="year-right-picker">
                  <el-date-picker
                    v-model="exerciseChartDateRange1"
                    type="daterange"
                    range-separator=""
                    start-placeholder=""
                    end-placeholder=""
                    @change="exerciseDateChange"
                    @focus="exerciseDateFocus"
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
          v-if="historyRadio=='手工记录'"
          class="ml_30"
          :check.sync="exerciseHistoryOnlyShowNotComment"
          @change="getExerciseRecordsChange"
        > 仅展示未点评 </m-checkbox>
        <div class="right">
          <template>
            <el-radio-group
              v-model="historyRadio"
              size="small"
              @change="historyRadioChange"
            >
              <el-radio-button label="手工记录"></el-radio-button>
              <el-radio-button label="处方运动"></el-radio-button>
              <el-radio-button label="手环运动"></el-radio-button>
            </el-radio-group>
          </template>
        </div>
      </div>
      <div class="history-table mt_20">
        <template v-if="historyRadio === '手工记录'">
          <m-view-table
            key="historyRadio1"
            ref="exerciseHistoryTable"
            :data="exerciseHistoryTableData"
            height="303"
            :total="exerciseHistoryTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="exerciseHistoryPageSize"
            :current-page.sync="exerciseHistoryPage"
            :get-data-func="getExerciseRecords"
          >
            <el-table-column
              label="运动时间"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="exercise.name"
              label="运动项目"
              align="center"
              min-width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="duration"
              label="运动时长"
              align="center"
              min-width="80"
            > </el-table-column>
            <el-table-column
              label="运动图片"
              min-width="80"
              align="center"
            >
              <template v-slot="scope">
                <span v-if="!scope.row.image">暂无</span>
                <el-link
                  v-else
                  @click="previewImage(scope.row.image)"
                >查看图片</el-link>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              min-width="70"
              align="center"
            >
              <template v-slot="scope">
                <span v-if="!scope.row.info">暂无</span>
                <span v-else>{{ scope.row.info }}</span>
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
                    @click.native="exerciseUnlike(scope.row)"
                  ></icon-box>
                  <icon-box
                    v-else
                    icon-name="is_liked_false"
                    w="21"
                    h="21"
                    w-box="21 h-box=20"
                    style="cursor: pointer"
                    @click.native="exerciseLike(scope.row)"
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
                    @click.native="exerciseCommentClick(scope.row)"
                  ></icon-box>
                  <icon-box
                    icon-name="table_edit"
                    w="39"
                    h="39"
                    box-w="39"
                    style="cursor: pointer"
                    title="编辑"
                    @click.native="exerciseEditClick(scope.row)"
                  ></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-view-table>
        </template>
        <template v-else-if="historyRadio === '处方运动'">
          <m-view-table
            key="historyRadio2"
            height="303"
            :data="prescriptionHistoryTableData"
            :total="prescriptionHistoryTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="prescriptionHistoryPageSize"
            :current-page.sync="prescriptionHistoryPage"
            :get-data-func="getPrescriptionExerciseRecord"
          >
            <el-table-column
              label="记录时间"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              label="运动时长"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.duration | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column
              label="有效运动时长"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.effective_duration | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column
              label="消耗热量"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{  parseInt(scope.row.calories) + '千卡' }}
              </template>
            </el-table-column>
          </m-view-table>
        </template>
        <template v-else-if="historyRadio === '手环运动'">
          <m-view-table
            key="historyRadio3"
            height="303"
            :data="braceletHistoryTableData"
            :total="braceletHistoryTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="braceletHistoryPageSize"
            :current-page.sync="braceletHistoryPage"
            :get-data-func="getBraceletExercise"
          >
            <el-table-column
              label="记录时间"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              label="运动类型"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.exercise_type_name }}
              </template>
            </el-table-column>
            <el-table-column
              label="运动时长"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.duration | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column
              label="消耗热量"
              align="center"
              min-width="120"
            >
              <template v-slot="scope">
                {{ parseInt(scope.row.calorie / 1000) + '千卡' }}
              </template>
            </el-table-column>
          </m-view-table>
        </template>
      </div>
    </div>

    <el-dialog
      title="添加运动评论"
      :visible.sync="exerciseCommentDialogVisible"
      class="diet-comment-dialog"
    >
      <el-input
        class="mt_20"
        type="textarea"
        :rows="5"
        resize="none"
        placeholder="请输入内容"
        v-model="exerciseCommentContent"
      > </el-input>
      <el-button
        size="small"
        class="submit-btn"
        @click="exerciseAddComment"
      >发表</el-button>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="exerciseCommentDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="运动记录详情"
      :visible.sync="exerciseDetailDialogVisible"
      class="diet-edit-dialog exercise"
    >
      <div class="date mtext">
        <span>{{ exerciseRecord.recorded_at | dateFormat }}</span>
        <span class="ml_30">{{ exerciseRecord.meal | mealType }}</span>
      </div>
      <div class="date-time mtext">运动时间：{{ exerciseRecord.recorded_at | dateFormatHhmm }}</div>
      <div class="diet-image">
        <span class="mtext">运动照片：</span>
        <div
          v-if="!exerciseRecord.image"
          class="box empty"
        >暂无</div>
        <div
          v-else
          class="box"
        >
          <el-image
            class=""
            :src="exerciseRecord.image"
            :preview-src-list="[exerciseRecord.image]"
            fit="cover"
          > </el-image>
        </div>
      </div>
      <div class="remake">备注：{{ exerciseRecord.info ? exerciseRecord.info : '暂无' }}</div>
      <div class="comment-num">
        <div class="comment mtext">点评（{{ exerciseRecord.comments.length }}）</div>
        <div class="like mtext">
          点赞
          <span class="mr_6">
            {{ exerciseRecord.likes.length }}
          </span>
          <icon-box
            class="icon"
            v-if="exerciseRecordLikedIsActive"
            icon-name="is_liked_true"
            w="21"
            h="21"
            w-box="21 h-box=20"
            style="cursor: pointer"
            @click.native="exerciseUnlike(exerciseRecord)"
          ></icon-box>
          <icon-box
            class="icon"
            v-else
            icon-name="is_liked_false"
            w="21"
            h="21"
            w-box="21 h-box=20"
            style="cursor: pointer"
            @click.native="exerciseLike(exerciseRecord)"
          ></icon-box>
        </div>
      </div>
      <div class="comment-list">
        <div
          class="comment-item"
          v-for="comment in exerciseRecord.comments"
          :key="comment.id"
        >
          <div class="role-name mtext">
            【{{ comment.creator.role_name }} - {{ comment.creator.name }}】
            <el-link
              class="delete-link"
              v-if="comment.creator.id === userInfo.id"
              @click="exerciseDeleteComment(comment.id)"
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
          v-model="exerciseCommentContent"
          style="width: 400px"
        > </el-input>
        <el-button
          size="small"
          class="submit-btn"
          @click="exerciseAddComment"
        >发送</el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="exerciseDetailDialogVisible = false"
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
import exerciseMixin from "../exerciseMixin";
import calendar from "./calendar.vue";
import { mapGetters } from "vuex";
export default {
  mixins: [exerciseMixin],
  components: {
    calendar,
  },
  props: ["ppInfo", "previewImage"],
  data() {
    return {
      chartOptions: {},
      todayDietRecordedAt: "",
      historyRadio: "手工记录",
      topHistoryRadio: "手工记录",

      prescriptionHistoryTableData: [],
      prescriptionHistoryTotal: 0,
      prescriptionHistoryPageSize: 10,
      prescriptionHistoryPage: 1,

      braceletHistoryTableData: [],
      braceletHistoryTotal: 0,
      braceletHistoryPageSize: 10,
      braceletHistoryPage: 1,

      todayPrescriptionExerciseRecord: [],
      todayBraceletExercise: [],
    };
  },
  created() {
    this.initExerciseData();
  },
  filters: {
    durationFilter: function (n) {
      let str = "";
      let min = parseInt(parseInt(n) / 60);
      let sec = parseInt(n) % 60;
      if (min > 0) {
        str += min + "'";
      }
      str += sec + "''";
      return str;
    },
  },
  methods: {
    historyRadioChange(val) {
      switch (val) {
        case "手工记录":
          this.getExerciseRecords();
          break;
        case "处方运动":
          this.getPrescriptionExerciseRecord();
          break;
        case "手环运动":
          this.getBraceletExercise();
          break;
      }
    },
    topHistoryRadioChange(val) {
      switch (val) {
        case "手工记录":
          this.getTodayExerciseRecord();
          break;
        case "处方运动":
          this.getTodayPrescriptionExerciseRecord();
          break;
        case "手环运动":
          this.getTodayBraceletExercise();
          break;
      }
    },
    getTodayPrescriptionExerciseRecord() {
      this.$api.prescriptionExerciseRecord
        .getList({
          date: this.todayExerciseDatePicker,
          patient: this.patient.user_id,
          page: 1,
          page_size: 9999,
        })
        .then((res) => {
          this.todayPrescriptionExerciseRecord = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getTodayBraceletExercise() {
      this.$api.braceletExercise
        .getList({
          patient: this.patient.user_id,
          page: 1,
          page_size: 9999,
          start_time__gte: this.todayExerciseDatePicker + " 00:00:00",
          start_time__lte: this.todayExerciseDatePicker + " 23:59:59",
          ordering: "-start_time",
        })
        .then((res) => {
          this.todayBraceletExercise = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getBraceletExercise() {
      this.$api.braceletExercise
        .getList({
          patient: this.patient.user_id,
          page: this.braceletHistoryPage,
          page_size: this.braceletHistoryPageSize,
          ordering: "-recorded_at",
        })
        .then((res) => {
          this.braceletHistoryTableData = res.data.results;
          this.braceletHistoryTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    getPrescriptionExerciseRecord() {
      this.$api.prescriptionExerciseRecord
        .getList({
          patient: this.patient.user_id,
          page: this.prescriptionHistoryPage,
          page_size: this.prescriptionHistoryPageSize,
        })
        .then((res) => {
          this.prescriptionHistoryTableData = res.data.results;
          this.prescriptionHistoryTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
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
      this.todayExerciseDatePicker = e;
      switch (this.topHistoryRadio) {
        case "手工记录":
          this.getTodayExerciseRecord();
          break;
        case "处方运动":
          this.getTodayPrescriptionExerciseRecord();
          break;
        case "手环运动":
          this.getTodayBraceletExercise();
          break;
      }
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
.exercise-record-container {
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
