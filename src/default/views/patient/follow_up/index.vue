<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/patient' }">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-h="90" box-w="20" style="margin-left: 16px"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/patient_detail/' + this.ppid }">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 随访管理 </el-breadcrumb-item>
    </el-breadcrumb>
    <div style="float: right" class="common-add-btn">
      <m-button icon="el-icon-plus" @click="toSetPage('create')">创建随访计划</m-button>
      <m-button icon="el-icon-plus" @click="toSetPage('additional')">补录随访</m-button>
    </div>

    <div class="card">
      <div class="container">
        <div class="card-title">随访管理</div>

        <el-form class="form-box" :model="form" :rules="rules" ref="form" label-position="top">
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">随访日期</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-date-picker v-model="form.date" type="date" placeholder="请选择日期"> </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button
                    @click="
                      page = 1
                      getDataFunc()
                    "
                    icon="el-icon-search"
                    h="40px"
                    w="100px"
                    >搜索</m-button
                  >
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100% - 8px - 15px - 15px)'" :get-data-func="getDataFunc">
          <el-table-column show-overflow-tooltip label="创建日期" min-width="180">
            <template v-slot="scope"> {{ scope.row.created_at | dateFormat }} </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="patient_name" label="患者姓名" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="phone_number" label="手机号" min-width="120"> </el-table-column>
          <el-table-column prop="project_name" label="随访项目" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="project_stage" label="项目阶段" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip label="随访方式" min-width="120">
            <template v-slot="scope">
              <span v-if="scope.row.follow_up_type === 'phone'">电话</span>
              <span v-else>微信</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="creator.name" label="随访人" min-width="120"> </el-table-column>
          <el-table-column label="完成状态" min-width="120">
            <template v-slot="scope">
              <el-tag type="warning" v-if="scope.row.status === 'pending'" effect="dark">待完成</el-tag>
              <el-tag type="success" v-else effect="dark">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="" label="完成时间" min-width="180">
            <template v-slot="scope">
              <span>{{ scope.row.follow_up_time | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-if="scope.row.status === 'pending'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="toFollowDetail(scope.row, 'edit')"></icon-box>
                <icon-box v-else icon-name="table_view" w="39" h="39" box-w="39" style="cursor: pointer" title="详情" @click.native="toFollowDetail(scope.row, 'view')"></icon-box>
                <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('PatientFollowUp', true)

export default {
  name: 'PatientFollowUp',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        name: '',
        date: '',
      },
      rules: {},

      ppid: '', // 项目患者id
      projectId: '', // 项目id
      userId: '', // 患者id
      stage: '',
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
        projectId: params.projectId,
        ppid: params.ppid,
        userId: params.userId,
        stage: params.stage,
      })
    }
    this.projectId = data.projectId
    this.ppid = data.ppid
    this.userId = data.userId
    this.stage = data.stage

    this.getDataFunc()
  },
  methods: {
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.ppFollowUps
        .getList({
          page: this.page,
          page_size: this.pageSize,
          project_patient: this.ppid,
          ordering: '-follow_up_time',
          follow_up_time__gt: this.form.date,
        })
        .then((res) => {
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetPage(createMethod) {
      this.$router.push({
        name: 'PatientSetFollowUp',
        params: {
          type: 'create',
          projectId: this.projectId,
          ppid: this.ppid,
          userId: this.userId,
          stage: this.stage,
          createMethod: createMethod,
        },
      })
    },
    toFollowDetail(row, type) {
      this.$router.push({
        name: 'PatientSetFollowUp',
        params: {
          type: type,
          projectId: this.projectId,
          ppid: this.ppid,
          userId: this.userId,
          stage: this.stage,
          followId: row.id,
        },
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除随访记录吗？`, '删除随访', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$api.ppFollowUps
            .delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getDataFunc()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="less">
.panel {
  .card {
  }
}

.m-table {
  height: calc(100% - 138px);

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }
}
</style>
