<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/patient'}">
        <icon-box
          icon-name="menu_wdhz" w="20" h="20" box-h="90" box-w="20"
          style="margin-left: 16px;"
        ></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/patient_detail/' + this.ppid}">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>减重报告</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <!--        <div class="card-title">-->
        <!--          减重报告-->
        <!--        </div>-->
        <m-table
          ref="table"
          class="m-table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'100%'"
          :get-data-func="getList"
        >
          <el-table-column
            show-overflow-tooltip
            label="创建日期"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="患者姓名"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="手机号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="项目阶段"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.stages | showSlowly }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="report_date"
            label="报告生成时间"
            min-width="140"
          >
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="查看" @click.native="showReport(scope.row)"></icon-box>
                <!--              <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"-->
                <!--                        @click.native="deleteClick(scope.row)"></icon-box>-->
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
    <report-view
      :visible.sync="dialogVisible"
      :reportId="reportId"
    >
    </report-view>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import ReportView from './report_view'

const localSession = new LocalStore('LoseWeight', true)
export default {
  name: 'LoseWeight',
  components: {
    ReportView,
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      ppid: '',
      userId: '',

      reportId: '',
      dialogVisible: false
    }
  },
  mounted() {
    const params = this.$route.params
    let data = params
    if (Object.keys(params).length === 0) {
      const cache = localSession.get('cache')
      if (!cache) return
      data = cache
    } else {
      localSession.set('cache', {
        ppid: params.ppid,
        userId: params.userId,
      })
    }
    this.ppid = data.ppid
    this.userId = data.userId
    this.getList()
  },
  methods: {
    getList() {
      this.$refs.table.loadStart()
      this.$api.weeklyReports.getList({
        patient: this.userId
      })
        .then((res) => {
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    showReport(row) {
      this.reportId = row.id
      this.dialogVisible = true
    },
    // deleteClick() {
    // },
  },
}
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 48px);
}


</style>
