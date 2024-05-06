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
        宣教课程集合
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button
          v-auth="'curriculumCa.create'"
          class="common-add-btn"
          icon="el-icon-plus"
          @click="add"
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
          >
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="creator.name"
              label="创建人"
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
                    v-auth="'curriculumCa.update'"
                    icon-name="table_edit"
                    w="39"
                    h="39"
                    box-w="39"
                    style="cursor:pointer;"
                    title="编辑"
                    @click.native="editClick(scope.row)"
                  ></icon-box>
                  <icon-box
                    v-auth="'curriculumCa.delete'"
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
          label=" 名称 "
          prop="name"
          class="mt_20"
        >
          <el-input
            v-model="form.name"
            type="text"
            placeholder="请输入名称"
            class=""
            style="width: 320px"
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
          w="80px"
          @click="save"
        >保 存</m-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "MissionCurriculumCategory",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      form: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
      },

      info: {},

      dialogVisible: false,
      dialogTitle: "添加宣教课程集合",
      isLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    add() {
      this.info = {};
      this.dialogTitle = "添加宣教课程集合";
      this.dialogVisible = true;
    },
    getList() {
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: "-created_at",
      };
      this.isLoading = true;
      this.$api.missionCurriculumCategory
        .getList(params)
        .then((res) => {
          this.isLoading = false;
          this.total = res.data.count;
          this.tableData = res.data.results;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$message.error(JSON.stringify(err));
        });
    },
    close() {
      this.form = {
        name: "",
      };
    },
    editClick(row) {
      this.form = {
        name: row.name,
      };
      this.info = row;
      this.dialogTitle = "修改宣教课程集合";
      this.dialogVisible = true;
    },
    create() {
      const params = { ...this.form };
      this.$api.missionCurriculumCategory
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
      this.$api.missionCurriculumCategory
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
      this.$confirm(`确定删除【${row.name}】吗？`, "删除宣教课程集合", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.missionCurriculumCategory
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
  }, // methods end
  computed: {},
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
      width: 80px;
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
