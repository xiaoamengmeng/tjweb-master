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
          <el-form-item label="视频标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入视频标题" clearable style="width: 450px"></el-input>
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
          <el-form-item label="作者" prop="author_name">
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
          <el-form-item label="视频封面">
            <m-upload class="upload-box" :image-url.sync="coverSrc" :image-path.sync="form.video.cover_path" :limit-size="2" accept=".jpg,.jpeg,.png,.gif" success-tips="上传视频封面成功"></m-upload>
            <span style="color: #5a607f; font-size: 14px">支持jpeg/png/gif格式，最大支持上传2MB</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="视频简介">
            <el-input type="textarea" v-model="form.content" placeholder="请输入" :rows="5" style="width: 450px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上传视频" prop="video" style="position: relative">
            <m-upload ref="uploadInfo" class="upload-box" :image-url.sync="imgSrc" :image-path.sync="form.video.file_path" :video-url="playSrc" :cover-src="coverSrc" accept=".mp4" success-tips="上传视频成功" :limit-size="200" mode="video" @remove="videoRemove" @change="videoChange"></m-upload>
            <span style="color: #5a607f; font-size: 14px">仅支持MP4格式文件</span>
            <div class="upload-box upload-box1">
              <el-popover placement="bottom" width="80" trigger="click">
                <div class="upload-items">
                  <div @click="toVideo" class="upload-item">视频库</div>
                  <div @click="toLocale" class="upload-item">本地视频</div>
                </div>
                <el-button slot="reference" style="width: 100px; height: 100px; background-color: transparent; border-width: 0px"></el-button>
              </el-popover>
            </div>
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
            <m-button plain @click="$router.go(-1)">返回</m-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-dialog title="选择视频" :visible.sync="dialogVisible" :modal="true" :destroy-on-close="true" class="creation-dialog">
      <div>
        <div class="action-content" style="height: 520px" v-loading="loading">
          <el-row>
            <el-col :span="6" v-for="(o, idx) in pptableData" :key="idx">
              <div class="action-item">
                <div @click="toSetPage(o)" class="action-item-top">
                  <img class="action-item-img" :src="o.cover_url" />
                  <i class="el-icon-caret-right" style="font-size: 30px; color: #ffffff; position: absolute"></i>
                  <div class="action-item-time">{{ o.timeStr }}</div>
                </div>
                <div class="action-item-bottom">
                  <div class="action-item-left">
                    <div>{{ o.name }}</div>
                    <div @click="select(o)" style="width: 30px">
                      <i class="el-icon-success" :style="'font-size: 20px; color: ' + (o == selectedVideo ? '#00A29A' : '#eeeeee')"></i>
                    </div>
                  </div>
                  <div class="action-item-right">
                    <div>{{ o.creator.name }}</div>
                    <div></div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-pagination ref="pagination" small background layout="total, sizes, prev, pager, next, jumper, slot" :page-sizes="[12]" :page-size="ppPageSize" :current-page="ppPage" :total="ppTotal" @current-change="currentPageChange" @size-change="sizeChange">
          <el-button type="default" size="mini" style="margin-left: 5px" @click="refresh"><i class="el-icon-refresh-left"></i></el-button>
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="savePass" w="80px">确 定</m-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogVideoVisible" :modal="true" :destroy-on-close="true" class="creation-dialog" @close="close">
      <video ref="videoContent" :src="videoUrl" controls autoplay width="100%" height="100%"></video>
    </el-dialog>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { mapGetters } from 'vuex'

const localSession = new LocalStore('setVideo', true)

