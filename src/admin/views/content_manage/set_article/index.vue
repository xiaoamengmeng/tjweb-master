<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/content_manage' }">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>科普内容</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="card-title">
        {{ title }}
      </div>
      <el-form class="form-box" :model="form" :rules="rules" ref="form" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" clearable style="width: 450px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择" style="width: 450px" clearable>
              <el-option v-for="cate in category" :key="cate.id" :label="cate.name" :value="cate.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="作者">
            <el-input v-model="form.author_name" placeholder="请输入作者" clearable style="width: 450px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发布范围" prop="permission">
            <el-radio-group v-model="form.permission">
              <el-radio :label="'All'">公共</el-radio>
              <el-radio :label="'PART'">部分机构部门</el-radio>
              <el-cascader v-if="form.permission == 'PART'" style="width: 450px" filterable v-model="form.dpt_scope_id" :options="dptCategory" :props="tagCategoryProps" :disabled="canSelected"> </el-cascader>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="患者标签" prop="patient_tag">
            <el-radio-group v-model="form.patient_tag">
              <el-radio :label="'All'">所有</el-radio>
              <el-radio :label="'Part'">部分标签用户</el-radio>
              <el-cascader v-if="form.patient_tag == 'Part'" style="width: 450px" filterable :show-all-levels="false" v-model="form.tags_id" :options="tagCategory" :props="tagCategoryProps" ref="tagCascader"> </el-cascader>
              <!-- <el-select style="width: 450px" v-if="form.patient_tag == 'Part'" class="patient-tagss" v-model="form.tags_id" multiple filterable placeholder="请选择患者标签，可多选">
                <el-option
                  v-for="item in tags"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> -->
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="文章图片">
            <m-upload class="upload-box" :image-url.sync="imgSrc" :image-path.sync="form.images[0].image_path" accept=".jpg,.jpeg,.png,.gif" success-tips="上传封面成功"></m-upload>
            <span style="color: #5a607f; font-size: 14px">参考尺寸342*228；支持jpeg/png/gif格式</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="正文" prop="content">
            <m-editor ref="editor" :content.sync="form.content" mode="default"> </m-editor>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="'published'">上架</el-radio>
              <el-radio :label="'draft'">草稿</el-radio>
              <el-radio :label="'scheduled'">定时发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="form.status === 'scheduled'">
          <el-form-item label="发布时间" prop="published_at">
            <el-date-picker type="datetime" v-model="form.published_at" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 350px"> </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <m-button @click="save">保存</m-button>
            <m-button plain @click="leavePage">返回</m-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { mapGetters } from 'vuex'

const localSession = new LocalStore('setArticle', true)

