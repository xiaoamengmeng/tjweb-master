<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        运动处方
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <div>
          <el-radio-group @change="viewsModeChange" class="radio-group" v-model="viewsMode">
            <el-radio-button label="处方库"></el-radio-button>
            <el-radio-button label="动作库"></el-radio-button>
          </el-radio-group>
        </div>

        <template v-if="viewsMode === '处方库'">
          <el-form
            class="form-box"
            :model="searchForm"
            ref="form"
            label-position="top"
            @submit.native.prevent
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">人群</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                       <el-select
                          v-model="searchForm.people"
                          placeholder="全部"
                          clearable
                        >
                          <el-option
                            v-for="cate in peopleType"
                            :key="cate.code"
                            :label="cate.label"
                            :value="cate.label"
                          ></el-option>
                        </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">年龄</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchForm.age"
                        placeholder="请输入年龄"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">BMI</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchForm.bmi"
                        placeholder="请输入BMI"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">安静心率</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchForm.rest_heartrate"
                        placeholder="请输入安静心率"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" @click.native="getList" h="40px" w="100px">搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>

          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :get-data-func="getList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="people"
              label="人群"
              min-width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="age"
              label="年龄"
              min-width="60"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="bmi"
              label="BMI"
              min-width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="rest_heartrate"
              label="安静心率"
              min-width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="max_heartrate"
              label="最大心率"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ Math.round(scope.row.max_heartrate) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="hrr"
              label="储备心率"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ Math.round(scope.row.hrr) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="low_heart_range"
              label="心率范围低"
              min-width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ Math.floor(scope.row.low_heart_range * 100, 6) + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="high_heart_range"
              label="心率范围高"
              min-width="100"
              align="center"
            >
               <template slot-scope="scope">
                <span>{{ Math.floor(scope.row.high_heart_range * 100, 6) + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="low_thr"
              label="靶心率低"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ Math.round(scope.row.low_thr) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="high_thr"
              label="靶心率高"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ Math.round(scope.row.high_thr) }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="exercise_duration"
              label="运动时长（分）"
              min-width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="exercise_time"
              label="运动时间"
              min-width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="exercise_frequency"
              label="运动频率（每周/天）"
              min-width="160"
              align="center"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="note"
              label="备注"
              min-width="100"
              align="center"
            >
            </el-table-column>
          </m-table>
        </template>
        <template v-else>
            <!-- <div>
              <m-upload
                class="upload-box"
                :image-path.sync="image_path"
                accept=".jpg,.jpeg,.png,.gif,.mp4"
                success-tips="上传图片成功"
              ></m-upload>
              <div>
                {{image_path}}
              </div>
            </div> -->

            <el-tabs style="padding-top: 10px" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in actionsType" :key="index" :label="item.label" :name="item.code + ''">
                  <div>
                    <div class="action-content" v-loading="loading">
                      <el-row>
                        <el-col :span="12" v-for="(o, idx) in pptableData" :key="idx">
                          <div class="action-item">
                            <div @click="toSetPage(o)" class="action-item-left">
                              <el-image class="action-item-image" 
                                :src="o.image"
                                fit="contain"
                              />
                              <span>{{ o.name }}</span>
                            </div>
                            <div class="action-item-right">
                              <span>训练频率</span>
                              <span>{{ o.exercise_frequency }}</span>
                              <span>动作要求</span>
                              <span>{{ o.exercise_require }}</span>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <el-pagination
                      ref="pagination"
                      small
                      background
                      layout="total, sizes, prev, pager, next, jumper, slot"
                      :page-sizes="[10, 15, 20]"
                      :page-size="ppPageSize"
                      :current-page="ppPage"
                      :total="ppTotal"
                      @current-change="currentPageChange"
                      @size-change="sizeChange"
                    >
                      <el-button type="default" size="mini" style="margin-left:5px;" @click="refresh"><i
                        class="el-icon-refresh-left"></i></el-button>
                    </el-pagination>
                  </div>
                </el-tab-pane>
            </el-tabs>
        </template>
      </div>
    </div>
  
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="true"
      :destroy-on-close="true"
      class="creation-dialog"
      @close="close"
    >
      <video
        ref="videoContent"
        :src="videoUrl"
        controls
        autoplay
        width="100%"
        height="100%"
      ></video>
    </el-dialog>

  </div>
</template>




<script>
// https://cos.ap-shanghai.myqcloud.com/tangjistaging-1303867602/uploads/20230511/16628fbe-f34a-409b-a0cf-e2c0672b7803.jpg
export default {
  name: 'ExercisePrescription',
  data() {
    return {
      viewsMode: '',
      searchForm: {
        people: '',
        rest_heartrate: '',
        bmi: '',
        age: '',
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      activeName: '1',
      category: '热身',

      ppTotal: 0,
      pptableData: [],
      ppPage: 1,
      ppPageSize: 10,
      loading: false,

      peopleType: [],

      dialogVisible: false,
      videoUrl: '',
      image_path: '',
    }
  },
  created() {
    let index = 0
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views)
    }
    if (index === 0) {
      this.viewsModeChange('处方库')
    } else {
      this.viewsModeChange('动作库')
    }
    this.getPeopleType()
  },
  methods: {
    getPeopleType() {
      this.peopleType = this.$dict.exercisePeopleType.data
    },
    handleClick(tab, event) {
      const active = this.actionsType.find(ele => ele.code == this.activeName)
      if (this.category != active.label) {
        this.ppPage = 1
      }
      this.category = active.label
      this.getPpList()
    },
    getList() {
      this.$nextTick(() => {
        const { table } = this.$refs
        if (table) table.loadStart()
      })
      this.$api.exercisePrescription.getList({
        page: this.page,
        page_size: this.pageSize,
        people: this.searchForm.people,
        rest_heartrate: this.searchForm.rest_heartrate,
        bmi: this.searchForm.bmi,
        age: this.searchForm.age,
        ordering: 'id',
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getPpList() {
      this.loading = true
      this.$api.exerciseActions.getList({
        page: this.ppPage,
        page_size: this.ppPageSize,
        exercise_categories: this.category,
        ordering: 'id'
      })
        .then((res) => {
          this.loading = false
          this.ppTotal = res.data.count
          this.pptableData = res.data.results
        })
        .catch((err) => {
          this.loading = false
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetPage(row) {
      this.dialogVisible = true
      //	https://cos.ap-shanghai.myqcloud.com/tangjistaging-1303867602/uploads/20230511/609076e0-f831-4db4-af77-7c932ae26a5e.mp4
      // this.videoUrl = "https://cos.ap-shanghai.myqcloud.com/tangjistaging-1303867602/uploads/20230511/609076e0-f831-4db4-af77-7c932ae26a5e.mp4"
      this.videoUrl = row.video
    },
    close() {
      this.videoUrl = ""
    },
    viewsModeChange(val) {
      this.viewsMode = val
      if (val === '处方库') {
        this.$router.push(`${this.$route.path}?views=0`)
        this.getList()
      } else {
        this.$router.push(`${this.$route.path}?views=1`)
        this.getPpList()
      }
    },
    refresh() {
      this.loading = true
      this.$nextTick(() => {
        if ((this.ppPage > 1 && this.pptableData.length === 0 ) ||
          (this.ppPage > 1 && this.ppTotal!==1 && this.ppTotal % this.ppPageSize === 1)
        ) {
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
  }, // methods end
  computed: {
    actionsType() {
      return this.$dict.exerciseActionsType.data
    }
  },
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
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

.radio-group {
  width: 250px;
  height: 46px;
  border-radius: 23px;
  background-color: #F4F5FA;
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
    background-color: #F4F5FA;

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


.m-table {
  height: calc(100% - 156px);

  // :deep(.el-table__body-wrapper) {
  //   overflow-x: hidden;
  // }

  .el-link {
    color: #00B386;
    text-decoration: none;
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

.action-content {

  height: calc(100vh - 375px);
  overflow: scroll;


  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .action-item-left {
      display: flex; 
      flex-direction: column; 
      width: 35%;
      align-items: center;
      .action-item-image {
        width: 100%;
        height: 200px;
      }
      span {
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .action-item-right {
      display: flex; 
      flex-direction: column; 
      width: 35%;
      margin-left: 30px;
      span {
        font-size: 14px;
        margin-top: 15px;
        font-weight: 600;
      }
      span:nth-child(2n) {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}

.el-pagination {
  height: 24px;
  line-height: 24px;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #ebeef5;

  :deep(.el-input__inner) {
    height: 22px;
  }
}

.upload-box {
  height: 150px;
  width: 200px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }
}


</style>
