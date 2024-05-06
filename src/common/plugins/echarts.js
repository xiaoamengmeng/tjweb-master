import Vue from 'vue'
import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/timeline'
import 'echarts/lib/component/dataset'

Vue.component('v-chart', ECharts)