export default {
  name: 'SetVideo',
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
    const validVideo = (rule, value, callback) => {
      if (this.form.video.file_path === '') {
        callback(new Error('请上传要发布的视频'))
      }
      callback()
    }

    return {
      type: 'create',
      title: '发布视频',
      form: {
        content_type: 'video',
        title: '',
        category_id: '',
        author_name: '',
        // images: [
        //   {
        //     image_path: '',
        //   }
        // ],
        video: {
          file_path: '',
          cover_path: '',
        },
        content: '',
        status: '',
        published_at: '',
        permission: '',
        patient_tag: '',
        tags_id: [],
        dpt_scope_id: [],
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择视频分类', trigger: 'blur' }],
        status: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
        published_at: [{ required: true, validator: validPublishAt, trigger: 'blur' }],
        video: [{ required: true, validator: validVideo, trigger: 'blur' }],
        permission: [{ required: true, message: '请选择发布范围', trigger: 'blur' }],
        patient_tag: [{ required: true, validator: validPatientTag, trigger: 'blur' }],
      },
      coverSrc: '',
      imgSrc: '',
      videoInfo: {},
      playSrc: '',
      category: [],

      dialogVisible: false,
      ppPageSize: 12,
      ppPage: 1,
      ppTotal: 0,
      pptableData: [],
      loading: false,

      dialogVideoVisible: false,
      videoUrl: '',
      selectedVideo: null,

      tags: [],
      tagCategory: [],
      tagCategoryProps: {
        multiple: true,
      },
      dptCategory: [],
    }
  },
  watch: {
    coverSrc(n) {
      if (n !== '' && this.form.video.file_path) {
        this.imgSrc = n
      }
      // this.$getVideoCover(this.playSrc, (imageUrl) => {
      //   this.imgSrc = imageUrl
      // })
    },

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
              console.log('====================================')
              console.log(err)
              console.log('====================================')
              this.$message.error(JSON.stringify(err))
            })
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
      this.title = this.type === 'create' ? '发布视频' : '编辑视频'
      this.form.content_type = 'video'
      // this.form.images = [{ image_path: '', }]

      if (this.type === 'create') {
        this.form.author_name = this.userInfo.name
        this.coverSrc = ''
        this.setDptId()
      } else {
        this.$api.content.getDetail(data.id).then((res) => {
          this.videoInfo = this.$clone(res.data)
          this.playSrc = this.videoInfo.video.file
          this.form.content_type = res.data.content_type
          this.form.title = res.data.title
          this.form.category_id = res.data.category_id
          this.form.author_name = res.data.author_name
          this.form.content = res.data.content
          this.form.status = res.data.status
          this.form.permission = res.data.permission

          // this.form = res.data
          if (this.videoInfo.video.cover_url) {
            // 有封面
            this.coverSrc = this.videoInfo.video.cover_url
            this.imgSrc = this.videoInfo.video.cover_url
            this.form.video.file_path = res.data.video.file_path
          } else {
            // 无封面
            if (this.videoInfo.video.file) {
              // 有视频
              this.$getVideoCover(this.videoInfo.video.file, (imageUrl) => {
                this.imgSrc = imageUrl
              })
            }
            this.form.video.file_path = res.data.video.file_path
          }
          if (res.data.published_at) {
            this.form.published_at = new Date(res.data.published_at).format('yyyy-MM-dd hh:mm')
          } else {
            this.form.published_at = ''
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
        if (this.videoInfo.dpt_scope) {
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
        console.log(valid)
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
      // const images = params.images
      // if (images.length > 0) {
      //   if (images[0].image_path === '') {
      //     params.images = []
      //   }
      // }
      params.department = this.userInfo.selectedDepartment.id
      return { ...params, verify_state: 'pending' }
    },
    create() {
      this.$api.content
        .create(this.getParams())
        .then((res) => {
          this.$message.success('发布成功')
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
        .patch(this.videoInfo.id, this.getParams())
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
    videoRemove() {
      this.imgSrc = ''
    },
    videoChange() {
      if (this.coverSrc) {
        this.imgSrc = this.coverSrc
      }
    },
    leavePage() {
      this.$router.go(-1)
    },

    refresh() {
      this.loading = true
      this.$nextTick(() => {
        if ((this.ppPage > 1 && this.pptableData.length === 0) || (this.ppPage > 1 && this.ppTotal !== 1 && this.ppTotal % this.ppPageSize === 1)) {
          let lastPage = this.ppPage - 1
          this.ppPage = lastPage
        }
        this.selectedVideo = null
        this.getPpList()
      })
    },
    currentPageChange(val) {
      this.ppPage = val
      this.loading = true
      this.selectedVideo = null
      this.getPpList()
    },
    sizeChange(val) {
      this.ppPageSize = val
      this.loading = true
      this.selectedVideo = null
      this.getPpList()
    },
    getPpList() {
      this.loading = true
      this.$api.postVideo
        .getList({
          page: this.ppPage,
          page_size: this.ppPageSize,
          ordering: '-id',
        })
        .then((res) => {
          this.loading = false
          this.ppTotal = res.data.count
          this.pptableData = res.data.results
          this.pptableData.forEach((ele) => {
            if (!ele.cover_url) {
              this.$getVideoCover(
                ele.file,
                (imageUrl) => {
                  ele.cover_url = imageUrl
                },
                0
              )
            }
            this.$getVideoSecond(ele.file, (sec) => {
              let min = parseInt(sec / 60)
              if (min < 10) min = '0' + min
              let secStr = parseInt(sec % 60)
              if (secStr < 10) secStr = '0' + secStr
              ele.timeStr = min + ':' + secStr
            })
          })
        })
        .catch((err) => {
          this.loading = false
          this.$message.error(JSON.stringify(err))
        })
    },

    close() {
      this.videoUrl = ''
    },
    toSetPage(row) {
      this.dialogVideoVisible = true
      this.videoUrl = row.file
    },

    toVideo() {
      this.ppPage = 1
      this.ppTotal = 0
      this.pptableData = []
      this.selectedVideo = null
      this.dialogVisible = true
      this.getPpList()
    },
    toLocale() {
      this.$refs.uploadInfo.$refs.upload.$refs['upload-inner'].handleClick()
    },
    select(row) {
      this.selectedVideo = row
    },
    savePass() {
      if (this.selectedVideo) {
        this.dialogVisible = false
        this.form.video.file_path = this.selectedVideo.file_path
        this.$refs.uploadInfo.previewSrc = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCACWASwDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBf/EABUQAQEAAAAAAAAAAAAAAAAAAAAR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDjCpFAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAABAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAEAAAAAAAAAAAAAAABQAAAAAQUBBQAAAAAAAAAAABBAFAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAFAFAERkBQAAAAAAAAAAABQAAAAAAAAABQEAAAAAAABQBQBEZAUAAAAAAAAAAAAAAUAABFAAABVVlRFgAMioAAoAIAAKIoMgKgAAAAAAAAKAgoAAigAAAAAAAAAKqCCoCiCgIAAAAACAKgAAAAACgAAIoAAAAAgAKAAAAAAKAKAAAAIAgAAAD/2Q=='
        this.$refs.uploadInfo.previewVideoUrl = this.selectedVideo.file
        this.$refs.uploadInfo.visible = false
        this.selectedVideo = {}
      } else {
        this.$message.error('请选择视频')
      }
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
  margin-left: 40px;
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
    margin-right: 10px;
  }

  :deep(.el-form-item__content) {
    line-height: 48px;
  }
}

.upload-box {
  width: 250px;
  height: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 100%;
    height: 100%;
  }
}

.creation-dialog {
  :deep(.el-dialog) {
    width: 1080px;
    height: 90vh;
    margin-top: 5vh !important;

    .el-dialog__body {
      margin-top: 20px !important;
      height: 90vh;
    }
  }
}

.action-content {
  height: calc(100% - 200px);
  width: 100%;
  overflow: scroll;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    height: 220px;

    .action-item-top {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80%;
      .action-item-img {
        width: 100%;
        height: 130px;
        border-radius: 12px;
        object-fit: contain;
        background-color: #797979;
      }

      .action-item-time {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.3);
        padding-left: 10px;
        padding-right: 10px;
        line-height: 20px;
        border-radius: 10px;
        right: 10px;
        bottom: 10px;
        color: #ffffff;
      }
    }

    .action-item-bottom {
      width: 80%;
      .action-item-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 14px;
        color: black;
        font-weight: 600;
      }
      .action-item-right {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: black;
        font-size: 12px;
      }
    }
  }
}

.upload-box1 {
  position: absolute;
  top: 0px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-items {
  width: 100px;
  .upload-item {
    line-height: 25px;
    padding-left: 20px;
  }
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
