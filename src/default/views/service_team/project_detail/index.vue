<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/project'}">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" style="margin-top: 0;" v-loading="loading">
      <div class="card-title">
        {{ projectInfo.name }}
        <m-tag
          :status="projectInfo.status"
          style="position: relative; top: -3px; display:inline-block; margin-left:10px;"
        ></m-tag>
      </div>
      <el-descriptions title="" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            项目编号
          </template>
          {{ projectInfo.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            产品
          </template>
          {{ projectInfo.product | product }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            项目类型
          </template>
          {{ projectInfo.project_type | projectType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始-结束时间
          </template>
          {{ projectInfo.start_date }} 至 {{ projectInfo.end_date }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="list-title">服务权益
        <m-button class="right" @click="addRightsClick" h="36px">添加服务权益</m-button>
      </div>
      <m-view-table
        class="data-view"
        height="203"
        :data="serviceRightsData"
        :total="serviceRightsTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="serviceRightsPageSize"
        :current-page.sync="serviceRightsPage"
        :get-data-func="getServiceRights"
        hide-refresh
      >
        <el-table-column
          prop="id"
          label="编号"
          min-width="80"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="次数"
          width="80"
        >
          <template v-slot="scope">
            <template v-if="scope.row.is_unlimited">
              不限次数
            </template>
            <template v-else>
              {{ scope.row.count }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="description"
          label="描述"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === $enum.SERVICE_RIGHTS_STATUS.ENABLE" type="success" effect="dark">
              启用
            </el-tag>
            <el-tag v-if="scope.row.status === $enum.SERVICE_RIGHTS_STATUS.DISABLE" type="danger" effect="dark">
              禁用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                        @click.native="rightsDeleteClick(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-view-table>
      <div class="list-title">服务团队
        <m-button class="right" @click="openAddTeamDialog" h="36px">添加团队</m-button>
      </div>
      <m-view-table
        class="data-view"
        :data="teamData"
        :total="teamTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="teamPageSize"
        :current-page.sync="teamPage"
        height="203"
        :get-data-func="getTeamData"
        hide-refresh
      >
        <el-table-column
          prop="id"
          label="团队编号"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="团队名称"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="leader.name"
          label="团队长"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="dpt.org_name"
          label="所属机构"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="dpt.name"
          label="所属部门"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="70"
          align="center"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.ENABLE" type="success" effect="dark">启用</el-tag>
            <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.DISABLE" type="info" effect="dark">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"
                        title="详情" @click.native="teamDetail(scope.row)"></icon-box>
              <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                        @click.native="teamDeleteClick(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-view-table>

      <div class="list-title">干预方案
        <m-button class="right" @click="toSetSolutions('create')" h="36px">添加方案</m-button>
      </div>
      <m-view-table
        class="data-view"
        :data="solutionData"
        :total="solutionTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="solutionPageSize"
        :current-page.sync="solutionPage"
        :get-data-func="getSolutionDate"
        height="203"
        hide-refresh
      >
        <el-table-column
          prop="id"
          label="干预方案编号"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="方案名称"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="stage"
          label="适用阶段"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updated_at"
          label="配置日期"
          min-width="140"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                        title="编辑" @click.native="toSetSolutions('edit', scope.row)"></icon-box>
              <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                        @click.native="solutionDelete(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-view-table>

      <div class="mt_30">
        <m-button @click="toSetProjectPage">编辑项目</m-button>
        <m-button plain @click="$router.push('/project')">返回</m-button>
      </div>
    </div>

    <el-dialog
      class="dialog-box"
      title="添加服务权益"
      width="700px"
      :visible.sync="rightsDialogVisible"
    >
      <div class="dialog-content">
        <m-view-table
          ref="addServiceRightsTable"
          :data="addServiceRightsData"
          :total="addServiceRightsTotal"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="addServiceRightsPageSize"
          :current-page.sync="addServiceRightsPage"
          @selection-change="handleRightsSelectionChange"
          height="303"
          :get-data-func="getAddServiceRights"
        >
          <el-table-column
            type="selection"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="编号"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="名称"
            min-width="160"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="次数"
            min-width="60"
          >
            <template v-slot="scope">
              <template v-if="scope.row.is_unlimited">
                不限次数
              </template>
              <template v-else>
                {{ scope.row.count }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="description"
            label="描述"
            min-width="160"
          >
          </el-table-column>
        </m-view-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="rightsDialogVisible=false" w="129px">取消</m-button>
        <m-button @click="addRights" w="129px">确定</m-button>

      </span>
    </el-dialog>

    <el-dialog
      class="dialog-box add-team"
      title="添加团队"
      width="700px"
      :visible.sync="teamDialogVisible"
      :show-close="false"
    >
      <div slot="title" class="el-dialog__title">添加团队
        <m-button class="right" w="129px" @click="createTeam">创建团队</m-button>
      </div>
      <div class="dialog-content">
        <m-view-table
          ref="addTeamTable"
          class="mt_20"
          :data="addTeamData"
          :total="addTeamTotal"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="addTeamPageSize"
          :current-page.sync="addTeamPage"
          height="303"
          :get-data-func="getAddTeamData"
        >
          <el-table-column
            prop="id"
            label="团队编号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="团队名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="leader.name"
            label="团队长"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dpt.org_name"
            label="所属机构"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dpt.name"
            label="所属部门"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="70"
            align="center"
          >
            <template v-slot="scope">
              <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.ENABLE" type="success" effect="dark">启用
              </el-tag>
              <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.DISABLE" type="info" effect="dark">禁用
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box icon-name="table_add" w="39" h="39" box-w="39" style="cursor:pointer;" title="添加"
                          @click.native="addTeamClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" w="129px" @click="teamDialogVisible=false">关闭</m-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectDetail',
  data() {
    return {
      projectInfo: {},
      rightsDialogVisible: false,
      teamDialogVisible: false,

      serviceRightsData: [],
      serviceRightsTotal: 0,
      serviceRightsPageSize: 5,
      serviceRightsPage: 1,
      serviceRightsSelection: [],

      addServiceRightsData: [],
      addServiceRightsTotal: 0,
      addServiceRightsPageSize: 5,
      addServiceRightsPage: 1,

      solutionData: [],
      solutionTotal: 0,
      solutionPageSize: 5,
      solutionPage: 1,

      teamData: [],
      teamTotal: 0,
      teamPageSize: 5,
      teamPage: 1,

      addTeamData: [],
      addTeamTotal: 0,
      addTeamPageSize: 5,
      addTeamPage: 1,

      tableHeaderStyle: {
        backgroundColor: '#FAFAFA',
        fontSize: '14px', fontWeight: 400, color: '#5A6D86'
      },

      loading: true,
    }
  },
  mounted() {
    this.getProjectInfo()
  },
  methods: {
    getProjectInfo() {
      const id = this.$route.params.id
      if (!id) {
        return
      }
      this.$api.project.getDetail(id)
        .then(res => {
          this.projectInfo = res.data
          this.loading = false
          this.refreshProjectInfo()
        })
    },
    refreshProjectInfo() {
      this.getServiceRights()
      this.getTeamData()
      this.getSolutionDate()
    },
    toSetProjectPage() {
      this.$router.push({
        name: 'SetProject',
        params: {
          type: 'edit',
          ...this.projectInfo,
        },
      })
    },
    addRightsClick() {
      this.rightsDialogVisible = true
      this.$nextTick(() => {
        this.getAddServiceRights()
      })
    },
    addRights() {
      const body = {
        rights_id: [
          ...this.projectInfo.rights.map(item => item.id),
          ...this.serviceRightsSelection.map(item => item.id)
        ],
      }
      this.$api.project.patch(this.projectInfo.id, body)
        .then((res) => {
          this.projectInfo = res.data
          this.refreshProjectInfo()
          this.rightsDialogVisible = false
          this.$message.success('添加服务权益成功')
        })
    },
    rightsDeleteClick(row) {
      this.$confirm(`确定删除服务权益【${row.name}】吗？`, '删除服务权益', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          const ids = this.projectInfo.rights.map(item => item.id)
          const index = ids.findIndex(item => item === row.id)
          ids.splice(index, 1)

          this.$api.project.patch(this.projectInfo.id, {
            rights_id: ids
          })
            .then((res) => {
              this.projectInfo = res.data
              this.refreshProjectInfo()
              this.$message.success('删除成功')
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    openAddTeamDialog() {
      this.teamDialogVisible = true
      this.$nextTick(() => {
        this.getAddTeamData()
      })
    },
    addTeamClick(row) {
      const teams = this.projectInfo.teams

      const body = {
        teams_id: [
          ...teams.map(item => item.id),
          row.id,
        ],
      }
      this.$api.project.patch(this.projectInfo.id, body)
        .then((res) => {
          this.projectInfo = res.data
          this.refreshProjectInfo()
          this.$message.success('添加团队成功')
        })
    },
    createTeam() {
      this.$router.push({
        name: 'SetTeam',
        params: {
          type: 'create',
        },
      })
    },
    toSetSolutions(type, row = {}) {
      this.$router.push({
        name: 'ProjectSetSolution',
        params: {
          type: type,
          projectId: this.projectInfo.id,
          projectStage: this.projectInfo.stage,
          intervsId: row.id
        },
      })
    },
    teamDetail(row) {
      this.$router.push({
        name: 'TeamDetail',
        params: {
          id: row.id,
          projectId: this.projectInfo.id,
        },
      })
    },
    teamDeleteClick(row) {
      this.$confirm(`确定删除服务团队【${row.name}】吗？`, '删除服务团队', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          const ids = this.projectInfo.teams.map(item => item.id)
          const index = ids.findIndex(item => item === row.id)
          ids.splice(index, 1)

          this.$api.project.patch(this.projectInfo.id, {
            teams_id: ids
          })
            .then((res) => {
              this.projectInfo = res.data
              this.refreshProjectInfo()
              this.$message.success('删除成功')
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    planDeleteClick(row) {
    },
    handleRightsSelectionChange(val) {
      this.serviceRightsSelection = val
    },
    getServiceRights() {
      const rights = this.projectInfo.rights
      this.serviceRightsTotal = rights.length
      const pageSize = this.serviceRightsPageSize
      const curr = this.serviceRightsPage
      this.serviceRightsData = rights.slice((curr - 1) * pageSize, curr * pageSize)
    },
    getAddServiceRights() {
      this.$refs.addServiceRightsTable.loadStart()
      this.$api.serviceRights.getList({
        page: this.addServiceRightsPage,
        page_size: this.addServiceRightsPageSize,
        ordering: 'id'
      })
        .then((res) => {
          this.addServiceRightsTotal = res.data.count
          this.addServiceRightsData = res.data.results
        })
    },
    getTeamData() {
      const teams = this.projectInfo.teams
      this.teamTotal = teams.length
      const pageSize = this.serviceRightsPageSize
      const curr = this.serviceRightsPage
      this.teamData = teams.slice((curr - 1) * pageSize, curr * pageSize)
    },
    getAddTeamData() {
      this.$refs.addTeamTable.loadStart()
      this.$api.team.getList({
        page: this.addTeamPage,
        page_size: this.addTeamPageSize,
        dpt: this.userInfo.selectedDepartment.id
      })
        .then((res) => {
          this.addTeamTotal = res.data.count
          this.addTeamData = res.data.results
        })
    },
    getSolutionDate() {
      const solutions = this.projectInfo.interventions
      this.solutionTotal = solutions.length
      const pageSize = this.solutionTotal
      const curr = this.solutionPage
      this.solutionData = solutions.slice((curr - 1) * pageSize, curr * pageSize)
    },
    solutionDelete(row) {
      console.log(row)
      this.$confirm(`确定删除项目的干预方案【${row.name}】吗？`, '删除项目方案', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.intervs.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getProjectInfo()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    }
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
      'asideIndex',
    ]),
  }
}
</script>
<style lang="less" scoped>
.right-buttons {
  position: absolute;
  right: 30px;
  top: 20px;
}

.dialog-box {
  :deep(.el-dialog) {
    width: 680px;
    height: 500px;
  }
}

.dialog-box.add-team {
  :deep(.el-dialog) {
    width: 680px;
    height: 520px;
  }
}
</style>
