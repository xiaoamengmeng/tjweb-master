<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/food_calorie'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>审核详情</b>
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
        label-position="top"
      >

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">UUID：{{form.id}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">医生状态：{{form.status | doctorStatus}}</div>
            </div>
          </el-col>
        </el-row>


        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">昵称：{{form.user}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">姓名：{{form.name}}</div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">医院：{{form.hospital}}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple base2">
              <div class="item">职称：{{form.title | titleFilter}}</div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="头像（个人照片）：">
              <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :image-url.sync="imgSrc"
							 :readonly="true" :image-path.sync.sync="form.photo_path"></m-upload>
              <span v-if="type === 'edit'" style="color: #5A607F; font-size: 14px;">参考尺寸342*228；支持jpeg/png/gif格式</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="医师资格证书：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload> -->
							<template v-for="item in verificationData.verification_images">
								<el-image 
									v-if="item.license_type === 'ZGZ'"
									:key="item.id"
									style="width: 150px; height: 150px;margin-right: 10px;"
									:src="item.image" 
									fit="contain"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
									<div slot="placeholder" class="image-slot">
										加载中<span class="dot">...</span>
									</div>
								</el-image>
							</template>
              
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="医师执业证书：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload> -->
							<template v-for="item in verificationData.verification_images">
								<el-image 
									v-if="item.license_type === 'ZYZ'"
									:key="item.id"
									style="width: 150px; height: 150px;margin-right: 10px;"
									:src="item.image" 
									fit="contain"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
									<div slot="placeholder" class="image-slot">
										加载中<span class="dot">...</span>
									</div>
								</el-image>
							</template>
              
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="胸牌：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload> -->
							<template v-for="item in verificationData.verification_images">
								<el-image 
									v-if="item.license_type === 'XP'"
									:key="item.id"
									style="width: 150px; height: 150px;margin-right: 10px;"
									:src="item.image" 
									fit="contain"
								>
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline"></i>
									</div>
									<div slot="placeholder" class="image-slot">
										加载中<span class="dot">...</span>
									</div>
								</el-image>
							</template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="专业技术资格证（职称证）：">
              <!-- <m-upload class="upload-box" :file-list.sync="uploadFile.fileList" :logoSrc="imgSrc"></m-upload>-->
							<div v-if="type === 'examine'">
								<template v-for="item in verificationData.verification_images">
									<el-image 
										v-if="item.license_type === 'ZYJS'"
										:key="item.id"
										style="width: 150px; height: 150px;margin-right: 10px;"
										:src="item.image" 
										fit="contain"
									>
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline"></i>
										</div>
										<div slot="placeholder" class="image-slot">
											加载中<span class="dot">...</span>
										</div>
									</el-image>
								</template>
							</div>
							
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="审核结果" prop="result">
            <el-radio-group v-model="form.result" :disabled="type==='see'?true:false">
              <el-radio label="通过">通过</el-radio>
              <el-radio label="不通过">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
				
				<el-row v-if="form.result === '不通过'">
				  <el-form-item label="不通过原由" prop="reject_reason">
				    <el-input type="textarea" v-model="form.reject_reason" rows="4" clearable placeholder="填写原因" maxlength="50" style="width: 750px;"></el-input>
				  </el-form-item>
				</el-row>

        <el-form-item>
          <m-button v-if="type!=='see'" @click="save">保存</m-button>
          <m-button v-if="type==='see'" plain @click="$router.go(-1)">返回</m-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { PRODUCT, PROJECT_TYPE, STATUS_PROJECT, STATUS_USER, DOCTOR_AUTHENTICATION } from '@/common/utils/dict'

const dishSession = new LocalStore('setDish', true)

