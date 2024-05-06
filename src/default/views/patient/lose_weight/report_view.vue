<template>
  <el-dialog
    :title="contentObj.title"
    :visible.sync="dialogVisible"
    class="dialog"
    @close="closeDialog"
  >
    <div class="report-wrapper">
      <div class="text-1 text_center mb_6">减重报告</div>
      <div class="date-range mb_6">
        {{ contentObj.data_time_from | dateFormatMDCN }}-{{ contentObj.data_time_to | dateFormatMDCN }}
      </div>
      <div class="weight-chart card mb_20">
        <div class="text-2 text_center mt_20">体重/腰围趋势</div>
        <div class="chart">
          <qiun-vue-ucharts
            type="area"
            :opts="weightOpts"
            :chartData="weightData"
            :animation="true"
            tooltipFormat="weightFormat"
            :canvas2d="true"
            inScrollView
            canvasId="bKMfJaWYnEQipVRqkJUrmnTOITpABs12"
          />
        </div>
      </div>

      <div class="grid-box card mb_10">
        <ul>
          <li>
            <div class="text-2">体重打卡</div>
            <div class="text-2">次数/天数</div>
            <div class="text-value">{{ contentObj.weight_record_count | round }}<span class="unit">次</span>/{{
                contentObj.weight_record_days
              }}<span class="unit">天</span>
            </div>
          </li>
          <li>
            <div class="text-2">BMI</div>
            <div class="text-value">{{ contentObj.bmi | round }}</div>
          </li>
          <li>
            <div class="text-2">最高体重</div>
            <div class="text-value">{{ contentObj.weight_max | round }}<span class="unit">kg</span></div>
          </li>
          <li>
            <div class="text-2">最低体重</div>
            <div class="text-value">{{ contentObj.weight_min | round }}<span class="unit">kg</span></div>
          </li>
          <li>
            <div class="text-2">最新体重</div>
            <div class="text-value">{{ contentObj.weight_latest | round }}<span class="unit">kg</span></div>
          </li>
          <li>
            <div class="text-2">最早体重</div>
            <div class="text-value">{{ contentObj.weight_first | round }}<span class="unit">kg</span></div>
          </li>
          <li>
            <div class="text-2">体重变化</div>
            <div class="text-value"><i v-if="contentObj.weight_change > 0" class="el-icon-top"></i><i v-if="contentObj.weight_change < 0" class="el-icon-bottom"></i>{{ abs(contentObj.weight_change) | round }}<span class="unit">kg</span></div>
          </li>
          <li>
            <div class="text-2">最高腰围</div>
            <div class="text-value">{{ contentObj.waistline_max | round }}<span class="unit">cm</span></div>
          </li>
          <li>
            <div class="text-2">最低腰围</div>
            <div class="text-value">{{ contentObj.waistline_min | round }}<span class="unit">cm</span></div>
          </li>
          <li>
            <div class="text-2">最新腰围</div>
            <div class="text-value">{{ contentObj.waistline_latest | round }}<span class="unit">cm</span></div>
          </li>
          <li>
            <div class="text-2">最早腰围</div>
            <div class="text-value">{{ contentObj.waistline_first | round }}<span class="unit">cm</span></div>
          </li>
          <li>
            <div class="text-2">腰围变化</div>
            <div class="text-value"><i v-if="contentObj.waistline_change > 0" class="el-icon-top"></i><i v-if="contentObj.waistline_change < 0" class="el-icon-bottom"></i>{{ abs(contentObj.waistline_change) | round }}<span class="unit">cm</span></div>
          </li>
        </ul>
      </div>

      <div class="text-2">
        本周体重均值：{{ contentObj.weight_avg | round }}kg，较上周差值：{{
          contentObj.weight_diff_from_last_week | round
        }}kg
      </div>
      <div class="text-2 mb_20">
        距目标前进了{{ contentObj.weight_forward_percent | round }}%，
        还有{{ contentObj.weight_to_target | round }}kg，请继续加油！
      </div>

      <div class="stat-chart card mb_20">
        <div class="chart">
          <qiun-vue-ucharts
            type="mix"
            :opts="sportOpts"
            :chartData="sportData"
            :animation="true"
            :canvas2d="true"
            inScrollView
            canvasId="uKMoYfJaWBawSWipVRqkJUrmnTOITp11s"
          />
        </div>
      </div>

      <div class="grid-box card">
        <ul>
          <li>
            <div class="text-2 grey">饮食打卡</div>
            <div class="text-value">{{ contentObj.diet_record_count | round }}<span class="unit">次</span></div>
          </li>
          <li>
            <div class="text-2 grey">运动打卡</div>
            <div class="text-value">{{ contentObj.exercise_record_count | round }}<span class="unit">次</span></div>
          </li>
          <li>
            <div class="text-2 grey">本周消耗</div>
            <div class="text-2 grey">总热量</div>
            <div class="text-value">{{ contentObj.exercise_calories_sum | round }}<span class="unit">千卡</span></div>
          </li>
          <li>
            <div class="text-2 grey">本周摄入</div>
            <div class="text-2 grey">总热量</div>
            <div class="text-value">{{ contentObj.eat_calories_sum | round }}<span class="unit">千卡</span></div>
          </li>
          <li>
            <div class="text-2 grey">上周摄入</div>
            <div class="text-2 grey">总热量</div>
            <div class="text-value">{{ contentObj.eat_calories_sum_last_week | round }}<span class="unit">千卡</span></div>
          </li>
          <li>
            <div class="text-2 grey">与上周比</div>
            <div class="text-2 grey">热量摄入差值</div>
            <div class="text-value">
              <i v-if="contentObj.eat_calories_change > 0" class="el-icon-top"></i>
              <i v-if="contentObj.eat_calories_change < 0" class="el-icon-bottom"></i>
              {{ abs(contentObj.eat_calories_change) | round }}<span class="unit">千卡</span>
            </div>
          </li>

        </ul>
      </div>

      <div class="mt_10">
        <div class="text-2">
          本周您完成了{{ contentObj.diet_record_count }}次饮食打卡，摄入总热量：
          {{ contentObj.eat_calories_sum }}千卡；
        </div>
        <div class="text-2">
          {{ dietComment }}
        </div>
        <div class="text-2">
          本周您完成了{{ contentObj.exercise_record_count }}次运动打卡，消耗总热量：
          {{ contentObj.exercise_calories_sum }}千卡；
        </div>
        <div class="text-2">
          {{ exerComment }}
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <m-button type="default" @click="closeDialog" w="80px">关 闭</m-button>
    </span>
  </el-dialog>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import reportModel from './reportModel'

