<template>
  <div class="panel">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_zsk"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>系统配置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        患者项目关联规则
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button
          v-auth="'projectRule.create'"
          class="common-add-btn"
          icon="el-icon-plus"
          @click="add"
          :disabled="tableData.length >= PRODUCT.length || isLoading"
        >添加</m-button>

        <template>
          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :get-data-func="getList"
            v-loading="isLoading"
            hidePagination
          >
            <el-table-column
              show-overflow-tooltip
              prop=""
              label="治疗方式"
              align="center"
            >
              <template v-slot="scope">
                <span>{{ getMode(scope.row.treatment_mode) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="project.name"
              label="项目"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              show-overflow-tooltip
            >
              <template v-slot="scope">
                <span>{{ scope.row.created_at | dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="160px"
            >
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box
                    v-auth="'projectRule.update'"
                    icon-name="table_edit"
                    w="39"
                    h="39"
                    box-w="39"
                    style="cursor:pointer;"
                    title="编辑"
                    @click.native="editClick(scope.row)"
                  ></icon-box>
                  <icon-box
                    v-auth="'projectRule.delete'"
                    icon-name="table_delete"
                    w="39"
                    h="39"
                    box-w="39"
                    style="cursor:pointer;"
                    title="删除"
                    @click.native="deleteClick(scope.row)"
                  ></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
      destroy-on-close
      @close="close"
    >
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100"
        label-position="left"
      >
        <el-form-item
          label="患者治疗方式"
          prop="treatment_mode"
        >
          <el-select
            v-model="form.treatment_mode"
            placeholder="请选择"
            clearable
            style="width: 320px"
            :disabled="isEdit"
          >
            <el-option
              v-for="product in products"
              :key="product.code"
              :label="product.label"
              :value="product.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="项目"
          prop="project_id"
        >
          <el-select
            v-model="form.project_id"
            placeholder="请选择"
            clearable
            style="width: 320px"
          >
            <el-option
              v-for="product in projects"
              :key="product.id"
              :label="product.name"
              :value="product.id"
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
          @click="dialogVisible = false"
          w="80px"
        >取 消</m-button>
        <m-button
          w="80px"
          @click="save"
        >保 存</m-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { PRODUCT } from "@/common/utils/dict";
import { mapGetters } from "vuex";
export default {
  name: "ProjectRule",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      form: {
        treatment_mode: "",
        project_id: "",
      },
      rules: {
        treatment_mode: [
          { required: true, message: "请选择患者治疗方式", trigger: "change" },
        ],
        project_id: [{ required: true, message: "请选择项目", trigger: "change" }],
      },

      info: {},

      dialogVisible: false,
      dialogTitle: "添加患者项目关联规则",
      isLoading: false,
      projects: [],
      products: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getMode(mode) {
      const item = this.PRODUCT.find((ele) => ele.code == mode);
      if (item) return item.label;
      return "";
    },
    add() {
      this.products = this.addProduct
      this.getProjectList();
      this.info = {};
      this.dialogTitle = "添加患者项目关联规则";
      this.dialogVisible = true;
    },
    getList() {
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: "-created_at",
        dpt: this.userInfo.selectedDepartment.id
      };
      this.isLoading = true;
      this.$api.projectRule
        .getList(params)
        .then((res) => {
          this.isLoading = false;
          this.total = res.data.count;
          this.tableData = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    close() {
      this.form = {
        treatment_mode: "",
        project_id: "",
      };
    },
    editClick(row) {
      this.products = this.PRODUCT
      this.getProjectList();
      this.form = {
        treatment_mode: row.treatment_mode,
        project_id: row.project.id,
      };
      this.info = row;
      this.dialogTitle = "修改患者项目关联规则";
      this.dialogVisible = true;
    },
    create() {
      const params = { ...this.form };
      params.dpt = this.userInfo.selectedDepartment.id;
      this.$api.projectRule
        .create(params)
        .then((res) => {
          this.$message.success("添加成功");
          this.dialogVisible = false;
          this.getList();
        })
        .catch((err) => {
          if (err.code === "multiple") {
            this.$message.error(
              JSON.stringify(err.list.map((item) => item.detail).join(""))
            );
          } else {
            this.$message.error(JSON.stringify(err.detail));
          }
        });
    },
    update() {
      const params = { ...this.form };
      params.dpt = this.info.dpt;
      this.$api.projectRule
        .patch(this.info.id, params)
        .then((res) => {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.getList();
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    deleteClick(row) {
      this.$confirm(`确定删除吗？`, "删除患者项目关联规则", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.projectRule
            .delete(row.id)
            .then((res) => {
              this.$message.success("删除成功");
              this.getList();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.info.id) {
            this.create();
          } else {
            this.update();
          }
        } else {
          return false;
        }
      });
    },
    getProjectList() {
      this.$api.project
        .getList({
          page: 1,
          page_size: 9999,
          dpt: this.userInfo.selectedDepartment.id,
          org: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          this.projects = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
  }, // methods end
  computed: {
    ...mapGetters(["userInfo"]),
    PRODUCT() {
      return PRODUCT;
    },
    addProduct() {
        return PRODUCT.filter(ele => {
            const sel = this.tableData.find(el => el.treatment_mode == ele.code)
            if (sel) return false
            return true
        })
    },
    isEdit() {
        return this.info.id ? true : false
    }
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

.calc-dialog {
  :deep(.el-dialog) {
    height: 300px;

    .el-form-item__label {
      width: 100px;
    }
  }
}

.m-table {
  height: calc(100% - 0px);

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

.action-content {
  height: calc(100vh - 375px);
  overflow: scroll;

  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .action-item-left {
      display: flex;
      flex-direction: column;
      width: 35%;
      align-items: center;
      .action-item-image {
        width: 100%;
        height: 200px;
      }
      span {
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .action-item-right {
      display: flex;
      flex-direction: column;
      width: 35%;
      margin-left: 30px;
      span {
        font-size: 14px;
        margin-top: 15px;
        font-weight: 600;
      }
      span:nth-child(2n) {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}

.el-pagination {
  height: 24px;
  line-height: 24px;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #ebeef5;

  :deep(.el-input__inner) {
    height: 22px;
  }
}

.upload-box {
  height: 150px;
  width: 200px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
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

  .close-btn {
    display: none;
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 11;
    cursor: pointer;
    font-weight: bold;
    padding: 4px;
    color: #fff;
    background-color: #000;
    opacity: 0.3;
    border-radius: 50%;
    font-size: 12px;
  }

  .image-wrapper:hover .close-btn {
    //visibility: visible;
    display: block;
  }
}
</style>
