<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/doctor'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>医生列表</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        内容统计
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!--    <m-button class="common-add-btn" icon="el-icon-document" @click="toSetArticle('create')" style="right: 157px;">上传文章</m-button>-->
    <!--    <m-button class="common-add-btn" icon="el-icon-monitor" @click="toSetVideo('create')">发布视频</m-button>-->
    <div class="card">
      <div class="container">

        <el-form
          class="form-box"
          :model="form"
          ref="form"
          label-position="top"
        >
          <div class="search-bar">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">月份</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-date-picker
                      v-model="form.month"
                      type="month"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM"
                      placeholder="选择月份"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col class="search-bar-col" :span="4">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button icon="el-icon-search" h="40px" w="100px" @click="search">搜索</m-button>
                  <!--<m-button h="40px" w="100px" @click="toSetArticle('create')">上传文章</m-button>-->
                  <!--<m-button h="40px" w="100px" @click="toSetVideo('create')">发布视频</m-button>-->
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="12">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  当月新增访问人数：{{ monthViewCount }}人
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          class="m-table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20, 30]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :get-data-func="getList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="内容ID"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            min-width="80"
          >
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.status == 'published'" effect="dark">上架</el-tag>
              <el-tag type="info" v-if="scope.row.status == 'draft'" effect="dark">草稿</el-tag>
              <el-tag type="warning" v-if="scope.row.status == 'scheduled'" effect="dark">定时发布</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="content_type"
            label="内容分类"
            min-width="100"
          >
            <template v-slot="scope">
              <span v-if="scope.row.content_type == 'video'">视频</span>
              <span v-if="scope.row.content_type == 'article'">文章</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="标题"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="num_of_viewers.month_viewers"
            label="当月新增访问人数"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="num_of_viewers.total"
            label="总访问人数"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="views"
            label="总访问次数"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="上传时间"
            min-width="110"
          >
            <template v-slot="scope">
              <span v-if="scope.row.created_at">{{ scope.row.created_at | publishedAt }}</span>
              <span v-else></span>
            </template>
          </el-table-column>

        </m-table>

      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('SetDoctorDetail', true)

export default {
  name: 'ContentManage',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        title: '',
        month: '',
      },
      current: {},
      category: [],
      count: '',
      userId: '',
      monthViewCount: 0,
    }
  },
  mounted() {
    const params = this.$route.params

    let data = params
    if (Object.keys(params).length === 0) {
      const cache = localSession.get('cache')
      if (!cache) return
      data = cache
    } else {
      localSession.set('cache', { userId: params.userId })
    }
    this.userId = data.userId
    this.form.month = this.$day.startOf('month').format('YYYY-MM-DD')
    this.getList()
    this.getMonthViews()
  },
  methods: {
    getList() {
      this.$api.postStat.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: '-created_at',
        month: this.form.month,
        creator_id: this.userId,
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getMonthViews() {
      this.$api.postStat.monthViews({
        creator_id: this.userId,
        month: this.form.month,
      })
        .then((res) => {
          this.monthViewCount = res.data.total_viewer
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    search() {
      this.getList()
      if (this.form.month) {
        this.getMonthViews()
      }
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
</style>
