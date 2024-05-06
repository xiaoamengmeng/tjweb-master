<template>
  <div class="panel" v-loading="loading">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/scale_manage'}">
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>量表管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        问卷设置
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
          ref="form"
          label-position="right"
          label-width="140px"
        >
          <el-form-item label="权限设置">
            <el-select
              v-model="form.permission_type"
              placeholder="请选择"
              clearable
              style="width: 320px; margin-left: 10px;"
            >
              <el-option value="all" label="所有人"></el-option>
              <el-option value="special" label="指定人"></el-option>
              <el-option value="creator" label="仅自己"></el-option>
            </el-select>
            <!-- <m-button v-if="form.permission_type == 'special'" w="150px" h="40px" class="ml_10 p_0"
                      @click="drawer = true">设置权限人员<span>（{{ selectedMembers.length }}）</span></m-button> -->
          </el-form-item>
          <el-form-item label="有效期设置">
            <el-switch
              v-model="form.effective"
              style="position: relative; top: 2px; margin-left: 10px;"
            >
            </el-switch>
            <span v-if="form.effective" class="ml_4" style="position: relative; top: 4px;">设置收集时间</span>
            <span v-else class="ml_4" style="position: relative; top: 4px;">永久有效</span>
          </el-form-item>
          <el-form-item v-if="form.effective" label="开始/结束收集时间" prop="range">
            <el-date-picker
              v-model="form.range"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <div class="mt_20">
            <m-button @click="save" :loading="submitLoading">保存</m-button>
            <m-button plain @click="$router.go(-1)">返回</m-button>
          </div>
        </el-form>
      </div>
    </div>
    <el-drawer
      title="选择允许访问量表的人员"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
      :size="selectedMembers.length>0?'880px':'360px'"
    >
      <el-row style="overflow:hidden;">
        <el-col :span="selectedMembers.length>0?10:24">
          <div class="member-wrap user-wrap">
            <el-input size="small" placeholder="请输入团队成员姓名搜索" v-model="keyword" clearable></el-input>
            <div class="team-wrap">
              <div class="wrap-header">
                <div class="wrap-title">团队成员</div>
                <el-checkbox v-model="teamSelectAll">全选</el-checkbox>
              </div>
              <user-checkbox-group v-model="selectedMembers" class="scroll-wrap">
                <user-card v-for="(member,index) in computedMembers" showCheckbox :label="member" :userInfo="member"
                           :key="index"></user-card>
              </user-checkbox-group>
            </div>
          </div>
        </el-col>
        <el-col :span="14" v-if="selectedMembers.length>0">
          <div class="selected-wrap user-wrap">
            <div class="patient-wrap">
              <div class="wrap-header">
                <div class="wrap-title">已选择</div>
                （{{ selectedMembers.length }}/{{ members.length * 2 }}）
              </div>
              <user-card v-for="(member,index) in selectedMembers" showRemove :label="member" :userInfo="member"
                         :key="index" @remove="onRemove">
                <div class="checkbox-wrap">
                  <el-radio-group v-model="member.level">
                    <el-radio :label="1">查看</el-radio>
                    <el-radio :label="2">编辑</el-radio>
                  </el-radio-group>

                </div>
              </user-card>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import userCard from '../components/userCard.vue'
