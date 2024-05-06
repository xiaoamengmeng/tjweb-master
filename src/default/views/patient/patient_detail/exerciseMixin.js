import dayjs from "dayjs";
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// 运动结果
export default {
  data() {
    return {
      exerciseChartOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['运动消耗'],
          selected: {
            '运动消耗': false,
          }
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            },
            min: 0,
            // splitLine: {show: false},
          },
        ],
        series: [
          {
            name: '运动消耗',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            connectNulls: true,
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            itemStyle: {
              normal: {
                color: '#33c8b2',
                lineStyle: {
                  width: 4
                }
              }
            },
            data: []
          },
        ]
      },
      todayExerciseDatePicker: '',
      todayExerciseRecord: [],
      dataSyncInfo: null,

      exerciseHistoryTableData: [],
      exerciseHistoryTotal: 0,
      exerciseHistoryPageSize: 10,
      exerciseHistoryPage: 1,
      exerciseChartDateRange: '',
      exerciseChartDateRange1: '',
      exerciseKindRadio: '周',
      exerciseHistoryOnlyShowNotComment: false,

      exerciseRecord: {
        comments: [],
        foods: [],
        likes: []
      }, // 当前点击的历史记录
      exerciseCommentDialogVisible: false,
      exerciseCommentContent: '',

      exerciseDetailDialogVisible: false,
      exerciseJumpFlag: 0,
    }
  },
  mounted() {
    this.todayExerciseDatePicker = this.$day.format('YYYY-MM-DD')
  },
  methods: {
    initExerciseData() {
      this.todayExerciseDatePicker = this.$day.format('YYYY-MM-DD')
      this.getExerciseRecords()
      this.getTodayExerciseRecord()
      this.exerciseKindChange()
      this.chartOptions = this.exerciseChartOptions
    },
    getExerciseRecords() {
      // this.$refs.exerciseHistoryTable.loadStart()
      this.$api.exerciseRecords.getList({
        patient: this.patient.user_id,
        page: this.exerciseHistoryPage,
        page_size: this.exerciseHistoryPageSize,
        ordering: '-recorded_at',
        comments__isnull: this.exerciseHistoryOnlyShowNotComment ? true : null,
      })
        .then((res) => {
          this.exerciseHistoryTableData = res.data.results
          this.exerciseHistoryTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getTodayExerciseRecord() {
      if (this.todayExerciseDatePicker === '' || this.todayExerciseDatePicker === null) {
        return
      }
      // this.$refs.todayExerciseRecord.loadStart()
      this.$api.exerciseRecords.getList({
        patient: this.patient.user_id,
        recorded_at__gte: this.todayExerciseDatePicker + ' 00:00:00',
        recorded_at__lte: this.todayExerciseDatePicker + ' 23:59:59'
      })
        .then((res) => {
          this.todayExerciseRecord = res.data.results
          // this.$refs.todayExerciseRecord.loadDone()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })

      this.$api.dataSync
        .getList({
          date: this.todayExerciseDatePicker,
          patient: this.patient.user_id,
          page: 1,
          page_size: 1,
        })
        .then((res) => {
          if (res.data && res.data.results && res.data.results.length > 0) {
            this.dataSyncInfo = res.data.results[0]
          } else {
            this.dataSyncInfo = null
          }
        })
        .catch((err) => {
          this.dataSyncInfo = null
          this.$message.error(JSON.stringify(err));
        });
    },
    getExerciseRecordDetail() {
      this.$api.exerciseRecords.getDetail(this.exerciseRecord.id)
        .then((res) => {
          const { comments, likes, foods } = res.data
          this.exerciseRecord.comments = comments
          this.exerciseRecord.likes = likes
          this.exerciseRecord.foods = foods
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getExerciseRecordsChange() {
      this.exerciseHistoryPage = 1
      this.$nextTick(() => {
        this.getExerciseRecords()
      })
    },
    exerciseLike(row) {
      this.$api.exerciseRecords.like(row.id)
        .then((res) => {
          if (this.exerciseDetailDialogVisible) {
            this.getExerciseRecordDetail()
          } else {
            this.getExerciseRecords()
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    exerciseUnlike(row) {
      this.$api.exerciseRecords.unlike(row.id)
        .then((res) => {
          if (this.exerciseDetailDialogVisible) {
            this.getExerciseRecordDetail()
          } else {
            this.getExerciseRecords()
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    exerciseCommentClick(row) {
      this.exerciseRecord = row
      this.exerciseCommentContent = ''
      this.exerciseCommentDialogVisible = true
    },
    exerciseAddComment() {
      if (this.exerciseCommentContent === '') {
        return this.$message.error('请输入评论内容')
      }
      this.$api.exerciseComments.create({
        content: this.exerciseCommentContent,
        exercise_record: this.exerciseRecord.id,
      })
        .then((res) => {
          this.exerciseCommentContent = ''
          this.$message.success('发表评论成功')
          this.exerciseCommentDialogVisible = false
          if (this.exerciseDetailDialogVisible) {
            this.getExerciseRecordDetail()
          } else {
            this.getExerciseRecords()
          }
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else {
            this.$message.error(JSON.stringify(err));
          }
        })
    },
    exerciseDeleteComment(id) {
      this.$confirm(`确定此条评论吗？`, '删除评论', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.exerciseComments.delete(id)
            .then((res) => {
              this.$message.success('删除评论成功')
              if (this.exerciseDetailDialogVisible) {
                this.getExerciseRecordDetail()
              } else {
                this.getExerciseRecords()
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    exerciseEditClick(row) {
      this.exerciseRecord = row
      this.exerciseDetailDialogVisible = true
    },
    exerciseKindChange() {
      this.exerciseJumpFlag = 0
      this.exerciseChartDateRange = []

      switch (this.exerciseKindRadio) {
        case '周':
          this.exerciseChartDateRange[0] = this.$day.startOf('week').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('week').format('YYYY-MM-DD')
          break
        case '月':
          this.exerciseChartDateRange[0] = this.$day.startOf('month').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('month').format('YYYY-MM-DD')
          break
        case '年':
          this.exerciseChartDateRange[0] = this.$day.startOf('year').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('year').format('YYYY-MM-DD')
          break
        case '自定义':
          this.exerciseChartDateRange[0] = this.exerciseChartDateRange1[0]
          this.exerciseChartDateRange[1] = this.exerciseChartDateRange1[1]
          break
      }
      this.renderExerciseChart()
    },
    exerciseChartDateRangePrevClick() {
      this.exerciseJumpFlag--
      let step = this.exerciseJumpFlag
      this.exerciseChartDateRange = []
      switch (this.exerciseKindRadio) {
        case '周':
          this.exerciseChartDateRange[0] = this.$day.startOf('week').add(step, 'week').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('week').add(step, 'week').format('YYYY-MM-DD')
          break
        case '月':
          this.exerciseChartDateRange[0] = this.$day.startOf('month').add(step, 'month').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('month').add(step, 'month').format('YYYY-MM-DD')
          break
        case '年':
          this.exerciseChartDateRange[0] = this.$day.startOf('year').add(step, 'year').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('year').add(step, 'year').format('YYYY-MM-DD')
          break
      }
      this.renderExerciseChart()
    },
    exerciseDateChange() {
      this.exerciseKindRadio = '自定义'
      this.exerciseChartDateRange = this.exerciseChartDateRange1
      this.exerciseChartDateRange[0] = this.exerciseChartDateRange1[0].format('yyyy-MM-dd')
      this.exerciseChartDateRange[1] = this.exerciseChartDateRange1[1].format('yyyy-MM-dd')
      this.renderExerciseChart()
    },
    exerciseDateFocus() {
      this.exerciseChartDateRange1 = ''
    },
    exerciseChartDateRangeNextClick() {
      if (this.$Day(this.exerciseChartDateRange[1] + ' 23:59:59').isSameOrAfter(this.$day)) {
        return this.$message.info('已经是最后了')
      }
      this.exerciseJumpFlag++
      let step = this.exerciseJumpFlag
      this.exerciseChartDateRange = []
      switch (this.exerciseKindRadio) {
        case '周':
          this.exerciseChartDateRange[0] = this.$day.startOf('week').add(step, 'week').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('week').add(step, 'week').format('YYYY-MM-DD')
          break
        case '月':
          this.exerciseChartDateRange[0] = this.$day.startOf('month').add(step, 'month').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('month').add(step, 'month').format('YYYY-MM-DD')
          break
        case '年':
          this.exerciseChartDateRange[0] = this.$day.startOf('year').add(step, 'year').format('YYYY-MM-DD')
          this.exerciseChartDateRange[1] = this.$day.endOf('year').add(step, 'year').format('YYYY-MM-DD')
          break
      }
      this.renderExerciseChart()
    },
    async renderExerciseChart() {
      const start = this.exerciseChartDateRange[0]
      const end = this.exerciseChartDateRange[1]
      this.exerciseChartOptions.xAxis[0].data = []
      this.exerciseChartOptions.series[0].data = []
      this.exerciseChartOptions.legend.data.forEach((key) => {
        this.exerciseChartOptions.legend.selected[key] = false
      })
      let data = {}

      var dayss = []

      switch (this.exerciseKindRadio) {
        case '周': {
          // 选择自然周按周一的日期到周日的日期设置x轴
          data = await this.getPatientStatByChart('day', this.exerciseChartDateRange[0], this.exerciseChartDateRange[1],)
          for (let i = 0; i < 7; i++) {
            this.exerciseChartOptions.xAxis[0].data[i] = this.$day.startOf('week').add(i, 'day').format('M/D')
          }
          this.exerciseChartOptions.series[0].data = new Array(7)
          break
        }
        case '月': {
          // 选择自然月按1日，8日，15日，22日设置x轴
          data = await this.getPatientStatByChart('day', this.exerciseChartDateRange[0], this.exerciseChartDateRange[1],)
          this.exerciseChartOptions.xAxis[0].data = [
            this.$day.startOf('month').format('M/D'),
            this.$day.startOf('month').add(7, 'day').format('M/D'),
            this.$day.startOf('month').add(14, 'day').format('M/D'),
            this.$day.startOf('month').add(21, 'day').format('M/D'),
          ]
          dayss = [
            this.$Day(start).format('M/D'),
            this.$Day(start).add(7, 'day'),
            this.$Day(start).add(14, 'day'),
            this.$Day(start).add(21, 'day')
          ]
          this.exerciseChartOptions.series[0].data = new Array(4)
          break
        }
        case '年': {
          // 选择自然年按1月、2月......12月设置x轴
          data = await this.getPatientStatByChart('month', this.exerciseChartDateRange[0], this.exerciseChartDateRange[1],)
          this.exerciseChartOptions.xAxis[0].data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',]
          this.exerciseChartOptions.series[0].data = new Array(12)
          break
        }
        case '自定义': {
          const diff = this.$Day(end).diff(this.$Day(start), 'day')
          let bet = 1
          if (diff >= 14) {
            bet = parseInt(diff / 7)
          }
          let j = 0
          for (let i = 0; i <= diff; i += bet) {
            dayss.push(this.$Day(start).add(i, 'day'))
            this.exerciseChartOptions.xAxis[0].data[j] = this.$Day(start).add(i, 'day').format('M/D')
            j++
          }
          if (diff >= 14 && diff % 7 != 0) {
            dayss.push(this.$Day(end))
            this.exerciseChartOptions.xAxis[0].data[j] = this.$Day(end).format('M/D')
            j++
          }
          this.exerciseChartOptions.series[0].data = new Array(j)
          data = await this.getPatientStatByChart('day', start, end)
          break
        }
      }

      const dietStats = data.diet_stats.stats
      const exerciseStats = data.exercise_stats.stats

      // 比较接口返回的日期和x轴的日期，日期一致则赋值到相应series的data上
      switch (this.exerciseKindRadio) {
        case '周': {
          this.exerciseChartOptions.xAxis[0].data.forEach((item, index) => {
            exerciseStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (statDate === item) {
                this.exerciseChartOptions.series[0].data[index] = stat.sum
              }
            })
          })
          break
        }
        case '月': {
          this.exerciseChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index]
            var next = null
            if (index < dayss.length - 1) {
              next = dayss[index + 1]
            }
            exerciseStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (next) {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isBefore(next)) {
                  this.exerciseChartOptions.series[0].data[index] = stat.sum
                }
              } else {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isSameOrBefore(items.endOf('month'))) {
                  this.exerciseChartOptions.series[0].data[index] = stat.sum
                }
              }
            })
          })
          break
        }
        case '年': {
          this.exerciseChartOptions.xAxis[0].data.forEach((item, index) => {
            exerciseStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M')
              if (statDate + '月' === item) {
                this.exerciseChartOptions.series[0].data[index] = stat.sum
              }
            })
          })
          break
        }
        case '自定义': {
          this.exerciseChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index]
            var next = null
            if (index < dayss.length - 1) {
              next = dayss[index + 1]
            }
            exerciseStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (next) {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isBefore(next)) {
                  this.exerciseChartOptions.series[0].data[index] = stat.sum
                }
              } else {
                if (statDate === item) {
                  this.exerciseChartOptions.series[0].data[index] = stat.sum
                }
              }
            })
          })
          break
        }
      }
      this.exerciseChartOptions.legend.data.forEach((key) => {
        this.exerciseChartOptions.legend.selected[key] = true
      })

    },
  }, // methods end
  computed: {
    exerciseRecordLikedIsActive() {
      if (this.exerciseRecord.likes.length === 0) {
        return false
      }
      if (this.exerciseRecord.likes.find(item => item.creator.id === this.userInfo.id)) {
        return true
      }
      return false
    },
    todayExerciseCalories() {
      let num = this.todayExerciseRecord.reduce((sum, curr) => {
        return curr.calories + sum
      }, 0)
      if (this.dataSyncInfo != null) {
        num += parseInt(this.dataSyncInfo.calories)
      }
      return num
    },
    todayExerciseHeartRate() {
      return 0
    },
    todayExerciseStepNumber() {
      return 0
    },
  },
}
