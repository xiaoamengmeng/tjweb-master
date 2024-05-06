<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'OrganizationManage'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>机构管理</b>
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
                <!-- is_active: true,
        name: '',
        image: '',
        address: '',
        contact: '',
        contact_details: '', -->
        <el-row>
            <el-col :span="12">
                <el-form-item label="机构名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入机构名称" clearable style="width: 450px;" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="机构地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入机构地址" clearable style="width: 450px;" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="form.contact" placeholder="请输入联系人姓名" clearable style="width: 450px;"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系方式" prop="contact_details">
                    <el-input v-model="form.contact_details" placeholder="请输入联系方式" clearable style="width: 450px;"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="机构logo" prop="image">
                    <div class="add-image-content">
                      <div class="image-wrapper" style="position: relative;" v-if="fileList.length == 1" >
                          <el-image 
                            style="min-height: 100px; max-height: 300px; max-width: 300px;"
                            :src="fileList[0].url" 
                            :preview-src-list="[fileList[0].url]"
                            fit="contain"
                          />
                          <i @click="handleRemove" class="close-btn el-icon-close"></i>
                      </div>
                      <el-upload 
                          accept=".jpg,.jpeg,.png" 
                          action="#"
                          :file-list="fileList"
                          :auto-upload="false"
                          :on-change="handleChange"
                          :show-file-list="false"
                      >
                          <div v-if="fileList.length == 0" class="add-image">
                              <el-button size="small" type="info" plain>选择文件</el-button> 
                              <div style="color: #566085; margin-left: 10px">未选择任何文件</div>
                          </div>
                          <div class="add-image-select" v-else>
                              <m-button style="margin-left: 10px;" plain>重新上传</m-button>
                          </div>
                      </el-upload>
                    </div>
                    <div style="color: #999999">支持jpg、jpeg、png格式，大小不超过500K</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="状态" prop="is_active">
                    <el-radio-group v-model="form.is_active">
                        <el-radio
                            v-for="status in ORGANIZATION_MANAGE_STATUS"
                            :key="status.code"
                            :label="status.code"
                        >{{ status.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>


        <el-form-item>
            <m-button @click="save">保存</m-button>
            <m-button plain @click="$router.go(-1)">返回</m-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { ORGANIZATION_MANAGE_STATUS } from '@/common/utils/dict'

const localSession = new LocalStore('SetOrganization', true)

export default {
  name: 'SetOrganization',
  components: {
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!this.$valid.phone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      type: 'create',
      title: '新增机构',
      form: {
        is_active: true,
        name: '',
        image_path: '',
        address: '',
        contact: '',
        contact_details: '',
      },
      organizationInfo: {

      },
      rules: {
        name: [{ required: true, message: '请填写机构名称', trigger: 'change' }],
        // contact_details: [{ required: true, validator: validPhone, trigger: 'change' }],
        address: [{ required: true, message: '请填写机构地址', trigger: 'change' }],
        // contact: [{ required: true, message: '请填写联系人', trigger: 'change' }],
      },
      fileList: [],
      image_path: '',
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }
      this.organizationInfo = data
      this.type = data.type || ''
      this.title = this.type === 'create' ? '新增机构' : '修改机构'

      // 新增
      if (data.type === 'create') {
        return
      }

      this.form.compareAssign(data)
      if (data.image) {
        this.fileList = [{
          url: data.image
        }]
      }
    },
    save() {
      // if (this.organizationInfo.id != undefined) {
      //   if (this.fileList.length > 0 && this.fileList[0].url != this.organizationInfo.image) {
      //     this.uploadFile()
      //   } else {
      //     this.$refs['form'].validate((valid) => {
      //       if (valid) {
      //         this.update()
      //       } else {
      //         return false
      //       }
      //     })
      //   }
      // } else {
        // 判断一下是否是更换了图片
        if (this.fileList.length > 0 && this.fileList[0].url != this.organizationInfo.image) {
          this.uploadFile()
        } else {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              if (this.type === 'create') {
                this.create()
              } else {
                this.update()
              }
            } else {
              return false
            }
          })
        }
      // }
    },
    processHandle(progressData, uploadKey) {
      if (progressData.percent === 1) {
        const image_path = uploadKey.path_list[0]
        this.form.image_path = image_path
        if (this.type === 'create') {
          this.create()
        } else {
          this.update()
        }
      }
    },
    uploadFile() {
      this.$cos.uploadFile(this.fileList, this.processHandle)
          .then((res) => {
            
          })
          .catch((err) => {
            this.$message.error("上传图片失败")
          })
    },
    create() {
      const params = { ...this.form, }
      if (params.image_path == null || params.image_path.length == 0) {
        params.image_path = ""
      }
      this.$api.organizationManage.create(params)
        .then(res => {
          this.$message.success('新增机构成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    update() {
      const params = { ...this.form, }
      if (params.image_path == null || params.image_path.length == 0) {
        params.image_path = ""
      }
      this.$api.organizationManage.update(this.organizationInfo.id, params)
        .then(res => {
          this.$message.success('修改成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    leavePage() {
      this.$router.go(-1)
    },

    handleChange(file, fileList) {
        if (!file.url) {
          file.url = URL.createObjectURL(file.raw);
        }
        if (fileList.length > 0) {
            this.fileList = [fileList[fileList.length - 1]]
        }
    },

    handleRemove() {
        this.fileList = []
        this.form.image_path = ''
    },

    // 上传前的限制
    handleBeforeUpload(file) {
      console.log('====================================');
      console.log(file.size / 1024);
      console.log('====================================');
      const isJPG = file.type === "image/jpg";
      const isPng = file.type === "image/png";
      const isJpeg = file.type === "image/jpeg";
      const is500KB = file.size / 1024 < 500;
      // //限制文件上传类型
      // if (!isJPG && !isPng && !isJpeg) {
      //   this.$message.error("上传图片只能是 png,jpg,jpeg 格式!");
      //   return false
      // }
 
      //  //限制文件上传大小
      // if (!is10M) {
      //   this.$message.error("上传图片大小不能超过 10MB!");
      //   return false
      // }
 
      return true
    },

  }, // methods end
  computed: {
    ORGANIZATION_MANAGE_STATUS() {
      return ORGANIZATION_MANAGE_STATUS
    }
  },
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
  }
}

.form-box {
  width: 100%;

    .add-image-content {

      display: flex;
      flex-direction: row;
      align-items: center;

      .add-image {
          width: 450px; 
          height: 48px; 
          border: 1px solid #D9E1EC !important; 
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
}


.roles-select {
  :deep(.el-input__suffix) {
    display: none;
  }
}

.role-editor {
  :deep(.el-select.roles-select) {
    width: 450px !important;
    .el-select__tags {
      max-width: unset !important;
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
  opacity: .3;
  border-radius: 50%;
  font-size: 12px;
}

.image-wrapper:hover .close-btn {
  //visibility: visible;
  display: block;
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
