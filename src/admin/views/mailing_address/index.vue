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
        支架寄回地址
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div
        class="container"
        v-loading="isLoading"
      >
        <div class="card-title">
          支架寄回地址
        </div>
        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
          ref="form"
          label-position="top"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="姓名"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入姓名"
                  clearable
                  style="width: 450px;"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话"
                prop="phone"
              >
                <el-input
                  v-model="form.phone"
                  placeholder="请输入电话"
                  clearable
                  style="width: 450px;"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item
                label="详细地址"
                prop="selectedArea"
              >
                <el-cascader
                  :options="regionData"
                  v-model="form.selectedArea"
                  style="width: 100%"
                  placeholder="请选择省市区"
                  clearable
                  :disabled="!canEdit"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="18">
              <el-form-item
                label="详细地址"
                prop="address"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="form.address"
                  placeholder="请输入详细地址"
                  clearable
                  style="width: 100%;"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item v-auth="'address.update'">
            <m-button @click="save">{{ canEdit ? '保存' : '编辑' }}</m-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, codeToText } from "element-china-area-data";
export default {
  name: "MailingAddress",
  data() {
    return {
      regionData,
      tableData: [],
      total: 0,
      pageSize: 1,
      page: 1,

      form: {
        name: "",
        phone: "",
        address: "",
        selectedArea: [],
      },
      rules: {
        name: [{ required: true, message: "请填写姓名", trigger: "change" }],
        phone: [{ required: true, message: "请填写电话", trigger: "change" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "change" },
        ],
        selectedArea: [
          { required: true, message: "请选择省市区", trigger: "change" },
        ],
      },
      isLoading: false,
      canEdit: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: "-created_at",
      };
      this.isLoading = true;
      this.$api.mailingAddress
        .getList(params)
        .then((res) => {
          this.isLoading = false;
          this.total = res.data.count;
          this.tableData = res.data.results;
          if (this.tableData.length > 0) {
            const item = this.tableData[0];
            this.form = {
              name: item.name,
              phone: item.phone,
              address: item.address,
              selectedArea: [
                item.province_code,
                item.city_code,
                item.area_code,
              ],
            };
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    save() {
      if (!this.canEdit) {
        this.canEdit = true;
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            phone: this.form.phone,
            address: this.form.address,
            province: codeToText[this.form.selectedArea[0]],
            province_code: this.form.selectedArea[0],
            city: codeToText[this.form.selectedArea[1]],
            city_code: this.form.selectedArea[1],
            area: codeToText[this.form.selectedArea[2]],
            area_code: this.form.selectedArea[2],
          };
          this.isLoading = true;
          this.$api.mailingAddress
            .create(params)
            .then((res) => {
              this.$message.success("保存成功");
              this.isLoading = false;
              this.canEdit = false;
              this.getList();
            })
            .catch((err) => {
              this.isLoading = false;
              this.$message.error(JSON.stringify(err));
            });
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
    height: 530px;

    .el-form-item__label {
      width: 90px;
    }
  }
}

.radio-group {
  width: 340px;
  height: 46px;
  border-radius: 23px;
  background-color: #f4f5fa;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 130px;
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

  // :deep(.el-table__body-wrapper) {
  //   overflow-x: hidden;
  // }

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
  .add-image-content {
    display: flex;
    flex-direction: row;
    align-items: center;

    .add-image {
      width: 306px;
      height: 48px;
      border: 1px solid #d9e1ec !important;
      border-radius: 12px !important;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 12px;

      // .el-button {
      //     background: ;
      // }
    }

    .add-image-select {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .add-image-delete {
      position: absolute;
      top: 0;
      right: 0;
      color: #ffffff;
    }
  }

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
