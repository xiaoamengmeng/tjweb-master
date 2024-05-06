<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        量表管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <m-button v-auth="'nurtScaleManage.create'" class="common-add-btn" icon="el-icon-plus" @click="toSetPage('create')">新建量表</m-button>
    <div class="card">

      <el-form
        class="form-box mb_20"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="top"
      >
        <div class="search-bar">
          <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                  :gutter="20" style="width: 100%; height: 100%">
            <el-col class="search-bar-col" :span="5">
              <el-row class="label-t">ID</el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    v-model="form.id"
                    placeholder="请输入ID"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="search-bar-col" :span="5">
              <el-row class="label-t">名称</el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    v-model="form.name"
                    placeholder="请输入名称"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="search-bar-col" :span="6">
              <el-row class="label-t">分类</el-row>
              <el-row>
                <el-form-item prop="stage">
                  <el-select
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      :label="'全部'"
                      :value="1"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="search-bar-col" :span="6">
              <el-row class="label-t">&nbsp;</el-row>
              <el-row>
                <m-button @click="page=1;getList()" icon="el-icon-search" h="40px" w="100px">搜索</m-button>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <div class="scale-list" v-loading="loading">
        <div
          class="scale-item"
          v-for="scale in scaleList"
          :key="scale.id"
        >
          <div class="scale-item-row-info">
            <div class="scale-title">量表名称：{{ scale.name }}
              <el-tag v-if="scale.start_time&&dayjs().isAfter(dayjs(scale.end_time))" type="danger" effect="dark"
                      style="margin-left:5px;">已过期
              </el-tag>
              <el-tag v-if="scale.start_time&&dayjs().isBefore(dayjs(scale.start_time))" type="warning" effect="dark"
                      style="margin-left:5px;">未开始
              </el-tag>
            </div>
            <div class="scale-stat">
              <div class="lookup">查阅量：{{ scale.views }}</div>
              <div class="submit">提交量：{{ scale.record_count }}</div>
              <!-- <div class="compliance">依从度：{{ Math.floor(scale.submit / scale.lookup * 100) }}%</div>-->
              <div class="compliance">依从度：{{ countPercent(scale.record_count, scale.views) }}%</div>
            </div>
            <div class="scale-base">
              <div class="id">ID：{{ scale.id }}</div>
              <div class="status">
                状态：{{ scale.status == 'published' ? '已发布' : '未发布' }}
                <el-switch
                  v-if="scale.attribute === 'Private' && scale.can_edit"
                  v-model="scale.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="published"
                  inactive-value="draft"
                  @change="statusChange(scale)">
                </el-switch>
              </div>
              <div class="create-time">创建时间：{{ scale.created_at | dateFormat }}</div>
            </div>
          </div>
          <div class="line"></div>
          <div class="scale-item-row-operate">
            <div class="btn-group">
              <m-button v-auth="'nurtScaleManage.update'" type="iron" w="100px" h="32px" v-if="scale.attribute === 'Private' && scale.can_edit" @click="toSetPage('edit', scale)">
                编辑量表
              </m-button>
              <m-button v-auth="'nurtScaleManage.info'" type="iron" w="100px" h="32px" @click="toPreviewPage(scale)">预览量表</m-button>
              <!-- <m-button v-auth="'nurtScaleManage.questionnaire'" type="iron" w="100px" h="32px" v-if="scale.attribute === 'Private' && scale.can_edit" @click="toSettingPage(scale)">问卷设置
              </m-button> -->
              <m-button v-auth="'nurtScaleManage.answer'" type="iron" w="100px" h="32px" @click="toRecordPage(scale)">答题记录</m-button>
              <m-button v-auth="'nurtScaleManage.answerStatistics'" type="iron" w="100px" h="32px" @click="toStatPage(scale)">答题统计</m-button>
            </div>
            <div class="icon-btn-group">
              <!--              <el-link @click="shareClick(scale)">-->
              <!--                <i class="el-icon-position"></i>分享-->
              <!--              </el-link>-->
              <el-link v-auth="'nurtScaleManage.copy'" @click="copyClick(scale)">
                <i class="el-icon-document-copy"></i>复制
              </el-link>
              <el-link v-if="scale.attribute === 'Private'" v-auth="'nurtScaleManage.delete'" @click="deleteClick(scale)">
                <i class="el-icon-delete"></i>删除
              </el-link>
            </div>
          </div>
        </div>
        <el-pagination
          ref="pagination"
          small
          background
          layout="total, sizes, prev, pager, next, jumper, slot"
          @current-change="currentChange"
          @size-change="sizeChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          :current-page="page"
          :total="total"
          class="mt_10"
        >
          <el-button type="default" size="mini" style="margin-left:5px;" @click="getList"><i
            class="el-icon-refresh-left"></i></el-button>
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="问卷信息"
      :visible.sync="shareDialogVisible"
      :modal="true"
      class="shard-dialog"
    >
      <div class="title">
        量表名称:{{ shareScale.name }}
      </div>
      <div class="title">
        量表描述：{{ shareScale.config.instructions }}
      </div>
      <div>生效日期：{{ shareScale.created_at | dateFormat }}</div>
      <div>失效日期：{{ '2099-12-31 00:00:00' }}</div>


      <span slot="footer" class="dialog-footer">
        <m-button @click="copyShareLink" w="80px">复 制</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'

