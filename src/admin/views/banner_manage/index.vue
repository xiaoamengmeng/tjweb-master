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
      <el-breadcrumb-item> banner管理 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button
          v-auth="'banner.create'"
          :disabled="tableData.length >= 5 || isLoading"
          class="common-add-btn"
          icon="el-icon-plus"
          @click="add"
        >添加</m-button>
        <div>
          <el-radio-group
            @change="viewsModeChange"
            class="radio-group"
            v-model="viewsMode"
          >
            <el-radio-button label="小程序首页"></el-radio-button>
            <el-radio-button label="小程序发现页"></el-radio-button>
          </el-radio-group>
        </div>

        <template>
          <div style="height: 20px"></div>
          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :get-data-func="getList"
            :hidePagination="true"
            v-loading="isLoading"
          >
            <el-table-column
              show-overflow-tooltip
              label="图片"
              width="300px"
              align="center"
            >
              <template v-slot="scope">
                <el-image
                  :src="scope.row.image_url"
                  style="width: auto; height: 100px"
                  fit="cover"
                  :preview-src-list="[scope.row.image_url]"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="type"
              label="跳转类型"
              width="120px"
              align="center"
            >
              <template v-slot="scope">
                <span>{{ scope.row.type | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="type"
              label="跳转内容"
              align="center"
            >
              <template v-slot="scope">
                <el-link
                  v-if="scope.row.type === 'Link'"
                  @click.native="toUrl(scope.row)"
                >{{ scope.row.url }}</el-link>
                <span v-if="scope.row.type === 'Mini'">{{
                  scope.row.mini_id
                }}</span>
                <span v-if="scope.row.type === 'Knowledge' && scope.row.post">{{
                  scope.row.post.title
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="creator.name"
              label="创建人"
              width="120px"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="160px"
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
                    v-auth="'banner.update'"
                    icon-name="table_edit"
                    w="39"
                    h="39"
                    box-w="39"
                    style="cursor: pointer"
                    title="编辑"
                    @click.native="editClick(scope.row)"
                  ></icon-box>
                  <icon-box
                    v-auth="'banner.delete'"
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
        </template>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
      @close="close"
      destroy-on-close
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
          label=" 跳转类型 "
          prop="type"
          class="mt_20"
        >
          <el-select
            v-model="form.type"
            placeholder="请选择跳转类型"
            clearable
            style="width: 320px"
          >
            <el-option
              v-for="statu in bannerType"
              :key="statu.code"
              :label="statu.label"
              :value="statu.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'Link'"
          label=" 跳转url "
          prop="url"
          class="mt_20"
        >
          <el-input
            v-model="form.url"
            type="text"
            placeholder="请输入跳转url"
            class=""
            style="width: 320px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'Mini'"
          label=" 小程序id "
          prop="mini_id"
          class="mt_20"
        >
          <el-input
            v-model="form.mini_id"
            type="text"
            placeholder="请输入小程序id"
            class=""
            style="width: 320px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'Knowledge'"
          label=" 科普知识 "
          prop="post"
          class="mt_20"
        >
          <el-input
            v-model="form.post"
            type="text"
            placeholder="请选择科普知识"
            class=""
            style="width: 320px"
            readonly
          ></el-input>
          <el-button
            @click="getContentList"
            class="knowledge-button"
            style="width: 320px"
          ></el-button>
        </el-form-item>
        <el-form-item
          label=" banner "
          prop="image_path"
          class="mt_20"
        >
          <div class="add-image-content">
            <div
              class="image-wrapper"
              style="position: relative"
              v-if="fileList.length == 1"
            >
              <el-image
                style="min-height: 100px; max-height: 100px; max-width: 100px"
                :src="fileList[0].url"
                :preview-src-list="[fileList[0].url]"
              />
              <i
                @click="handleRemove"
                class="close-btn el-icon-close"
              ></i>
            </div>
            <el-upload
              accept=".jpg,.jpeg,.png"
              action="#"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="handleChange"
              :show-file-list="false"
            >
              <div
                v-if="fileList.length == 0"
                class="add-image"
              >
                <el-button
                  size="small"
                  type="info"
                  plain
                >选择文件</el-button>
                <div style="color: #566085; margin-left: 10px">
                  未选择任何文件
                </div>
              </div>
              <div
                class="add-image-select"
                v-else
              >
                <m-button
                  style="margin-left: 10px"
                  plain
                >重新上传</m-button>
              </div>
            </el-upload>
          </div>
          <!-- <div style="color: #999999; margin-left: 110px">支持jpg、jpeg、png格式，大小不超过500K</div> -->
        </el-form-item>
        <div style="color: #999999">
          说明：
          <br />
          1、banner图片支持jpg、jpeg、png格式，建议尺寸为750*320像素，不超过500K。
          <br />
          2、跳转类型选择“url链接”时，文章需要在微信公众平台的小程序管理系统把跳转的url添加至白名单，具体操作如下：
          <br />
          登录微信公众平台：https://mp.weixin.qq.com/
          <br />
          使用吉享健康小程序管理员账号扫描二维码，进入系统
          <br />
          选择开发->开发管理->开发设置->业务域名，点击修改，添加要跳转的url，并请下载校验文件，将文件放置在域名根目录下，例如wx.qq.com，且确保可以访问该文件。
          <br />
          “吉享健康公众号”的内容，不需要配置白名单。
          <br />
          3、跳转类型选择“小程序”时，需要在微信公众平台的小程序管理系统获取跳转小程序的ID，具体操作如下：
          <br />
          登录微信公众平台：https://mp.weixin.qq.com/
          <br />
          使用跳转小程序的管理员账号扫描二维码，进入系统
          <br />
          选择开发->开发管理->开发设置->开发者ID，找到“AppID(小程序ID)”，复制内容即可。
        </div>
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
          @click="save()"
        >保 存</m-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择科普知识"
      :visible.sync="visible"
      :modal="true"
      class="calc-dialog"
      @close="contentClose"
      destroy-on-close
    >
      <m-table
        ref="table"
        class="m-table1"
        :data="contentTableData"
        :total="contentTotal"
        :page-sizes="[10, 15, 20]"
        :page-size.sync="contentPageSize"
        :current-page.sync="contentPage"
        :get-data-func="getContentList"
        @row-click="rowClick"
      >
        <el-table-column
          show-overflow-tooltip
          prop="title"
          label="标题"
          min-width="120px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="content_type"
          label="类型"
          min-width="100"
        >
          <template v-slot="scope">
            <span v-if="scope.row.content_type == 'video'">视频</span>
            <span v-if="scope.row.content_type == 'article'">文章</span>
            <span v-if="scope.row.content_type == 'short_article'">短文章</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="category"
          label="分类"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="creator.name"
          label="发布人"
          min-width="80"
        >
        </el-table-column>
      </m-table>
    </el-dialog>
  </div>
</template>

<script>
import { BANNER_TYPE } from "@/common/utils/dict";
import button from "../../../default/lemon-imui/components/button.vue";
import { debounce } from '@/common/utils/debounce';
export default {
  components: { button },
  name: "BannerManage",
  data() {
    return {
      viewsMode: "",
      tableData: [],
      total: 0,
      pageSize: 5,
      page: 1,

      form: {
        // position: "", // MiniHome, MiniFind
        type: "", // Link, Knowledge, Mini
        post: "",
        post_id: "",
        url: "",
        mini_id: "",
        image_path: "",
      },
      rules: {
        // type: [
        //   { required: true, message: "请选择跳转类型", trigger: "change" },
        // ],
        url: [{ required: true, message: "请填写跳转url", trigger: "change" }],
        post: [{ required: true, message: "请填写科普id", trigger: "change" }],
        mini_id: [
          { required: true, message: "请填写小程序id", trigger: "change" },
        ],
        image_path: [
          { required: true, message: "请选择banner", trigger: "change" },
        ],
      },

      info: {},

      dialogVisible: false,
      dialogTitle: "添加banner",
      bannerType: [],
      fileList: [],
      isLoading: false,
      visible: false,
      contentPage: 1,
      contentPageSize: 10,
      contentTotal: 0,
      contentTableData: [],
    };
  },
  filters: {
    typeFilter: function (n) {
      const item = BANNER_TYPE.find((ele) => ele.code === n);
      if (item) {
        return item.label;
      }
      return "";
    },
  },
  created() {
    this.getBannerType();
    let index = 0;
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views);
    }
    if (index === 0) {
      this.viewsModeChange("小程序首页");
    } else {
      this.viewsModeChange("小程序发现页");
    }
  },
  methods: {
    rowClick(row, column, event) {
      this.form.post = row.title;
      this.form.post_id = row.id;
      this.visible = false;
    },
    getContentList() {
      this.visible = true;
      let params = {
        page: this.contentPage,
        page_size: this.contentPageSize,
        ordering: "-id",
        permission: "All",
        is_null_tags: true,
        status: "published",
      };
      this.$api.content
        .getList(params)
        .then((res) => {
          this.contentTotal = res.data.count;
          this.contentTableData = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getBannerType() {
      this.bannerType = this.$dict.bannerType.data;
    },
    add() {
      this.info = {};
      this.dialogTitle = "添加banner";
      this.dialogVisible = true;
    },
    getList() {
      // this.$nextTick(() => {
      //   const { table } = this.$refs;
      //   if (table) table.loadStart();
      // });

      const params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: "-created_at",
      };
      if (this.viewsMode === "小程序首页") {
        params.position = "MiniHome";
      } else if (this.viewsMode === "小程序发现页") {
        params.position = "MiniFind";
      }
      this.isLoading = true;
      this.$api.banner
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
    contentClose() {
      this.contentPage = 1;
      this.contentPageSize = 10;
      this.contentTotal = 0;
      this.contentTableData = [];
    },
    close() {
      this.fileList = [];
      this.form = {
        type: "", // Link, Knowledge, Mini
        post: "",
        post_id: "",
        url: "",
        mini_id: "",
        image_path: "",
      };
    },
    toUrl(row) {
      window.open(row.url, "_blank");
    },
    editClick(row) {
      this.form = {
        type: row.type,
        post: row.post ? row.post.title : "",
        post_id: row.post ? row.post.id : "",
        url: row.url,
        mini_id: row.mini_id,
        image_path: row.image_path,
      };
      this.fileList = [
        {
          url: row.image_url,
        },
      ];
      this.info = row;
      this.dialogTitle = "修改banner";
      this.dialogVisible = true;
    },
    create() {
      const params = { ...this.form };
      // params.post = params.post_id;
      delete params.post;
      if (!params.post_id) delete params.post_id;
      if (!params.url) delete params.url;
      if (!params.mini_id) delete params.mini_id;
      if (this.viewsMode === "小程序首页") {
        params.position = "MiniHome";
      } else if (this.viewsMode === "小程序发现页") {
        params.position = "MiniFind";
      }
      this.$api.banner
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
      // params.post = params.post_id;
      delete params.post;
      if (!params.post_id) delete params.post_id;
      if (!params.url) delete params.url;
      if (!params.mini_id) delete params.mini_id;
      this.$api.banner
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
    handleChange(file, fileList) {
      if (!file.url) {
        file.url = URL.createObjectURL(file.raw);
      }
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },

    handleRemove() {
      this.fileList = [];
      this.form.image_path = "";
    },
    processHandle(progressData, uploadKey) {
      if (progressData.percent === 1) {
        const image_path = uploadKey.path_list[0];
        this.form.image_path = image_path;
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
      }
    },
    uploadFile() {
      this.$cos
        .uploadFile(this.fileList, this.processHandle)
        .then((res) => {})
        .catch((err) => {
          this.$message.error("上传图片失败");
        });
    },
    deleteClick(row) {
      this.$confirm(`确定删除banner吗？`, "删除banner", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$api.banner
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
    saveInfo() {
      // 判断一下是否是更换了图片
      if (
        this.fileList.length > 0 &&
        this.fileList[0].url != this.info.image_url
      ) {
        this.uploadFile();
      } else {
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
      }
    },
    save: debounce(function (...args) {
			this.saveInfo(...args)
		}, 500),
    viewsModeChange(val) {
      this.viewsMode = val;
      if (val === "小程序首页") {
        this.$router.push(`${this.$route.path}?views=0`);
        this.getList();
      } else {
        this.$router.push(`${this.$route.path}?views=1`);
        this.getList();
      }
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
    width: 700px;
    height: 620px;

    .el-dialog__body {
      overflow: scroll;
      height: 480px;
    }

    .el-form-item__label {
      width: 120px;
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

.m-table1 {
  height: 100%;
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

.knowledge-button {
  width: 320px;
  position: absolute;
  left: 120px;
  height: 100%;
  background-color: transparent;
  border: none;
}
</style>
