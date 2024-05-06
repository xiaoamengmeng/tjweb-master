<template>
  <div>
    <el-table
      ref="table"
      class="data-view"
      size="small"
      :data="data"
      v-bind="$attrs"
      v-on="$listeners"
      :empty-text="emptyText"
      v-loading="loading"
    >
      <slot></slot>
    </el-table>
    <el-pagination
      ref="pagination"
      v-if="!hidePagination"
      small
      background
      layout="total, sizes, prev, pager, next, jumper, slot"
      @current-change="currentPageChange"
      @size-change="sizeChange"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
    >
      <el-button v-if="!hideRefresh" type="default" size="mini" style="margin-left:5px;" @click="refresh"><i
        class="el-icon-refresh-left"></i></el-button>
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "MViewTable",
  props: {
    data: Array,
    hidePagination: Boolean,  //隐藏分页器
    pageSizes: Array,
    pageSize: Number,
    currentPage: Number,
    total: Number,
    getDataFunc: Function,
    hideLoading: Boolean,
    hideRefresh: Boolean,
    emptyText: {
      type: String,
      default: ' ',
    },
  },
  watch: {
    'data': function (val, oldVal) {
      if(this.hideLoading) {
        this.loading = false
        return
      }
      if(val.length === 0 && this.total === 0) {
        this.loading = false
        return
      }
      if (val.length > 0 ) {
        this.loading = false
        return
      }
      this.loading = true
    },
  },
  data() {
    return {
      now: 0,
      loading: false
    }
  },
  activated() {
    this.now = new Date().getTime()
  },
  methods: {
    refresh() {
      this.loading = true
      if (typeof this.getDataFunc === 'function') {
        if (!this.hidePagination) {
          this.$nextTick(() => {
            // console.log(this.currentPage,this.data)
            if (this.currentPage > 1 && this.data.length === 0) {
              let lastPage = this.currentPage - 1
              this.$emit("update:currentPage", lastPage)
            }
            this.getDataFunc()
          })
        }
      }
    },
    currentPageChange(val) {
      this.$emit("update:currentPage", val)
      this.loading = true
      this.getDataFunc()
    },
    sizeChange(val) {
      this.$emit("update:pageSize", val)
      this.$emit("update:currentPage", 1)
      this.loading = true
      this.getDataFunc()
    },
    loadStart() {
      this.loading = true
    },
    loadDone() {
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
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

.table-statistics {
  padding: 5px;
  font-size: 14px;
  color: #555;
  background: #fff;
  border: 1px solid #ebeef5;
  border-top: none;
}

.el-table.data-view {
  &::before {
    content: none;
    height: 0;
  }
  border: 1px solid #D9E1EC;
  border-radius: 8px;

  :deep(.el-table__header) {
    th.el-table__cell {
      height: 50px;
      background: #F4F5FA !important;
      font-size: 14px;
      font-weight: 400;
      color: #A1A7C4;
    }
  }

  :deep(.el-table__body-wrapper) {
    height: 50px;
    overflow-y: auto;
    overflow-x: hidden;

    .el-table__body {
      td.el-table__cell {
        height: 50px;
        padding: 0;
        font-size: 14px;
        font-weight: 400;
        color: #4F5D74;
      }

      .el-table__row:last-child {
        td.el-table__cell {
          border-bottom: none;
          position: relative;
          top: 1px;
        }
      }
    }
  }
}

</style>
