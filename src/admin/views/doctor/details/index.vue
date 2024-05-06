<template>
  <div class="panel scroll">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item :to="{path: '/doctor'}">
        <icon-box
          icon-name="menu_zsk"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>医生列表</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div
      class="card"
      v-loading="loading"
    >
      <div class="card-title">
        {{ title }}
      </div>
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="top"
      >

        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">UUID：{{ form.user }}</div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">医生状态：{{ form.status | doctorStatus }}</div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">昵称：{{ form.name }}</div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">姓名：{{ form.name }}</div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">医院：{{ department_info.organization__name }}</div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple base2">
              <div class="item">职称：{{ form.title | titleFilter }}</div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="头像（个人照片）：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>
              <span style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span> -->
              <el-image
                style="width: 150px; height: 150px;margin-right: 10px;"
                :src="verificationData.photo"
                fit="cover"
                :preview-src-list="[verificationData.photo]"
                class="preview-image-box"
              >
                <div
                  slot="error"
                  class="image-slot"
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
                <div
                  slot="placeholder"
                  class="image-slot"
                >
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="医师资格证书：">
              <template v-for="item in verificationData.verification_images">
                <el-image
                  v-if="item.license_type === 'ZGZ'"
                  :key="item.id"
                  style="width: 150px; height: 150px;margin-right: 10px;"
                  :src="item.image"
                  fit="cover"
                  :preview-src-list="[item.image]"
                  class="preview-image-box"
                >
                  <div
                    slot="error"
                    class="image-slot"
                  >
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </template>
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>
              <span style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span> -->
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="医师执业证书：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>
              <span style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span> -->
              <template v-for="item in verificationData.verification_images">
                <el-image
                  v-if="item.license_type === 'ZYZ'"
                  :key="item.id"
                  style="width: 150px; height: 150px;margin-right: 10px;"
                  :src="item.image"
                  fit="cover"
                  :preview-src-list="[item.image]"
                  class="preview-image-box"
                >
                  <div
                    slot="error"
                    class="image-slot"
                  >
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </template>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="胸牌：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>
               <span style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span> -->
              <template v-for="item in verificationData.verification_images">
                <el-image
                  v-if="item.license_type === 'XP'"
                  :key="item.id"
                  style="width: 150px; height: 150px;margin-right: 10px;"
                  :src="item.image"
                  fit="cover"
                  :preview-src-list="[item.image]"
                  class="preview-image-box"
                >
                  <div
                    slot="error"
                    class="image-slot"
                  >
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="专业技术资格证（职称证）：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>
              <span style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span> -->
              <template v-for="item in verificationData.verification_images">
                <el-image
                  v-if="item.license_type === 'ZYJS'"
                  :key="item.id"
                  style="width: 150px; height: 150px;margin-right: 10px;"
                  :src="item.image"
                  fit="cover"
                  :preview-src-list="[item.image]"
                  class="preview-image-box"
                >
                  <div
                    slot="error"
                    class="image-slot"
                  >
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </template>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item>
          <m-button
            @click="toDetail"
            v-if="verificationData.status==='approved'||verificationData.status==='canceled'"
          >
            修改
          </m-button>
          <m-button @click="off">{{ verificationData.is_user_active ? '停用' : '启用' }}</m-button>
          <!-- <m-button @click="toDoctorPatientList">患者列表</m-button> -->
          <m-button @click="toContentList">内容列表</m-button>
          <m-button @click="toContentCount">内容统计</m-button>
          <!--<m-button plain @click="$router.go(-1)">返回</m-button>-->
        </el-form-item>

        <m-view-table
          ref="drVerlogs"
          class="mt_20"
          :data="solutionData"
          height="302"
          highlight-current-row
          :total="total"
          :page-sizes="[10, 15, 20]"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            prop="id"
            label="ID"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="医生名称"
            align="center"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="hospital"
            label="所在医院"
            align="center"
          >
            <template>
              <span>{{ department_info.organization__name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="department"
            label="科室"
            align="center"
          >
            <template>
              <span>{{ department_info.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="职称"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.title | titleFilter }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            label="创建认证时间"
            align="center"
            min-width="140"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | dateFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="updated_at"
            label="修改认证时间"
            align="center"
            min-width="140"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.updated_at | dateFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="140"
            prop=""
            label="审核人（昵称）"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.verified_by.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            label="审核状态"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.status | doctorStatus }}</span>
            </template>
          </el-table-column>

        </m-view-table>

        <div class="mt_10">
          <div>患者列表</div>
          <m-view-table
            ref="patientList"
            :data="patentTableData"
            :total="patentTotal"
            highlight-current-row
            :page-sizes="[10, 15, 20]"
            height="300"
            class="mt_20"
            :get-data-func="getPatentListData"
          >
            <el-table-column
              show-overflow-tooltip
              prop="user_id"
              label="ID"
              width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="姓名"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="phone_number"
              label="联系电话"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="性别"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column
              label="年龄"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.user_profile.birthday | calcAge }}
              </template>

            </el-table-column>
          </m-view-table>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from "@/common/utils/LocalStore";
