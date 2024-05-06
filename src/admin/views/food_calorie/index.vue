<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        食物热量表
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container flex">
<!-- {
      name: '添加分类',
      codename: 'foodCalorie.createCategory',
    }, {
      name: '删除分类',
      codename: 'foodCalorie.deleteCategory',
    } -->
        <m-button v-auth="'foodCalorie.createFood'" class="common-add-btn" icon="el-icon-plus" @click="toSetPage('create')">添加</m-button>

        <div class="category">
          <m-category
            :addAuth="'foodCalorie.createCategory'"
            :deleteAuth="'foodCalorie.deleteCategory'"
            :data="category"
            :select.sync="cageSelect"
            @add="addCateClick"
            @minus="minusCateClick"
            @click="cateClick"
          ></m-category>
        </div>
        <div class="content">
          <el-form
            ref="searchFrom"
            class="form-box"
            :model="searchFrom"
            label-position="top"
          >
            <div class="search-bar">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">菜品ID</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchFrom.id"
                        placeholder="输入菜品ID搜索"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">菜品名称</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchFrom.name"
                        placeholder="输入菜品名称搜索"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="5">
                  <el-row class="label-t">分类</el-row>
                  <el-row>
                    <el-form-item>
                      <el-select
                        v-model="searchFrom.category_id"
                        placeholder="全部"
                        clearable
                      >
                        <el-option
                          v-for="cate in category"
                          :key="cate.id"
                          :label="cate.name"
                          :value="cate.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="7">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" h="40px" w="100px" @click="getFoodList">搜索</m-button>
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
            :get-data-func="getFoodList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="id"
              label="菜品ID"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="图片"
              min-width="140"
            >
              <template v-slot="scope">
                <el-image
                  :src="scope.row.image"
                  style="width: auto; height: 60px;"
                  fit="cover"
                  :preview-src-list="[scope.row.image]"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="菜品名称"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="category.name"
              label="分类"
            >
            </el-table-column>
            <el-table-column
              prop="calories"
              label="100克/千卡"
              min-width="140"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" width="160px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'foodCalorie.foodDetail'" icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="查看详情" @click.native="toSetPage('view', scope.row)"></icon-box>
                  <icon-box v-auth="'foodCalorie.updateFood'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="编辑" @click.native="toSetPage('edit', scope.row)"></icon-box>
                  <icon-box v-auth="'foodCalorie.deleteFood'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                            @click.native="deleteClick(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </div>
      </div>
    </div>

    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      :modal="true"
    >
      <el-form
        class="form-box"
        :model="cateForm"
        ref="cateForm"
        label-width="60"
        label-position="left"
      >
        <el-form-item label="名称" required class="mt_20">
          <el-input v-model="cateForm.name" placeholder="请输入分类名称" class="" style="width: 380px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="cateDialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="addCate" w="80px">保 存</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import foodCategories from "@/common/request/api/foodCategories";

export default {
  name: 'FoodCalorie',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      searchFrom: {
        id: '',
        name: '',
        category_id: '',
      },
      rules: {},
      current: {},
      deleteDialogVisible: false,

      cateForm: {
        name: '',
      },
      category: [],
      cageSelect: {},
      cateDialogVisible: false,
    }
  },
  mounted() {
    this.getCategoryList()
    this.getFoodList()
  },
  methods: {
    getFoodList() {
      this.$refs.table.loadStart()
      this.$api.food.getList({
        page: this.page,
        page_size: this.pageSize,
        search: this.searchFrom.name,
        id: this.searchFrom.id,
        category_id: this.searchFrom.category_id,
        ordering: 'id',
      }).then((res) => {
        this.total = res.data.count
        this.tableData = res.data.results
      }).catch((err) => {
     this.$message.error(JSON.stringify(err))
      })
    },
    getCategoryList() {
      this.$api.foodCategories.getList({}).then((res) => {
        this.category = res.data.results
      })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    toSetPage(type, row = {}) {
      this.$router.push({
        name: 'SetDish',
        params: {
          type: type,
          ...row
        },
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除食物【${row.name}】吗？`, '删除食物', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.food.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getFoodList()
            })
            .catch((err) => {
           this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    addCateClick() {
      this.cateDialogVisible = true
      this.cateForm.name = ''
    },
    minusCateClick() {
      if (Object.keys(this.cageSelect).length === 0) {
        return this.$message.error('请选择一个分类')
      }
      this.$confirm(`确定删除分类【${ this.cageSelect.name }】吗？`, '删除标签', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.foodCategories.delete(this.cageSelect.id)
          .then((res) => {
            this.$message.success('删除成功')
            this.getCategoryList()
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
          })
      }).catch(() => {
      })
    },
    addCate() {
      this.$api.foodCategories.create({
        ...this.cateForm,
      }).then(res => {
        this.$message.success('新增成功')
        this.getCategoryList()
        this.cateDialogVisible = false
      })
    },
    cateClick(cate) {
      this.page = 1
      this.searchFrom.category_id = cate.id
      this.getFoodList()
    }
  }
}
</script>

<style scoped lang="less">
.panel {
  //.card {
  //  margin-top: 32px;
  //  height: calc(100% - 32px - 32px);
  //}
  .container {
    .category {
      margin-right: 10px;
      max-height: 500px;
      //height: 100%;
    }

    .content {
      flex: 1;
      width: calc(100% - 200px - 10px);
    }
  }
}

.m-table {
  height: calc(100% - 90px);
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
