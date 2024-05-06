<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/doctor/details'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>医生详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <b>患者列表</b>
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
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">标题</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.name"
                      placeholder="请输入姓名"
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>


              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">电话</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.phone_number"
                      placeholder="请输入电话"
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>


              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">性别</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.sex"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        :label="'男'"
                        value="M"
                      ></el-option>
                      <el-option
                        :label="'女'"
                        value="F"
                      ></el-option>
											<el-option
											  :label="'未知'"
											  value="U"
											></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="10">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button @click="getDataFunc" icon="el-icon-search" h="40px" w="100px">搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
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
            prop="user_id"
            label="ID"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名"
            min-width="100"
          >
          </el-table-column>
					<el-table-column
					  show-overflow-tooltip
					  prop="phone_number"
					  label="联系电话"
					  min-width="100"
					>
					</el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sex"
            label="性别"
            min-width="100"
          >
						<template slot-scope="scope">
							<span v-if="scope.row.sex === 'M'">男</span>
							<span v-else-if="scope.row.sex === 'F'">女</span>
							<span v-else>未知</span>
						</template>
          </el-table-column>
          <el-table-column
            prop=""
            label="年龄"
            min-width="120"
          >
						<template slot-scope="scope">
							<span v-if="scope.row.user_profile">{{scope.row.user_profile.birthday | calcAge}}</span>
						</template>

          </el-table-column>

          <!-- <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            min-width="100"
          >
          </el-table-column> -->
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'KnowledgeCard',
  components: {

  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        name: '',
        sex: '',
				ordering: '',
				phone_number: ''
      },
      rules: {},

    }
  },
	mounted() {
		this.getDataFunc()
	},
  methods: {
    getDataFunc() {
			this.$api.patients.getList({
				page: this.page,
				page_size: this.pageSize,
				ordering: this.form.ordering,
				name: this.form.name,
				status: this.form.status,
				phone_number: this.form.phone_number,
				sex: this.form.sex
			})
			  .then((res) => {
					this.tableData = res.data.results
					this.total = res.data.count
			  })
			  .catch((err) => {
			    this.$message.error(JSON.stringify(err))
			  })
    },

  }, // methods end
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

.creation-dialog {
  :deep(.el-dialog) {
    width: 1080px;
    height: 860px;
    margin-top: 5vh !important;

  }
}

.creation-box {
  .card-editor {
    height: 320px;

    .left {
      width: 220px;

      .card-box {
        width: 180px;
        height: 240px;
        margin: 0 auto;
      }

      .el-button {
        display: block;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
  }
}

.sec-title {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: #5A6D86 !important;
}

.image-card-dialog {
  :deep(.el-dialog) {
    width: 900px;
    height: 560px;
  }
  .img-card-row {
    width: 100%;
    height: 200px;
    background-color: red;
    .img-card-upload {

    }
    .img-card-row {

    }
  }
}
</style>