import qiunVueUcharts from '@qiun/vue-ucharts'
import dayjs from 'dayjs'

const localSession = new LocalStore('RecipeView', true)

export default {
  name: 'RecipeView',
  components: {
    qiunVueUcharts,
  },
  props: {
    visible: false,
    reportId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      id: '',
      dialogVisible: false,
      contentObj: {},
      weightData: {
        categories: [],
        series: [{ index: 0, name: '体重', legendShape: 'line', connectNulls: true, data: [] },
          { index: 1, name: '腰围', legendShape: 'line', connectNulls: true, data: [] }]
      },
      weightOpts: {
        update: true,
        color: ["#299679", "#FAC858"],
        padding: [15, 15, 0, 15],
        dataLabel: false,
        dataPointShape: false,
        legend: { show: true },
        xAxis: {
          disableGrid: true,
          boundaryGap: "justify",
          axisLine: false,
          fontColor: '#6C6D76',
          fontSize: 12,
          format: "XDateFormat"
        },
        yAxis: {
          disableGrid: true,
          splitNumber: 3,
          data: [{
            axisLine: false,
            fontColor: '#6C6D76',
            fontSize: 12,
            tofix: 0,
            textAlign: 'left'
          },
            {
              position: 'right',
              title: '腰围',
              axisLine: false,
              fontColor: '#6C6D76',
              fontSize: 12,
              tofix: 0,
              textAlign: 'left'
            }]
        },
        extra: {
          area: {
            type: "straight",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: true
          },
          tooltip: {
            showBox: true,
            showArrow: false,
            showCategory: true,
            borderWidth: 0,
            borderRadius: 10,
            borderColor: "#000000",
            borderOpacity: 0.7,
            bgColor: "#000000",
            bgOpacity: 0.7,
            gridType: "dash",
            dashLength: 4,
            gridColor: "#CCCCCC",
            fontColor: "#FFFFFF",
            splitLine: false,
            horizentalLine: false,
            xAxisLabel: false,
            yAxisLabel: false,
            labelBgColor: "#FFFFFF",
            labelBgOpacity: 0.7,
            labelFontColor: "#666666"
          },
        },
      },
      sportData: {
        categories: [],
        series: [
          {
            index: 0,
            name: '运动消耗',
            type: 'column',
            color: '#E84E4D',
            data: [],
          },
          {
            index: 0,
            name: '能量摄入',
            type: 'column',
            color: '#FAC858',
            data: [],
          },
          {
            index: 1,
            name: '餐后血糖',
            type: 'line',
            style: 'curve',
            color: '#29b367',
            connectNulls: true,
            data: [],
          },
          {
            index: 1,
            name: '',
            type: 'area',
            style: 'curve',
            color: '#29b367',
            disableLegend: true,
            legendShape: 'none',
            connectNulls: true,
            data: [],
          }
        ]
      },
      sportOpts: {
        update: true,
        padding: [15, 15, 0, 15],
        dataLabel: false,
        dataPointShape: false,
        legend: { show: true },
        xAxis: {
          disableGrid: true,
          boundaryGap: "justify",
          axisLine: false,
          fontColor: '#6C6D76',
          fontSize: 12,
          format: "XDateFormat"
        },
        yAxis: {
          disableGrid: true,
          splitNumber: 4,
          showTitle: false,
          data: [{
            position: 'left',
            title: '运动消耗',
            axisLine: false,
            fontColor: '#6C6D76',
            fontSize: 12,
            tofix: 0,
            min: 0,
            textAlign: 'right'
          },
            {
              position: 'right',
              title: '血糖',
              axisLine: false,
              fontColor: '#6C6D76',
              fontSize: 12,
              tofix: 0,
              textAlign: 'left'
            }
          ]
        },
        extra: {
          mix: {
            area: {
              opacity: 0.2,
              gradient: true
            },
            column: {
              width: 3,
              barBorderCircle: true
            }
          },
          tooltip: {
            showBox: true,
            showArrow: false,
            showCategory: true,
            borderWidth: 0,
            borderRadius: 10,
            borderColor: "#000000",
            borderOpacity: 0.7,
            bgColor: "#000000",
            bgOpacity: 0.7,
            gridType: "dash",
            dashLength: 4,
            gridColor: "#CCCCCC",
            fontColor: "#FFFFFF",
            splitLine: false,
            horizentalLine: false,
            xAxisLabel: false,
            yAxisLabel: false,
            labelBgColor: "#FFFFFF",
            labelBgOpacity: 0.7,
            labelFontColor: "#666666"
          },
        },
      },
    }
  },
  watch: {
    visible(visible) {
      this.dialogVisible = visible
      if (visible) {
        this.$api.weeklyReports.getDetail(this.reportId)
          .then((res) => {
            this.contentObj = res.data
            this.renderChart()
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }
    },
  },
  mounted() {
    this.contentObj = reportModel
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    abs(value) {
      if (value === null || value === undefined || value === false) {
        return '--'
      } else {
        return Math.abs(value)
      }
    },
    renderChart() {
      Object.keys(this.contentObj).forEach(key => {
        if (this.contentObj[key] == null) this.contentObj[key] = '--'
        else if (typeof (this.contentObj[key]) == 'number' && parseInt(this.contentObj[key]) !== this.contentObj[key]) {
          this.contentObj[key] = Math.round(this.contentObj[key] * 10) / 10
        }
      })
      // 处理图表数据
      let weekArr = []
      for (var i = 0; i < 7; i++) {
        weekArr.push(dayjs(this.contentObj.data_time_from).startOf('day').add(i, 'day').format('MM/DD'))
      }
      this.weightData.categories = weekArr
      this.weightData.categories.forEach((day, i) => {
        let index = this.contentObj.weight_stats.findIndex(item => dayjs(item.date).format('MM/DD') == day)
        if (index != -1) {
          this.weightData.series[0].data.push(this.contentObj.weight_stats[index].weight)
          this.weightData.series[1].data.push(this.contentObj.weight_stats[index].waistline)
        } else {
          this.weightData.series[0].data.push(null)
          this.weightData.series[1].data.push(null)
        }
      })

      this.sportData.categories = weekArr
      this.sportData.categories.forEach((day, i) => {
        let res = this.contentObj
        // 血糖
        let blood_sugarIndex = res.blood_sugar_stats.findIndex(item => dayjs(item.date).format('MM/DD') == day)
        if (blood_sugarIndex != -1) {
          this.sportData.series[2].data.push(res.blood_sugar_stats[blood_sugarIndex].avg)
          this.sportData.series[3].data.push(res.blood_sugar_stats[blood_sugarIndex].avg)
        } else {
          this.sportData.series[2].data.push(null)
          this.sportData.series[3].data.push(null)
        }
        // 摄入
        let dietIndex = res.diet_stats.findIndex(item => dayjs(item.date).format('MM/DD') == day)
        if (dietIndex != -1) {
          this.sportData.series[1].data.push(res.diet_stats[dietIndex].sum)
        } else {
          this.sportData.series[1].data.push(null)
        }
        // 运动
        let exerciseIndex = res.exercise_stats.findIndex(item => dayjs(item.date).format('MM/DD') == day)
        if (exerciseIndex != -1) {
          this.sportData.series[0].data.push(res.exercise_stats[exerciseIndex].sum)
        } else {
          this.sportData.series[0].data.push(null)
        }
      })
    },

  }, // methods end
  computed: {
    dietComment() {
      const eatRecommend = this.contentObj.eat_calories_recommended
      if (eatRecommend === '--') {
        return `推荐总摄入--千卡`
      }
      const totalRecommendEat = eatRecommend * 7
      const eatCaloriesSum = this.contentObj.eat_calories_sum
      if (eatCaloriesSum === '--') {
        return `推荐总摄入${totalRecommendEat}千卡`
      }

      let delta = totalRecommendEat - eatCaloriesSum
      if (delta === 0) {
        return `与推荐的总摄入（${totalRecommendEat}千卡）一致`
      } else if (delta < 0) {
        return `比推荐的总摄入（${totalRecommendEat}千卡）多摄入了${-delta}千卡，要注意控制饮食哦！`
      } else {
        return `比推荐的总摄入（${totalRecommendEat}千卡）少摄入了${delta}千卡，要按时吃饭打卡哦！`
      }
      // '很好的完成了营养处方，请再接再厉，继续保持！'
    },
    exerComment() {
      const exerciseRecommend = this.contentObj.exercise_calories_recommended
      if (exerciseRecommend === '--') {
        return `推荐总消耗--千卡`
      }
      const totalRecommendExercise = exerciseRecommend * 7
      const exerciseCaloriesSum = this.contentObj.exercise_calories_sum
      if (exerciseCaloriesSum === '--') {
        return `推荐总消耗${totalRecommendExercise}千卡`
      }

      let delta = totalRecommendExercise - exerciseCaloriesSum
      if (delta === 0) {
        return `与推荐的总消耗（${totalRecommendExercise}千卡）一致`
      } else if (delta < 0) {
        return `比推荐的总消耗（${totalRecommendExercise}千卡）高了${-delta}千卡，太棒了！！`
      } else {
        return `比推荐的总消耗（${totalRecommendExercise}千卡）低了${delta}千卡，要坚持运动哦！！`
      }
    },
  },
}
</script>

<style scoped lang="less">
.dialog {
  :deep(.el-dialog) {
    margin-top: 32px !important;
    margin-bottom: 32px !important;
    width: 500px;
    height: auto;
    background-color: #f4f5fa;

    .el-dialog__header {

    }

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
    }
  }
}

