<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/patient'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: `/patient_detail/${ppid}?views=4`}">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ '推荐运动项目' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card" v-loading="loading">
      <div class="patient-info">
        <div class="base">
          <div class="avatar">
            <el-avatar fit="cover" :size="62" :src="ppInfo.patient.avatar_url"></el-avatar>
          </div>
          <div class="name">{{ ppInfo.patient.name }}</div>
          <div class="sex">
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.M"
              icon-name="sex_male" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.F"
              icon-name="sex_female" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
          </div>
          <div class="tag age">{{ ppInfo.patient.user_profile.birthday | calcAge }}岁</div>
          <div v-if="ppInfo.stage" class="tag stage">{{ ppInfo.stage }}</div>
          <div class="tag id">No.{{ ppInfo.patient.user_id }}</div>

        </div>
        <div class="base2">
          <div class="item">手机号：{{ ppInfo.patient.phone_number }}</div>
          <div class="item">身份证：{{ ppInfo.patient.id_number }}</div>
          <div class="item">出生日期：{{ ppInfo.patient.user_profile.birthday | dateFormatCN }}</div>
        </div>
        <div class="tags">
          <span>患者标签：</span>
          <span v-if="ppInfo.patient.tags && ppInfo.patient.tags.length === 0">暂无</span>
          <template v-else>
          <span
            class="tag mr_8"
            v-for="tag in ppInfo.patient.tags"
            :key="tag.id"
          >#{{ tag.name }}</span>
          </template>
        </div>
      </div>

      <div class="list-title" style="width: 800px;">
        总消耗热量：{{ caloriesSum }} 千卡
        <m-button class="right" @click="addExerciseClick">添加运动项目</m-button>
      </div>
      <m-view-table
        ref="table"
        :data="tableData"
        height="353"
        hide-pagination
        style="width: 800px;"
        :get-data-func="getPpExercise"
        hide-loading
      >
        <el-table-column
          show-overflow-tooltip
          label="推荐运动项目"
          width="300"
          prop="exercise.name"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="210"
          label="运动时长"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.duration }}分钟
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="210"
          label="消耗热量"
          align="center"
        >
          <template v-slot="scope">
            {{ scope.row.calories }}千卡
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="操作"
          align="center"
        >
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                @click.native="deletePpExercise(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-view-table>

      <div class="mt_20">
        <!--        <m-button @click="save">保存</m-button>-->
        <m-button plain @click="leavePage">返回</m-button>
      </div>

      <el-dialog
        title="选择运动项目"
        :visible.sync="dialogVisible"
        class="dialog"
      >
        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
          ref="form"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="运动项目" prop="name">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="form.name"
              :fetch-suggestions="querySearch"
              placeholder="输入项目名称查询"
              style="width: 300px"
              @select="handleSelect"
              clearable
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="推荐运动时长" prop="duration">
            <el-input
              style="width: 300px;"
              v-model.number="form.duration"
              placeholder="请输入推荐运动时长"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
            （分钟）
          </el-form-item>
          <el-form-item label="热量" prop="calories">
            <el-input
              style="width: 300px;"
              v-model="form.calories"
              readonly
              placeholder="选择运动项目和运动时长后自动计算"
            ></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false">关 闭</m-button>
        <m-button @click="save">添 加</m-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('PatientRecommendExercise', true)

