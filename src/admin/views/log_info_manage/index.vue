<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>日志管理</b>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <el-form class="form-box" :model="form" ref="form" label-position="top">
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">搜索信息</el-row>
                <el-row>
                  <el-form-item prop="search">
                    <el-input v-model="form.search" placeholder="操作人姓名/账户" clearable></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">功能</el-row>
                <el-row>
                  <el-form-item prop="search">
                    <el-input v-model="form.module" placeholder="请输入" clearable></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="9">
                <el-row class="label-t">操作时间</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-date-picker v-model="form.range" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
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
                    @click="
                      page = 1
                      getDataFunc()
                    "
                    >搜索</m-button
                  >
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100% - 8px - 15px - 15px - 60px)'" :get-data-func="getDataFunc">
          <el-table-column show-overflow-tooltip prop="operated_at" label="创建时间" min-width="150">
            <template v-slot="scope">
              {{ scope.row.operated_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="operator_account" label="操作人账号" min-width="130"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="operator_name" label="操作人姓名" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="ip" label="IP" min-width="120"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="module" label="功能" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="action" label="操作" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="description" label="操作内容" min-width="300"> </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'LogInfo',
  data() {
    return {
      visible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        search: '',
        module: '',
        range: [],
      },
    }
  },
  mounted() {
    this.getDataFunc()
  },
  methods: {
    focusMenu() {
      this.$nextTick(() => {
        const element = document.querySelector('li.el-menu-item[index="/account"]')
        if (element) element.click()
      })
    },
    getDataFunc() {
      this.$refs.table.loadStart()
      let params = {
        page: this.page,
        page_size: this.pageSize,
        search: this.form.search,
        module: this.form.module,
      }
      if (this.form.range && this.form.range != '') {
        params.operated_at__gte = dayjs(this.form.range[0]).format()
        params.operated_at__lte = dayjs(this.form.range[1]).format()
      }
      this.$api.logInfoManage
        .getList(params)
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
  },
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
