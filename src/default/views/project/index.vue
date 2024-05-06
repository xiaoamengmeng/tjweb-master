<template>
  <div class="panel">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_xmgl"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <m-button
      v-auth="'project.create'"
      class="right add-auth-btn"
      icon="el-icon-plus"
      @click="toSetProjectPage"
    >新建项目</m-button>
    <div
      class="card"
    >
      <div class="container">
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px)'"
          :get-data-func="getProjectList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="项目编号"
            min-width="80"
          > </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="项目名称"
            min-width="120"
          > </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="product"
            label="产品"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.product | product }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="project_type"
            label="项目类型"
          >
            <template v-slot="scope">
              {{ scope.row.project_type | projectType }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="start_date"
            label="开始时间"
            min-width="120"
          > </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="end_date"
            label="结束时间"
            min-width="120"
          > </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="状态"
            min-width="120"
          >
            <template v-slot="scope">
              <m-tag :status="scope.row.status"></m-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="created_by"
            label="创建人"
          > </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            label="创建时间"
            min-width="170"
          >
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            min-width="160px"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box
                  v-auth="'project.info'"
                  icon-name="table_detail"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="详情"
                  @click.native="toDetail(scope.row)"
                ></icon-box>
                <icon-box
                  v-auth="'project.update'"
                  icon-name="table_edit"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="编辑"
                  @click.native="editClick(scope.row)"
                ></icon-box>
                <icon-box
                  v-auth="'project.delete'"
                  icon-name="table_delete"
                  w="39"
                  h="39"
                  box-w="39"
                  style="cursor: pointer"
                  title="删除"
                  @click.native="deleteClick(scope.row)"
                ></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Project",
  data() {
    return {
      companyID: -1,
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      current: {},
    };
  },
  mounted() {
    this.getProjectList();
    this.focusMenu();
  },
  watch: {},
  methods: {
    focusMenu() {
      this.$nextTick(() => {
        const element = document.querySelector(
          'li.el-menu-item[index="/project"]'
        );
        if (element) element.click();
      });
    },
    getProjectList() {
      this.$refs.table.loadStart();
      this.$api.project
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: "-created_at",
          dpt: this.userInfo.selectedDepartment.id,
          org: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          this.total = res.data.count;
          this.tableData = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    toDetail(row) {
      this.current = row;
      this.$router.push(`/project_detail/${row.id}`);
    },
    deleteClick(row) {
      this.$confirm(`确定删除项目【${row.name}】吗？`, "删除项目", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.project
            .delete(row.id)
            .then((res) => {
              this.$message.success("删除成功");
              this.getProjectList();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    editClick(row) {
      this.current = row;
      this.$router.push({
        name: "SetProject",
        params: {
          type: "edit",
          ...row,
        },
      });
    },
    toSetProjectPage(row) {
      this.$router.push({
        name: "SetProject",
        params: {
          type: "create",
          ...row,
        },
      });
    },
  },
  computed: {
    ...mapGetters(["userInfo", "asideIndex"]),
  },
};
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
