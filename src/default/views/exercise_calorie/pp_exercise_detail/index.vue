<template>
  <div class="panel scroll" v-loading="loading">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item @click="leavePage" :to="{path: '/exercise_calorie?views=1'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>运动热量表</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>推荐运动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="card-title">
        推荐运动详情
      </div>
      <el-descriptions class="desc-box" title="" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            用户
          </template>
          {{ info.project_patient.patient }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            运动项目
          </template>
          {{ info.exercise.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            强度（METs）
          </template>
          {{ info.exercise.intensity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            运动时长（分钟）
          </template>
          {{ info.duration }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            总消耗热量
          </template>
          {{ info.calories }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            推荐者
          </template>
          {{ info.creator.name }}
          <template v-if="info.creator.role_name">
            <el-tag class="role" v-if="info.creator.role_id === $enum.ROLE.DR" type="success"
                    effect="dark"
                    size="mini">
              {{ info.creator.role_name }}
            </el-tag>
            <el-tag class="role" v-else-if="info.creator.role_id === $enum.ROLE.LD" color="#6b8cce"
                    effect="dark"
                    size="mini">
              {{ info.creator.role_name }}
            </el-tag>
            <el-tag class="role" v-else-if="info.creator.role_id === $enum.ROLE.RD" type="warning"
                    effect="dark"
                    size="mini">
              {{ info.creator.role_name }}
            </el-tag>
            <el-tag class="role" v-else type="info" effect="dark" size="mini">
              {{ info.creator.role_name }}
            </el-tag>
          </template>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            推荐日期
          </template>
          {{ info.created_at | dateFormat }}
        </el-descriptions-item>
      </el-descriptions>
      <m-button class="mt_20" plain @click="leavePage">返回</m-button>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('PpExerciseDetail', true)

export default {
  name: 'PpExerciseDetail',
  data() {
    return {
      info: {
        creator: {},
        exercise: {},
        project_patient: {}
      },
      loading: true,
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      const params = this.$route.params
      let data = params
      this.form = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }

      this.$api.ppexercise.getDetail(data.id)
        .then((res) => {
          this.loading = false
          this.info = res.data
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    date() {
      this.$api.exercise.update(this.form.id, {
        ...this.form,
      })
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
    }
  }, // methods end
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    //height: calc(100vh - 32px - 32px - 48px);
    min-height: calc(100% - 90px - 96px);
  }
}

.desc-box {
  width: 800px;
}
</style>