export default {
  name: 'PatientRecommendExercise',
  data() {
    return {
      loading: true,
      caloriesSum: '',
      ppid: '', // 项目患者id
      projectId: '', // 项目id
      userId: '', // 患者id
      stage: '',

      ppInfo: {
        project: {},
        patient: {
          user_profile: {}
        },
      },

      tableData: [],
      dialogVisible: false,
      form: {
        name: '',
        exercise_id: '',
        duration: '',
        calories: '',
      },
      rules: {
        name: [{ required: true, message: '请选择运动项目', trigger: 'change' }],
        duration: [{ required: true, message: '请输入运动项目时长', trigger: 'change' }],
        calories: [{ required: true, message: ' ', trigger: 'change' }],
      },

      exerciseLibrary: [],
      searchText: '',
      searchResultCache: [],
      selectExercise: {},
    }
  },
  watch: {
    form: {
      deep: true,
      handler: function (form) {
        if (form.name === '') {
          this.form.exercise_id = ''
        }

        if (form.name !== '' && this.form.duration !== '') {
          this.calcCalories()
        }
        if (form.name === '' || this.form.duration === '') {
          this.form.calories = ''
        }
      }
    },
    // form({ name, duration }) {
    //   if (name === '') {
    //     this.form.exercise_id = ''
    //   }
    // }
  },
  mounted() {
    this.initForm()
    this.getPpExercise()
    this.getExerciseLibrary()
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
        localSession.set('cache', {
          ppid: params.ppid,
          userId: params.userId,
        })
      }

      this.ppid = data.ppid
      this.userId = data.userId

      this.getPpInfo()
    },
    getPpInfo() {
      this.loading = true
      this.$api.myProjectPatient.getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.form.project_patient_id = this.ppInfo.id
          this.loading = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getExerciseLibrary() {
      this.$api.exercise.getList()
        .then((res) => {
          this.exerciseLibrary = res.data.result
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getPpExercise() {
      this.$refs.table.loadStart()
      this.$api.ppexercise.getList({
        page: this.page,
        page_size: this.pageSize,
        project_patient: this.ppid,
        ordering: 'id',
      })
        .then((res) => {
          this.$refs.table.loadDone()
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.project_patient_id = this.ppid
          this.$api.ppexercise.create(this.form)
            .then((res) => {
              this.$message.success('添加推荐运动成功')
              this.getPpExercise()
              this.dialogVisible = false
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        }
      })
    },
    leavePage() {
      this.$router.push(`/patient_detail/${this.ppid}?views=4`)
    },
    querySearch(queryString, cb) {
      this.$api.exercise.getList({
        page: 1,
        page_size: 10000,
        search: queryString,
        // category_id: cateId
      }).then((res) => {
        const result = res.data.results
        this.searchResultCache = result
        if (result.length === 0) {
          cb([])
        } else {
          cb(result)
        }
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    handleSelect(obj) {
      this.selectExercise = obj
      this.form.name = obj.name
      this.form.exercise_id = obj.id
    },
    calcCalories() {
      // 熱量消耗 = 40 kg * 1 hour * 3.5 METs = 140 kcal，
      // 如果持續時間為30分鐘，則為140 / 2 = 70 kcal
      const weight = this.ppInfo.patient.user_profile.initial_weight
      const METs = this.selectExercise.intensity
      const calories = (weight * 1 * METs) / (60 / this.form.duration)
      this.form.calories = Math.round(calories)
    },
    addExerciseClick() {
      this.searchResultCache = []
      this.selectExercise = {}
      this.dialogVisible = true
      Object.assign(this.$data.form, this.$options.data().form)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    deletePpExercise(row) {
      this.$confirm(`确定删除运动项目【${row.exercise.name}】吗？`, '删除运动项目', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.ppexercise.delete(row.id)
            .then(res => {
              this.$message.success('删除成功')
              this.getPpExercise()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {

        })
    },
  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
  }
}

.dialog {
  :deep(.el-dialog) {
    width: 560px;
    height: 400px;
  }
}

.patient-info {
  width: 100%;

  .base {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    margin-bottom: 22px;

    .name {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: #344563;
      line-height: 28px;
      margin-left: 16px;
    }

    .sex {
      margin-left: 8px;
    }

    .tag {
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #D9E1EC;
      font-size: 12px;
      font-weight: 600;
      color: #1E242C;
      margin-left: 4px;
    }

    .tag.age {
      min-width: 42px;
    }

    .tag.stage {
      min-width: 52px;
    }

    .tag.id {
      min-width: 76px;
    }

    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .font-mixin {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5A607F;
    line-height: 20px;
  }

  .base2 {
    display: flex;
    margin-bottom: 22px;

    .item {
      .font-mixin();
      margin-right: 38px;
    }

  }

  .tags {
    .font-mixin();

    .tag {
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #D9E1EC;
      padding: 4px 8px;
    }

    margin-bottom: 32px;
  }
}
</style>
