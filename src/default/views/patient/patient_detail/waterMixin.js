import dayjs from "dayjs";
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// 饮水结果
export default {
  data() {
    return {
      weightChartOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["饮水"],
          selected: {
            饮水: true,
          },
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "饮水",
            axisLabel: {
              formatter: "{value}",
            },
            min: 0,
            // interval: ,
            // splitLine: {show: false},
          },
        ],
        series: [
          {
            name: "饮水",
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            connectNulls: true,
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            itemStyle: {
              normal: {
                color: "#F99680",
                lineStyle: {
                  width: 4,
                },
              },
            },
            data: [],
          },
        ],
      },

      weightHistoryTableData: [],
      weightHistoryTotal: 0,
      weightHistoryPageSize: 10,
      weightHistoryPage: 1,

      bloodPressureHistoryTableData: [],
      bloodPressureHistoryTotal: 0,
      bloodPressureHistoryPageSize: 10,
      bloodPressureHistoryPage: 1,

      bloodSugarHistoryTableData: [],
      bloodSugarHistoryTotal: 0,
      bloodSugarHistoryPageSize: 10,
      bloodSugarHistoryPage: 1,

      todayWeightDatePicker: "",
      weightKindRadio: "周",
      weightChartDateRange: "",
      weightChartDateRange1: "",
      weightHistoryOnlyShowNotComment: false,
      weightHistoryRadio: "饮水",
      todayWeightRecord: {},
      todayWeightRecordTable: [],

      todayWeight: "", // 今日饮水
      todayInitWeight: "", // 初始饮水
      todayTargetWeight: "", // 目标饮水
      todayWeightToTarget: "", // 距目标还有
      todayBMI: "",
      todayBMR: "", // 基础代谢率
      todayFatPer: "", // 体脂率

      todayWeightRecordDialogVisible: false,
      todayWeightRecordTimerPeriod: "",
      todayWeightRecordedAt: "",
      todayWeightRecordWeightValue: "",
      todayWeightRecordWaistlineValue: "",

      weightRecord: {
        comments: [],
        foods: [],
        likes: [],
      }, // 当前点击的记录
      weightCommentDialogVisible: false,
      weightDetailDialogVisible: false,
      weightCommentContent: "",
      weightJumpFlag: 0,
    };
  },
  mounted() {
    this.todayWeightDatePicker = this.$day.format("YYYY-MM-DD");
    this.initTodayWeightRecordData();
  },
  methods: {
    initWeightData() {
      this.todayWeightDatePicker = this.$day.format("YYYY-MM-DD");
      this.getBloodPressureRecords();
      this.getTodayWeightInfo();
      this.getTodayWeightRecord();
      this.weightKindChange();
      this.todayWeight = "--";
      this.todayInitWeight = "--";
      this.todayTargetWeight = "--";
      this.todayWeightToTarget = "--";
      this.todayBMR = "--";
      this.todayBMI = "--";
      this.todayFatPer = "--";
      this.todayWeightRecordTimerPeriod =
        this.$enum.WEIGHT_RECORD_TIME_PERIOD.EMPTY_STOMACH;
      this.chartOptions = this.weightChartOptions;
    },
    initTodayWeightRecordData() {
      this.todayWeightRecord = {};
      this.todayWeightRecord.date = this.$Day(
        this.todayWeightDatePicker
      ).format("MM/DD");
      this.$dict.weightRecordTimePeriod.data.forEach((item) => {
        if (item.code === this.$enum.WEIGHT_RECORD_TIME_PERIOD.UNKNOWN) return;
        this.todayWeightRecord[item.code] = "--";
      });
    },
    getWeightRecords() {
      // const { weightHistoryTable } = this.$refs;
      // if (weightHistoryTable) {
      //   weightHistoryTable.loadStart();
      // }

      this.$api.bloodPressureRecords
        .getList({
          patient: this.patient.user_id,
          page: this.weightHistoryPage,
          page_size: this.weightHistoryPageSize,
          ordering: "-recorded_at",
          comments__isnull: this.weightHistoryOnlyShowNotComment ? true : null,
        })
        .then((res) => {
          console.log(res);
          this.weightHistoryTableData = res.data.results;
          this.weightHistoryTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getBloodSugarRecords() {
      const { bloodSugarHistoryTable } = this.$refs;
      if (bloodSugarHistoryTable) bloodSugarHistoryTable.loadStart();

      this.$api.bloodSugarRecords
        .getList({
          patient: this.patient.user_id,
          page: this.bloodSugarHistoryPage,
          page_size: this.bloodSugarHistoryPageSize,
          ordering: "-recorded_at",
          // comments__isnull: this.weightHistoryOnlyShowNotComment,
        })
        .then((res) => {
          this.bloodSugarHistoryTableData = res.data.results;
          this.bloodSugarHistoryTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getBloodPressureRecords() {
      const { weightHistoryTable } = this.$refs;
      if (weightHistoryTable) weightHistoryTable.loadStart();

      this.$api.waterRecords
        .getList({
          patient: this.patient.user_id,
          page: this.bloodPressureHistoryPage,
          page_size: this.bloodPressureHistoryPageSize,
        //   ordering: "-recorded_at",
          // comments__isnull: this.weightHistoryOnlyShowNotComment,
        })
        .then((res) => {
          this.bloodPressureHistoryTableData = res.data.results;
          this.bloodPressureHistoryTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    weightHistoryRadioChange(val) {
      switch (val) {
        case "饮水":
          this.getWeightRecords();
          break;
        case "血糖":
          this.getBloodSugarRecords();
          break;
        case "血压":
          this.getBloodPressureRecords();
          break;
      }
    },
    getTodayWeightInfo() {
      this.$api.physicalData
        .get(this.userId)
        .then((res) => {
          const patientPhysical = res.data;
          const isToday = this.$Day().isSame(
            this.$Day(patientPhysical.weight_updated_at),
            "day"
          );
          this.todayWeight = isToday ? patientPhysical.latest_weight : "--";
          this.todayInitWeight = patientPhysical.initial_weight;
          this.todayTargetWeight = patientPhysical.target_weight;
          this.todayWeightToTarget = isToday
            ? Math.abs(Math.round(this.todayTargetWeight - this.todayWeight))
            : "--";
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getTodayWeightRecord() {
      this.todayWeightRecordTable = [];
      if (
        this.todayWeightDatePicker === "" ||
        this.todayWeightDatePicker === null
      ) {
        return;
      }
      this.initTodayWeightRecordData();
      // const { todayWeightRecordTable } = this.$refs;
      // if (todayWeightRecordTable) {
      //   todayWeightRecordTable.loadStart();
      // }
      this.$api.bloodPressureRecords
        .getList({
          patient: this.patient.user_id,
          recorded_at__gte: this.todayWeightDatePicker + " 00:00:00",
          recorded_at__lte: this.todayWeightDatePicker + " 23:59:59",
          ordering: "-recorded_at"
        })
        .then((res) => {
            this.todayWeightRecordTable = res.data.results.map(ele => {
                return {
                    date: this.$Day(this.todayWeightDatePicker).format("MM/DD"),
                    time: this.$Day(ele.recorded_at).format("HH:mm:ss"),
                    ...ele,
                }
            });
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    todayWeightRecordClick() {
      this.todayWeightRecordDialogVisible = true;
      this.todayWeightRecordedAt = this.$day.format("HH:mm:ss");
      this.todayWeightRecordWeightValue = "";
      this.todayWeightRecordWaistlineValue = "";
    },
    validateTodayWeightRecordForm() {
      if (!this.todayDietRecordedDate) {
        this.$message.error("请选择测量日期");
        return false;
      }
      if (!this.todayDietRecordedAt) {
        this.$message.error("请选择测量时间");
        return false;
      }
      if (this.systolic === "") {
        this.$message.error("请输入收缩压");
        return false;
      }
      if (Number(this.systolic).toString() === "NaN") {
        this.$message.error("收缩压只能是数字");
        return false;
      }
      if (this.diastolic === "") {
        this.$message.error("请输入舒张压");
        return false;
      }
      if (Number(this.diastolic).toString() === "NaN") {
        this.$message.error("舒张压只能是数字");
        return false;
      }
      return true;
    },
    saveTodayWeight() {
      if (!this.validateTodayWeightRecordForm()) return;
      const params = {
        recorded_at:
          this.todayDietRecordedDate + " " + this.todayDietRecordedAt,
        patient: this.patient.user_id,
        systolic: this.systolic,
        diastolic: this.diastolic
      };
      this.$api.bloodPressureRecords
        .create(params)
        .then((res) => {
          this.getPatientStat();
          this.$message.success("新增血压记录成功");
          this.getBloodPressureRecords();
          this.getTodayWeightRecord();
          this.renderWeightChart();
          this.todayWeightRecordDialogVisible = false;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getWeightRecordDetail() {
      this.$api.weightRecords
        .getDetail(this.weightRecord.id)
        .then((res) => {
          const { comments, likes, foods } = res.data;
          this.weightRecord.comments = comments;
          this.weightRecord.likes = likes;
          this.weightRecord.foods = foods;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    weightLike(row) {
      this.$api.weightRecords
        .like(row.id)
        .then((res) => {
          if (this.weightDetailDialogVisible) {
            this.getWeightRecordDetail();
          } else {
            if (this.weightHistoryRadio === "饮水") {
              this.getWeightRecords();
            }
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    weightUnlike(row) {
      this.$api.weightRecords
        .unlike(row.id)
        .then((res) => {
          if (this.weightDetailDialogVisible) {
            this.getWeightRecordDetail();
          } else {
            if (this.weightHistoryRadio === "饮水") {
              this.getWeightRecords();
            }
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    weightEditClick(row) {
      this.weightRecord = row;
      this.weightDetailDialogVisible = true;
    },
    weightCommentClick(row) {
      this.weightRecord = row;
      this.weightCommentDialogVisible = true;
    },
    weightAddComment() {
      if (this.weightCommentContent === "") {
        return this.$message.error("请输入评论内容");
      }
      this.$api.weightComments
        .create({
          content: this.weightCommentContent,
          weight_record: this.weightRecord.id,
        })
        .then((res) => {
          this.weightCommentContent = "";
          this.$message.success("发表评论成功");
          if (this.weightDetailDialogVisible) {
            this.getWeightRecordDetail();
          } else {
            if (this.weightHistoryRadio === "饮水") {
              this.getWeightRecords();
            }
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    weightDeleteComment(id) {
      this.$confirm(`确定此条评论吗？`, "删除评论", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.weightComments
            .delete(id)
            .then((res) => {
              this.$message.success("删除评论成功");
              if (this.weightDetailDialogVisible) {
                this.getWeightRecordDetail();
              } else {
                if (this.weightHistoryRadio === "饮水") {
                  this.getWeightRecords();
                }
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    deleteWeightRecord(row) {
      this.$confirm(`确定此条饮水记录吗？`, "删除饮水记录", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.weightRecords
            .delete(row.id)
            .then((res) => {
              this.$message.success("删除饮水记录成功");
              this.getWeightRecords();
              this.getPatientStat();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    getWeightRecordsChange(val) {
      this.weightHistoryPage = 1;
      this.$nextTick(() => {
        this.weightHistoryRadioChange(this.weightHistoryRadio);
      });
    },
    weightChartDateRangePrevClick() {
      this.weightJumpFlag--;
      let step = this.weightJumpFlag;
      this.weightChartDateRange = [];
      switch (this.weightKindRadio) {
        case "周":
          this.weightChartDateRange[0] = this.$day
            .startOf("week")
            .add(step, "week")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("week")
            .add(step, "week")
            .format("YYYY-MM-DD");
          break;
        case "月":
          this.weightChartDateRange[0] = this.$day
            .startOf("month")
            .add(step, "month")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("month")
            .add(step, "month")
            .format("YYYY-MM-DD");
          break;
        case "年":
          this.weightChartDateRange[0] = this.$day
            .startOf("year")
            .add(step, "year")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("year")
            .add(step, "year")
            .format("YYYY-MM-DD");
          break;
      }
      this.renderWeightChart();
    },
    weightChartDateRangeNextClick() {
      if (
        this.$Day(this.weightChartDateRange[1] + " 23:59:59").isSameOrAfter(
          this.$day
        )
      ) {
        return this.$message.info("已经是最后了");
      }
      this.weightJumpFlag++;
      let step = this.weightJumpFlag;
      this.weightChartDateRange = [];
      switch (this.weightKindRadio) {
        case "周":
          this.weightChartDateRange[0] = this.$day
            .startOf("week")
            .add(step, "week")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("week")
            .add(step, "week")
            .format("YYYY-MM-DD");
          break;
        case "月":
          this.weightChartDateRange[0] = this.$day
            .startOf("month")
            .add(step, "month")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("month")
            .add(step, "month")
            .format("YYYY-MM-DD");
          break;
        case "年":
          this.weightChartDateRange[0] = this.$day
            .startOf("year")
            .add(step, "year")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("year")
            .add(step, "year")
            .format("YYYY-MM-DD");
          break;
      }
      this.renderWeightChart();
    },
    weightDateChange() {
      this.weightKindRadio = "自定义";
      this.weightChartDateRange = this.weightChartDateRange1;
      this.weightChartDateRange[0] =
        this.weightChartDateRange1[0].format("yyyy-MM-dd");
      this.weightChartDateRange[1] =
        this.weightChartDateRange1[1].format("yyyy-MM-dd");
      this.renderWeightChart();
    },
    weightDateFocus() {
      this.weightChartDateRange1 = "";
    },
    weightKindChange() {
      this.weightJumpFlag = 0;
      this.weightChartDateRange = [];

      switch (this.weightKindRadio) {
        case "周":
          this.weightChartDateRange[0] = this.$day
            .startOf("week")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("week")
            .format("YYYY-MM-DD");
          break;
        case "月":
          this.weightChartDateRange[0] = this.$day
            .startOf("month")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("month")
            .format("YYYY-MM-DD");

          break;
        case "年":
          this.weightChartDateRange[0] = this.$day
            .startOf("year")
            .format("YYYY-MM-DD");
          this.weightChartDateRange[1] = this.$day
            .endOf("year")
            .format("YYYY-MM-DD");
          break;
        case "自定义":
          this.weightChartDateRange[0] = this.weightChartDateRange1[0];
          this.weightChartDateRange[1] = this.weightChartDateRange1[1];
          break;
      }
      this.renderWeightChart();
    },
    async renderWeightChart() {
      const start = this.weightChartDateRange[0];
      const end = this.weightChartDateRange[1];

      this.weightChartOptions.xAxis[0].data = [];
      this.weightChartOptions.series[0].data = [];
      this.weightChartOptions.legend.data.forEach((key) => {
        this.weightChartOptions.legend.selected[key] = false;
      });
      let data = {};

      var dayss = [];

      switch (this.weightKindRadio) {
        case "周": {
          // 选择自然周按周一的日期到周日的日期设置x轴
          for (let i = 0; i < 7; i++) {
            this.weightChartOptions.xAxis[0].data[i] = this.$Day(start)
              .add(i, "day")
              .format("M/D");
          }
          this.weightChartOptions.series[0].data = new Array(7);
          data = await this.getPatientStatByChart("day", start, end);
          break;
        }
        case "月": {
          // 选择自然月按1日，8日，15日，22日设置x轴
          this.weightChartOptions.xAxis[0].data = [
            this.$Day(start).format("M/D"),
            this.$Day(start).add(7, "day").format("M/D"),
            this.$Day(start).add(14, "day").format("M/D"),
            this.$Day(start).add(21, "day").format("M/D"),
          ];
          dayss = [
            this.$Day(start).format("M/D"),
            this.$Day(start).add(7, "day"),
            this.$Day(start).add(14, "day"),
            this.$Day(start).add(21, "day"),
          ];
          this.weightChartOptions.series[0].data = new Array(4);
          data = await this.getPatientStatByChart("day", start, end);
          break;
        }
        case "年": {
          // 选择自然年按1月、2月......12月设置x轴
          this.weightChartOptions.xAxis[0].data = [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ];
          this.weightChartOptions.series[0].data = new Array(12);
          data = await this.getPatientStatByChart("month", start, end);
          break;
        }
        case "自定义": {
          const diff = this.$Day(end).diff(this.$Day(start), "day");
          let bet = 1;
          if (diff >= 14) {
            bet = parseInt(diff / 7);
          }
          let j = 0;
          for (let i = 0; i <= diff; i += bet) {
            dayss.push(this.$Day(start).add(i, "day"));
            this.weightChartOptions.xAxis[0].data[j] = this.$Day(start)
              .add(i, "day")
              .format("M/D");
            // this.weightChartOptions.xAxis[0].data[j] = this.$Day(start).add(i, 'day')
            j++;
          }
          if (diff >= 14 && diff % 7 != 0) {
            dayss.push(this.$Day(end));
            this.weightChartOptions.xAxis[0].data[j] =
              this.$Day(end).format("M/D");
            // this.weightChartOptions.xAxis[0].data[j] = this.$Day(end)
            j++;
          }
          this.weightChartOptions.series[0].data = new Array(j);
          data = await this.getPatientStatByChart("day", start, end);
          break;
        }
      }
      const weightStats = data.stats;

      // 比较接口返回的日期和x轴的日期，日期一致则赋值到相应series的data上
      switch (this.weightKindRadio) {
        case "周": {
          this.weightChartOptions.xAxis[0].data.forEach((item, index) => {
            weightStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format("M/D");
              if (statDate === item) {
                this.weightChartOptions.series[0].data[index] = stat.sum;
              }
            });
          });
          break;
        }
        case "月": {
          this.weightChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index];
            var next = null;
            if (index < dayss.length - 1) {
              next = dayss[index + 1];
            }
            weightStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format("M/D");
              if (next) {
                if (
                  this.$Day(stat.date).isSameOrAfter(items) &&
                  this.$Day(stat.date).isBefore(next)
                ) {
                  this.weightChartOptions.series[0].data[index] = stat.sum;
                }
              } else {
                if (
                  this.$Day(stat.date).isSameOrAfter(items) &&
                  this.$Day(stat.date).isSameOrBefore(items.endOf("month"))
                ) {
                  this.weightChartOptions.series[0].data[index] = stat.sum;
                }
              }
            });
          });
          this.weightChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index];
            var next = null;
            if (index < dayss.length - 1) {
              next = dayss[index + 1];
            }
            weightStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format("M/D");
              if (
                this.$Day(stat.date).isSameOrAfter(items) &&
                this.$Day(stat.date).isSameOrBefore(items.endOf("month"))
              ) {
                this.weightChartOptions.series[0].data[index] = stat.sum;
              }
            });
          });
          break;
        }
        case "年": {
          this.weightChartOptions.xAxis[0].data.forEach((item, index) => {
            weightStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format("M");
              if (statDate + "月" === item) {
                this.weightChartOptions.series[0].data[index] = stat.sum;
              }
            });
          });
          break;
        }
        case "自定义": {
          this.weightChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index];
            var next = null;
            if (index < dayss.length - 1) {
              next = dayss[index + 1];
            }
            weightStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format("M/D");
              if (next) {
                if (
                  this.$Day(stat.date).isSameOrAfter(items) &&
                  this.$Day(stat.date).isBefore(next)
                ) {
                  this.weightChartOptions.series[0].data[index] = stat.sum;
                }
              } else {
                if (statDate === item) {
                  this.weightChartOptions.series[0].data[index] = stat.sum;
                }
              }
            });
          });
          break;
        }
      }

      this.weightChartOptions.legend.data.forEach((key) => {
        this.weightChartOptions.legend.selected[key] = true;
      });
    },
  }, // methods end
  computed: {
    weightRecordLikedIsActive() {
      if (this.weightRecord.likes.length === 0) {
        return false;
      }
      if (
        this.weightRecord.likes.find(
          (item) => item.creator.id === this.userInfo.id
        )
      ) {
        return true;
      }
      return false;
    },
  },
};
