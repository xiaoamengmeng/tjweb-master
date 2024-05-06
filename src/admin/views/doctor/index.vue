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
        医生列表
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

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
                :span="5"
              >
                <el-row class="label-t">ID</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.id"
                      placeholder="请输入ID"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">姓名</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入姓名"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col
                class="search-bar-col"
                :span="6"
              >
                <el-row class="label-t">医生状态</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.status"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        :label="'审核通过'"
                        value="approved"
                      ></el-option>
                      <el-option
                        :label="'待审核'"
                        value="pending"
                      ></el-option>
                      <el-option
                        :label="'审核未通过'"
                        value="rejected"
                      ></el-option>
                      <el-option
                        :label="'草稿'"
                        value="draft"
                      ></el-option>
                      <el-option
                        :label="'已取消'"
                        value="canceled"
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
                    @click="page=1;getDataFunc()"
                    h="40px"
                    w="100px"
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
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="user"
            label="UUID"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="department_info.organization__name"
            label="所在医院"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="department_info.name"
            label="科室"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="title"
            label="职称"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.title | titleFilter}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="创建时间"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.created_at | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_user_active"
            label="用户状态"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.is_user_active"
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
            prop="status"
            label="医生状态"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.status | statusFilter}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150px"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link
                  v-auth="'doctor.info'"
                  @click.native="toDetail(scope.row)"
                >详情</el-link>
                <span
                  v-show="scope.row.status === 'approved'"
                  class="inline_block mr_10"
                ></span>
                <el-link
                  v-show="scope.row.status === 'approved'"
                  v-auth="'doctor.qrcode'"
                  @click.native="qrCodeClick(scope.row)"
                >二维码</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>

    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      width="300px"
      class="qr-code-dialog"
      center
    >
      <div
        v-if="item"
        class="qr-code-content"
      >
        <div style="font-size: 18px; color: #333; font-weight: 600">
          {{ item.name }}
        </div>
        <div style="margin-top: 6px">{{ item.title | titleFilter }}</div>
        <el-carousel
          :autoplay="false"
          style="margin-top: 10px; width: 300px;"
          arrow="always"
          indicator-position="none"
          @change="changeQr"
        >
          <el-carousel-item
            v-for="ite in dpts"
            :key="ite.id"
          >
            <div class="qr-code-content1">
              <div>{{ ite | depStr }}</div>
              <img
                class="qr-code"
                :src="ite.qrCode"
                alt=""
              />
            </div>
          </el-carousel-item>
        </el-carousel>

        <el-link @click.native="download()">下载</el-link>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { DOCTOR_AUTHENTICATION } from "@/common/utils/dict";
