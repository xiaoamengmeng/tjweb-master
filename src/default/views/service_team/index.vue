<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>服务团队管理</b>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <m-button v-auth="'serviceTeam.create'" class="right add-auth-btn" icon="el-icon-plus" @click="createTeam">创建团队</m-button>
    <div class="card">
      <div class="container">
        <m-table class="m-table" ref="table" :data="teamList" :total="teamTotal" :page-sizes="[5, 10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100% - 8px - 15px - 15px)'" :get-data-func="getTeamList">
          <el-table-column prop="id" label="团队编号" align="center"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="团队名称" align="center"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="leader.name" label="团队长" align="center"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="dpt.org_name" label="所属机构" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="dpt.name" label="所属部门" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="dpt.name" label="服务项目" min-width="120">
            <template v-slot="scope">
              {{ porjectsToString(scope.row.projects) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="70" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.ENABLE" type="success" effect="dark">启用 </el-tag>
              <el-tag v-if="scope.row.status === $enum.TEAM_STATUS.DISABLE" type="info" effect="dark">禁用 </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-auth="'serviceTeam.edit'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="editTeam(scope.row)"></icon-box>
                <icon-box v-auth="'serviceTeam.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteTeam(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
        <!-- <m-table class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100% - 8px - 15px - 15px)'" :get-data-func="getProjectList">
          <el-table-column show-overflow-tooltip prop="id" label="项目编号" min-width="80"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="项目名称" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="product" label="产品" min-width="120">
            <template v-slot="scope">
              {{ scope.row.product | product }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="project_type" label="项目类型">
            <template v-slot="scope">
              {{ scope.row.project_type | projectType }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="start_date" label="开始时间" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="end_date" label="结束时间" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip label="状态" min-width="120">
            <template v-slot="scope">
              <m-tag :status="scope.row.status"></m-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="created_by" label="创建人"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="created_at" label="创建时间" min-width="170">
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="160px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-auth="'project.info'" icon-name="table_detail" w="39" h="39" box-w="39" style="cursor: pointer" title="详情" @click.native="toDetail(scope.row)"></icon-box>
                <icon-box v-auth="'project.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="editClick(scope.row)"></icon-box>
                <icon-box v-auth="'project.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ServiceTeam',
  data() {
    return {
      teamList: [],
      pageSize: 10,
      page: 1,
      teamTotal: 0,
    }
  },
  mounted() {
    this.getTeamList()
    this.focusMenu()
  },
  watch: {},
  methods: {
    porjectsToString(list) {
      if (list.length) {
        return list.map((v) => v.name).join(',')
      } else {
        return '-'
      }
    },
    getTeamList() {
      this.$refs.table.loadStart()
      this.$api.team
        .getList({
          page: this.page,
          page_size: this.pageSize,
          dpt: this.userInfo.selectedDepartment.id,
        })
        .then((res) => {
          this.teamTotal = res.data.count
          this.teamList = res.data.results
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
    deleteTeam(row) {
      if (row.projects.length) {
        this.$message.error('该团队有服务项目，无法删除！')
        return
      }
      this.$confirm(`确定删除服务团队【${row.name}】吗？`, '删除服务团队', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$api.team
            .delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getTeamList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
    },
    editTeam(row) {
      this.$router.push({
        name: 'SetTeam',
        params: {
          type: 'edit',
          ...row,
        },
      })
    },
    focusMenu() {
      this.$nextTick(() => {
        const element = document.querySelector('li.el-menu-item[index="/serviceTeam"]')
        if (element) element.click()
      })
    },
  },
  computed: {
    ...mapGetters(['userInfo', 'asideIndex']),
  },
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 8px !important;
    height: calc(100% - 8px - 8px) !important;
  }
}

.add-auth-btn {
  position: absolute;
  top: 80px;
  right: 32px;
}

.m-table {
  height: 100%;

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }

  .el-link {
    color: #00b386;
    text-decoration: none;
  }
}

:deep(.el-date-editor) {
  width: 100% !important;

  .el-range-separator {
    line-height: 32px;
  }
}
</style>