import { DOCTOR_AUTHENTICATION } from "@/common/utils/dict";

const localSession = new LocalStore("DoctorDetail", true);

export default {
  name: "DoctorDetail",
  data() {
    return {
      type: "create",
      title: "医生详情",
      form: {
        name: "",
        title: "",
        status: "",
        id: "",
        user: "",
        hospital: "",
      },
      verificationData: [],
      doctorInfo: {},
      rules: {},
      uploadFile: {
        fileList: [],
        action: "",
      },
      imgSrc: "",
      solutionData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      patentTableData: [],
      patentTotal: 0,
      patentPageSize: 10,
      patentPage: 1,
      loading: true,
      department_info: {
        id: "",
        name: "",
        organization__id: "",
        organization__name: "",
      },
    };
  },
  filters: {
    doctorStatus(v) {
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
  },
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      const params = this.$route.params;
      let data = params;
      if (Object.keys(params).length === 0) {
        const cache = localSession.get("cache");
        if (!cache) return;
        data = cache;
      } else {
        localSession.set("cache", {
          type: params.type,
          id: params.id,
          user: params.user,
        });
      }

      this.doctorInfo = data;
      this.type = data.type || "";
      this.title = this.type === "create" ? "医生详情" : "医生详情";

      if (data.type === "create") {
        this.loading = false;
      } else {
        this.$api.doctor
          .getVerDetail(data.id)
          .then((res) => {
            this.loading = false;
            this.doctorInfo = res.data;
            this.verificationData = res.data;
            this.department_info = res.data.department_info;
            this.form.compareAssign(res.data);
            this.getDataFunc();
            this.getPatentListData();
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
          });
      }
    },
    getDataFunc() {
      const { drVerlogs } = this.$refs;
      if (drVerlogs) drVerlogs.loadStart();
      this.$api.doctor
        .getDoctorLogList({
          page: this.page,
          page_size: this.pageSize,
          ordering: "",
          verification: this.verificationData.id,
        })
        .then((res) => {
          this.solutionData = res.data.results;
          this.total = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    toDetail() {
      this.$router.push({
        name: "SetDoctorDetails",
        params: {
          type: "edit",
          ...this.doctorInfo,
        },
      });
    },
    off() {
      this.$confirm(
        `确定${this.verificationData.is_user_active ? "停用" : "启用"}吗？`,
        `${this.verificationData.is_user_active ? "停用" : "启用"}`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const param = this.$clone(this.verificationData);
          param.is_user_active = this.verificationData.is_user_active
            ? false
            : true;

          const type = this.verificationData.is_user_active
            ? "disable_user"
            : "enable_user";
          this.$api.doctor
            .upDoctorAccoun(this.verificationData.id, type, param)
            .then((res) => {
              this.$message.success(
                `${this.verificationData.is_user_active ? "停用" : "启用"}成功`
              );
              this.$router.push("/doctor");
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },

    getPatentListData() {
      const { patientList } = this.$refs;
      if (patientList) patientList.loadStart();
      this.$api.patients
        .getList({
          page: this.patentPage,
          page_size: this.patentPageSize,
          ordering: "id",
          doctor_id: this.doctorInfo.user,
        })
        .then((res) => {
          this.patentTableData = res.data.results;
          this.patentTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    toContentList() {
      this.$router.push({
        name: "DoctorContentList",
        params: {
          userId: this.doctorInfo.user,
        },
      });
    },

    toContentCount() {
      this.$router.push({
        name: "DoctorContentCount",
        params: {
          userId: this.doctorInfo.user,
        },
      });
    },

    create() {
      this.$api.project
        .create({
          ...this.form,
          stage: this.form.stage.split(","),
        })
        .then((res) => {
          this.$message.success("新增成功");
          this.leavePage();
        });
    },
    update() {
      this.$api.project
        .update(this.form.id, {
          ...this.form,
          stage: this.form.stage.split(","),
        })
        .then((res) => {
          this.$message.success("修改成功");
          this.leavePage();
        });
    },
    leavePage() {
      if (this.type === "create") {
        this.$router.push("/project");
      } else {
        this.$router.push(`/project`);
      }
    },
  }, // methods end
};
</script>

<style scoped lang="less">
.base2 {
  display: flex;
  margin-bottom: 22px;

  .item {
    .font-mixin();
    // margin-right: 150px;
  }
}

.font-mixin {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #5a607f;
  line-height: 20px;
}

.panel .card {
  margin-top: 0 !important;
}

.form-box {
  // width: 850px;
  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
}

.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}

/deep/ .el-image {
  border: 1px dashed #d9d9d9;
  box-sizing: border-box;
}

.image-slot {
  width: 100%;
  height: 100%;
  line-height: 150px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  box-sizing: border-box;
}

.preview-image-box {
  width: 150px !important;
  height: 200px !important;
}

:deep(.el-loading-spinner) {
  top: 30%;
}
</style>
