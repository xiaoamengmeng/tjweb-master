<template>
  <div class="panel scroll" v-loading="loading">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/scale_manage'}">
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>量表管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <b>答题统计</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="list-title">答题依从性统计</div>
      <el-row>
        <el-descriptions title="" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              <span class="fontsize_16 font_bold p_10">累计发放（查阅）人次</span>
            </template>
            <div class="split-row">
              <div class="fontsize_16 font_bold">填报人次</div>
              <div class="split-line"></div>
              <div class="fontsize_16 font_bold">依从性</div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="fontsize_16 font_bold p_10">{{results.length>0?results[0].form.views:'--'}}</span>
            </template>
            <div class="split-row">
              <div class="fontsize_16 font_bold">{{results.length>0?results[0].form.record_count:'--'}}</div>
              <div class="split-line"></div>
              <div class="fontsize_16 font_bold">{{results.length>0?countPercent(results[0].form.record_count,results[0].form.views):'--'}}%</div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-row>

      <div class="list-title">答案统计</div>
      <template>
        <div class="result-item" v-for="(result,index) in results" :key="result.id">
            <table class="result-table">
              <thead>
                <th width="50%"><div class="fontsize_16 font_bold p_10 text_left">{{index+1}}、{{result.name}}（{{~~result.field_type|questionType}}）</div></th>
                <th><div class="fontsize_16 font_bold p_10 text_right">累计查阅{{result.form.views}}人次，填报{{result.record_count}}人次，依从率{{countPercent(result.record_count,result.form.views)}}%</div></th>
              </thead>
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="fontsize_16 font_bold p_10 text_right">
                      <template v-if="result.answer_stats.length>0">
                        <span v-for="(answer,j) in result.answer_stats" :key="j" class="mr_10">{{answer.value}}（{{answer.percent}}%）</span>
                      </template>
                      <span v-else style="color:#aaa;font-style:italic;">（填空题或跳过的题结果不展示）</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ScaleStat',
  data() {
    return {
      title: '',
      loading:true,
      form: {
        range: null,
      },
      results: [],
    }
  },
  mounted() {
    if(this.$route.query.title) this.title = this.$route.query.title
    if(this.$route.query.id) this.getStats()

  },
  methods: {
    getStats(){
      this.loading = true
      let params = {
        form_id:this.$route.query.id
      }
      if(this.form.range&&this.form.range!=''){
        params.created_at__gte = dayjs(this.form.range[0]).format()
        params.created_at__lte = dayjs(this.form.range[1]).format()
      }
      this.$api.cfRecords.getAnswerStats(params).then(res=>{
        this.results = res.data.results
      }).catch(err=>{
        this.$message.error(err)
      }).finally(()=>{
        this.loading = false
      })
    },
    countPercent(numerator,denominator){
      if(denominator==0||!denominator) return 0
      let percent = (Math.round(numerator/denominator*1000)/1000) * 100
      return isNaN(percent)?0:percent
    }
  }, // methods end
  computed: {
    
  }
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
.result-table{
  // border-collapse: collapse;
  width:80%;
  border-spacing: 0;
  border: 1px solid #D9E1EC;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom:10px;
  th{
      background-color: #f4f5fa !important;
  }
  th,td{
    border-right:1px solid #D9E1EC;
    border-bottom:1px solid #D9E1EC;
    color: @textColor;
  }
  th:last-child{
    border-right:none;
  }
  td:last-child{
    border:none;
  }
}

.form-box {
  width: 800px;
  :deep(.el-form-item__content) {
    line-height: 48px;
    position: relative;
    left: 10px;
  }

  .el-date-editor {
    height: inherit;
    line-height: inherit;

    :deep(.el-range-separator) {
      height: inherit;
      line-height: inherit;
    }
  }
}

.add-field-btn {
  float: right;
  position: relative;
  top: 20px;
}

.el-descriptions {
  width: 800px;
  position: relative;

  :deep(.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label) {
    //background-color: #f4f5fa !important;
    background-color: #fff;
    padding: 0;

    .el-input__inner {
      border: none !important;
      border-radius: 0;
      //background-color: #f4f5fa !important;
      background-color: #fff;
    }
  }

  :deep(.el-descriptions-item__cell.el-descriptions-item__content) {
    height: 100%;
    padding: 0;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;

    .split-row {
      display: flex;

      > div {
        width: 50%;
        height: 100%;
        padding: 0;
        padding-left: 10px;
        line-height: 50px;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .split-line {
        width: 1px;
        background-color: #D9E1EC;
        height: 50px;
        padding: 0;
      }
    }
  }

  :deep(.el-descriptions__table.is-bordered) {
    tbody:first-child {
      background-color: #f4f5fa !important;

      .el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label {
        background-color: #f4f5fa !important;
      }
    }
  }
}

.list-title {
  margin-bottom: 0 !important;
}
</style>
