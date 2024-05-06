<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/food_calorie'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>食物热量表</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="card-title">
        {{ title }}
      </div>
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="right"
        label-width="180px"
      >
        <el-row>
          <el-form-item label="图片" prop="image_path">
            <m-upload
              class="upload-box"
              :file-list.sync="uploadFile.fileList"
              :image-url.sync="imgSrc"
              :image-path.sync="form.image_path"
              accept=".jpg,.jpeg,.png,.gif"
              success-tips="上传图片成功"
              :readonly="isViewMode"
            ></m-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="菜品" prop="name">
            <el-input :readonly="isViewMode" v-model="form.name" placeholder="请输入菜品名称" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="菜品分类" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="全部"
              clearable
              :disabled="isViewMode"
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
        <el-row>
          <el-form-item label="每单位碳水化合物（g）">
            <el-input :readonly="isViewMode" v-model="form.carbohydrate" placeholder="请输入" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每单位脂肪（g）">
            <el-input :readonly="isViewMode" v-model="form.fat" placeholder="请输入" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每单位蛋白质（g）">
            <el-input :readonly="isViewMode" v-model="form.protein" placeholder="请输入" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每一百克热量" prop="calories">
            <el-input
              :readonly="isViewMode"
              v-model="form.calories"
              placeholder="请输入"
              clearable
              style="width: 450px;"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-form-item>
          <m-button v-show="type !== 'view'" @click="save">保存</m-button>
          <m-button plain @click="leavePage">返回</m-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('SetDish', true)

export default {
  name: 'SetDish',
  data() {
    const isInteger = (val) => {
      return /^\d+$/.test(val)
    }
    const validCalories = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入热量'))
      }
      if (!isInteger(value)) {
        callback(new Error('热量只能输入整数'))
      }
      callback()
    }
    const validImage = (rule, value, callback) => {
      if (this.type === 'create' && this.form.image_path === '') {
        callback(new Error('请上传菜品图片'))
      }
      if (this.type === 'edit' && this.imgSrc === '') {
        callback(new Error('请上传菜品图片'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '添加菜品',
      form: {
        name: '',
        image_path: '',
        category_id: '',
        calories: null, // 热量（每 100g）
        protein: null, // 蛋白质(g）
        fat: null, // 脂肪(g)
        carbohydrate: null, // 碳水化合物(g)
      },
      uploadFile: {
        fileList: [],
        action: ''
      },
      dishInfo: {},
      rules: {
        name: [
          { required: true, message: '请输入菜品名称', trigger: 'change' },
        ],
        category_id: [
          { required: true, message: '请选择菜品分类', trigger: 'change' },
        ],
        calories: [
          { required: true, validator: validCalories, trigger: 'change' },
        ],
        image_path: [
          { required: true, validator: validImage, message: '请上传菜品图片', trigger: 'blur' },
        ],
      },
      imgSrc: '',
      category: [],
    }
  },
  mounted() {
    this.initForm()
    this.getCategoryList()
  },
  methods: {
    initForm() {
      const params = this.$route.params

      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', { type: params.type, id: params.id})
      }

      this.type = data.type || 'create'
      if (this.type === 'create') {
        this.title = '添加菜品'
      } else if (this.type === 'edit') {
        this.title = '编辑菜品'
      } else {
        this.title = '菜品详情'
      }

      if (this.type === 'create') {
        Object.assign(this.$data.form, this.$options.data().form)
      } else {
        this.$api.food.getDetail(data.id)
          .then((res) => {
            this.dishInfo = this.$clone(res.data)
            this.form.compareAssign(res.data)
            this.imgSrc = res.data.image
            this.form.image_path = res.data.image_path
            this.form.category_id = res.data.category.id
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
          })
      }
    },
    getCategoryList() {
      this.$api.foodCategories.getList({}).then((res) => {
        this.category = res.data.results
      })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.create()
          } else {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    create() {
      this.$api.food.create(this.form)
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(err.detail)
          }
        })
    },
    update() {
      this.$api.food.update(this.dishInfo.id, this.form)
        .then(res => {
          this.$message.success('修改成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(err.list.map(item => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },
    leavePage() {
      this.$router.go(-1)
    }
  }, // methods end
  computed: {
    isViewMode() {
      return this.type === 'view'
    }
  },
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

.form-box {
  width: 800px;

  .el-form-item {
    width: 100%;

    .el-input {
      width: 100%;
    }

    //.el-select {
    //  width: 100%;
    //}
  }
}

.upload-box {
  height: 150px;
  width: 200px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}
</style>
