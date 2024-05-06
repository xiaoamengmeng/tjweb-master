<template>
  <div class="panel">
  <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/doctor'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>医生列表</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        内容列表
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
                <el-row class="label-t">标题</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.title"
                      placeholder="输入标题搜索"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">形式</el-row>
                <el-row>
                  <el-form-item>
                    <el-select
                      v-model="form.content_type"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        :label="'文章'"
                        :value="'article'"
                      ></el-option>
                      <el-option
                        :label="'视频'"
                        :value="'video'"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">分类</el-row>
                <el-row>
                  <el-form-item>
                    <el-select
                      v-model="form.category_id"
                      placeholder="请选择"
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
              <el-col class="search-bar-col" :span="10">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button icon="el-icon-search" h="40px" w="100px" @click.native="getList">搜索</m-button>
                  <!--<m-button h="40px" w="100px" @click="toSetArticle('create')">上传文章</m-button>-->
                  <!--<m-button h="40px" w="100px" @click="toSetVideo('create')">发布视频</m-button>-->
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
            prop="title"
            label="标题"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="content_type"
            label="形式"
            min-width="100"
          >
            <template v-slot="scope">
              <span v-if="scope.row.content_type == 'video'">视频</span>
              <span v-if="scope.row.content_type == 'article'">文章</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="category"
            label="分类"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="published_at"
            label="发布时间"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.status == 'scheduled'">{{ scope.row.published_at | publishedAt }}</span>
              <span v-else>{{ scope.row.created_at | publishedAt }}</span>
            </template>
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
              <el-tag type="warning"  v-if="scope.row.status == 'scheduled'" effect="dark">定时发布</el-tag>
            </template>
          </el-table-column>
<!--          <el-table-column label="操作" align="center" width="120px">-->
<!--            <template v-slot="scope">-->
<!--              <div class="flex justify_center">-->
<!--                <icon-box icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"-->
<!--                          title="编辑" @click.native="editClick(scope.row)"></icon-box>-->
<!--                <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"-->
<!--                          @click.native="deleteClick(scope.row)"></icon-box>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
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
        type: '',
        cate: '',
      },
      current: {},
      category: [],
      userId: '',
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
      localSession.set('cache', {userId: params.userId})
    }
    this.userId = data.userId

    this.getList()
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      this.$api.contentCategories.getList().then((res) => {
        this.category = res.data.results
      })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getList(userId) {
      this.$api.content.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: '-created_at',
        search: this.form.title,
        content_type: this.form.content_type,
        category_id: this.form.category_id,
        creator_id: this.userId
      }).then((res) => {
        this.total = res.data.count
        this.tableData = res.data.results
      })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    editClick(row) {
      if (row.content_type === 'article') {
        this.toSetArticle('edit', row)
      } else {
        this.toSetVideo('edit', row)
      }
      this.dialogTitle = '编辑标签'
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm(`确定删除标题为【${ row.title }】的内容吗？`, '删除内容', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.content.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    toSetArticle(type, row) {
      this.$router.push({
        name: 'SetArticle',
        params: {
          type: type,
          ...row
        }
      })
    },
    toSetVideo(type, row) {
      this.$router.push({
        name: 'SetVideo',
        params: {
          type: type,
          ...row
        }
      })
    }
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
