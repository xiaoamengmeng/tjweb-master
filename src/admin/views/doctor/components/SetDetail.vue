<template>
  <div class="panel scroll">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item :to="{path: '/doctor/details'}">
        <icon-box
          icon-name="menu_zsk"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>医生详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
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

        <el-row>
          <el-form-item
            label="用户"
            prop="user"
          >
            <el-input
              v-model="form.user"
              disabled
              placeholder="请输入用户名"
              clearable
              style="width: 450px;"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="角色">
            <el-input
              v-model="form.title"
              disabled
              placeholder="请输入角色"
              clearable
              style="width: 450px;"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入姓名"
              clearable
              style="width: 450px;"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="医院">
            <el-input
              v-model="form.hospital"
              placeholder="请输入医院名称"
              clearable
              style="width: 450px;"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="科室">
            <el-input
              v-model="form.department"
              placeholder="请输入科室"
              clearable
              style="width: 450px;"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item
            label="职称"
            prop="title"
          >
            <el-select
              v-model="form.title"
              placeholder="请选择"
              clearable
              style="width: 450px;"
            >
              <el-option
                v-for="(item, index) in doctorAuthentication"
                :key="index"
                :value="item.code"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="头像（个人照片）">
              <m-upload
                accept=".jpg,.jpeg,.png,.gif"
                class="upload-box"
                :file-list.sync="uploadFile.fileList"
                :image-url.sync="imgSrc"
                :image-path.sync="form.photo_path"
              ></m-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="医师资格证书，最多上传5张">
              <el-upload
                action=""
                :auto-upload="false"
                list-type="picture-card"
                :limit="5"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                success-tips="上传图片成功"
                :file-list="ZGZ_Arr"
                class="my-upload"
              >
                <!-- <i slot="default" class="el-icon-plus"></i> -->
                <div
                  slot="file"
                  slot-scope="{file}"
                >
                  <el-image
                    class="el-upload-list__item-thumbnail my-img"
                    :src="file.image"
                    :preview-src-list="[file.image]"
                    fit="cover"
                    style="width: 150px;height: 200px;"
                  >
                  </el-image>
                  <i
                    class="el-icon-close close-btn"
                    @click="deleteImg('ZGZ',file)"
                  ></i>
                </div>
              </el-upload>

              <template v-if="ZGZ_Arr.length<5">
                <div
                  v-for="i in (5-ZGZ_Arr.length)"
                  :key="i"
                  style="float: left;margin-left: 8px;"
                >
                  <m-upload
                    accept=".jpg,.jpeg,.png,.gif"
                    class="upload-box"
                    :image-path.sync="image_path"
                    :file-list.sync="UP_ZGZ_Arr"
                    @change="upLoadChang('ZGZ','ZGZ'+i)"
                    @remove="removeImg('ZGZ')"
                  ></m-upload>
                </div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="医师执业证书，最多上传5张">
              <el-upload
                action=""
                :auto-upload="false"
                list-type="picture-card"
                :limit="5"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                success-tips="上传图片成功"
                :file-list="ZYZ_Arr"
                class="my-upload"
              >
                <!-- <i slot="default" class="el-icon-plus"></i> -->
                <div
                  slot="file"
                  slot-scope="{file}"
                >
                  <el-image
                    class="el-upload-list__item-thumbnail my-img"
                    :src="file.image"
                    :preview-src-list="[file.image]"
                    fit="cover"
                    style="width: 150px;height: 200px;"
                  >
                  </el-image>
                  <i
                    class="el-icon-close close-btn"
                    @click="deleteImg('ZYZ',file)"
                  ></i>
                </div>
              </el-upload>

              <template v-if="ZYZ_Arr.length<5">
                <div
                  v-for="i in (5-ZYZ_Arr.length)"
                  :key="i"
                  style="float: left;margin-left: 8px;"
                >
                  <m-upload
                    accept=".jpg,.jpeg,.png,.gif"
                    class="upload-box"
                    :image-path.sync="image_path"
                    :file-list.sync="UP_ZYZ_Arr"
                    @change="upLoadChang('ZYZ','ZYZ'+i)"
                    @remove="removeImg('ZYZ')"
                  ></m-upload>
                </div>
              </template>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="专业技术资格书（职称证），最多上传5张">
              <el-upload
                action=""
                :auto-upload="false"
                list-type="picture-card"
                :limit="5"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                success-tips="上传图片成功"
                :file-list="ZYJS_Arr"
                class="my-upload"
              >
                <!-- <i slot="default" class="el-icon-plus"></i> -->
                <div
                  slot="file"
                  slot-scope="{file}"
                >
                  <el-image
                    class="el-upload-list__item-thumbnail my-img"
                    :src="file.image"
                    :preview-src-list="[file.image]"
                    fit="cover"
                    style="width: 150px;height: 200px;"
                  >
                  </el-image>
                  <i
                    class="el-icon-close close-btn"
                    @click="deleteImg('ZYJS',file)"
                  ></i>
                </div>
              </el-upload>

              <template v-if="ZYJS_Arr.length<5">
                <div
                  v-for="i in (5-ZYJS_Arr.length)"
                  :key="i"
                  style="float: left;margin-left: 8px;"
                >
                  <m-upload
                    accept=".jpg,.jpeg,.png,.gif"
                    class="upload-box"
                    :image-path.sync="image_path"
                    :file-list.sync="UP_ZYJS_Arr"
                    @change="upLoadChang('ZYJS','ZYJS'+i)"
                    @remove="removeImg('ZYJS')"
                  ></m-upload>
                </div>
              </template>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="胸牌，最多上传5张">
              <el-upload
                action=""
                :auto-upload="false"
                list-type="picture-card"
                :limit="5"
                multiple
                accept=".jpg,.jpeg,.png,.gif"
                success-tips="上传图片成功"
                :file-list="XP_Arr"
                class="my-upload"
              >
                <!-- <i slot="default" class="el-icon-plus"></i> -->
                <div
                  slot="file"
                  slot-scope="{file}"
                >
                  <el-image
                    class="el-upload-list__item-thumbnail my-img"
                    :src="file.image"
                    :preview-src-list="[file.image]"
                    fit="cover"
                    style="width: 150px;height: 200px;"
                  >
                  </el-image>
                  <i
                    class="el-icon-close close-btn"
                    @click="deleteImg('XP',file)"
                  ></i>
                </div>
              </el-upload>

              <template v-if="XP_Arr.length<5">
                <div
                  v-for="i in (5-XP_Arr.length)"
                  :key="i"
                  style="float: left;margin-left: 8px;"
                >
                  <m-upload
                    accept=".jpg,.jpeg,.png,.gif"
                    class="upload-box"
                    :image-path.sync="image_path"
                    :file-list.sync="UP_XP_Arr"
                    @change="upLoadChang('XP','XP'+i)"
                    @remove="removeImg('XP')"
                  ></m-upload>
                </div>
              </template>

            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <m-button @click="save">保存</m-button>
          <m-button
            plain
            @click="$router.go(-1)"
          >返回</m-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import LocalStore from "@/common/utils/LocalStore";
