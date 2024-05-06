<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/project' }">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
      <!--      <el-breadcrumb-item :to="{}" @click.native="$router.go(-1)">-->
      <!--        <b>项目详情</b>-->
      <!--      </el-breadcrumb-item>-->
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" style="margin-top: 0" v-loading="loading">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="list-title">团队信息</div>
      <el-form class="form-box" :model="form" ref="form" label-position="top">
        <el-row :gutter="50">
          <el-col :span="24">
            <el-form-item label="团队头像" prop="avatar_path">
              <m-upload class="upload-box" :image-path.sync="form.avatar_path" :image-url.sync="imageSrc" accept=".jpg,.jpeg,.png,.gif" use-crop hide-tips></m-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队名称" required>
              <el-input v-model="form.name" style="width: 100%" placeholder="请输入团队名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构">
              <el-input disabled v-model="this.userInfo.selectedOrganization.name" style="width: 100%" placeholder="" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-input disabled v-model="this.userInfo.selectedDepartment.name" style="width: 100%" placeholder="" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">

          </el-col>
          <el-col :span="24">
            <el-form-item label="团队介绍">
              <el-input type="textarea" :rows="4" v-model="form.introduce" style="width: 100%" placeholder="" clearable  maxlength="500" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="团队标签">
              <el-select
                v-model="form.tags_id"
                placeholder="请选择"
                multiple
                style="width:100%;"
              >
                <el-option
                  v-for="teamTag in presetTag"
                  :key="teamTag.id"
                  :label="teamTag.name"
                  :value="teamTag.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="团队状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="status in teamStatus" :key="status.code" :label="status.code">{{ status.label }} </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <div class="list-title member-title">团队成员</div>
      <div class="team-members">
        <doctor-radio-group v-model="form.leader_id" style="display: flex; flex-wrap: wrap">
          <doctor-card v-for="(doctor, index) in selectedMembers" :label="doctor.id" showCheckbox :doctorInfo="doctor" :key="index" show-close @remove="memberRemoveClick">设为团队长 </doctor-card>
          <div class="add-btn top" @click="addTeamMemberClick"><i class="el-icon-plus"></i></div>
        </doctor-radio-group>
      </div>
      <el-divider></el-divider>
      <m-button @click="save">保存</m-button>
      <m-button plain @click="leavePage">返回</m-button>
    </div>
    <el-dialog class="dialog-box" title="添加团队成员" width="1024px" :visible.sync="addTeamMemberDialogVisible">
      <div class="dialog-content">
        <div class="team-members">
          <doctor-checkbox-group v-model="viewMember" style="display: flex; flex-wrap: wrap">
            <doctor-card v-for="(member, index) in members" showCheckbox :label="member" :doctorInfo="member" :key="index"></doctor-card>
          </doctor-checkbox-group>
        </div>
        <el-pagination background layout="slot, total, prev, pager, next" :page-size="pageSize" @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
          <span style="margin-right: 5px">已选择 {{ viewMember.length }} 人</span>
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="addTeamMemberClose">关 闭</m-button>
        <m-button @click="addTeamMemberConfirm">确 定</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LocalStore from '@/common/utils/LocalStore'
import doctorCard from '../components/doctorCard.vue'
import doctorCheckboxGroup from '../components/doctorCheckboxGroup.vue'
import doctorRadioGroup from '../components/doctorRadioGroup.vue'

const localSession = new LocalStore('setTeam', true)

