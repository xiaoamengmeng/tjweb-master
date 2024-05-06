<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        审核记录
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <el-form
          class="form-box"
          :model="form"
          :rules="rules"
          ref="form"
          label-position="top"
        >

          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">ID</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.id"
                      placeholder="请输入ID"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">姓名</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入姓名"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">审核状态</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.status"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        :label="'审核通过'"
                        value="approved"
                      ></el-option>
                      <el-option
                        :label="'待审核'"
                        value="pending"
                      ></el-option>
                      <el-option
                        :label="'审核未通过'"
                        value="rejected"
                      ></el-option>
                      <el-option
                        :label="'草稿'"
                        value="draft"
                      ></el-option>
                      <el-option
                        :label="'已取消'"
                        value="canceled"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button @click="page=1;getDataFunc()" icon="el-icon-search" h="40px" w="100px">搜索</m-button>
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
          :height="'calc(100% - 8px - 15px - 15px)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="user"
            label="ID"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="医生姓名"
            min-width="100"
          >
          </el-table-column>


          <el-table-column
            show-overflow-tooltip
            prop="hospital"
            label="所在医院"
          >
          </el-table-column>


          <el-table-column
            show-overflow-tooltip
            prop="department"
            label="科室"
            min-width="120"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="职称"
            min-width="100"
          >
						<template slot-scope="scope">
							<span>{{scope.row.title | titleFilter}}</span>
						</template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            label="创建认证时间"
            min-width="160"
          >
						<template slot-scope="scope">
							<span>{{scope.row.created_at | dateFormat}}</span>
						</template>
          </el-table-column>


          <el-table-column
            show-overflow-tooltip
            prop="updated_at"
            label="修改认证时间"
            min-width="160"
          >
						<template slot-scope="scope">
							<span>{{scope.row.updated_at | dateFormat}}</span>
						</template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="col1"
            label="审核人（昵称）"
            min-width="120"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="审核状态"
            min-width="120"
          >
						<template slot-scope="scope">
							<span>{{scope.row.status | statusFilter}}</span>
						</template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="250px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link v-auth="'examine.audit'" @click="toDetail(scope.row,'examine')" size="mini" v-if="scope.row.status === 'pending'">
                  审核
                </el-link>
                <span class="inline_block mr_6"></span>
                <el-link v-auth="'examine.update'" @click="toDetail(scope.row,'edit')" size="mini" v-if="scope.row.status==='rejected'||scope.row.status === 'pending'">
                  修改
                </el-link>
                <span class="inline_block mr_6"></span>
                <el-link v-auth="'examine.info'" @click="toDetail(scope.row,'see')" v-if="scope.row.status==='rejected'||scope.row.status==='approved'||scope.row.status==='canceled'" size="mini">查看</el-link>
                <span class="inline_block mr_6"></span>
                <el-link v-auth="'examine.delete'"  @click="deleteClick(scope.row)" v-if="scope.row.status==='rejected'" size="mini">取消</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import { DOCTOR_AUTHENTICATION } from '@/common/utils/dict'
export default {
  name: 'Examine',
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        id: '',
        name: '',
        status: '',
      },
      rules: {},
      current: {},
      dialogVisible: false,
      dialogTitle: '修改密码',
      roleVisible: false,
      roleTitle: '修改角色'
    }
  },
	filters: {
		statusFilter: function(v){
			return v==='draft'?'草稿':v==='approved'?'审核通过':v==='pending'?'待审核':v==='rejected'?'审核未通过':'已取消'
		},
		titleFilter: function(v){
			const item = DOCTOR_AUTHENTICATION.find(ele => ele.code == v)
      return item ? item.label : '住院医师'
		},
		dateFormat:function(v){
			return v ? v.split('+')[0].split('.')[0].replace(/T/,' ') : ''
		}
	},
  mounted() {
		this.getDataFunc()
  },
  methods: {
		getDataFunc() {
      this.$refs.table.loadStart()
			this.$api.doctor.getList({
				page: this.page,
				page_size: this.pageSize,
				ordering: '',
				search: this.form.name,
        status: this.form.status,
        user_id: this.form.id,
      })
				.then((res) => {
					this.tableData = res.data.results
					this.total = res.data.count
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
		},

    toSetDishPage() {
      this.$router.push({
        name: 'SetAccount',
        params: {
          type: 'create',
        },
      })
    },
    toDetail(row,type) {
      this.$router.push({
        name: 'ExamineDetail',
        params: {
          type: type,
          ...row,
        },
      })
    },

    toRole(row) {
      this.roleVisible = true
    },

    setPwd(row) {
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm(`确定取消本次认证？`, '取消认证', {
        confirmButtonText: '取消认证',
        cancelButtonText: '暂不取消',
        type: 'error'
      })
			.then(()=>{
				row.status = 'canceled'

				this.$api.doctor.upStatus(row.id,row)
					.then((res) => {
						this.$message.success('取消认证成功')
						this.getDataFunc()
					})
					.catch((err) => {
						this.$message.error(JSON.stringify(err))
					})

			})
    },
  }
}
</script>

<style scoped lang="less">

.m-table {
  height: calc(100% - 110px);

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
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

</style>
