<template>
  <div>
    <el-table
      ref="table"
      size="mini"
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
  name: "MTable",
  props: {
    data: Array,
    hidePagination: Boolean,  //隐藏分页器
    pageSizes: Array,
    pageSize: Number,
    currentPage: Number,
    total: Number,
    getDataFunc: Function,
    hideRefresh: Boolean,
    hideLoading: Boolean,
    emptyText: {
      type: String,
      default: ' ',
    }
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
      loading: false
    }
  },
  mounted() {
    // this.loading = true
  },
  methods: {
    refresh() {
      this.loading = true
      if (typeof this.getDataFunc === 'function') {
        if (!this.hidePagination) {
          this.$nextTick(() => {
            if ((this.currentPage > 1 && this.data.length === 0 ) ||
              (this.currentPage > 1 && this.total % this.pageSize === 1)
            ) {
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

.el-table {
  height: calc(100% - 35px - 10px);

  :deep(.el-table__fixed) {
    height: 100% !important;
  }

  :deep(.el-table__header) {
    height: 56px;

    .cell {
      font-size: 14px;
      color: #A1A7C4;
    }
  }

  :deep(.el-table__row) {
    height: 70px;

    .cell {
      font-size: 14px;
      color: #4F5D74;
    }
  }

  // :deep(.el-table--scrollable-x .el-table__body-wrapper) {
  //   overflow: auto !important;
  // }
  // :deep(.el-table__fixed-right-patch) {
  //     background-color: #f5f7fa !important;
  // }

  :deep(.el-table__body-wrapper) {
    height: calc(100% - 56px);
    z-index: 2 !important;
    overflow-y: auto;
    overflow-x: auto;
  }

  :deep(.el-table__fixed-right) {
    right: 12px !important;
  }

  :deep(.el-link) {
    color: #00B386;
    text-decoration: none;

    &:after {
      border-color: @primaryColor;
    }
  }
}
</style>