export default {
  name: 'ScaleManage',
  data() {
    return {
      scaleList: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        id: '',
        name: '',
        type: '',
      },
      rules: {},
      current: {},

      shareDialogVisible: false,
      shareScale: { config: {} },

      loading: true,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mounted() {
    this.getList()
  },
  methods: {
    dayjs,
    getList() {
      this.loading = true
      let params = {
        page: this.page,
        page_size: this.pageSize,
        ordering: '-id',
        id: this.form.id,
        search: this.form.name,
        private_dpt: this.userInfo.selectedDepartment.id,
        attribute__in: "Private,Public",
        // status: "published"
      }
      this.$api.scale.getList(params)
        .then((res) => {
          this.loading = false
          this.total = res.data.count
          this.scaleList = res.data.results
          // .map((item) => {
          //   return {
          //     id: item.id,
          //     can_edit:item.can_edit,
          //     title: item.config.title,
          //     status: item.config.status,
          //     lookup: item.lookup ? item.lookup : '0',
          //     submit: item.submit ? item.submit : '0',
          //     compliance: item.compliance ? item.compliance : '0',
          //     created_at: item.created_at,
          //     config: item.config
          //   }
          // })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    currentChange(val) {
      this.page = val
      this.getList()
    },
    statusChange(scale) {
      // console.log(scale)
      this.$api.scale.patch(scale.id, { status: scale.status }).then(() => {
      }).catch(err => {
        // this.$message.error(err?.detail??'修改发布状态时出错')
        scale.status = scale.status == 'published' ? 'draft' : 'published'
      })
    },
    toSetPage(type, scale = {}) {
      this.$router.push({
        name: 'SetScale',
        params: {
          type,
          scaleId: scale.id,
        }
      })
    },
    toPreviewPage(scale) {
      this.$router.push({
        name: 'ScaleDetail',
        query: {
          formId: scale.id
        }
      })
    },
    toRecordPage(scale) {
      this.$router.push({
        name: 'ScaleRecord',
        query: { id: scale.id, title: scale.name }
      })
    },
    toStatPage(scale) {
      this.$router.push({
        name: 'ScaleStat',
        query: { id: scale.id, title: scale.name }
      })
    },
    toSettingPage(scale) {
      this.$router.push({
        name: 'ScaleSetting',
        query: { id: scale.id, title: scale.name }
      })
    },
    sizeChange(val) {
      this.pageSize = val
      this.scaleList = []
      this.page = 1
      this.getList()
    },
    shareClick(scale) {
      this.shareDialogVisible = true
      this.shareScale = scale
    },
    copyClick(scale) {
      this.toSetPage('copy', scale)
    },
    deleteClick(scale) {
      const tips = `确定删除【ID: ${scale.id}】${scale.config.title ? '【' + scale.config.title + '】' : ''}吗？`
      this.$confirm(tips, '删除量表', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.scale.delete(scale.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
              if (err.code === 'protected_error') {
                this.$message.error('已提交的量表受到保护，只能进行编辑，无法删除')
              } else {
                this.$message.error(JSON.stringify(err))
              }
            })
        })
        .catch(() => {
        })
    },
    toDecimal(x) {
      let f = parseFloat(x);
      if (isNaN(f)) {
        return
      }
      f = Math.round(x * 100) / 100;
      return f
    },
    countPercent(numerator, denominator) {
      if (denominator == 0 || !denominator) return 0
      let percent = (Math.round(numerator / denominator * 1000) / 1000) * 100
      return isNaN(percent) ? 0 : this.toDecimal(percent)
    },
    copyShareLink() {
      const text = this.$config.WEBSITE + '/scale/' + this.shareScale.id
      this.$copyText(text)
        .then((res) => {
          this.$message.success('问卷链接已复制')
        })
        .catch((err) => {
          this.$message.error('复制失败')
        })
    },
  }, // methods end

}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
  }

  position: relative;

  .common-add-btn {
    top: 32px;
  }
}

.m-table {
  height: calc(100% - 110px);
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

.scale-list {
  .scale-item:nth-child(n+2) {
    margin-top: 20px;
  }

  .scale-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 140px;
    box-sizing: border-box;
    border: 1px solid #dadce0;
    padding: 20px;
    border-radius: 12px;

    .line {
      width: 100%;
      height: 1px;
      background-color: #ccc;
    }

    .scale-item-row-info {
      display: flex;
      justify-content: space-between;
      //height: 50px;
      //line-height: 50px;
      .scale-title {
        font-size: 18px;
        font-weight: bold;
        color: #344563;
        width: 300px;
        .text-ellipsis();
      }

      .scale-stat {
        display: flex;
        font-size: 12px;
        color: #1E242C;

        * {
          margin-left: 18px;
        }
      }

      .scale-base {
        display: flex;
        font-size: 12px;
        color: #1E242C;

        * {
          margin-left: 18px;
        }
      }
    }

    .scale-item-row-operate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;

      .btn-group {
        display: flex;
        justify-content: flex-start;
        align-content: center;

        .el-button {
          padding: 0;
        }
      }

      .icon-btn-group {
        display: flex;
        justify-content: flex-start;
        align-content: center;
        margin-right: 10px;

        .el-link {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          margin-left: 50px;
          font-size: 15px;

          i {
            margin-right: 2px;
            position: relative;
            top: 2px;
            font-size: 20px;
            font-weight: bold;
          }
        }
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

.shard-dialog {
  :deep(.el-dialog) {
    width: 550px;
    height: 300px;
  }

  .title {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    font-weight: 500;
    color: #344563;
  }
}
</style>
