<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/project'}">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
      <!--      <el-breadcrumb-item :to="{}" @click.native="$router.go(-1)">-->
      <!--        <b>项目详情</b>-->
      <!--      </el-breadcrumb-item>-->
      <el-breadcrumb-item>团队详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="loading">
      <div class="card-title">团队详情</div>
      <div class="list-title">团队信息</div>
      <el-descriptions title="" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            团队编号
          </template>
          {{ teamInfo.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            团队名称
          </template>
          {{ teamInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            团队头像
          </template>
          <template v-if="teamInfo&&teamInfo.avatar">
            <el-avatar
              fit="cover"
              :size="20"
              :src="teamInfo.avatar"
            ></el-avatar>
          </template>
          <template v-else>
            暂无
          </template>
          <!--          <el-avatar-->
          <!--            :size="20"-->
          <!--            :src="teamInfo.avatar ? teamInfo.avatar : require('@/common/assets/bg/default_team_avatar.png')"-->
          <!--          ></el-avatar>-->
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template slot="label">
            团队标签
          </template>
          <template v-if="teamInfo && teamInfo.tags.length > 0">
            {{ teamInfo.tags.map(tag => tag.name) | showSlowly }}
          </template>
          <template v-else>
            暂无
          </template>
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label">
            所属机构
          </template>
          {{ teamInfo.dpt.org_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属部门
          </template>
          {{ teamInfo.dpt.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建时间
          </template>
          {{ teamInfo.created_at| dateFormat }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            创建人
          </template>
          <template v-if="teamInfo && teamInfo.creator && teamInfo.creator.name > 0">
            {{ teamInfo.creator.name }}
          </template>
          <template v-else>
            暂无
          </template>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            状态
          </template>
          <el-tag v-if="teamInfo.status==$enum.TEAM_STATUS.ENABLE" type="success" effect="dark">启用</el-tag>
          <el-tag v-else type="info" effect="dark">禁用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            团队介绍
          </template>
          <template v-if="teamInfo && teamInfo.introduce && teamInfo.introduce.length > 0">
            {{ teamInfo.introduce }}
          </template>
          <template v-else>
            暂无
          </template>
        </el-descriptions-item>
      </el-descriptions>
      <div class="list-title">团队成员</div>
      <div class="team-members mb_20">
        <doctor-card v-if="teamInfo.leader && Object.keys(teamInfo.leader).length !== 0" :doctorInfo="teamInfo.leader" show-leader>
        </doctor-card>
        <doctor-card v-for="(doctor,index) in teamInfo.members" :label="doctor.id" :doctorInfo="doctor" :key="index">
          设为团队长
        </doctor-card>
      </div>
      <!--      <el-divider></el-divider>-->
      <m-button @click="toSetTeamPage">编辑团队信息</m-button>
      <m-button plain @click="goBack">返回</m-button>
    </div>
  </div>
</template>
<script>
import doctorCard from '../components/doctorCard.vue'

export default {
  name: 'TeamDetail',
  components: {
    doctorCard
  },
  data() {
    return {
      teamInfo: {
        leader: {},
        members: [],
        org: {},
        dpt: {},
        tags: [],
        creator: {},
      },
      tableHeaderStyle: {
        backgroundColor: '#FAFAFA',
        fontSize: '14px', fontWeight: 400, color: '#5A6D86'
      },
      loading: true,
    }
  },
  mounted() {
    this.getTeamInfo()
  },
  methods: {
    goBack() {
      const id = this.$route.params.projectId
      if (id) {
        this.$router.push(`/project_detail/${id}`)
      } else {
        this.$router.go(-2)
      }
    },
    getTeamInfo() {
      const id = this.$route.params.id
      this.$api.team.getDetail(id)
        .then(res => {
          const info = res.data
          this.teamInfo = info
          if(info.leader) {
            this.teamInfo.members = info.members.filter(item => item.id !== info.leader.id)
          }
          this.loading = false
        }).catch((err) => {
            this.loading = false
            this.$message.error(JSON.stringify(err))
          })
    },
    toSetTeamPage() {
      this.$router.push({
        name: 'SetTeam',
        params: {
          type: 'edit',
          ...this.teamInfo,
        },
      })
    },
  }, // methods end
}
</script>
<style lang="less" scoped>
.panel {
  .card {
    margin-top: 0 !important;
    //height: calc(100vh - 32px - 32px - 48px);
    min-height: calc(100% - 90px - 96px);
  }
}

.right-buttons {
  position: absolute;
  right: 30px;
  top: 20px;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
}
</style>