export default {
  name: 'SetArticle',
  data() {
    const validPatientTag = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择患者标签'))
      } else if (this.form.tags_id.length <= 0 && value == 'Part') {
        callback(new Error('请选择患者标签'))
      } else {
        callback()
      }
    }
    const validPublishAt = (rule, value, callback) => {
      if (this.form.status === 'scheduled' && this.form.published_at === '') {
        callback(new Error('请选择发布时间'))
      }
      callback()
    }
    const validContent = (rule, value, callback) => {
      if (this.form.content === '' || this.form.content === '<p><br></p>') {
        callback(new Error('请填写正文内容'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '上传文章',
      form: {
        content_type: 'article',
        title: '',
        category_id: '',
        author_name: '',
        images: [
          {
            image_path: '',
          },
        ],
        content: '',
        status: '',
        published_at: '',
        permission: '',
        patient_tag: '',
        tags_id: [],
        dpt_scope_id: [],
      },
      dishInfo: {},
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [{ required: true, validator: validContent, trigger: 'blur' }],
        status: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
        published_at: [{ required: true, validator: validPublishAt, trigger: 'blur' }],
        permission: [{ required: true, message: '请选择发布范围', trigger: 'blur' }],
        patient_tag: [{ required: true, validator: validPatientTag, trigger: 'blur' }],
      },
      imgSrc: '',
      articleInfo: {},
      category: [],
      tags: [],
      tagCategory: [],
      tagCategoryProps: {
        multiple: true,
      },
      dptCategory: [],
    }
  },
  watch: {
    'form.patient_tag'(visible) {
      if (visible == 'All') {
        this.form.tags_id = []
      }
    },
    'form.permission'(visible) {
      if (visible == 'All') {
        this.form.dpt_scope_id = []
      } else {
        this.setDptId()
      }
    },
  },
  mounted() {
    this.getTagCategoryList()
    this.getCategoryList()
    // this.getTagList()
  },
  methods: {
    getCategoryList() {
      this.$api.contentCategories
        .getList()
        .then((res) => {
          this.category = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getTagCategoryList() {
      this.$api.tagCategories
        .getList({
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.tagCategory = res.data.results.map((ele, index) => {
            return {
              ...ele,
              value: ele.id,
              label: ele.name,
              children: [],
            }
          })
          this.tagCategory.unshift({
            id: -1,
            value: -1,
            label: '自动标签',
            children: [],
          })
          this.$api.tag
            .getList({
              ordering: 'id',
              page: 1,
              page_size: 99999,
              attribute__in: 'Private, Public, Auto',
            })
            .then((res) => {
              res.data.results.forEach((ele) => {
                if (ele.attribute == 'Auto') {
                  const idx = this.tagCategory.find((ite) => ite.id == -1)
                  if (idx) {
                    idx.children.push({
                      ...ele,
                      value: ele.id,
                      label: ele.name,
                      leaf: 'leaf',
                    })
                  }
                } else {
                  const idx = this.tagCategory.find((ite) => ite.id == ele.category.id)
                  if (idx) {
                    idx.children.push({
                      ...ele,
                      value: ele.id,
                      label: ele.name,
                      leaf: 'leaf',
                    })
                  }
                }
              })
              this.getOrganizations()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getOrganizations() {
      this.$api.organizationManage
        .getList({
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.dptCategory = res.data.results.map((ele, index) => {
            return {
              ...ele,
              value: ele.id,
              label: ele.name,
              children: [],
            }
          })
          this.$api.departmentManage
            .getList({
              page: 1,
              page_size: 99999,
            })
            .then((res) => {
              res.data.results.forEach((ele) => {
                const idx = this.dptCategory.find((ite) => ite.id == ele.organization.id)
                if (idx) {
                  idx.children.push({
                    ...ele,
                    value: ele.id,
                    label: ele.name,
                    leaf: 'leaf',
                  })
                }
              })
              this.initForm()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    initForm() {
      const params = this.$route.params

      let data = params

      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', { type: params.type, id: params.id })
      }

      this.type = data.type || 'create'
      this.title = this.type === 'create' ? '上传文章' : '编辑文章'
      this.form.images = [{ image_path: '' }]

      if (this.type === 'create') {
        this.form.author_name = this.userInfo.name
        this.imgSrc = ''
        this.setDptId()
      } else {
        this.$api.content.getDetail(data.id).then((res) => {
          this.articleInfo = res.data
          this.form.content_type = res.data.content_type
          this.form.title = res.data.title
          this.form.category_id = res.data.category_id
          this.form.author_name = res.data.author_name
          this.form.content = res.data.content
          this.form.status = res.data.status
          this.form.permission = res.data.permission

          // this.form = res.data
          this.$refs.editor.setContent(this.form.content)

          if (res.data.published_at) {
            this.form.published_at = new Date(res.data.published_at).format('yyyy-MM-dd hh:mm')
          } else {
            this.form.published_at = ''
          }

          if (res.data.images.length === 0) {
            this.form.images = [{ image_path: '' }]
          } else {
            const images = res.data.images
            const hasImageUrl = images.length > 0
            if (hasImageUrl) {
              this.form.images = [{ image_path: images[0].image_path }]
              this.imgSrc = images[0].image_url
            }
          }

          if (res.data.tags.length == 0) {
            this.form.patient_tag = 'All'
            this.form.tags_id = []
          } else {
            this.form.patient_tag = 'Part'
            res.data.tags.forEach((el) => {
              if (el.attribute == 'Auto') {
                this.form.tags_id.push([-1, el.id])
              } else {
                for (let i = 0; i < this.tagCategory.length; i++) {
                  const element = this.tagCategory[i]
                  for (let j = 0; j < element.children.length; j++) {
                    const elemen = element.children[j]
                    if (el.id == elemen.id) {
                      this.form.tags_id.push([element.id, el.id])
                    }
                  }
                }
              }
            })
          }

          this.setDptId()
        })
      }
    },
    setDptId() {
      if (this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id == 1) {
        if (this.articleInfo.dpt_scope) {
          this.form.dpt_scope_id = this.articleInfo.dpt_scope.map((ele) => {
            return [ele.organization.id, ele.id]
          })
        } else {
          this.form.dpt_scope_id = []
        }
      } else if (this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id != 1) {
        this.form.dpt_scope_id = [[this.userInfo.selectedOrganization.id, this.userInfo.selectedDepartment.id]]
      } else {
        this.form.dpt_scope_id = [[this.userInfo.department.org_id, this.userInfo.department.id]]
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
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
    },
    getParams() {
      const params = this.$clone(this.form)
      params.tags_id = params.tags_id.map((ele) => ele[1])
      params.dpt_scope_id = params.dpt_scope_id.map((ele) => ele[1])
      if (params.status !== 'scheduled') {
        delete params.published_at
      }
      const images = params.images
      if (images.length > 0) {
        if (images[0].image_path === '') {
          params.images = []
        }
      }
      params.department = this.userInfo.selectedDepartment.id
      return { ...params, verify_state: 'pending' }
    },
    create() {
      this.$api.content
        .create(this.getParams())
        .then((res) => {
          this.$message.success('新增成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
            confirmButtonText: '好的',
            showCancelButton: false,
            type: 'error',
          })
        })
    },
    update() {
      this.$api.content
        .patch(this.articleInfo.id, this.getParams())
        .then((res) => {
          this.$message.success('修改成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
            confirmButtonText: '好的',
            showCancelButton: false,
            type: 'error',
          })
        })
    },
    leavePage() {
      this.$router.go(-1)
    },

    getTagList() {
      this.$api.tag
        .getList({
          private_dpt: this.userInfo.selectedDepartment.id,
          ordering: 'id',
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.tags = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
  }, // methods end
  computed: {
    ...mapGetters(['userInfo']),
    canSelected() {
      // 糖吉账户 并且选择了糖吉机构
      return !(this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id == 1)
    },
  },
}
</script>

<style scoped lang="less">
.panel .card {
  margin-top: 0 !important;
}

.form-box {
  width: 1000px;
  //margin-left: 40px;
  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
  :deep(.el-form-item__label) {
    //margin-right: 10px;
  }

  :deep(.el-form-item__content) {
    line-height: 48px;
  }
}

.upload-box {
  width: 250px;
  height: 150px;
  overflow: hidden;
}

.patient-tagss {
  :deep(.el-select__tags-text) {
    color: #333333;
  }
}
:deep(.el-tag) {
  color: #333;
}
</style>
