<template>
  <div class="panel">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_hzfz"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>患者分组</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>项目分配</el-breadcrumb-item>

    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <div class="pro-top">
          <el-radio-group
            @change="assignedChange"
            class="radio-group"
            v-model="viewsMode"
          >
            <el-radio-button label="待分配"></el-radio-button>
            <el-radio-button label="已分配"></el-radio-button>
          </el-radio-group>
          <template v-if="viewsMode === '待分配'">
            <!--          <div class="mt_20 mb_10 text_right w_100">-->
            <m-button
              v-auth="'projectAssignment.all'"
              :disabled="bulkBtnDisable"
              :type="bulkBtnDisable ? 'default' : 'primary'"
              h="40px"
              @click="bulkAssignedClick"
              :class="{ 'btn-disable': bulkBtnDisable }"
            >批量分配 </m-button>
            <!--          </div>-->
          </template>
        </div>

        <template v-if="viewsMode === '待分配'">
          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[5, 10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getProjectPatients"
            @selection-change="handleSelectionChange"
            key="patientTable1"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="user_id"
              label="患者ID"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="昵称"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="real_name"
              label="姓名"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sex"
              label="性别"
              min-width="60"
            >
              <template slot-scope="scope">
                {{ scope.row.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="年龄"
              min-width="60"
            >
              <template v-if="scope.row.user_profile.birthday" slot-scope="scope">
                {{ scope.row.user_profile.birthday | calcAge }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="bond_doctor.name"
              label="绑定医生"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="治疗方式"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ getPorduct(scope.row.user_profile.therapy) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="user_profile.surgery_date"
              label="手术日期"
              min-width="100"
            >
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="120px"
            >
              <template v-slot="scope">
                <el-link
                  v-auth="'projectAssignment.one'"
                  @click="doAssignedClick(scope.row)"
                >去分配</el-link>
              </template>
            </el-table-column>
          </m-table>
        </template>
        <template v-else>
          <m-table
            ref="alreadyTable"
            class="m-table yet"
            :data="alreadyTableData"
            :total="alreadyTotal"
            :page-sizes="[5, 10, 15, 20]"
            :page-size.sync="alreadyPageSize"
            :current-page.sync="alreadyPage"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getProjectPatients"
            key="patientTable2"
          >
            <el-table-column
              show-overflow-tooltip
              prop="user_id"
              label="患者ID"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="昵称"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="real_name"
              label="姓名"
              min-width="60"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sex"
              label="性别"
              min-width="60"
            >
              <template slot-scope="scope">
                {{ scope.row.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="年龄"
              min-width="60"
            >
              <template slot-scope="scope">
                {{ scope.row.user_profile.birthday | calcAge }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="bond_doctor.name"
              label="绑定医生"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="项目名称"
              min-width="100"
            >
              <template
                v-if="scope.row.subscriptions && scope.row.subscriptions.length > 0"
                slot-scope="scope"
              >
                {{ scope.row.subscriptions[0].project.name }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="治疗方式"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ getPorduct(scope.row.user_profile.therapy) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="user_profile.surgery_date"
              label="手术日期"
              min-width="60"
            >
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="120px"
            >
              <template v-slot="scope">
                <el-link
                  v-auth="'projectAssignment.one'"
                  @click="unAssigned(scope.row)"
                >取消分配</el-link>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
    </div>

    <el-dialog
      title="为患者分配项目"
      :visible.sync="assignedVisible"
      class="assigned-dialog"
    >
      <el-form
        ref="assignedForm"
        class="form-box"
        :model="assignedForm"
        :rules="assignedRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item
          label="分配项目"
          prop="ld"
          required
        >
          <el-select
            v-model="assignedForm.ld"
            placeholder="请选择"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="assignedVisible = false"
          w="80px"
        >取 消</m-button>
        <m-button
          @click="assigned"
          w="80px"
        >提 交</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量分配项目"
      :visible.sync="bulkAssignedVisible"
      class="assigned-dialog"
    >
      <el-form
        ref="bulkAssignedForm"
        class="form-box"
        :model="bulkAssignedForm"
        :rules="bulkAssignedRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item
          label="分配项目"
          prop="ld"
          required
        >
          <el-select
            v-model="bulkAssignedForm.ld"
            placeholder="请选择"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="bulkAssignedVisible = false"
          w="80px"
        >取 消</m-button>
        <m-button
          @click="bulkAssigned"
          w="80px"
        >提 交</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ASGMT_STATUS, PRODUCT } from "@/common/utils/dict";
import { mapGetters } from "vuex";

export default {
  name: "ProjectDistribution",
  data() {
    return {
      viewsMode: "待分配",
      form: {},
      rules: {},
      assignedStatus: "",
      projectStage: "",
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      alreadyTableData: [],
      alreadyTotal: 0,
      alreadyPageSize: 10,
      alreadyPage: 1,
      assignedForm: {
        ld: "",
      },
      assignedRules: {
        ld: [{ required: true, message: "请选择项目", trigger: "change" }],
      },

      selection: [],
      bulkBtnDisable: false,
      assignedVisible: false,

      bulkAssignedVisible: false,
      bulkAssignedForm: {
        ld: "",
      },
      bulkAssignedRules: {
        ld: [{ required: true, message: "请选择项目", trigger: "change" }],
      },

      members: [],
      selectPatient: {},
      stages: [],
      projects: [],
    };
  },
  watch: {
    selection(n) {
      if (n.length === 0 || n.length === 1) {
        this.bulkBtnDisable = false;
        return;
      }
      let equal = false;
      const first = n[0].team;
      equal = n.every((item) => {
        return item.team.id === first.id;
      });
      this.bulkBtnDisable = !equal;
    },
    assignedVisible(n) {
      if (!n) {
        this.selectPatient = {};
      }
    },
  },
  mounted() {
    this.getProjectPatients();
  },
  methods: {
    showCalorieCalc() {
      this.calorieCalcVisible = true;
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false;
    },
    getProjects() {
      this.$api.project
        .getList({
          page: 1,
          page_size: 999,
          ordering: "-created_at",
          dpt: this.userInfo.selectedDepartment.id,
          org: this.userInfo.selectedOrganization.id,
          team_member: this.userInfo.id,
        })
        .then((res) => {
          if (res.data.results && res.data.results.length > 0) {
            this.projects = res.data.results;
          } else {
            this.projects = [];
          }
        })
        .catch((err) => {
          this.projects = [];
          this.$message.error(JSON.stringify(err));
        });
    },
    doAssignedClick(row) {
      this.getProjects();
      this.selectPatient = row;
      this.assignedForm.ld = "";
      this.assignedVisible = true;
      this.$nextTick(() => {
        this.$refs.assignedForm.clearValidate();
      });
    },
    assigned() {
      this.$refs.assignedForm.validate((valid) => {
        if (valid) {
          const projectItem = this.projects.find(
            (ele) => ele.id == this.assignedForm.ld
          );
          this.$api.patients
            .assignProject({
              project: this.assignedForm.ld,
              patient: this.selectPatient.user_id,
              team: projectItem.teams.id,
            })
            .then((res) => {
              this.$message.success("分配项目成功");
              this.getProjectPatients();
              this.assignedVisible = false;
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        }
      });
    },
    unAssigned(row) {
      this.$confirm(`确定取消分配项目吗？`, "取消分配项目", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "warning",
      })
        .then(() => {
          this.$api.patients
            .leaveOnlyProject({
              patient_id: row.user_id,
            })
            .then((res) => {
              this.$message.success("取消分配项目成功");
              this.getProjectPatients();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    bulkAssigned() {
      this.$refs.bulkAssignedForm.validate((valid) => {
        if (valid) {
          const ids = this.selection.map((item) => item.user_id);
          const projectItem = this.projects.find(
            (ele) => ele.id == this.bulkAssignedForm.ld
          );
          this.$api.patients
            .bulkAssignProject({
              project: this.bulkAssignedForm.ld,
              project_patient_ids: ids,
              team: projectItem.teams.id,
            })
            .then((res) => {
              this.$message.success("分配项目成功");
              this.getProjectPatients();
              this.bulkAssignedVisible = false;
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        }
      });
    },
    bulkAssignedClick() {
      if (this.selection.length === 0) {
        return this.$message.error("至少选择一位患者");
      }
      this.getProjects();
      this.bulkAssignedVisible = true;
    },
    assignedChange() {
      this.getProjectPatients();
      this.selection = [];
    },
    getProjectPatients() {
      this.selection = [];
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: "-user_id",
        department_id: this.userInfo.selectedDepartment.id,
      };
      if (this.viewsMode === "待分配") {
        params.project__isnull = true;
        this.$refs.table.loadStart();
      } else {
        params.project__isnull = false;
        params.page = this.alreadyPage;
        params.page_size = this.alreadyPageSize;
        this.$refs.alreadyTable.loadStart();
      }
      this.$api.patients
        .getList(params)
        .then((res) => {
          if (this.viewsMode === "待分配") {
            this.tableData = res.data.results;
            this.total = res.data.count;
          } else {
            this.alreadyTableData = res.data.results;
            this.alreadyTotal = res.data.count;
          }
          this.$bus.$emit("updateBage")
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    getPorduct(type) {
      const item = this.PRODUCT.find((ele) => ele.code == type);
      if (item) return item.label;
      return "";
    },
  }, // methods end
  computed: {
    ...mapGetters(["userInfo"]),
    ASGMT_STATUS() {
      return ASGMT_STATUS;
    },
    PRODUCT() {
      return PRODUCT;
    },
  },
};
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.pro-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.radio-group {
  width: 250px;
  height: 46px;
  border-radius: 23px;
  background-color: #f4f5fa;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
    height: 34px;
    line-height: 34px;
    padding: 0;
    border-radius: 17px;
    border: none;
    user-select: none;
    color: #000;
    background-color: #f4f5fa;

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
  height: calc(100% - 40px);

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }

  .el-link {
    color: #00b386;
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

.btn-disable {
  &:hover,
  &:focus {
    border-color: unset;
    background-color: #e9edfa !important;
    color: #c0c4cc;
  }

  &:active {
    border-color: unset;
    background-color: #e9edfa !important;
    color: #c0c4cc;
  }
}

.assigned-dialog {
  :deep(.el-dialog) {
    height: 300px;
  }
}
</style>
