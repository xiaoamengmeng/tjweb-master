<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>内容管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 科普内容 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- <m-button v-auth="'content.uploadContent'" v-if="viewsMode === '内容发布'" class="common-add-btn" icon="el-icon-document" @click="toSetArticle('create')" style="right: 157px"> 上传文章 </m-button>
    <m-button v-auth="'content.createVideo'" v-if="viewsMode === '内容发布'" class="common-add-btn" icon="el-icon-monitor" @click="toSetVideo('create')">发布视频</m-button>
    <el-upload v-if="viewsMode === '视频库'" class="upload-demo" action="" :on-change="onChange" :auto-upload="false" :show-file-list="false" accept=".mp4">
      <m-button v-auth="'content.uploadVideo'" v-loading="sendVideo" class="common-add-btn" icon="el-icon-upload2">上传视频</m-button>
    </el-upload> -->

    <div class="card">
      <div class="container">
        <!-- <div style="margin-bottom: 10px">
          <el-radio-group @change="assignedChange" class="radio-group" v-model="viewsMode">
            <el-radio-button label="内容发布"></el-radio-button>
            <el-radio-button label="视频库"></el-radio-button>
          </el-radio-group>
        </div> -->

        <template v-if="viewsMode === '内容发布'">
          <el-form class="form-box" :model="form" ref="form" label-position="top">
            <div class="search-bar">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">标题</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input v-model="form.title" placeholder="输入标题搜索" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">形式</el-row>
                  <el-row>
                    <el-form-item>
                      <el-select v-model="form.content_type" placeholder="全部" clearable>
                        <el-option :label="'文章'" :value="'article'"></el-option>
                        <el-option :label="'短文章'" :value="'short_article'"></el-option>
                        <el-option :label="'视频'" :value="'video'"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">分类</el-row>
                  <el-row>
                    <el-form-item>
                      <el-select v-model="form.category_id" placeholder="请选择" clearable>
                        <el-option v-for="cate in category" :key="cate.id" :label="cate.name" :value="cate.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>

                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">审核状态</el-row>
                  <el-row>
                    <el-form-item prop="verify_state">
                      <el-select v-model="form.verify_state" placeholder="全部" clearable>
                        <el-option v-for="check in checkEum" :key="check.code" :label="check.label" :value="check.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>

                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">发布人</el-row>
                  <el-row>
                    <el-form-item>
                      <el-input v-model="form.search" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>

                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">所属机构</el-row>
                  <el-row>
                    <el-form-item prop="department__organization">
                      <el-select v-model="form.department__organization" placeholder="全部" clearable>
                        <el-option v-for="role in organizations" :key="role.id" :label="role.name" :value="role.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">所属部门</el-row>
                  <el-row>
                    <el-form-item prop="department">
                      <el-select v-model="form.department" placeholder="全部" clearable>
                        <el-option v-for="role in departments" :key="role.id" :label="role.name" :value="role.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>

                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button
                      icon="el-icon-search"
                      h="40px"
                      w="100px"
                      @click.native="
                        page = 1
                        getList()
                      "
                      >搜索</m-button
                    >
                    <!--<m-button h="40px" w="100px" @click="toSetArticle('create')">上传文章</m-button>-->
                    <!--<m-button h="40px" w="100px" @click="toSetVideo('create')">发布视频</m-button>-->
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <m-table ref="table" class="m-table" :data="tableData" :total="total" :page-sizes="[10, 15, 20, 30]" :page-size.sync="pageSize" :current-page.sync="page" :get-data-func="getList" :height="'calc(100% - 85px)'">
            <el-table-column show-overflow-tooltip prop="id" label="内容ID" min-width="60"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="title" label="标题" min-width="120"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="content_type" label="类型" width="60">
              <template v-slot="scope">
                <span v-if="scope.row.content_type == 'video'">视频</span>
                <span v-if="scope.row.content_type == 'article'">文章</span>
                <span v-if="scope.row.content_type == 'short_article'">短文章</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="category" label="分类" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="permission" label="发布范围" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.permission == 'All'">公共</span>
                <span v-else>
                  {{ dptStr(scope.row.dpt_scope) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="tags" label="患者标签" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.tags.length == 0">所有</span>
                <span v-else>
                  {{ tagStr(scope.row.tags) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="creator.name" label="发布人" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="creator.department.org_name" label="所属机构" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="creator.department.name" label="所属部门" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="published_at" label="发布时间" min-width="120">
              <template v-slot="scope">
                <span v-if="scope.row.status == 'scheduled'">{{ scope.row.published_at | publishedAt }}</span>
                <span v-else>{{ scope.row.created_at | publishedAt }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
              <template v-slot="scope">
                <el-tag type="success" v-if="scope.row.status == 'published'" effect="dark">上架</el-tag>
                <el-tag type="info" v-if="scope.row.status == 'draft'" effect="dark">草稿</el-tag>
                <el-tag type="warning" v-if="scope.row.status == 'scheduled'" effect="dark">定时发布</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column show-overflow-tooltip prop="status" label="审核状态" min-width="100" align="center">
              <template v-slot="scope">
                <el-button type="text" v-if="scope.row.verify_state == 'approved'" effect="dark">审核通过</el-button>
                <div type="info" v-if="scope.row.verify_state == 'pending'" effect="dark">待审核</div>
                <el-button @click="showRejectReason(scope.row)" type="text" v-if="scope.row.verify_state == 'rejected'" style="color: red">审核未通过</el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="120px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <!-- <icon-box v-auth="'content.update'" v-if="scope.row.content_type != 'short_article'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="editClick(scope.row)"></icon-box> -->
                  <!-- <icon-box v-auth="'content.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteClick(scope.row)"></icon-box> -->
                  <icon-box v-auth="'coupeContCheck.check'" v-if="scope.row.verify_state == 'pending'" icon-name="table_check" w="39" h="39" box-w="39" style="cursor: pointer" title="审核" @click.native="checkClick(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>

        <!-- <template v-if="viewsMode === '视频库'">
          <el-form class="form-box" :model="videoForm" ref="videoForm" label-position="top" v-auth="'content.videoInfo'">
            <div class="search-bar">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">视频名称</el-row>
                  <el-row>
                    <el-form-item prop="title">
                      <el-input v-model="videoForm.name" placeholder="请输入视频名称" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="10">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button
                      icon="el-icon-search"
                      h="40px"
                      w="100px"
                      @click.native="
                        ppPage = 1
                        getPpList()
                      "
                      >搜索</m-button
                    >
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div v-auth="'content.videoInfo'" class="action-content" v-loading="loading">
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
                      <div v-auth="'content.deleteVideo'" @click="deleteRow(o)">
                        <i class="el-icon-delete" style="color: red"></i>
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
          <el-pagination v-auth="'content.videoInfo'" ref="pagination" small background layout="total, sizes, prev, pager, next, jumper, slot" :page-sizes="[8, 16, 24]" :page-size="ppPageSize" :current-page="ppPage" :total="ppTotal" @current-change="currentPageChange" @size-change="sizeChange">
            <el-button type="default" size="mini" style="margin-left: 5px" @click="refresh"><i class="el-icon-refresh-left"></i></el-button>
          </el-pagination>
        </template> -->
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :modal="true" :destroy-on-close="true" class="creation-dialog" @close="close">
      <video ref="videoContent" :src="videoUrl" controls autoplay width="100%" height="100%"></video>
    </el-dialog>

    <el-dialog title="内容审核" :visible.sync="checkDialogVisible" @close="closeCheckDialog">
      <el-form ref="checkFormRef" :model="checkForm" :rules="checkFormRules" label-width="120px">
        <el-form-item label="审核结论" prop="isCheck">
          <el-radio-group v-model="checkForm.isCheck">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="checkForm.isCheck == 0" label="请录入原因" prop="reject_reason">
          <el-input v-model="checkForm.reject_reason" autocomplete="off" placeholder="请填写审核不通过原因" type="textarea" />
        </el-form-item>
        <br />
        <el-form-item label-width="0" style="text-align: center">
          <el-button @click="closeCheckDialog">取消</el-button>
          <el-button type="primary" @click="submitCheck">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CoupeContCheck',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        title: '',
        type: '',
        cate: '',
        department__organization: '',
        department: '',
        search: '',
        verify_state: '',
      },
      videoForm: {
        name: '',
      },
      current: {},
      category: [],

      viewsMode: '内容发布',
      ppPageSize: 8,
      ppPage: 1,
      ppTotal: 0,
      pptableData: [],
      loading: false,

      dialogVisible: false,
      videoUrl: '',
      sendVideo: false,
      videoName: '',

      fileList: [],
      tags: [],
      checkDialogVisible: false,
      checkForm: {
        reject_reason: '',
        isCheck: 1,
      },
      checkFormRules: {
        isCheck: [{ required: true }],
        reject_reason: [{ required: true, message: '请输入审核不通过原因', trigger: 'change' }],
      },
      currentCheckRow: {},

      // 机构
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 9999,
      departments: [],
      departmentsTotal: 0,
      departmentsPage: 1,
      departmentsPageSize: 9999,

      // 审核
      checkEum: [],
    }
  },
  mounted() {
    this.getTagList()
    this.getList()
    this.getCategoryList()
    this.getOrganizations()
    this.getDepartments()
    this.getCheckEum()
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    getCheckEum() {
      this.checkEum = this.$dict.contentCheckType.data
    },
    getOrganizations() {
      this.$api.organizationManage
        .getList({
          page: this.organizationsPage,
          page_size: this.organizationsPageSize,
          ordering: 'id',
        })
        .then((res) => {
          this.organizations = res.data.results
          this.organizationsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getDepartments() {
      this.$api.departmentManage
        .getList({
          page: this.departmentsPage,
          page_size: this.departmentsPageSize,
          ordering: 'id',
          organization: this.form.department__organization,
        })
        .then((res) => {
          this.departments = res.data.results
          this.departmentsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    showRejectReason(row) {
      this.$confirm(row.reject_reason, '审核不通过原因', {
        confirmButtonText: '好的',
        showCancelButton: false,
        type: 'error',
      })
    },
    submitCheck() {
      this.$refs['checkFormRef'].validate(async (valid) => {
        if (valid) {
          console.log(this.currentCheckRow)
          let { isCheck, reject_reason } = this.checkForm
          if (isCheck) {
            this.$api.content
              .approve(this.currentCheckRow.id)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '审核成功!',
                })
                this.getList()
                this.closeCheckDialog()
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })
          } else {
            this.$api.content
              .reject(this.currentCheckRow.id, { reject_reason: reject_reason })
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '审核成功!',
                })
                this.getList()
                this.closeCheckDialog()
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })
          }
        } else {
          return false
        }
      })
    },
    closeCheckDialog() {
      this.checkDialogVisible = false
    },
    checkClick(row) {
      this.checkDialogVisible = true
      this.currentCheckRow = row
    },
    tagStr(tagIds) {
      return tagIds.map((ele) => ele.name).join('，')
    },
    dptStr(dpt_scope) {
      return dpt_scope.map((ele) => ele.organization.name + '-' + ele.name).join('，')
    },
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
    getList() {
      const { table } = this.$refs
      if (table) table.loadStart()
      let params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: '-id',
        search: this.form.title,
        content_type: this.form.content_type,
        category_id: this.form.category_id,
        creator__account__department: this.form.department,
        search: this.form.search,
        creator__account__department__organization: this.form.department__organization,
        verify_state: this.form.verify_state,
      }

      // //if (this.userInfo.selectedOrganization.id !== 1) {
      //   params.creator__account__department =
      //     this.userInfo.selectedDepartment.id;
      // }
      this.$api.content
        .getList(params)
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    editClick(row) {
      if (row.content_type === 'article') {
        this.toSetArticle('edit', row)
      } else {
        this.toSetVideo('edit', row)
      }
      this.dialogTitle = '编辑标签'
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm(`确定删除标题为【${row.title}】的内容吗？`, '删除内容', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$api.content
            .delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
    },
    toSetArticle(type, row) {
      this.$router.push({
        name: 'SetArticle',
        params: {
          type: type,
          ...row,
        },
      })
    },
    toSetVideo(type, row) {
      this.$router.push({
        name: 'SetVideo',
        params: {
          type: type,
          ...row,
        },
      })
    },
    assignedChange(val) {
      if (val === '内容发布') {
        this.getList()
      } else {
        this.getPpList()
      }
    },
    refresh() {
      this.loading = true
      this.$nextTick(() => {
        if ((this.ppPage > 1 && this.pptableData.length === 0) || (this.ppPage > 1 && this.ppTotal !== 1 && this.ppTotal % this.ppPageSize === 1)) {
          let lastPage = this.ppPage - 1
          this.ppPage = lastPage
        }
        this.getPpList()
      })
    },
    currentPageChange(val) {
      this.ppPage = val
      this.loading = true
      this.getPpList()
    },
    sizeChange(val) {
      this.ppPageSize = val
      this.ppPageSize = 1
      this.loading = true
      this.getPpList()
    },
    getPpList() {
      this.loading = true
      this.$api.postVideo
        .getList({
          page: this.ppPage,
          page_size: this.ppPageSize,
          search: this.videoForm.name,
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
      this.dialogVisible = true
      this.videoUrl = row.file
    },
    deleteRow(row) {
      this.$confirm(`确定删除标题为【${row.name}】的视频吗？`, '删除视频', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$api.postVideo
            .delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getPpList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
    },

    onChange(file, fileList) {
      // console.log('====================================');
      // console.log(fileList);
      // console.log('====================================');
      if (!file.url) {
        file.url = URL.createObjectURL(file.raw)
      }
      // this.fileList = fileList
      // let videoName = []
      // for (let i = 0; i < fileList.length; i++) {
      //   const element = fileList[i];
      //   if (!element.url) {
      //     element.url = URL.createObjectURL(element.raw);
      //   }
      //   videoName.push(element.name.substring(0, element.name.length - 4))
      // }
      this.videoName = file.name.substring(0, file.name.length - 4)
      this.$getVideoCover(
        file.url,
        (imageUrl) => {
          let imgFile = this.dataURLtoFile(imageUrl, this.videoName + '.png')
          this.$cos.uploadFile([imgFile], this.processHandle).then((res) => {
            const coverPath = res.uploadKey.path_list[0]
            this.uploadFile([file], coverPath)
          })
        },
        0
      )
      // this.uploadFile([file]);
      //
      // this.getVideoSnapshot("uploads/20230613/813af4ff-0c3b-4f19-ab1d-c9c37b14e736.mp4")
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new File([u8arr], filename, { type: mime })
    },
    processHandle(progressData, uploadKey) {},
    uploadFile(fileList, coverPath) {
      this.sendVideo = true
      let that = this
      this.$cos
        .uploadFile(fileList, this.processHandle)
        .then((res) => {
          const image_path = res.uploadKey.path_list[0]
          that.$api.postVideo
            .create({
              file_path: image_path,
              name: that.videoName,
              cover_path: coverPath,
            })
            .then((res) => {
              that.sendVideo = false
              that.$message.success('新增成功')
              that.getPpList()
            })
            .catch((err) => {
              that.sendVideo = false
              that.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {
          that.sendVideo = false
          this.$message.error('上传视频失败')
        })
    },
    getVideoSnapshot(key) {
      let that = this
      this.$cos
        .getVideoSnapshot(key)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTagList() {
      this.$api.tag
        .getList({
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
  }, // methods
}
</script>

<style scoped lang="less">
.panel {
  //.card {
  //  margin-top: 32px;
  //  height: calc(100% - 32px - 32px);
  //}
}

.m-table {
  height: calc(100% - 110px);
  :deep(.el-table__row) {
    height: 40px;
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
.radio-group {
  width: 230px;
  height: 46px;
  border-radius: 23px;
  background-color: #f4f5fa;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
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
.action-content {
  height: calc(100% - 200px);
  width: 100%;
  overflow: scroll;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    height: 230px;

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

.creation-dialog {
  :deep(.el-dialog) {
    width: 1080px;
    height: 90vh;
    margin-top: 5vh !important;
    background-color: transparent;

    .el-dialog__body {
      margin-top: 20px !important;
      height: 90vh;
    }
  }
}

.upload-demo {
  height: 0px;
}
</style>
