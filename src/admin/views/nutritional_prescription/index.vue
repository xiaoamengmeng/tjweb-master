<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        营养处方
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
          ref="form"
          label-position="top"
        >
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">性别</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.sex"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in sexStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.code"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">年龄</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.age_set"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in ageStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">BMI</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.bmi"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in BMIStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">血压</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.blood_pressure"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in bloodPressureStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">血糖</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.blood_sugar"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in bloodGlucoseStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">血脂</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.blood_fat"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in bloodFatStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">Pal</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.pal"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in bloodPalStatus"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="3">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button icon="el-icon-search" h="40px" w="100px" @click="page=1;getDataFunc()">搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px - 60px)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="处方编号"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sex"
            label="性别"
            min-width="60"
            align="center"
          >
            <template v-slot="scope">
              <span v-if="scope.row.sex != 'N/A'">{{ scope.row.sex }}</span>
              <span v-else>全部</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="age_set"
            label="年龄"
            min-width="70"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bmi"
            label="BMI"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="blood_pressure"
            label="血压"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="blood_sugar"
            label="血糖"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="blood_fat"
            label="血脂"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="pal"
            label="Pal"
            min-width="60"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="pal_ratio"
            label="Pal系数"
            min-width="80"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="calorie"
            label="总热量"
            min-width="80"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="carbohydrate_ratio"
            label="碳水化合物比例"
            min-width="120"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="protein_ratio"
            label="蛋白质比例"
            min-width="100"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="fat_ratio"
            label="脂肪比例"
            min-width="80"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="dishes_count"
            label="菜品数量"
            min-width="80"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>

          <el-table-column label="操作" align="center" min-width="60">
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link v-auth="'nutritional.info'" @click.native="changeInfoClick(scope.row)">查看</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NutritionalPrescription',
  components: {
    
  },
  watch: {
    $route(to, from){
      if (from.name == 'NutritionalPrescriptionDetail') {

      } else {
        if (to.name != 'NutritionalPrescriptionDetail') {
          this.form = {
            sex: '',
            age_set: '',
            bmi: '',
            blood_pressure: '',
            blood_sugar: '',
            blood_fat: '',
            pal: '',
          }
          this.total = 0
          this.pageSize = 10
          this.page = 1
          this.getStatus()
          this.getDataFunc()
        }
      }
    } 
  },
  data() {
    return {
      tableData: [{
        id: 1
      }],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        sex: '',
        age_set: '',
        bmi: '',
        blood_pressure: '',
        blood_sugar: '',
        blood_fat: '',
        pal: '',
      },
      status: [],
      sexStatus: [],
      ageStatus: [],
      BMIStatus: [],
      bloodPressureStatus: [],
      bloodGlucoseStatus: [],
      bloodFatStatus: [],
      bloodPalStatus: [],
      rules: {},
    }
  },
  mounted() {
    this.getStatus()
    this.getDataFunc()
  },
  methods: {
    getStatus() {
        this.status = this.$dict.departmentManageStatus.data
        this.sexStatus = this.$dict.nutritionalSexStatus.data
        this.ageStatus = this.$dict.nutritionalAgeStatus.data
        this.BMIStatus = this.$dict.nutritionalBMIStatus.data
        this.bloodPressureStatus = this.$dict.nutritionalBloodPressureStatus.data
        this.bloodGlucoseStatus = this.$dict.nutritionalBloodGlucoseStatus.data
        this.bloodFatStatus = this.$dict.nutritionalBloodFatStatus.data
        this.bloodPalStatus = this.$dict.nutritionalBloodPalStatus.data
    },
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.nutrition.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
        sex: this.form.sex,
        age_set: this.form.age_set,
        bmi: this.form.bmi,
        blood_pressure: this.form.blood_pressure,
        blood_sugar: this.form.blood_sugar,
        blood_fat: this.form.blood_fat,
        pal: this.form.pal,
      })
        .then((res) => {
          this.$refs.table.loadDone()
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$refs.table.loadDone()
          this.$message.error(JSON.stringify(err))
        })
    },
    changeInfoClick(row) {
      this.$router.push({
        name: 'NutritionalPrescriptionDetail',
        params: {
          ...row,
        },
      })
    },
  }
}
</script>

<style scoped lang="less">


.m-table {
  height: calc(100% - 50px);
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
</style>
