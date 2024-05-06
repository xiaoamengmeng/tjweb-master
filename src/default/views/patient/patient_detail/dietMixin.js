// 饮食结果
import food from "@/common/request/api/food"
import dietRecords from "@/common/request/api/dietRecords"
import dayjs from "dayjs"
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default {
  data() {
    return {
      dietChartOptions: {
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
          data: ['饮食摄入'],
          selected: {
            '饮食摄入': false,
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
            name: '热量',
            axisLabel: {
              formatter: '{value}'
            },
            min: 0,
            // splitLine: {show: false},
          },
        ],
        series: [
          {
            name: '饮食摄入',
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
                color: '#2E5EBB',
                lineStyle: {
                  width: 4
                }
              }
            },
            data: []
          },
        ]
      },
      todayDietDatePicker: '',
      todayDietRecord: [],
      dietHistoryTableData: [],
      dietHistoryTotal: 0,
      dietHistoryPageSize: 10,
      dietHistoryPage: 1,
      dietCalories: 0,
      recommendedTotalCalories: 0,
      dietHistoryOnlyShowNotComment: false,
      dietChartDateRange: '',
      dietChartDateRange1: '',
      dietKindRadio: '周',

      dietCommentDialogVisible: false,
      dietCommentContent: '',
      dietRecord: {
        meal: '',
        comments: [],
        foods: [],
        likes: [],
      },

      dietDetailDialogVisible: false,
      dietEditDialogVisible: false,

      dietRecordAddFooData: [],
      dietRecordAddFoodVisible: false,
      todayDietRecordDialogVisible: false,

      todayDietRecordAddFoodVisible: false,
      todayDietRecordMeal: 'breakfast',
      todayDietRecordAddFoodData: [],
      todayDietRecordAddFoodTableData: [],
      todayDietRecordedAt: '',
      todayDietRecordedInfo: '',

      dietJumpFlag: 0,
    }
  },
  watch: {
    dietEditDialogVisible(visible) {
      if (!visible) {
        this.dietRecord = {
          meal: '',
          comments: [],
          foods: [],
          likes: []
        }
        this.dietCommentContent = ''
      }
    },
    dietCommentDialogVisible(visible) {
      if (!visible) {
        this.dietRecord = {
          meal: '',
          comments: [],
          foods: [],
          likes: []
        }
        this.dietCommentContent = ''
      }
    },
    dietHistoryTableData(data) {
      //
    }
  },
  mounted() {
    this.todayDietDatePicker = this.$day.format('YYYY-MM-DD')
    this.initTodayDietRecordData()
  },
  methods: {
    initDietData() {
      this.todayDietDatePicker = this.$day.format('YYYY-MM-DD')
      this.getDietRecords()
      this.getTodayDietRecord()
      this.getTodayRecommendedCalories()
      this.dietKindChange()
      this.chartOptions = this.dietChartOptions
    },
    getDietRecords() {
      const { dietHistoryTable } = this.$refs
      if (dietHistoryTable) dietHistoryTable.loadStart()
      this.$api.dietRecords.getList({
        patient: this.patient.user_id,
        page: this.dietHistoryPage,
        page_size: this.dietHistoryPageSize,
        ordering: '-recorded_at',
        comments__isnull: this.dietHistoryOnlyShowNotComment ? true : null,
      })
        .then((res) => {
          this.dietHistoryTableData = res.data.results
          this.dietHistoryTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDietRecordDetail() {
      this.$api.dietRecords.getDetail(this.dietRecord.id)
        .then((res) => {
          const { comments, likes, foods } = res.data
          this.dietRecord.comments = comments
          this.dietRecord.likes = likes
          this.dietRecord.foods = foods
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDietRecordsChange() {
      this.dietHistoryPage = 1
      this.$nextTick(() => {
        this.getDietRecords()
      })
    },
    // 获取今日饮食推荐摄入
    getTodayRecommendedCalories() {
      this.recommendedTotalCalories = 0
      this.$api.physicalData.get(this.userId)
        .then((res) => {
          if (res.data.recommended_calories) {
            this.recommendedTotalCalories = res.data.recommended_calories
          } else {
            this.recommendedTotalCalories = '暂无'
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getTodayDietRecord() {
      if (this.todayDietDatePicker === '' || this.todayDietDatePicker === null) {
        return
      }
      this.initTodayDietRecordData()

      const { todayDietRecord } = this.$refs
      if (todayDietRecord) {
        todayDietRecord.loadStart()
      }

      this.$api.dietRecords.getList({
        patient: this.patient.user_id,
        recorded_at__gte: this.todayDietDatePicker + ' 00:00:00',
        recorded_at__lte: this.todayDietDatePicker + ' 23:59:59'
      })
        .then((res) => {
          const result = res.data.results
          this.calcDietCalories(result)
          if (result.length === 0) {
            this.todayDietRecord.forEach(item => {
              item.date = new Date(this.todayDietDatePicker).format('MM/dd')
            })
          } else {
            this.todayDietRecord.forEach((item) => {
              result.forEach((resultItem) => {
                item.date = new Date(this.todayDietDatePicker).format('MM/dd')
                if (resultItem.meal === item.meal) {
                  item.recorded_at = new Date(resultItem.recorded_at).format('hh:mm')
                  item.image = resultItem.image ? resultItem.image : null
                  item.info = resultItem.info ? resultItem.info : null
                  item.creator = !!resultItem.creator
                  item.foods = resultItem.foods
                }
              })
            })
          }
          this.$refs.todayDietRecord.loadDone()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    calcDietCalories(diets) {
      let sum = 0
      diets.forEach(item => {
        item.foods.forEach(item => {
          sum += item.calories
        })
      })
      this.dietCalories = sum
    },
    dietLike(row) {
      this.$api.dietRecords.like(row.id)
        .then((res) => {
          if (this.dietEditDialogVisible) {
            this.getDietRecordDetail()
          } else {
            this.getDietRecords()
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    dietUnlike(row) {
      this.$api.dietRecords.unlike(row.id)
        .then((res) => {
          if (this.dietEditDialogVisible) {
            this.getDietRecordDetail()
          } else {
            this.getDietRecords()
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    dietCommentClick(row) {
      this.dietRecord = row
      this.dietCommentDialogVisible = true
    },
    dietEditClick(row) {
      this.dietRecord = row
      this.dietEditDialogVisible = true
    },
    dietAddComment() {
      if (this.dietCommentContent === '') {
        return this.$message.error('请输入评论内容')
      }
      this.$api.dietComments.create({
        content: this.dietCommentContent,
        diet_record: this.dietRecord.id,
      })
        .then((res) => {
          this.dietCommentContent = ''
          this.$message.success('发表评论成功')
          this.dietCommentDialogVisible = false
          if (this.dietEditDialogVisible) {
            this.getDietRecordDetail()
          } else {
            this.getDietRecords()
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
    dietDeleteComment(id) {
      this.$confirm(`确定此条评论吗？`, '删除评论', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.dietComments.delete(id)
            .then((res) => {
              this.$message.success('删除评论成功')
              if (this.dietEditDialogVisible) {
                this.getDietRecordDetail()
              } else {
                this.getDietRecords()
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    deleteDietRecord(row) {
      this.$confirm(`确定此条饮食记录吗？`, '删除饮食记录', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.dietRecords.delete(row.id)
            .then((res) => {
              this.$message.success('删除饮食记录成功')
              this.getDietRecords()
              if (this.todayDietDatePicker === this.$Day(row.recorded_at).format('YYYY-MM-DD')) {
                this.getTodayDietRecord()
                this.renderDietChart()
                this.getPatientStat()
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    dietRecordAddFoodClick() {
      this.dietRecordAddFoodVisible = true
    },
    todayDietRecordAddFoodClick() {
      this.todayDietRecordAddFoodVisible = true
    },
    todayDietRecordClick() {
      this.todayDietRecordMeal = 'breakfast'
      this.todayDietRecordedAt = this.$day.format('HH:mm:ss')
      this.todayDietRecordAddFoodTableData = []
      this.todayDietRecordedInfo = ''
      this.todayDietRecordDialogVisible = true
    },
    dietRecordAddFooSave(data) {
      const find = data.find(item => item.period === this.dietRecord.meal)
      find.meal.forEach(item => {
        item.amount = item.weight
        item.calories = this.calcCalories(item)
        item.id = item.food.id
        this.dietRecord.foods.push(item)
      })
    },
    todayDietRecordAddFooSave(data) {
      const find = data.find(item => item.period === this.todayDietRecordMeal)
      find.meal.forEach(item => {
        item.meal = this.todayDietRecordMeal
        item.amount = item.weight
        item.calories = this.calcCalories(item)
        item.id = item.food.id
        this.todayDietRecordAddFoodTableData.push(item)
      })
    },
    calcCalories(food) {
      return Math.round(food.weight / 100 * food.calories)
    },
    dietRecordAddFoodSave() {
      this.$api.dietRecords.patch(this.dietRecord.id, {
        foods: this.dietRecord.foods
      })
        .then((res) => {
          this.$message.success('保存成功')
          this.getDietRecordDetail()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    saveTodayDiet() {
      if (!this.todayDietRecordedAt) {
        return this.$message.error('请选择用餐时间')
      }
      const params = {
        recorded_at: this.todayDietDatePicker + ' ' + this.todayDietRecordedAt,
        patient: this.patient.user_id,
        meal: this.todayDietRecordMeal,
        info: this.todayDietRecordedInfo,
        foods: this.todayDietRecordAddFoodTableData
      }
      this.$api.dietRecords.create(params)
        .then((res) => {
          this.todayDietRecordedInfo = ''
          this.todayDietRecordAddFoodTableData = []
          this.$message.success('新增饮食记录成功')
          this.getDietRecords()
          this.getTodayDietRecord()
          this.renderDietChart()
          this.getPatientStat()
          this.todayDietRecordDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    initTodayDietRecordData() {
      this.todayDietRecord = [
        {
          date: '',
          meal: 'breakfast',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
        {
          date: '',
          meal: 'mid_moor',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
        {
          date: '',
          meal: 'lunch',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
        {
          date: '',
          meal: 'mid_afternoon',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
        {
          date: '',
          meal: 'dinner',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
        {
          date: '',
          meal: 'late_night',
          recorded_at: '--',
          image: '--',
          info: '--',
        },
      ]
    },
    dietChartDateRangePrevClick() {
      this.dietJumpFlag--
      let step = this.dietJumpFlag
      this.dietChartDateRange = []
      switch (this.dietKindRadio) {
        case '周':
          this.dietChartDateRange[0] = this.$day.startOf('week').add(step, 'week').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('week').add(step, 'week').format('YYYY-MM-DD')
          break
        case '月':
          this.dietChartDateRange[0] = this.$day.startOf('month').add(step, 'month').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('month').add(step, 'month').format('YYYY-MM-DD')
          break
        case '年':
          this.dietChartDateRange[0] = this.$day.startOf('year').add(step, 'year').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('year').add(step, 'year').format('YYYY-MM-DD')
          break
      }
      this.renderDietChart()
    },
    dietChartDateRangeNextClick() {
      if (this.$Day(this.dietChartDateRange[1] + ' 23:59:59').isSameOrAfter(this.$day)) {
        return this.$message.info('已经是最后了')
      }
      this.dietJumpFlag++
      let step = this.dietJumpFlag
      this.dietChartDateRange = []
      switch (this.dietKindRadio) {
        case '周':
          this.dietChartDateRange[0] = this.$day.startOf('week').add(step, 'week').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('week').add(step, 'week').format('YYYY-MM-DD')
          break
        case '月':
          this.dietChartDateRange[0] = this.$day.startOf('month').add(step, 'month').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('month').add(step, 'month').format('YYYY-MM-DD')
          break
        case '年':
          this.dietChartDateRange[0] = this.$day.startOf('year').add(step, 'year').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('year').add(step, 'year').format('YYYY-MM-DD')
          break
      }
      this.renderDietChart()
    },
    dietDateChange() {
      this.dietKindRadio = '自定义'
      this.dietChartDateRange = this.dietChartDateRange1
      this.dietChartDateRange[0] = this.dietChartDateRange1[0].format('yyyy-MM-dd')
      this.dietChartDateRange[1] = this.dietChartDateRange1[1].format('yyyy-MM-dd')
      this.renderDietChart()
    },
    dietDateFocus() {
      this.dietChartDateRange1 = ''
    },
    dietKindChange() {
      this.dietJumpFlag = 0
      this.dietChartDateRange = []

      switch (this.dietKindRadio) {
        case '周':
          this.dietChartDateRange[0] = this.$day.startOf('week').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('week').format('YYYY-MM-DD')
          break
        case '月':
          this.dietChartDateRange[0] = this.$day.startOf('month').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('month').format('YYYY-MM-DD')
          break
        case '年':
          this.dietChartDateRange[0] = this.$day.startOf('year').format('YYYY-MM-DD')
          this.dietChartDateRange[1] = this.$day.endOf('year').format('YYYY-MM-DD')
          break
        case '自定义':
          this.dietChartDateRange[0] = this.dietChartDateRange1[0]
          this.dietChartDateRange[1] = this.dietChartDateRange1[1]
          break
      }
      this.renderDietChart()
    },
    async renderDietChart() {
      const start = this.dietChartDateRange[0]
      const end = this.dietChartDateRange[1]
      this.dietChartOptions.xAxis[0].data = []
      this.dietChartOptions.series[0].data = []
      this.dietChartOptions.legend.data.forEach((key) => {
        this.dietChartOptions.legend.selected[key] = false
      })
      let data = {}

      var dayss = []

      switch (this.dietKindRadio) {
        case '周': {
          // 选择自然周按周一的日期到周日的日期设置x轴
          data = await this.getPatientStatByChart('day', start, end)
          for (let i = 0; i < 7; i++) {
            this.dietChartOptions.xAxis[0].data[i] = this.$Day(start).add(i, 'day').format('M/D')
          }
          this.dietChartOptions.series[0].data = new Array(7)
          break
        }
        case '月': {
          // 选择自然月按1日，8日，15日，22日设置x轴
          data = await this.getPatientStatByChart('day', start, end)
          this.dietChartOptions.xAxis[0].data = [
            this.$Day(start).format('M/D'),
            this.$Day(start).add(7, 'day').format('M/D'),
            this.$Day(start).add(14, 'day').format('M/D'),
            this.$Day(start).add(21, 'day').format('M/D'),
          ]
          dayss = [
            this.$Day(start).format('M/D'),
            this.$Day(start).add(7, 'day'),
            this.$Day(start).add(14, 'day'),
            this.$Day(start).add(21, 'day')
          ]
          this.dietChartOptions.series[0].data = new Array(4)
          break
        }
        case '年': {
          // 选择自然年按1月、2月......12月设置x轴
          data = await this.getPatientStatByChart('month', start, end)
          this.dietChartOptions.xAxis[0].data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',]
          this.dietChartOptions.series[0].data = new Array(12)
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
            this.dietChartOptions.xAxis[0].data[j] = this.$Day(start).add(i, 'day').format('M/D')
            j++
          }
          if (diff >= 14 && diff % 7 != 0) {
            dayss.push(this.$Day(end))
            this.dietChartOptions.xAxis[0].data[j] = this.$Day(end).format('M/D')
            j++
          }
          this.dietChartOptions.series[0].data = new Array(j)
          data = await this.getPatientStatByChart('day', start, end)
          break
        }
      }

      const dietStats = data.diet_stats.stats
      const exerciseStats = data.exercise_stats.stats
      const weightStats = data.weight_stats.stats

      // 比较接口返回的日期和x轴的日期，日期一致则赋值到相应series的data上
      switch (this.dietKindRadio) {
        case '周': {
          this.dietChartOptions.xAxis[0].data.forEach((item, index) => {

            dietStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (statDate === item) {
                this.dietChartOptions.series[0].data[index] = stat.sum
              }
            })
          })
          break
        }
        case '月': {
          this.dietChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index]
            var next = null
            if (index < dayss.length - 1) {
              next = dayss[index + 1]
            }

            dietStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (next) {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isBefore(next)) {
                  this.dietChartOptions.series[0].data[index] = stat.sum
                }
              } else {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isSameOrBefore(items.endOf('month'))) {
                  this.dietChartOptions.series[0].data[index] = stat.sum
                }
              }
            })
          })
          break
        }
        case '年': {
          this.dietChartOptions.xAxis[0].data.forEach((item, index) => {
            dietStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M')
              if (statDate + '月' === item) {
                this.dietChartOptions.series[0].data[index] = stat.sum
              }
            })
          })
          break
        }
        case '自定义': {
          this.dietChartOptions.xAxis[0].data.forEach((item, index) => {
            var items = dayss[index]
            var next = null
            if (index < dayss.length - 1) {
              next = dayss[index + 1]
            }
            dietStats.forEach((stat) => {
              const statDate = this.$Day(stat.date).format('M/D')
              if (next) {
                if (this.$Day(stat.date).isSameOrAfter(items) && this.$Day(stat.date).isBefore(next)) {
                  this.dietChartOptions.series[0].data[index] = stat.sum
                }
              } else {
                if (statDate === item) {
                  this.dietChartOptions.series[0].data[index] = stat.sum
                }
              }
            })
          })
          break
        }
      }
      this.dietChartOptions.legend.data.forEach((key) => {
        this.dietChartOptions.legend.selected[key] = true
      })
    },
    showFoodDetail(foods) {
      return foods.reduce((item, curr) => {
        if (curr.food) {
          return item += curr.food.name + curr.amount + '克 '
        } else {
          return item += curr.picture_food + curr.amount + '克 '
        }
      }, '')
    },
  }, // methods end
  computed: {
    dietRecordLikedIsActive() {
      if (this.dietRecord.likes.length === 0) {
        return false
      }
      if (this.dietRecord.likes.find(item => item.creator.id === this.userInfo.id)) {
        return true
      }
      return false
    },
  },
}