export default {
  name: 'SetTeam',
  components: {
    doctorCard,
    doctorCheckboxGroup,
    doctorRadioGroup,
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    selectedMembers(n) {
      this.form.members_id = n.map((item) => item.id)
    },
  },
  data() {
    return {
      type: 'create',
      title: '创建团队',
      form: {
        avatar_path: '',
        name: '',
        org_id: '',
        dpt_id: '',
        tags_id: [],
        status: '',
        members_id: [],
        leader_id: '',
        introduce: '',
      },
      presetOrganization: [],
      presetTag: [],
      rules: {},
      addTeamMemberDialogVisible: false,
      uploadFile: {
        fileList: [],
        action: '',
      },
      teamStatus: [],

      members: [],
      viewMember: [],
      selectedMembers: [],
      keyword: '',

      currentPage: 1,
      pageSize: 16,
      total: 0,
      imageSrc: '',
      teamInfo: {},

      loading: true,
      tjDep: [],
    }
  },
  mounted() {
    this.teamStatus = this.$dict.teamStatus.data
    this.initForm()
    // this.getOrgs()
    this.getTags()
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
        localSession.set('cache', { type: params.type, id: params.id })
      }

      this.type = data.type || 'create'
      this.title = this.type === 'create' ? '创建团队' : '编辑团队'

      if (this.type === 'create') {
        this.loading = false
        this.form.status = this.$enum.TEAM_STATUS.ENABLE
        this.form.org_id = this.userInfo.selectedOrganization.id
        this.form.dpt_id = this.userInfo.selectedDepartment.id
        this.getDepartment(() => {
          this.getMembers()
        })
      } else {
        this.$api.team.getDetail(data.id).then((res) => {
          this.loading = false
          const info = res.data
          this.teamInfo = info
          this.form.name = info.name
          this.form.tags_id = info.tags.map((item) => item.id)
          this.form.status = info.status
          this.form.introduce = info.introduce
          this.form.leader_id = info?.leader?.id
          ;(this.form.org_id = info.dpt.org_id), (this.form.dpt_id = info.dpt.id), (this.form.avatar_path = info.avatar_path)
          this.imageSrc = info.avatar
          this.selectedMembers = info.members
          this.getDepartment(() => {
            this.getMembers()
          })
        })
        // let data = params
      }
    },

    // 获取所有糖吉的部门
    getDepartment(callback) {
      this.$api.departmentManage
        .getList({
          page: 1,
          page_size: 9999,
          ordering: '-id',
          organization: 1,
        })
        .then((res) => {
          this.tjDep = res.data.results.map((ele) => ele.id)
          callback && callback()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getMembers() {
      var dpts = this.tjDep
      if (!dpts.includes(this.form.dpt_id)) {
        dpts.push(this.form.dpt_id)
      }
      this.$api.user
        .getTeamMembers(this.currentPage, this.pageSize, dpts)
        .then((res) => {
          this.members = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getOrgs() {
      this.$api.orgs
        .getList()
        .then((res) => {
          this.presetOrganization = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getTags() {
      this.$api.tag
        .getList({
          ordering: 'id',
          private_dpt: this.userInfo.selectedDepartment.id,
          page: 1,
          page_size: 99999,
          attribute__in: 'Private, Public',
        })
        .then((res) => {
          this.presetTag = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    checkForm() {
      if (this.form.name === '') {
        this.$message.error('请输入团队名称')
        return false
      }
      if (this.form.org_id === '') {
        this.$message.error('请选择所属机构')
        return false
      }
      // if (this.form.introduce === '') {
      //   this.$message.error('请输入团队介绍')
      //   return false
      // }
      if (this.form.members_id.length === 0) {
        this.$message.error('请选择团队成员')
        return false
      }
      if (this.form.leader_id === '') {
        this.$message.error('请设置团队长')
        return false
      }
      return true
    },
    save() {
      if (this.checkForm()) {
        if (this.type === 'create') {
          this.create()
        } else {
          this.update()
        }
      }
    },
    create() {
      const params = { ...this.form }
      if (this.form.avatar_path === '') {
        delete params.avatar_path
      }
      this.$api.team
        .create(params)
        .then((res) => {
          this.$message.success('创建团队成功')
          this.$router.push(`/team_detail/${res.data.id}`)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    update() {
      const params = { ...this.form }
      if (this.form.avatar_path === '' || this.imageSrc === '') {
        delete params.avatar_path
      }
      this.$api.team
        .update(this.teamInfo.id, params)
        .then((res) => {
          this.$message.success('编辑团队成功')
          this.$router.push(`/team_detail/${res.data.id}`)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    leavePage() {
      this.$router.go(-1)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMembers()
    },
    addTeamMemberClick() {
      this.viewMember = this.$clone(this.selectedMembers)
      this.addTeamMemberDialogVisible = true
    },
    addTeamMemberClose() {
      this.viewMember = []
      this.addTeamMemberDialogVisible = false
    },
    addTeamMemberConfirm() {
      this.selectedMembers = this.$clone(this.viewMember)
      this.addTeamMemberDialogVisible = false
    },
    memberRemoveClick(obj) {
      if (obj.id === this.form.leader_id) {
        if (this.type == 'edit') {
          this.$message.error('团队队长不允许删除！')
          return
        }
        this.form.leader_id = ''
      }
      const index = this.selectedMembers.findIndex((item) => item.id === obj.id)
      this.selectedMembers.splice(index, 1)
    },
  }, // methods end
}
</script>

<style scoped lang="less">
.form-box {
  width: 850px;
}

.add-btn {
  display: flex;
  width: 200px;
  height: 100px;
  padding: 15px;
  margin: 0 10px 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.top {
    height: 140px;
  }

  i {
    color: #5a6d86;
    font-size: 32px;
  }

  &:hover {
    background-color: #fafafa;
  }
}

.team-members {
  height: 430px;
  overflow: scroll;
}

.dialog-box {
  :deep(.el-dialog) {
    height: 630px;
  }
}

.dialog-title {
  height: 28px;
  line-height: 28px;
  font-size: 20px;
  font-weight: 500;
  color: #344563;

  .right-search-bar {
    float: right;
    width: 300px;
    margin-right: 25px;
  }
}

.upload-box {
  width: 150px;
  height: 150px;
  overflow: hidden;
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
}
.member-title::after {
    content: "";
    top: -1px;
    left: 4px;
    width: 4px;
    height: 4px;
    background-color: #e6240a;
    line-height: 4px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 2px;
    margin-left: 2px;
}
</style>