import { downloadBase64Image } from "@/common/utils/downloadImage";
import QRCode from "qrcode";
export default {
  name: "Doctor",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        id: "",
        name: "",
        type: "",
        ordering: "",
        status: "",
      },
      rules: {},
      current: {},
      deleteDialogVisible: false,
      dialogVisible: false,
      centerDialogVisible: false,
      item: null,
      qrIdx: 0,
      dpts: [],
      qrCode:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAAC4klEQVR4nO2bQY6jMBBFX42ReglSH8jcrDVHmhvAUXIDWEYC/VnYBpKeTSsa6IZigTDxU4xSqfpVZUx8+eh/fZ0BhxxyyCGHHHLonJDlowKYzawBswborcLasUxoD1meQ/tDUZI0gFkTRBxAulXYhyaAIEnSI7Tf8hzaHxqLA4jDbOrGCmvru9E3s6kDigc5ZnkOHQelMAHAWEG8Vc8zft4zOfQCpK6WgNmglqCe/tM3OfQ9oeIBagFjHogRxNig3oLyvSOW59DuEFvFSBBx+NepTIiS1H3zZ3LoFSj5iK0DqO8mxtmgvlse8ljr/ubP5NArUPYROfsMYnUU6dNyT12Z7D7i1NAmaiRRGSVBrWQCUE+oq7dFCbeIU0P5by9NEIeQrpI/SAYylOJUqlq5RZwdKhYxrLYhlRQ0JG9B1LSd7BZxfsjaWjIrPQxgNnV18Ra/7S05D2sPWZ5DR/iIkFxBUQ+SOnIQYVGWnn2eH1qUZSi5Rj2RCxB11phJXq6BxS3i/JCku6XWVtykoBTbIMjadDpieQ4dEzUewgTw5Dcouan7iFNDD9mnJnL2uWQYKeccvEJ1GWjpdQcZ47tgfJeBod5AfQMGASBMFrt9l+fQ7tCmCpHrk+QCdvERYalHBI8aF4C2vc9FRaYwoYFUwN7Yi0eN00Obn3utT2aLWAQGD/Vst4hTQ9veZ0dIBeycdQy5uZFOkvuIK0BFWY4NRM0G9Vylq/gHLN4sb47o2wOW59Du0EPUAIp7+Lx9yrvh14C2Hc+NxtxoiykPXUdcCVrf6crqITVAg/Lu/DG/7HXQ8hzaH4qplL3eD4LRjL6BElNKoeKHPJNDL+UaA3kPVbd0PFPoWO3A6xHXhfKuurFCXdqQLcH45r3PK0JxAPu45Y1UqdPVJQnhOuIK0PPu/LKXbillL0mI5xrXgD6/01X64lAKl3noOuIS0PM7XcpSctWTYhl6ruGQQw455JBDDm2Ov5wJxYcMWBvsAAAAAElFTkSuQmCC",
    };
  },
  filters: {
    statusFilter: function (v) {
      return v === "draft"
        ? "草稿"
        : v === "approved"
        ? "审核通过"
        : v === "pending"
        ? "待审核"
        : v === "rejected"
        ? "审核未通过"
        : "已取消";
    },
    titleFilter: function (v) {
      const item = DOCTOR_AUTHENTICATION.find((ele) => ele.code == v);
      return item ? item.label : "住院医师";
    },
    dateFormat: function (v) {
      return v ? v.split("+")[0].split(".")[0].replace(/T/, " ") : "";
    },
    depStr(v) {
      return `${v.orgName} ${v.dptName}`;
    },
  },
  mounted() {
    this.getDataFunc();
  },
  methods: {
    getDataFunc() {
      this.$refs.table.loadStart();
      this.$api.doctor
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: this.form.ordering,
          search: this.form.name,
          user_id: this.form.id,
          status: this.form.status,
        })
        .then((res) => {
          this.tableData = res.data.results;
          this.total = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    toSetDishPage() {
      this.$router.push({
        name: "SetAccount",
        params: {
          type: "create",
        },
      });
    },
    toDetail(row) {
      this.$router.push({
        name: "DoctorDetails",
        params: {
          type: "edit",
          ...row,
        },
      });
    },
    setPwd(row) {
      this.dialogVisible = true;
    },
    deleteClick(row) {
      this.$confirm(`确定删除账号吗？`, "删除账号", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      });
    },
    async qrCodeClick(item) {
      let dpts = item.teams.map((ele) => {
        return {
          dptId: ele.dpt__id,
          dptName: ele.dpt__name,
          orgName: ele.dpt__organization__name,
        };
      });
      dpts = [
        {
          dptId: item.department_info.id,
          dptName: item.department,
          orgName: item.hospital,
        },
        ...dpts,
      ];
      this.dpts = dpts
        .reduce(
          (prev, curr) =>
            prev.find((ele) => ele.dptId == curr.dptId)
              ? prev
              : [...prev, curr],
          []
        )
        .map((ele) => {
          let local = window.location.origin.replace("admin", "www");
          let qrStr =
            local +
            "?doctor_id=" +
            item.user +
            "&dep_id=" +
            ele.dptId;
          return {
            ...ele,
            qrStr: qrStr,
          };
        });
      for (let i = 0; i < this.dpts.length; i++) {
        const element = this.dpts[i];
        const qrCode = await QRCode.toDataURL(element.qrStr, {
          errorCorrectionLevel: "H",
        });
        element.qrCode = qrCode;
      }
      this.item = item;
      this.qrIdx = 0;
      this.centerDialogVisible = true;
    },
    changeQr(idx) {
      this.qrIdx = idx;
    },
    download() {
      const url = this.dpts[this.qrIdx].qrCode;
      const img = new Image(); // 创建img元素
      img.setAttribute("crossorigin", "anonymous");
      img.onload = () => {
        const imgWidth = 800,
          imgHeight = 800;
        const canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");

        // 设置画布大小
        canvas.width = (imgWidth + 40);
        canvas.height = (imgHeight + 300);
        // canvas.style.width = imgWidth + 20 + "px";
        // canvas.style.height = imgHeight + 120 + "px";

        // 绘制背景颜色
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制文字(文本内容，x坐标，y坐标)
        ctx.font = "48px Microsoft YaHei";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(this.item.name, canvas.width / 2, 80);
        ctx.font = "36px Microsoft YaHei";
        const itemI = DOCTOR_AUTHENTICATION.find(
          (ele) => ele.code == this.item.title
        );
        const title = itemI ? itemI.label : "住院医师";
        ctx.fillText(title, canvas.width / 2, 160);
        ctx.fillText(
          `${this.dpts[this.qrIdx].orgName} ${this.dpts[this.qrIdx].dptName}`,
          canvas.width / 2,
          240
        );

        ctx.drawImage(img, 20, 260, imgWidth, imgHeight);
        downloadBase64Image(
          canvas.toDataURL("image/png"),
          `${this.item.name}.png`
        );
      };

      img.src = url;
    },
  },
};
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 110px);

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
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

.qr-code-dialog {
  /deep/.el-dialog {
    height: 440px;
  }

  .qr-code-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    /deep/.el-carousel__container {
      height: 270px;
    }

    .qr-code-content1 {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .qr-code {
      width: 230px;
    }
  }
}
</style>