import { DOCTOR_AUTHENTICATION } from "@/common/utils/dict";

const dishSession = new LocalStore("SetDoctorDetail", true);

export default {
  name: "SetDoctorDetail",
  data() {
    return {
      type: "create",
      title: "新增医生",
      form: {
        name: "",
        photo_path: "",
        user: "",
        hospital: "",
        department: "",
        title: "",
      },
      dishInfo: {},
      rules: {
        name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        user: [{ required: true, message: "请填写用户", trigger: "blur" }],
        title: [{ required: true, message: "请选择职称", trigger: "blur" }],
      },
      uploadFile: {
        fileList: [],
        action: "",
      },
      imgSrc: "",
      verificationData: [],
      ZYJS_Arr: [],
      XP_Arr: [],
      ZYZ_Arr: [],
      ZGZ_Arr: [],
      UP_ZYJS_Arr: [],
      UP_ZYZ_Arr: [],
      UP_ZGZ_Arr: [],
      UP_XP_Arr: [],
      verificationImagesArr: [],
      image_path: "",
      titleType: null,
      titleVal: null,
      doctorAuthentication: DOCTOR_AUTHENTICATION,
    };
  },
  watch: {
    image_path: function (newVal, oldVal) {
      if (newVal) {
        this.verificationImagesArr.push({
          license_type: this.titleVal,
          image_path: newVal,
          ide: this.titleType,
        });
      }
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
        const cache = dishSession.get("cache");
        if (!cache) return;
        data = cache;
      } else {
        dishSession.set("cache", params);
      }

      this.dishInfo = data;
      this.type = data.type || "";
      this.title = this.type === "create" ? "新增医生" : "修改医生";

      if (data.type === "create") {
        return;
      } else {
        this.$api.doctor
          .getVerDetail(data.id)
          .then((res) => {
            this.form.compareAssign(res.data);
            this.verificationData = res.data;
            this.imgSrc = res.data.photo;
            this.verificationData.verification_images.forEach((v) => {
              if (v.license_type === "ZYJS") {
                this.ZYJS_Arr.push(v);
              } else if (v.license_type === "XP") {
                this.XP_Arr.push(v);
              } else if (v.license_type === "ZYZ") {
                this.ZYZ_Arr.push(v);
              } else {
                this.ZGZ_Arr.push(v);
              }
            });
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
          });
      }
    },
    upLoadChang(type, ide) {
      this.titleVal = type;
      this.titleType = ide;
    },
    removeImg(type) {
      const index = this.verificationImagesArr.findIndex(
        (v) => v.ide === this["UP_" + type + "_Arr"][0].ide
      );
      this.verificationImagesArr.splice(index, 1);
    },
    save() {
      this.form.verification_images = [
        ...this.verificationImagesArr,
        ...this.ZYJS_Arr,
        ...this.XP_Arr,
        ...this.ZYZ_Arr,
        ...this.ZGZ_Arr,
      ];
      if (this.form.verification_images.length === 0) {
        this.$message.error("请至少上传一项证书资料");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = { ...this.form };
          if (params.photo_path === "") {
            delete params.photo_path;
          }
          this.$api.doctor
            .upStatus(this.dishInfo.id, params)
            .then((res) => {
              this.$message.success("修改成功");
              this.$router.push("/doctor");
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        } else {
          return false;
        }
      });
    },

    deleteImg(type, file) {
      let arr =
        type === "ZYJS"
          ? this.ZYJS_Arr
          : type === "XP"
          ? this.XP_Arr
          : type === "ZYZ"
          ? this.ZYZ_Arr
          : this.ZGZ_Arr;
      const index = arr.findIndex((v) => v.id === file.id);
      arr.splice(index, 1);
    },
  }, // methods end
  computed: {},
};
</script>

<style scoped lang="less">
.panel .card {
  margin-top: 0 !important;
}

.form-box {
  width: 100%;
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
  width: 150px;
  height: 200px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}
.my-upload {
  width: auto;
  float: left;
  /deep/.el-upload {
    display: none;
  }
  /deep/.el-upload-list__item {
    width: 150px;
    height: 200px;
  }
}
.el-upload-list__item:hover .close-btn {
  position: absolute;
  display: block;
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  color: #fff;
  background-color: #000;
  opacity: 0.3;
  border-radius: 50%;
  font-size: 12px;
  z-index: 99999;
}
</style>
