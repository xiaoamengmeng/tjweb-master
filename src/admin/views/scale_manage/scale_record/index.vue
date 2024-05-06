<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/scale_manage'}">
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>量表管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        答题记录
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <el-form
          class="form-box"
          :model="form"
          ref="form"
          label-position="top"
        >
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">统计周期</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-date-picker
                      v-model="form.range"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">患者姓名</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入患者姓名"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button icon="el-icon-search" h="40px" w="100px" @click="getDataFunc">搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          ref="mTable"
          class="m-table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="答题记录ID"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="creator.name"
            label="反馈者"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="col1"
            label="完成时间"
            min-width="120"
          >
          <template slot-scope="scope">
            <span>{{scope.row.created_at | dateFormat}}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box icon-name="table_detail" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="详情" @click.native="toDetailPage(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ScaleRecord',
  data() {
    return {
      title: '',
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        name: '',
        range: [],
      },
    }
  },

  mounted(){
    if(this.$route.query){
      this.getDataFunc()
      this.title = this.$route.query.title
    }
  },
  methods: {
    dayjs,
    getDataFunc() {
      let params = {
        form_id:this.$route.query.id,
        page:this.page,
        page_size:this.pageSize
      }
      if(this.form.name!='') params.search = this.form.name
      if(this.form.range&&this.form.range!=''){
        params.created_at__gte = dayjs(this.form.range[0]).format()
        params.created_at__lte = dayjs(this.form.range[1]).format()
      }
      this.$refs.mTable.loadStart()
      this.$api.cfRecords.getList(params).then(res=>{
        this.total = res.data.count
        this.tableData =  res.data.results
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    toDetailPage(row) {
      this.$router.push({
        name: 'ScaleDetail',
        query: {
          id:row.id,
          formId:row.form.id
        }
      })
    }
  },

}
</script>

<style scoped lang="less">

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
