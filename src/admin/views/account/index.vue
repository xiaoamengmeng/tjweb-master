<template>
  <div class="panel">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_wdhz"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        管理员管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <div>
          <m-button
            v-auth="'account.consult'"
            class="common-add-btn"
            icon="el-icon-plus"
            @click="addConsultation"
            style="right: 138px;"
          >接入咨询</m-button>
          <m-button
            v-auth="'account.create'"
            class="common-add-btn"
            icon="el-icon-plus"
            @click="toSetPage('create')"
          >新建</m-button>
        </div>

        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
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
                class="search-bar-col"
                :span="4"
              >
                <el-row class="label-t">搜索信息</el-row>
                <el-row>
                  <el-form-item prop="search">
                    <el-input
                      v-model="form.search"
                      placeholder="姓名/账号"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="4"
              >
                <el-row class="label-t">人员类型</el-row>
                <el-row>
                  <el-form-item prop="users__role_id">
                    <el-select
                      v-model="form.users__role_id"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="role in roles"
                        :key="role.code"
                        :label="role.label"
                        :value="role.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="3"
              >
                <el-row class="label-t">启用状态</el-row>
                <el-row>
                  <el-form-item prop="is_active">
                    <el-select
                      v-model="form.is_active"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in userStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="6"
              >
                <el-row class="label-t">所属机构</el-row>
                <el-row>
                  <el-form-item prop="department__organization">
                    <el-select
                      v-model="form.department__organization"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="role in organizations"
                        :key="role.id"
                        :label="role.name"
                        :value="role.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="6"
              >
                <el-row class="label-t">所属部门</el-row>
                <el-row>
                  <el-form-item prop="department">
                    <el-select
                      v-model="form.department"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="role in departments"
                        :key="role.id"
                        :label="role.name"
                        :value="role.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="6"
              >
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button
                    icon="el-icon-search"
                    h="40px"
                    w="100px"
                    @click="page=1;getDataFunc()"
                  >搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px - 60px)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="用户ID"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名"
            min-width="100"
          >
            <template v-slot="scope">
              <span v-if="scope.row.users && scope.row.users[0]">{{ scope.row.users[0].name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="账号"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="users"
            label="人员类型"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.users && scope.row.users[0]">{{ scope.row.users[0].role_name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="is_active"
            label="状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.is_active"
                effect="dark"
              >启用</el-tag>
              <el-tag
                type="info"
                v-else
                effect="dark"
              >禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="department"
            label="所属机构"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.org_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="department"
            label="所属部门"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.name }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            show-overflow-tooltip
            label="角色"
            min-width="120"
          > -->
          <!-- <template v-slot="scope"> -->
          <!-- {{ scope.row.users.map(item => item.role_name) | showSlowly }} -->
          <!--              <el-select-->
          <!--                placeholder=""-->
          <!--                v-if="scope.row.users.length > 0"-->
          <!--                :value="scope.row.users ? scope.row.users[0].role_name : ''"-->
          <!--              >-->
          <!--                <el-option-->
          <!--                  v-for="item in scope.row.users"-->
          <!--                  :key="item.id"-->
          <!--                  :label="item.role_name"-->
          <!--                  :value="item.role_name"-->
          <!--                ></el-option>-->
          <!--              </el-select>-->
          <!-- </template> -->
          <!-- </el-table-column> -->

          <el-table-column
            show-overflow-tooltip
            prop="creator"
            label="创建人"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.creator">{{ scope.row.creator.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="date_joined"
            label="创建时间"
            min-width="180"
            show-overflow-tooltip
          >
            <template v-slot="scope">
              <span>{{ scope.row.date_joined | dateFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            min-width="200"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link
                  v-auth="'account.update'"
                  @click.native="changeInfoClick(scope.row)"
                >修改信息</el-link>
                <span class="inline_block mr_6"></span>
                <el-link
                  v-auth="'account.updatePassword'"
                  @click="setPwdClick(scope.row)"
                >修改密码</el-link>
              </div>

              <div class="flex justify_center">
                <el-link
                  v-auth="'account.delete'"
                  @click="deleteClick(scope.row)"
                >删除账号</el-link>
                <span class="inline_block mr_6"></span>
                <el-link style="color: transparent">修改密码</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
    >
      <el-form
        class="form-box"
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordForm"
        label-width="60"
        label-position="left"
      >
        <el-form-item
          label=" 密码 "
          prop="password"
          class="mt_20"
        >
          <el-input
            v-model="passwordForm.password"
            show-password
            type="password"
            placeholder="请输入修改的密码"
            class=""
            style="width: 320px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="dialogVisible = false"
          w="80px"
        >取 消</m-button>
        <m-button
          @click="savePass"
          w="80px"
        >保 存</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="接入咨询"
      :visible.sync="visible"
      :modal="true"
      class="calc-dialog"
      @closed="canEdit = false"
    >
      <div style="width: 100%;
        text-align: center;
        margin-top: 40px;">
        <div>
          当前接入营养师：<span style="color: #333">{{ isSelectedConsultationStr }}</span>
          <div
            v-if="!canEdit"
            style="color: #00A29A; margin-top: 10px; cursor: pointer;"
            @click="canEdit = true"
          >修改</div>
        </div>
        <el-select
          v-if="canEdit"
          style="margin-top: 20px; width: 200px"
          v-model="isSelectedConsultation"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in consultationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="visible = false"
          w="80px"
        >取 消</m-button>
        <m-button
          @click="saveConsultation"
          w="80px"
        >保 存</m-button>
      </span>
    </el-dialog>

    <role-editor
      ref="roleEditor"
      v-model="roleForm.roles"
      :account-info="currAccount"
      :roles="roles"
      @save="saveRole"
    ></role-editor>
  </div>
</template>

<script>
import RoleEditor from "./components/RoleEditor";

export default {
  name: "Account",
  components: {
    RoleEditor,
  },
  watch: {
    "form.department__organization"(n) {
      this.form.department = "";
      if (n) {
        this.getDepartments();
      } else {
        this.departments = [];
      }
    },
  },
  computed: {
    isSelectedConsultationStr() {
      if (this.consultationList.length > 0) {
        const select = this.consultationList.find(
          (ele) => ele.is_access
        );
        if (select) return select.name;
      }
      return "无";
    },
  },
  data() {
    return {
      visible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        department: "",
        department__organization: "",
        is_active: "",
        search: "",
        users__role_id: "",
      },
      passwordForm: {
        password: "",
      },
      passwordRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
      rules: {},
      current: {},
      dialogVisible: false,
      dialogTitle: "修改密码",
      roleVisible: false,
      roleTitle: "修改角色",
      roles: [],
      roleForm: {
        roles: [],
      },
      currAccount: {},
      userStatus: [],

      // 机构
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 9999,
      departments: [],
      departmentsTotal: 0,
      departmentsPage: 1,
      departmentsPageSize: 9999,

      consultationList: [],
      isSelectedConsultation: null,
      canEdit: false,
    };
  },
  mounted() {
    this.getUserStatus();
    this.getRoles();
    this.getOrganizations();
    this.getDataFunc();
    this.focusMenu();
    // this.$api.contentCategories.getList().then(res => {
    //   console.log('====================================');
    //   console.log(res);
    //   console.log('====================================');
    // })

    // this.$api.contentCategories.create({
    //   name: "减重知识",
    //   // id: "bariatric_knowledge"
    // })
    // this.$api.contentCategories.create({
    //   name: "减重知识",
    //   id: "bariatric_knowledge"
    // })

    // bariatric_knowledge
    // bariatric_surgery
    // patient_story

  },
  methods: {
    getUserStatus() {
      this.userStatus = this.$dict.userStatus.data;
    },
    focusMenu() {
      this.$nextTick(() => {
        const element = document.querySelector(
          'li.el-menu-item[index="/account"]'
        );
        if (element) element.click();
      });
    },
    getDataFunc() {
      this.$refs.table.loadStart();
      this.$api.accounts
        .getList({
          page: this.page,
          page_size: this.pageSize,
          department: this.form.department,
          department__organization: this.form.department__organization,
          is_active: this.form.is_active,
          ordering: "-id",
          search: this.form.search,
          users__role_id: this.form.users__role_id,
        })
        .then((res) => {
          this.$refs.table.loadDone();
          this.tableData = res.data.results;
          this.total = res.data.count;
        })
        .catch((err) => {
          this.$refs.table.loadDone();
          this.$message.error(JSON.stringify(err));
        });
    },
    getOrganizations() {
      this.$api.organizationManage
        .getList({
          page: this.organizationsPage,
          page_size: this.organizationsPageSize,
          ordering: "id",
        })
        .then((res) => {
          this.organizations = res.data.results;
          this.organizationsTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    getDepartments() {
      this.$api.departmentManage
        .getList({
          page: this.departmentsPage,
          page_size: this.departmentsPageSize,
          ordering: "id",
          organization: this.form.department__organization,
        })
        .then((res) => {
          this.departments = res.data.results;
          this.departmentsTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    getRoles() {
      this.roles = this.$dict.personnelType.data;
      // this.$api.roles.getList({ ordering: 'id' })
      //   .then((res) => {
      //     // this.roles = res.data.results
      //   })
      //   .catch((err) => {
      //     this.$message.error(JSON.stringify(err))
      //   })
    },
    toSetPage() {
      this.$router.push({
        name: "SetAccount",
        params: {
          type: "create",
          users: [],
        },
      });
    },
    changeInfoClick(row) {
      this.$router.push({
        name: "SetAccount",
        params: {
          type: "edit",
          ...row,
          rolesArr: this.roles,
        },
      });
    },
    changeRoleClick(row) {
      this.currAccount = row;
      this.$refs.roleEditor.showDialog();
    },
    saveRole() {
      const params = { users: [] };
      const name = this.currAccount.name;
      this.roleForm.roles.forEach((roleId) => {
        const old = this.currAccount.users.find(
          (item) => item.role_id === roleId
        );
        if (old) {
          old.name = name;
          params.users.push(old);
        } else {
          params.users.push({
            role_id: roleId,
            name: this.currAccount.name,
          });
        }
      });

      this.$api.accounts
        .patch(this.currAccount.id, params)
        .then((res) => {
          this.$message.success("修改成功");
          this.getDataFunc();
          this.roleVisible = false;
        })
        .catch((err) => {
          if (err.code === "cannot_delete_protected") {
            this.$message.error("保存失败，无法删除使用中的角色");
          } else {
            this.$message.error(err.detail);
          }
        });
    },
    setPwdClick(row) {
      this.dialogVisible = true;
      this.passwordForm.password = "";
      this.currAccount = row;
      this.$nextTick(() => {
        const { passwordForm } = this.$refs;
        if (passwordForm) passwordForm.clearValidate();
      });
    },
    savePass() {
      this.$refs["passwordForm"].validate((valid) => {
        if (valid) {
          this.$api.accounts
            .patch(this.currAccount.id, {
              ...this.currAccount,
              password: this.passwordForm.password,
            })
            .then((res) => {
              this.$message.success("修改密码成功");
              this.getDataFunc();
              this.dialogVisible = false;
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        } else {
          return false;
        }
      });
    },
    deleteClick(row) {
      this.$confirm(`确定删除账号吗？`, "删除账号", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$api.accounts
          .delete(row.id)
          .then((res) => {
            this.$message.success("删除成功");
            this.getDataFunc();
          })
          .catch((err) => {
            if (err.code === "protected_error") {
              this.$message.error("删除失败，账号受到保护，无法删除");
            } else {
              this.$message.error(JSON.stringify(err));
            }
          });
      });
    },
    addConsultation() {
      this.getConsultationList();
      // this.visible = true;
    },
    saveConsultation() {
      const select = this.consultationList.find(
        (ele) => ele.id === this.isSelectedConsultation
      );
      const selectAccess = this.consultationList.find((ele) => ele.is_access);
      if (select) {
        if (selectAccess) {
          if (select.id === selectAccess.id) {
            this.$message.success("保存成功");
            this.visible = false;
          } else {
            this.patchAccess(selectAccess.id, false, false);
            this.patchAccess(select.id, true);
          }
        } else {
          this.patchAccess(select.id, true);
        }
      } else {
        if (selectAccess) {
          this.patchAccess(selectAccess.id, false);
        } else {
          this.$message.success("保存成功");
          this.visible = false;
        }
      }
    },
    patchAccess(id, isAccess, showTip = true) {
      this.$api.accounts
        .patch(id, {
          is_access: isAccess,
        })
        .then((res) => {
          if (showTip) {
            this.$message.success("保存成功");
            this.visible = false;
          }
        })
        .catch((err) => {
          if (err.code === "multiple") {
            this.$message.error(err.list.map((item) => item.detail).join(""));
          } else {
            this.$message.error(err.detail);
          }
        });
    },
    getConsultationList() {
      this.$api.accounts
        .getList({
          page: 1,
          page_size: 9999,
          department__organization: 1,
          ordering: "-id",
          is_active: true,
          users__role_id__in: "ld,rd",
        })
        .then((res) => {
          this.consultationList = res.data.results;
          const select = res.data.results.find((ele) => ele.is_access);
          this.isSelectedConsultation = select ? select.id : null;
          this.visible = true;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
  },
};
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 50px);
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

.form-box {
  .el-select {
    :deep(.el-select__tags) {
      .el-tag {
        box-sizing: border-box;
        background-color: #e9e9eb;
        color: #909399;

        .el-tag__close.el-icon-close::before {
          background: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
