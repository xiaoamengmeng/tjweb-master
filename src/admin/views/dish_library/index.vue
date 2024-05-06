<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 菜品库 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button v-auth="'dishLibrary.create'" class="common-add-btn" icon="el-icon-plus" @click="toSetPage('create')">新建</m-button>

        <el-form class="form-box" :model="form" ref="form" label-position="top">
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">对应食材</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select v-model="form.food_type" placeholder="全部" clearable>
                      <el-option v-for="statu in foodTypeInfos" :key="statu.alltypeid" :label="statu.foodtypename" :value="statu.alltypeid"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t" style="color: transparent">食材名称</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select v-model="form.food_id" placeholder="全部" clearable>
                      <el-option v-for="statu in foodInfos" :key="statu.foodid" :label="statu.foodname" :value="statu.foodid"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">菜品名称</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input v-model="form.search" placeholder="请输入搜索内容" clearable></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
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
          <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="50"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="菜品名称" min-width="90"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="food" label="对应食材" min-width="90">
            <template v-slot="scope">
              <span v-if="scope.row.food">{{ scope.row.food.foodcommonname }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="contact_details" label="图片" min-width="60">
            <template v-slot="scope">
              <el-image :src="scope.row.image" style="width: auto; height: 60px" fit="cover" :preview-src-list="[scope.row.image]"></el-image>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="calories" label="100克/毫升含热量（千卡）" min-width="160" align="center"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="meal_type_id" label="餐段" min-width="160" align="center">
            <template v-slot="scope">
              <span>{{ showMealType(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="creator" label="创建人" min-width="60">
            <template v-slot="scope">
              <span v-if="scope.row.creator">{{ scope.row.creator.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.created_at | dateFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" min-width="100">
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link v-auth="'dishLibrary.update'" @click.native="changeInfoClick(scope.row)">修改</el-link>
                <span class="inline_block mr_10"></span>
                <el-link v-auth="'dishLibrary.delete'" @click.native="deleteClick(scope.row)">删除</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :modal="true" class="calc-dialog">
      <el-form class="form-box" :model="dishForm" :rules="dishRules" ref="dishForm" label-width="100" label-position="left">
        <el-form-item label=" 对应食材 " prop="food_id" class="mt_20">
          <el-select v-model="dishForm.food_type" placeholder="请选择食材分类" clearable style="width: 155px">
            <el-option v-for="statu in foodTypeInfos" :key="statu.alltypeid" :label="statu.foodtypename" :value="statu.alltypeid"></el-option>
          </el-select>
          <el-select v-model="dishForm.food_id" placeholder="请选择食材名称" clearable style="width: 155px; margin-left: 10px">
            <el-option v-for="statu in selectFoodInfos" :key="statu.foodid" :label="statu.foodname" :value="statu.foodid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 菜品名称 " prop="name" class="mt_20">
          <el-input v-model="dishForm.name" type="text" placeholder="请输入菜品名称" class="" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label=" 热量（千卡） " prop="calories" class="mt_20">
          <el-input v-model="dishForm.calories" type="text" placeholder="请输入100克/毫升菜品所含热量" class="" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label=" 餐段 " prop="meal_type_id" class="mt_20">
          <el-select v-model="dishForm.meal_type_id" placeholder="请选择菜品所对应餐段，可多选" multiple clearable style="width: 320px">
            <el-option v-for="statu in recipeData" :key="statu.value" :label="statu.label" :value="statu.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 图片 " prop="image_path" class="mt_20">
          <!-- <el-input v-model="dishForm.image_path" type="text" placeholder="菜品分类"
                    class=""
                    style="width: 320px;"></el-input> -->
          <div class="add-image-content">
            <div class="image-wrapper" style="position: relative" v-if="fileList.length == 1">
              <el-image style="min-height: 100px; max-height: 100px; max-width: 100px" :src="fileList[0].url" :preview-src-list="[fileList[0].url]" />
              <i @click="handleRemove" class="close-btn el-icon-close"></i>
            </div>
            <el-upload accept=".jpg,.jpeg,.png" action="#" :file-list="fileList" :auto-upload="false" :on-change="handleChange" :show-file-list="false">
              <div v-if="fileList.length == 0" class="add-image">
                <el-button size="small" type="info" plain>选择文件</el-button>
                <div style="color: #566085; margin-left: 10px">未选择任何文件</div>
              </div>
              <div class="add-image-select" v-else>
                <m-button style="margin-left: 10px" plain>重新上传</m-button>
              </div>
            </el-upload>
          </div>
          <div style="color: #999999; margin-left: 110px">支持jpg、jpeg、png格式，大小不超过500K</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button w="80px" @click="save">保 存</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DishLibrary',
  components: {},
  watch: {
    'form.food_type'(n) {
      this.form.food_id = ''
      if (n) {
        this.getFoodInfos()
      } else {
        this.foodInfos = []
      }
    },
    'dishForm.food_type'(n) {
      this.dishForm.food_id = ''
      if (n) {
        this.getSelectFoodInfos()
      } else {
        this.selectFoodInfos = []
      }
    },
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        food_type: '',
        food_id: '',
        search: '',
      },
      loading: false,
      organizations: [],
      dialogTitle: '添加菜品',
      dialogVisible: false,
      dishes: {},
      dishForm: {
        name: '',
        image_path: '',
        // category_id: '',
        food_type: '',
        food_id: '',
        calories: '',
        meal_type_id: '',
      },
      dishRules: {
        name: [{ required: true, message: '请填写菜品名称', trigger: 'change' }],
        food_id: [{ required: true, message: '请选择对用食材', trigger: 'change' }],
        // category_id: [{ required: true, message: '请选择菜品分类', trigger: 'change' }],
        calories: [{ required: true, message: '请输入热量（千卡）', trigger: 'change' }],
        image_path: [{ required: true, message: '请选择图片', trigger: 'change' }],
        meal_type_id: [{ required: true, message: '请选择餐段', trigger: 'change' }],
      },

      dishesCategories: [],
      dishesCategoriesTotal: 0,
      dishesCategoriesPage: 1,
      dishesCategoriesPageSize: 9999,

      foodTypeInfos: [],
      foodTypeInfosTotal: 0,
      foodTypeInfosPage: 1,
      foodTypeInfosPageSize: 9999,

      foodInfos: [],
      foodInfosTotal: 0,
      foodInfosPage: 1,
      foodInfosPageSize: 9999,

      selectFoodInfos: [],
      selectFoodInfosTotal: 0,
      selectFoodInfosPage: 1,
      selectFoodInfosPageSize: 9999,

      fileList: [],
      recipeData: [
        {
          value: 1,
          label: '早餐',
        },
        {
          value: 2,
          label: '午餐',
        },
        {
          value: 3,
          label: '加餐',
        },
        {
          value: 4,
          label: '晚餐',
        },
      ],
    }
  },
  created() {
    console.log('recipeData', this.recipeData)
  },
  mounted() {
    this.getFoodTypeInfos()
    // this.getFoodInfos()
    this.getDataFunc()
  },
  methods: {
    showMealType(data) {
      return data.meal_type.map((v) => v.name).join('、')
    },
    getFoodTypeInfos() {
      this.$api.foodTypeInfo
        .getList({
          // page: this.foodTypeInfosPage,
          // page_size: this.foodTypeInfosPageSize,
        })
        .then((res) => {
          this.foodTypeInfos = res.data
          // this.foodTypeInfosTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getFoodInfos() {
      const item = this.foodTypeInfos.find((ele) => ele.alltypeid == this.form.food_type)
      this.$api.foodInfo
        .getList({
          // page: this.foodInfosPage,
          // page_size: this.foodInfosPageSize,
          // food_one_type_name: item.foodtypename,
          alltypeid: item.alltypeid,
        })
        .then((res) => {
          this.foodInfos = res.data
          // this.foodInfosTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getSelectFoodInfos(callback) {
      const item = this.foodTypeInfos.find((ele) => ele.alltypeid == this.dishForm.food_type)
      this.$api.foodInfo
        .getList({
          // page: this.selectFoodInfosPage,
          // page_size: this.selectFoodInfosPageSize,
          // food_one_type_name: item.foodtypename,
          alltypeid: item.alltypeid,
        })
        .then((res) => {
          this.selectFoodInfos = res.data
          // this.selectFoodInfosTotal = res.data.count
          callback && callback()
        })
        .catch((err) => {
          callback && callback()
          this.$message.error(JSON.stringify(err))
        })
    },
    getDishesCategories() {
      this.$api.dishesCategories
        .getList({
          page: this.dishesCategoriesPage,
          page_size: this.dishesCategoriesPageSize,
        })
        .then((res) => {
          this.dishesCategories = res.data.results
          this.dishesCategoriesTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.dishes
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: '-id',
          food_type: this.form.food_type,
          food_id: this.form.food_id,
          search: this.form.search,
        })
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
    toSetPage() {
      this.dishForm = {
        name: '',
        image_path: '',
        // category_id: '',
        food_type: '',
        food_id: '',
        calories: '',
        meal_type_id: '',
      }
      this.fileList = []
      this.dishes = {}
      this.dialogTitle = '添加菜品'
      this.dialogVisible = true
      setTimeout(() => {
        this.$refs['dishForm'].clearValidate()
      }, 200)
    },

    processHandle(progressData, uploadKey) {
      if (progressData.percent === 1) {
        const image_path = uploadKey.path_list[0]
        this.dishForm.image_path = image_path
        if (!this.dishes.id) {
          this.create()
        } else {
          this.update()
        }
      }
    },

    uploadFile() {
      this.$cos
        .uploadFile(this.fileList, this.processHandle)
        .then((res) => {})
        .catch((err) => {
          this.$message.error('上传图片失败')
        })
    },

    save() {
      // if (!this.dishes.id) {
      //   this.uploadFile()
      // } else {
      // 判断一下是否是更换了图片
      if (this.fileList.length > 0 && this.fileList[0].url != this.dishes.image) {
        this.uploadFile()
      } else {
        this.$refs['dishForm'].validate((valid) => {
          if (valid) {
            if (!this.dishes.id) {
              this.create()
            } else {
              this.update()
            }
          } else {
            return false
          }
        })
      }
      // }
    },
    create() {
      const params = { ...this.dishForm }
      this.$api.dishes
        .create(params)
        .then((res) => {
          this.$message.success('新增菜品成功')
          this.dialogVisible = false
          this.getDataFunc()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map((item) => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    update() {
      const params = { ...this.dishForm }
      params.calories = parseInt(params.calories)
      this.$api.dishes
        .update(this.dishes.id, params)
        .then((res) => {
          this.$message.success('修改成功')
          this.dialogVisible = false
          this.getDataFunc()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    changeInfoClick(row) {
      this.dishForm = {
        name: row.name,
        image_path: row.image_path,
        // category_id: row.category.id,
        food_type: row.food.alltypeid.split('.')[0],
        food_id: row.food.foodid,
        calories: row.calories,
        meal_type_id: row.meal_type.map((v) => v.id),
      }
      this.fileList = [
        {
          url: row.image,
        },
      ]
      this.dishes = row
      this.dialogTitle = '修改菜品'
      this.getSelectFoodInfos(() => {
        this.dishForm.food_id = row.food.foodid
        setTimeout(() => {
          this.dialogVisible = true
        }, 500)
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除菜品吗？`, '删除菜品', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      }).then(() => {
        this.$api.dishes
          .delete(row.id)
          .then((res) => {
            this.$message.success('删除成功')
            this.getDataFunc()
          })
          .catch((err) => {
            if (err.code === 'protected_error') {
              this.$message.error('删除失败，账号受到保护，无法删除')
            } else {
              this.$message.error(JSON.stringify(err))
            }
          })
      })
    },

    handleChange(file, fileList) {
      if (!file.url) {
        file.url = URL.createObjectURL(file.raw)
      }
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },

    handleRemove() {
      this.fileList = []
      this.dishForm.image_path = ''
    },

    // 上传前的限制
    handleBeforeUpload(file) {
      console.log('====================================')
      console.log(file.size / 1024)
      console.log('====================================')
      const isJPG = file.type === 'image/jpg'
      const isPng = file.type === 'image/png'
      const isJpeg = file.type === 'image/jpeg'
      const is500KB = file.size / 1024 < 500
      // //限制文件上传类型
      // if (!isJPG && !isPng && !isJpeg) {
      //   this.$message.error("上传图片只能是 png,jpg,jpeg 格式!");
      //   return false
      // }

      //  //限制文件上传大小
      // if (!is10M) {
      //   this.$message.error("上传图片大小不能超过 10MB!");
      //   return false
      // }

      return true
    },
  },
}
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 50px);
}

.calc-dialog {
  :deep(.el-dialog) {
    height: 630px;

    .el-form-item__label {
      width: 110px;
    }
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

.form-box {
  .add-image-content {
    display: flex;
    flex-direction: row;
    align-items: center;

    .add-image {
      width: 306px;
      height: 48px;
      border: 1px solid #d9e1ec !important;
      border-radius: 12px !important;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 12px;

      // .el-button {
      //     background: ;
      // }
    }

    .add-image-select {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .add-image-delete {
      position: absolute;
      top: 0;
      right: 0;
      color: #ffffff;
    }
  }

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

  .close-btn {
    display: none;
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 11;
    cursor: pointer;
    font-weight: bold;
    padding: 4px;
    color: #fff;
    background-color: #000;
    opacity: 0.3;
    border-radius: 50%;
    font-size: 12px;
  }

  .image-wrapper:hover .close-btn {
    //visibility: visible;
    display: block;
  }
}
</style>