export default {
  name: 'ExamineDetail',
  data() {
    const validStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择项目开始时间'))
      }
      callback()
    }
    const validEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择项目结束时间'))
      }
      if (this.form.start_date && new Date(this.form.end_date) < new Date(this.form.start_date)) {
        callback(new Error('结束时间不能小于开始时间'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '新增菜品',
      form: {
        name: '',
        title: '',
        status: '',
        id: '',
        user: '',
        hospital: '',
				reject_reason: '',
				result: '',
				photo_path: ''
      },
      dishInfo: {},
      rules: {
				result: [{required: true, message: '请选择审核结果', trigger: 'blur'}],
				reject_reason: [{required: true, message: '请填写不通过原由', trigger: 'blur'}]
			},
      uploadFile: {
        fileList: [],
        action: ''
      },
      imgSrc: '',
      verificationData: [],
			ZYJS_Arr: [],
			XP_Arr: [],
			ZYZ_Arr: [], 
			ZGZ_Arr: [],
    }
  },
	filters:{
		doctorStatus(v){
			return v==='draft'?'草稿':v==='approved'?'审核通过':v==='pending'?'待审核':v==='rejected'?'审核未通过':'已取消'
		},
		titleFilter: function(v){
			const item = DOCTOR_AUTHENTICATION.find(ele => ele.code == v)
      return item ? item.label : '住院医师'
		}
	},
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      const params = this.$route.params

      let data = params
      if (Object.keys(params).length === 0) {
        const cache = dishSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        dishSession.set('cache', params)
      }

      this.dishInfo = data
      this.type = data.type || ''
      this.title = this.type === 'examine' ? '医生审核' : '医生详情'

      if (data.type === 'create') {
        return
      } else {
				this.$api.doctor.getVerDetail(data.id)
				  .then((res) => {
						this.verificationData = res.data
						this.imgSrc = res.data.photo;
						this.form.compareAssign(res.data)
						if(this.type === 'edit'){
							this.verificationData.verification_images.forEach(v=>{
								if(v.license_type === 'ZYJS'){
									this.ZYJS_Arr.push(v)
								}else if(v.license_type === 'XP'){
									this.XP_Arr.push(v)
								}else if(v.license_type === 'ZYZ'){
									this.ZYZ_Arr.push(v)
								}else{
									this.ZGZ_Arr.push(v)
								}
							})
						}
						if(this.verificationData.status==='approved') this.form.result = '通过'
						if(this.verificationData.status==='rejected') this.form.result = '不通过'
				  })
				  .catch((err) => {
				    this.$message.error(JSON.stringify(err))
				  })
			}
      
    },
		save() {
			this.$refs['form'].validate((valid) => {
			  if (valid) {
					let apiName = this.form.result === '通过' ? 'saveApprove' : 'saveReject'
					this.$api.doctor[apiName](this.dishInfo.id,{reject_reason: this.form.reject_reason})
					.then(res => {
						this.$message.success('审核成功')
						this.$router.push('/examine')
					})
					.catch((err) => {
						this.$message.error(JSON.stringify(err))
					})
			  } else {
			    return false
			  }
			})
		},
    off(row) {
      this.$confirm(`确定停用吗？`, '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
    },
  }, // methods end
  computed: {
    PRODUCT() {
      return PRODUCT
    },
    PROJECT_TYPE() {
      return PROJECT_TYPE
    },
    STATUS_PROJECT() {
      return STATUS_PROJECT
    },
    STATUS_USER() {
      return STATUS_USER
    }
  },
}
</script>

<style scoped lang="less">

.base2 {
  display: flex;
  margin-bottom: 22px;

  .item {
    .font-mixin();
    margin-right: 150px;
  }

}

.font-mixin {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #5A607F;
  line-height: 20px;
}

.panel .card {
  margin-top: 0 !important;
}

.form-box {
  width: 100%;
  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
}
.my-upload{
	width: auto;
	float: left;
	/deep/.el-upload{
		display: none;
	}
} 
.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}
.el-upload-list__item:hover .close-btn{
	position: absolute;
	display: block;
	cursor: pointer;
	font-weight: bold;
	padding: 4px;
	color: #fff;
	background-color: #000;
	opacity: .3;
	border-radius: 50%;
	font-size: 12px;
	z-index: 99999;
}

.image-slot {
	width: 100%;
	height: 100%;
	line-height: 150px;
	text-align: center;
	border: 1px dashed #d9d9d9;
	box-sizing: border-box;
}
</style>