.grey {
  color: #a8aaae !important;
}

.black {
  color: #323436 !important;
}

.text-1 {
  font-size: 18px;
  font-weight: 600;
  color: #566085;
}

.text-2 {
  font-size: 15px;
  font-weight: 400;
  .black();
}

.text-value {
  font-size: 16px;
  font-weight: bold;
  .black()
}

.unit {
  .grey();
  font-size: 13px;
  font-weight: normal;
}

.report-wrapper {
  padding: 0 30px;
  padding-bottom: 98px;

  .card {
    padding: 0;
    margin: 0;
    width: 100%;
    min-width: unset;
  }

  .weight-chart {
    width: 100%;
    height: 280px;
    background-color: #ccc;

    .chart {
      width: 360px;
      height: 200px;
      margin: 0 auto;
      margin-top: 20px;
    }
  }


  .stat-chart {
    width: 100%;
    height: 280px;
    background-color: #ccc;

    .chart {
      width: 360px;
      height: 240px;
      margin: 0 auto;
      margin-top: 30px;
    }
  }

  .grid-box {
    height: auto;
    /* 网格布局 */
    display: grid;

    /* 子元素居中 */
    place-items: center;
    /* 父元素 */

    ul {
      margin: 0;
      padding: 0;
      width: calc(400px + 2px);

      /* 清除默认样式 */
      list-style: none;

      /* 设置为flex布局 */
      display: flex;

      /* 设置换行 */
      flex-flow: wrap;
    }

    /* 子元素 */

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* 宽高都是100像素 */
      width: 33.333333333%;
      height: 133.333333333px;
      cursor: default;

      /* 设置盒模型 */
      box-sizing: border-box;

      /* 设置1像素的边框 */
      border: 1px solid #e6e6e6;

      /* 负边距 */
      margin: -1px 0 0 -1px;
    }

    /* 第1、4、7个子元素 */

    li:nth-child(3n+1) {
      /* 取消左负边距 */
      margin-left: 0;
      border-left: unset;
    }

    /* 第3、6、9个子元素 */

    li:nth-child(3n+3) {
      margin-right: 0;
      border-right: unset;
    }

    /* 前三个子元素 */

    li:nth-child(-n+3) {
      /* 取消上负边距 */
      margin-top: 0;
      border-top: unset;
    }

    /* 最后三个子元素 */

    li:nth-last-child(-n+3) {
      border-bottom: unset;
    }

    li:hover {
      background-color: #ebeef5;
    }
  }
}

.mb_20 {
  margin-bottom: 20px !important;
}

.mb_10 {
  margin-bottom: 10px !important;
}
</style>
