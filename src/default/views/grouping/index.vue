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
      <el-breadcrumb-item>营养师分配</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <div>
          <el-radio-group
            @change="assignedChange"
            class="radio-group"
            v-model="viewsMode"
          >
            <el-radio-button label="待分配"></el-radio-button>
            <el-radio-button label="已分配"></el-radio-button>
          </el-radio-group>
        </div>

        <el-form
          class="form-box"
          :model="form"
          ref="form"
          label-position="top"
        >
          <div class="search-bar mt_20">
            <el-row
              class="search-bar-row"
              type="flex"
              justify="start"
              align="middle"
              :gutter="20"
              style="width: 100%; height: 100%"
            >
              <el-col
                v-if="viewsMode === '待分配'"
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">分配状态</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="assignedStatus"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in ASGMT_STATUS"
                        :key="item.code"
                        :label="item.label"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                v-else
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">项目阶段</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="projectStage"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="type in stages"
                        :key="type"
                        :label="type"
                        :value="type"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="19"
              >
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button
                    icon="el-icon-search"
                    h="40px"
                    w="100px"
                    @click="
                      alreadyPage = 1
                      page = 1
                      getProjectPatients()
                    "
                  >搜索</m-button>
                  <template v-if="viewsMode === '待分配'">
                    <!--          <div class="mt_20 mb_10 text_right w_100">-->
                    <m-button
                      v-auth="'dietitianAssignment.all'"
                      :disabled="bulkBtnDisable"
                      :type="bulkBtnDisable ? 'default' : 'primary'"
                      h="40px"
                      @click="bulkAssignedClick"
                      :class="{ 'btn-disable': bulkBtnDisable }"
                    >批量分配 </m-button>
                    <!--          </div>-->
                  </template>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>

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
              prop="id"
              label="患者ID"
              width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="nick_name"
              label="昵称"
              min-width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="patient"
              label="姓名"
              min-width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="patient_phone_number"
              label="手机号"
              min-width="120"
            >
              <template v-slot="scope">
                {{fillterPhone(scope.row.patient_phone_number)}}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="project.name"
              label="参与项目"
              min-width="120"
            > </el-table-column>
            <el-table-column
              prop="team.name"
              label="服务团队"
              min-width="120"
            > </el-table-column>
            <el-table-column
              prop="doctor.name"
              label="绑定医生"
              min-width="120"
            > </el-table-column>
            <el-table-column
              label="服务状态"
              min-width="100"
            >
              <template v-slot="scope">
                {{ $dict.patientServiceRightsStatus.getLabel(scope.row.status) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="asgmt_status"
              label="分配状态"
              min-width="100"
            >
              <template v-slot="scope">{{ scope.row.asgmt_status | asgmtStatus }}</template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="created_at"
              label="分配时间"
              min-width="170"
            >
              <template v-slot="scope">
                {{ scope.row.joined_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120px"
            >
              <template v-slot="scope">
                <el-link
                  v-auth="'dietitianAssignment.one'"
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
              prop="id"
              label="患者ID"
              width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="nick_name"
              label="昵称"
              min-width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="patient"
              label="姓名"
              min-width="100"
            > </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="patient_phone_number"
              label="手机号"
              min-width="120"
            >
              <template v-slot="scope">
                {{fillterPhone(scope.row.patient_phone_number)}}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="project.name"
              label="参与项目"
              min-width="120"
            > </el-table-column>
            <el-table-column
              prop="team.name"
              label="服务团队"
              min-width="120"
            > </el-table-column>
            <el-table-column
              prop="doctor.name"
              label="绑定医生"
              min-width="120"
            > </el-table-column>
            <el-table-column
              prop="dietitian.name"
              label="主责营养师"
              min-width="120"
            > </el-table-column>
            <el-table-column
              label="服务状态"
              min-width="100"
            >
              <template v-slot="scope">
                {{ $dict.patientServiceRightsStatus.getLabel(scope.row.status) }}
              </template>
            </el-table-column>
            <el-table-column
              label="分配状态"
              min-width="100"
            >
              <template v-slot="scope">{{ scope.row.asgmt_status | asgmtStatus }}</template>
            </el-table-column>
            <el-table-column
              label="阶段"
              min-width="130"
            >
              <template v-slot="scope">
                <el-select
                  v-model="scope.row.stage"
                  placeholder="未设置"
                  @change="changePatientStage(scope.row)"
                >
                  <el-option
                    v-for="item in scope.row.project.stage"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              prop="created_at"
              label="分配时间"
              min-width="170"
            >
              <template v-slot="scope">
                {{ scope.row.joined_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120px"
            >
              <template v-slot="scope">
                <el-link
                  v-auth="'dietitianAssignment.one'"
                  @click="unAssigned(scope.row)"
                >取消分配</el-link>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
    </div>

    <el-dialog
      title="为患者分配营养师"
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
          label="分配营养师"
          prop="ld"
          required
        >
          <el-select
            v-model="assignedForm.ld"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in members"
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
      title="批量分配营养师"
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
          label="分配营养师"
          prop="ld"
          required
        >
          <el-select
            v-model="bulkAssignedForm.ld"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in members"
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
import { ASGMT_STATUS } from "@/common/utils/dict";
import { mapGetters } from "vuex";

export default {
  name: "Grouping",
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
        ld: [{ required: true, message: "请选择营养师", trigger: "change" }],
      },

      selection: [],
      bulkBtnDisable: false,
      assignedVisible: false,

      bulkAssignedVisible: false,
      bulkAssignedForm: {
        ld: "",
      },
      bulkAssignedRules: {
        ld: [{ required: true, message: "请选择营养师", trigger: "change" }],
      },

      members: [],
      selectPatient: {},
      stages: [],
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
    alreadyTableData(n) {
      if (n.length === 0) {
        return;
      }

      const set = new Set();
      n.forEach((item) => {
        item.project.stage.forEach((stage) => {
          set.add(stage);
        });
      });
      this.stages = Array.from(set);
    },
  },
  mounted() {
    this.getProjectPatients();
  },
  methods: {
    fillterPhone(phone) {
      if (phone.length > 7) {
        return phone.substring(0, 3) + "****" + phone.substring(7);
      }
      return phone;
    },
    showCalorieCalc() {
      this.calorieCalcVisible = true;
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false;
    },
    doAssignedClick(row) {
      this.selectPatient = row;
      this.assignedForm.ld = "";
      this.members = row.team.members.filter((item) => {
        return (
          item.role_id === this.$enum.ROLE.RD ||
          item.role_id === this.$enum.ROLE.LD ||
          item.role_id === this.$enum.ROLE.DA
        );
      });
      this.assignedVisible = true;
      this.$nextTick(() => {
        this.$refs.assignedForm.clearValidate();
      });
    },
    assigned() {
      this.$refs.assignedForm.validate((valid) => {
        if (valid) {
          this.$api.projectPatient
            .assignDietitian(this.selectPatient.id, {
              dietitian: this.assignedForm.ld,
            })
            .then((res) => {
              this.$message.success("分配营养师成功");
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
      this.$confirm(`确定取消分配营养师吗？`, "取消分配营养师", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "warning",
      })
        .then(() => {
          this.$api.projectPatient
            .cancelDietitian(row.id)
            .then((res) => {
              this.$message.success("取消分配营养师成功");
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
          const ids = this.selection.map((item) => item.id);

          this.$api.projectPatient
            .bulkAssignDietitian({
              dietitian_id: this.bulkAssignedForm.ld,
              project_patient_ids: ids,
            })
            .then((res) => {
              this.$message.success("分配营养师成功");
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
      this.members = this.selection[0].team.members.filter((item) => {
        return (
          item.role_id === this.$enum.ROLE.RD ||
          item.role_id === this.$enum.ROLE.LD
        );
      });
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
        asgmt_status:
          this.viewsMode === "待分配"
            ? this.assignedStatus === ""
              ? 0
              : this.assignedStatus
            : 1,
        ordering: "-id",
        project__dpt: this.userInfo.selectedDepartment.id,
        project__dpt__organization: this.userInfo.selectedOrganization.id,
      };
      if (this.viewsMode === "已分配") {
        params.page = this.alreadyPage;
        params.page_size = this.alreadyPageSize;
      }
      if (this.viewsMode === "已分配" && this.projectStage !== "") {
        params.stage = this.projectStage;
      }
      if (this.viewsMode === "待分配") {
        this.$refs.table.loadStart();
      } else {
        this.$refs.alreadyTable.loadStart();
      }
      this.$api.projectPatient
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
    changePatientStage(row) {
      this.$api.projectPatient
        .patch(row.id, {
          stage: row.stage,
        })
        .then((res) => {
          this.$message.success("系统已保存您的更改");
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
  }, // methods end
  computed: {
    ...mapGetters(["userInfo"]),
    ASGMT_STATUS() {
      return ASGMT_STATUS;
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
  height: calc(100% - 156px);

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
