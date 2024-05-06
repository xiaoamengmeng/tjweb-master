<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_tjfx" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>统计分析</b>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <div>
          <el-radio-group @change="assignedChange" class="radio-group" v-model="viewsMode">
            <el-radio-button class="radio-group-item" v-auth="'nurtStat.weight'" label="体重统计"></el-radio-button>
            <el-radio-button class="radio-group-item" v-auth="'nurtStat.answer'" label="答题记录"></el-radio-button>
            <el-radio-button class="radio-group-item" v-auth="'nurtStat.compliance'" label="依从性统计"></el-radio-button>
          </el-radio-group>
        </div>

        <template v-if="viewsMode == '体重统计'">
          <el-form
            class="form-box"
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">项目</el-row>
                  <el-row>
                    <el-form-item prop="project">
                      <el-select v-model="form.project" placeholder="全部" clearable>
                        <template v-for="item in projectList">
                          <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">阶段</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-select
                        v-model="form.stage"
                        placeholder="请选择"
                        clearable
                        style="width:100%;"
                      >
                        <el-option label="置入期" value="置入期"></el-option>
                        <el-option label="过渡期" value="过渡期"></el-option>
                        <el-option label="稳定期" value="稳定期"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">统计周期</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-date-picker
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-model="form.range"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button @click="page=1;getWeightStatList()" icon="el-icon-search" h="40px" w="100px"> 搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>

          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getWeightStatList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="患者"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="性别"
            >
              <template v-slot="scope">
                {{ scope.row.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="age"
              label="年龄"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="bmi"
              label="BMI"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="height"
              label="身高"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="initial_weight"
              label="初始体重"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="latest_weight"
              label="最新体重"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="体重变化"
            >
              <template v-slot="scope">
                <template v-if="scope.row.initial_weight && scope.row.latest_weight">
                  <i v-if="scope.row.initial_weight - scope.row.latest_weight < 0" class="el-icon-top"></i>
                  <i v-if="scope.row.initial_weight - scope.row.latest_weight > 0" class="el-icon-bottom"></i>
                  {{ calcChangeValue(scope.row.initial_weight, scope.row.latest_weight) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="first_waistline"
              label="初始腰围"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="latest_waistline"
              label="最新腰围"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="腰围变化"
            >
              <template v-slot="scope">
                <template v-if="scope.row.first_waistline && scope.row.latest_waistline">
                  <i v-if="scope.row.first_waistline - scope.row.latest_waistline < 0" class="el-icon-top"></i>
                  <i v-if="scope.row.first_waistline - scope.row.latest_waistline > 0" class="el-icon-bottom"></i>
                  {{ calcChangeValue(scope.row.first_waistline, scope.row.latest_waistline) }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="阶段"
            >
              <template v-slot="scope">
                <template v-if="scope.row.stages.length === 1 && scope.row.stages[0] === null">
                  未设置
                </template>
                <template v-else-if="scope.row.stages && scope.row.stages.length > 0">
                  {{ scope.row.stages | showSlowly }}
                </template>
                <template v-else>
                  未设置
                </template>
              </template>
            </el-table-column>
          </m-table>
        </template>
        <template v-if="viewsMode == '答题记录'">
          <el-form
            class="form-box"
            :model="scaleSearchForm"
            ref="form"
            label-position="top"
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">患者姓名</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="scaleSearchForm.name"
                        placeholder="请输入患者姓名"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button @click="scalePage=1;getScaleStatList()" icon="el-icon-search" h="40px" w="100px">搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <m-table
            ref="scaleTable"
            class="m-table"
            :data="scaleTableData"
            :total="scaleTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="scalePageSize"
            :current-page.sync="scalePage"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getScaleStatList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="反馈者"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="phone"
              label="手机号"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="total_views"
              label="累计查阅答题"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="record_count"
              label="提交答题记录"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="compliance_rate"
              label="依从率"
              min-width="120"
            >
            </el-table-column>
          </m-table>
        </template>
        <template v-if="viewsMode == '依从性统计'">
          <el-form
            class="form-box"
            :model="complianceForm"
            ref="form"
            label-position="top"
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">项目</el-row>
                  <el-row>
                    <el-form-item prop="project">
                      <el-select v-model="complianceForm.project_id" placeholder="全部" clearable>
                        <template v-for="item in projectList">
                          <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">患者姓名</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="complianceForm.search"
                        placeholder="请输入患者姓名"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button @click="compliancePage = 1;getPatients()" icon="el-icon-search" h="40px" w="100px"> 搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <m-table
            ref="table1"
            class="m-table"
            :data="complianceTableData"
            :total="complianceTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="compliancePageSize"
            :current-page.sync="compliancePage"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getPatients"
          >
            <el-table-column
              show-overflow-tooltip
              prop="user_id"
              label="患者ID"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="患者姓名"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="性别"
            >
              <template v-slot="scope">
                {{ $dict.sex.getLabel(scope.row.sex) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="年龄"
            >
              <template v-slot="scope">
                <span v-if="scope.row.user_profile && scope.row.user_profile.birthday">
                  {{ scope.row.user_profile.birthday | calcAge }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="项目名称"
            >
              <template v-slot="scope">
                <span v-if="scope.row.subscriptions && scope.row.subscriptions[0] && scope.row.subscriptions[0].project">
                  {{ scope.row.subscriptions[0].project.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="服务状态"
            >
              <template v-slot="scope">
                <span v-if="scope.row.subscriptions && scope.row.subscriptions[0]">
                  {{ $dict.patientServiceStatus.getLabel(scope.row.subscriptions[0].status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="项目阶段"
            >
              <template v-slot="scope">
                <span v-if="scope.row.subscriptions && scope.row.subscriptions[0]">
                  {{ scope.row.subscriptions[0].stage }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <el-link @click.native="changeInfoClick(scope.row)">查看统计数据</el-link>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
    </div>
    <el-dialog
      title="查看统计数据"
      :visible.sync="dialogVisible"
      :modal="true"
      :destroy-on-close="true"
      class="creation-dialog"
    >
      <div>
        <div class="creation-dialog-top">
          <p>{{ selectedCompliance.name }}</p>
          <download-excel
            class="export-excel-wrapper"
            :data="json_data"
            :fields="json_fields"
            type="xls"
            worksheet="sheet1"
            :name="infoName"
          >
            <m-button>导出</m-button>
          </download-excel>
        </div>
        <div class="chart-wrapper">
          <v-chart
            ref="weightChart"
            :options="chartOptions"
            class="chart"
            autoresize
          ></v-chart>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
export default {
  name: 'Stat',
  data() {
    return {
      viewsMode: '体重统计',
      form: {
        stage: '',
        name: '',
        project: '',
        range: ''
      },
      rules: {},
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      scaleSearchForm: {
        name: ''
      },

      scaleTableData: [],
      scaleTotal: 0,
      scalePageSize: 10,
      scalePage: 1,

      assignedForm: {},
      assignedRules: {},

      projectList: [],

      dialogVisible: false,
      complianceTableData: [],
      complianceTotal: 0,
      compliancePageSize: 10,
      compliancePage: 1,

      selectedCompliance: {},

      complianceForm: {
        project_id: '',
        search: '',
      },
      

      chartOptions:  {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let list = ''
            if (params.length > 0) {
              list += params[0].name + '<br/>'
            }
            for (let i = 0; i < params.length; i++) {
              const element = params[i];
              let data = (element.data * 100).toFixed(2) + '%'
              list += (element.marker + element.seriesName + '：' + data) + '<br/>'
            }
            return list
          }
        },
        legend: {
          data: ['运动处方打卡', '饮食打卡', '体重打卡']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          // axisLabel: {
          //   align: 'left',
          // }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function(value, index) {
              let num = parseFloat(value) * 100
              return num.toFixed(2) + '%'
            }
          }
        },
        series: [
          {
            name: '运动处方打卡',
            type: 'line',
            // stack: 'Total',
            data: []
          },
          {
            name: '饮食打卡',
            type: 'line',
            // stack: 'Total',
            data: []
          },
          {
            name: '体重打卡',
            type: 'line',
            // stack: 'Total',
            data: []
          }
        ]
      },

      json_fields: {
        患者ID:  "user_id",           //常规字段
        患者姓名: "name",    //支持嵌套属性
        性别:    "sex",    //支持嵌套属性
        年龄:    "age",
        项目名称: "project_name",
        服务状态: "status",
        项目阶段: "stage",
      },
    }
  },
  mounted() {
    const permissions = this.userInfo.func_permissions.split(',')
    if (permissions.includes('nurtStat.compliance')) {
      this.viewsMode = '依从性统计'
    }
    if (permissions.includes('nurtStat.answer')) {
      this.viewsMode = '答题记录'
    }
    if (permissions.includes('nurtStat.weight')) {
      this.viewsMode = '体重统计'
    }
    this.getProjectList()
    this.assignedChange(this.viewsMode)
  },
  methods: {
    getProjectList() {
      this.$api.project.getList({
        page: 1,
        page_size: 9999,
        ordering: 'id',
        dpt: this.userInfo.selectedDepartment.id,
        org: this.userInfo.selectedOrganization.id,
      })
        .then((res) => {
          this.projectList = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getWeightStatList() {
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
        stage: this.form.stage,
        project_id: this.form.project,
        dpt_id: this.userInfo.selectedDepartment.id,
        org_id: this.userInfo.selectedOrganization.id,
      }
      if (this.form.range !== '' && this.form.range !== null) {
        params.recorded_at_from = this.form.range[0]
        params.recorded_at_to = this.form.range[1]
      }
      const { table } = this.$refs
      if (table) {
        table.loadStart()
      }
      this.$api.stats.getPatientSummaryDetail(params)
        .then((res) => {
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getScaleStatList() {
      const { scaleTable } = this.$refs
      if (scaleTable) {
        scaleTable.loadStart()
      }
      this.$api.stats.patientCfRecords({
        page: this.scalePage,
        page_size: this.scalePageSize,
        ordering: 'id',
        search: this.scaleSearchForm.name,
        account__department: this.userInfo.selectedDepartment.id,
        account__department__organization: this.userInfo.selectedOrganization.id,
      })
        .then((res) => {
          this.scaleTableData = res.data.results
          this.scaleTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    assignedChange(val) {
      if (val === '体重统计') {
        this.getWeightStatList()
      } else if (val == '答题记录') {
        this.getScaleStatList()
      } else {
        this.getPatients()
      }
    },
    // 计算体重、腰围变化
    calcChangeValue(initial, latest) {
      const value = Math.abs(initial - latest)
      let f = parseFloat(value)
      if (isNaN(f)) {
        return 0
      }
      f = Math.round(value * 10) / 10;
      return f
    },
    changeInfoClick(row) {
      this.selectedCompliance = row
      console.log(row);
      if (row.subscriptions && row.subscriptions.length > 0) {
        this.$api.patients.getPatientExercisePrescriptionList({
          ordering: '-created_at',
          page: 1,
          page_size: 9999,
          patient: row.user_id
        })
        // this.$api.patients.getPatientRecordState(row.user_id)
          .then((info) => {
            
            var list = info.data.results

            // 运动频次
            // let exercise_frequency = res.data.exercise_frequency

            const recorded_at__gte = dayjs(row.subscriptions[0].joined_at)
            const recorded_at__lte = dayjs()
            const params = {
              kind: "week",
              recorded_at__gte: recorded_at__gte.format('YYYY-MM-DD') + ' 00:00:00',
              recorded_at__lte: recorded_at__lte.format("YYYY-MM-DD") + ' 23:59:59',
              patient: row.user_id,
            }
            let startDay = dayjs(recorded_at__gte).startOf('week').add(0, 'day')
            let days = []
            while(startDay.isSameOrBefore(recorded_at__lte, 'day')) {
              days.push(startDay.format("YYYY-MM-DD"))
              startDay = startDay.add(7, 'day')
            }
            this.chartOptions.xAxis.data = days.map(ele => ele + ' ~\n' + dayjs(ele).add(6, 'day').format("YYYY-MM-DD"))
            this.$api.patients.getStat(row.user_id, params)
              .then(res => {
                const dietStatic = res.data.diet_stats.static
                const weightStatic = res.data.weight_stats.static
                const exerciseStatic = res.data.exercise_prescript_stats.static
                let series1 = []
                let series2 = []
                let series3 = []
                for (let j = 0; j < days.length; j++) {
                  let exercise_frequency = null
                  const infoDay =  days[j]
                  let count1 = 0
                  let count2 = 0
                  let count3 = 0
                  if (list.length > 0) {
                    exercise_frequency = list[0].exercise_frequency
                  }
                  for (let k = 0; k < 7; k++) {
                    const current = dayjs(infoDay).add(k, 'day')

                    let findItem = list.find(ele => dayjs(ele.created_at).format('YYYY-MM-DD') == current.format('YYYY-MM-DD'))
                    if (findItem) {
                      exercise_frequency = findItem.exercise_frequency
                    }

                    if (exerciseStatic) {
                      const info = exerciseStatic.find(ele => dayjs(ele.att_date).format('YYYY-MM-DD') == current.format('YYYY-MM-DD'))
                      if (info) {
                        if (info.is_finished == 1) {
                          count1 += 1
                        }
                      }
                    }
                    if (dietStatic) {
                      const info = dietStatic.find(ele => dayjs(ele.date).format('YYYY-MM-DD') == current.format('YYYY-MM-DD'))
                      if (info) {
                        count2 += info.count
                      }
                    }
                    if (weightStatic) {
                      const info = weightStatic.find(ele => dayjs(ele.date).format('YYYY-MM-DD') == current.format('YYYY-MM-DD'))
                      if (info) {
                        count3 += info.count
                      }
                    }
                  }
                  

                  if (!exercise_frequency) {
                    series1.push(0)
                  } else {
                    series1.push(count1 / parseInt(exercise_frequency))
                  }
                  series2.push(count2 / 21.0)
                  series3.push(count3 / 7.0)
                }
                this.chartOptions.series[0].data = series1
                this.chartOptions.series[1].data = series2
                this.chartOptions.series[2].data = series3
                this.dialogVisible = true
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })

          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })


      }
    },
    getPatients() {
      this.$refs.table1.loadStart()
      this.$api.patients.getList({
        page: this.compliancePage,
        page_size: this.compliancePageSize,
        ordering: '-user_id',
        search: this.complianceForm.search,
        project_id: this.complianceForm.project_id,
        department_id: this.userInfo.selectedDepartment.id,
        organization_id: this.userInfo.selectedOrganization.id
      })
        .then((res) => {
          this.$refs.table1.loadDone()
          this.complianceTableData = res.data.results
          this.complianceTotal = res.data.count
        })
        .catch((err) => {
          this.$refs.table1.loadDone()
          this.$message.error(JSON.stringify(err))
        })
    },
    getAge(value) {
      if (value === '') {
        return ''
      }
      const birthday = new Date(value.replace(/-/g, "\/"));
      const d = new Date();
      const age = d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth() || d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0);
      return age
    }
    
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    infoName() {
      let str = ''
      if (this.selectedCompliance) {
        str += this.selectedCompliance.name + '_'
        if (this.selectedCompliance.subscriptions && this.selectedCompliance.subscriptions[0] && this.selectedCompliance.subscriptions[0].project) {
          str += this.selectedCompliance.subscriptions[0].project.name + '_'
        }
      }
      str += dayjs().format('YYYY-MM-DD')
      str +=  Math.floor(Math.random() * 999) + 100
      return str
    },
    json_data() {
      let info = []
      if (this.selectedCompliance) {
        let user_id = this.selectedCompliance.user_id
        let name = this.selectedCompliance.name
        let sex = this.$dict.sex.getLabel(this.selectedCompliance.sex)  
        let age = ''
        if (this.selectedCompliance.user_profile && this.selectedCompliance.user_profile.birthday) {
          age = this.getAge(this.selectedCompliance.user_profile.birthday + '')
          age = age ? age : 0
        }
        let project_name = ''
        let status = ''
        let stage = ''
        if (this.selectedCompliance.subscriptions && this.selectedCompliance.subscriptions[0]) {
          status = this.$dict.patientServiceStatus.getLabel(this.selectedCompliance.subscriptions[0].status)
          stage = this.selectedCompliance.subscriptions[0].stage
          if (this.selectedCompliance.subscriptions[0].project) {
            project_name = this.selectedCompliance.subscriptions[0].project.name
          }
        }
        info.push({
          user_id, name, sex, age, project_name, status, stage
        })
      }

      if (this.chartOptions.xAxis.data) {
        info.push({
          user_id: '', name: '', sex: '', age: '', project_name: '', status: '', stage: ''
        })

        info.push({
          user_id: '日期', name: '运动处方打卡', sex: '餐饮打卡', age: '体重打卡', project_name: '', status: '', stage: ''
        })

        for (let i = 0; i < this.chartOptions.xAxis.data.length; i++) {
          const element = this.chartOptions.xAxis.data[i]
          const series1 = this.chartOptions.series[0].data[i] ? this.chartOptions.series[0].data[i] : 0
          const series2 = this.chartOptions.series[1].data[i] ? this.chartOptions.series[1].data[i] : 0
          const series3 = this.chartOptions.series[2].data[i] ? this.chartOptions.series[2].data[i] : 0
          
          info.push({
            user_id: element, name: (parseFloat(series1) * 100).toFixed(2) + '%', sex: (parseFloat(series2) * 100).toFixed(2) + '%', age: (parseFloat(series3) * 100).toFixed(2) + '%', project_name: '', status: '', stage: ''
          })
        }
      }
      return info
    },
  },
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.chart-wrapper {
  height: 45vh;

  .echarts {
    width: 100%;
    height: 100%;
  }
}

.creation-dialog {
  :deep(.el-dialog) {
    width: 1080px;
    height: 60vh;

    .creation-dialog-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    // .el-dialog__body {
    //   margin-top: 20px !important;
    // }
  }
}

.radio-group {
  // width: 375px;
  height: 46px;
  padding-left: 25px;
  border-radius: 23px;
  background-color: #F4F5FA;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;

  .radio-group-item {
    padding-right: 25px;
  }

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
    height: 34px;
    line-height: 34px;
    padding: 0;
    border-radius: 17px;
    border: none;
    user-select: none;
    color: #000;
    background-color: #F4F5FA;

    &:hover {
      color: #797979;
    }
  }

  .el-radio-button.is-active {
    border: none;

    :deep(.el-radio-button__inner) {
      height: 34px;
      line-height: 34px;
      padding: 0;
      background: #344563;
      border: none;
      user-select: none;
      color: #fff;
    }
  }

  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
    box-shadow: unset;
  }
}


.m-table {
  height: calc(100% - 155px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
}

.search-bar {

  .el-form-item {
    margin: 0;

    .el-select {
      width: 100%;
    }

    :deep(.el-input__inner) {
      width: 100%;
      cursor: default !important;
      font-size: 14px;
      height: 40px !important;
    }
  }
}

</style>