import userCheckboxGroup from '../components/userCheckboxGroup.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ScaleSetting',
  components: {
    userCard,
    userCheckboxGroup,
  },
  data() {
    return {
      title: '',
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        range: null,
        permission_type: 'all',
        effective: false,
      },
      formInfo: {},
      loading: false,
      submitLoading: false,
      teamSelectAll: false,
      members: [],
      selectedMembers: [],
      rules: {
        range: [{ type: 'array', required: true, message: '请选择开始/结束时间', trigger: 'change' }]
      },
      keyword: '',
      drawer: false,
    }
  },
  watch: {
    teamSelectAll: function (val) {
      if (val) this.selectedMembers = this.members
      else this.selectedMembers = []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedMembers() {
      if (this.keyword != '') {
        let members = this.members.filter(item => item.name.indexOf(this.keyword) != -1)
        return members
      } else {
        return this.members
      }
    },
    isAdmin() {
      return this.$router.currentRoute.meta.isAdmin
    },
  },
  mounted() {
    this.title = this.$route.query.title
    this.getScale()
  },
  methods: {
    getScale() {
      this.loading = true
      this.$api.scale.getDetail(this.$route.query.id).then(res => {
        this.formInfo = res.data
        this.form.permission_type = this.formInfo.permission_type
        this.form.effective = this.formInfo.start_time != null
        if (this.form.effective) {
          this.form.range = []
          this.form.range[0] = new Date(this.formInfo.start_time)
          this.form.range[1] = new Date(this.formInfo.end_time)
        }
        this.getTeam()
      }).catch(err => {
        console.log(err)
        this.$message.error(JSON.stringify(err))
      }).finally(() => {
        this.loading = false
      })
    },
    getTeam() {
      const params = { member: ''}
      if(this.isAdmin) {
        params.member = this.formInfo.creator.id
      } else {
        params.member = this.userInfo.id
      }
      this.$api.team.getList(params).then(res => {
        let teams = res.data.results
        this.members = []
        teams.forEach(team => {
          if (team.leader) {
            team.leader.level = 1
            if (this.members.findIndex(member => member.id == team.leader.id) == -1 && team.leader.id != this.formInfo.creator.id) {
              this.members.push(team.leader)
            }
          }
          team.members.forEach(tm => {
            tm.level = 1
            if (this.members.findIndex(member => member.id == tm.id) == -1 && tm.id != this.formInfo.creator.id) this.members.push(tm)
          });
        })
        if (this.formInfo.permission_type == 'special' && this.formInfo.permissions.length > 0) {
          this.formInfo.permissions.forEach(permission => {
            let member = this.members.find(member => member.id == permission.user)
            if (member) {
              member.level = permission.level
              this.selectedMembers.push(member)
            }
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(JSON.stringify(err))
      })
    },
    drawerClose(done) {
      done()
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            permission_type: this.form.permission_type
          }
          if (this.form.permission_type == 'special') {
            if (this.selectedMembers.length == 0) return this.$message.warning('请指定权限人员')
            else {
              let permissions = []
              this.selectedMembers.forEach(member => {
                let dict = {
                  user_id: member.id,
                  level: member.level
                }
                permissions.push(dict)
              })
              params.permissions = permissions
            }
          }
          if (this.form.effective) {
            params.start_time = new Date(this.form.range[0]).toISOString()
            params.end_time = new Date(this.form.range[1]).toISOString()
          } else {
            params.start_time = null
            params.end_time = null
          }
          this.submitLoading = true
          this.$api.scale.patch(this.$route.query.id, params).then(res => {
            this.$message.success('保存成功')
            this.$router.go(-1)
          }).catch(() => {
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    onRemove(member) {
      let index = -1
      index = this.selectedMembers.findIndex(item => item.id == member.id)
      if (index != -1) this.selectedMembers.splice(index, 1)
      else {
        index = this.selectedPatients.findIndex(item => item.id == member.id)
        if (index != -1) {
          this.selectedPatients.splice(index, 1)
        }
      }
    }
  }, // methods end
}
</script>

<style scoped lang="less">
:deep(.el-drawer__body) {
  overflow: hidden;
}

:deep(.el-drawer) {
  transition: width .3s;
}

.user-wrap {
  padding: 0 10px;

  .wrap-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #eee;
    margin: 5px -10px;

    .wrap-title {
      color: #566085;
      font-size: 16px;
      margin-right: 10px;
      font-weight: bold;
    }
  }

  .scroll-wrap {
    height: calc(100vh - 165px);
    padding-right: 15px;
    overflow: hidden auto;
  }

  .checkbox-wrap {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
}

.selected-wrap {
  height: calc(100vh - 80px);
  box-shadow: inset 6px 6px 7px #0000000f;
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

:deep(.el-date-editor .el-range-separator) {
  line-height: 38px;
}
</style>
