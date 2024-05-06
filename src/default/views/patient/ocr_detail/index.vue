<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/patient'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: `/patient_detail/${ppid}?views=5`}">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card" v-loading="loading">

      <div class="patient-info">
        <div class="base">
          <div class="avatar">
            <el-avatar fit="cover" :size="62" :src="ppInfo.patient.avatar_url"></el-avatar>
          </div>
          <div class="name">{{ ppInfo.patient.name }}</div>
          <div class="sex">
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.M"
              icon-name="sex_male" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.F"
              icon-name="sex_female" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
          </div>
          <div class="tag age">{{ ppInfo.patient.user_profile.birthday | calcAge }}岁</div>
          <div v-if="ppInfo.stage" class="tag stage">{{ ppInfo.stage }}</div>
          <div class="tag id">No.{{ ppInfo.patient.user_id }}</div>

        </div>
        <div class="base2">
          <div class="item">手机号：{{ ppInfo.patient.phone_number }}</div>
          <div class="item">身份证：{{ ppInfo.patient.id_number }}</div>
          <div class="item">出生日期：{{ ppInfo.patient.user_profile.birthday | dateFormatCN }}</div>
        </div>
        <div class="tags">
          <span>患者标签：</span>
          <span v-if="ppInfo.patient.tags && ppInfo.patient.tags.length === 0">暂无</span>
          <template v-else>
          <span
            class="tag mr_8"
            v-for="tag in ppInfo.patient.tags"
            :key="tag.id"
          >#{{ tag.name }}</span>
          </template>
        </div>
      </div>

      <div class="time-info">
        <div>
          上传时间：
          <span>{{recordData.created_at|dateFormat}}</span>
        </div>
      </div>

      <div class="img-show mt_20 mb_20">
        <h4>报告图片：</h4>
        <el-image v-for="image in recordData.images"
          :key="image.id"
          style="width: 100px; height: 100px; margin-right: 10px;margin-bottom:10px;"
          :src="image.image"
          :preview-src-list="recordData.images.map(image=>image.image)"
          fit="cover"
        >
        </el-image>
      </div>
      <template v-for="formItem in forms">
        <div class="record-wrap" :key="formItem.info.id">
          <div class="list-title all-border">
            <span class="mr_10">({{formItem.info.id+1}}).病历分类</span>
            <el-select
              v-model="formItem.record_type"
              placeholder="请选择"
              clearable
              @clear="onClear(formItem.info.id)"
              style="width: 200px;"
              class="mr_20"
            >
              <el-option
                v-for="item in templates"
                :key="item.record_type"
                :value="item.record_type"
                :label="item.record_type | medicalType"
                @click.native="formTypeChange(item,formItem.info.id)"
              >
              <span>
                {{ item.record_type | medicalType }}
              </span>
              </el-option>
            </el-select>
            <span class="mr_10">入院日期</span>
            <el-date-picker
              v-model="formItem.record_date"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            <m-button class="ml_30" w="80px" h="40px" @click="deleteClick(formItem.info.id)">删 除</m-button>
            <m-button class="ml_30" h="40px" @click="viewRawData(formItem)">查看原始解析数据</m-button>
            <el-image v-if="getImageOfFormItem(formItem)!=''"
              style="width: 50px; height: 50px;right: 20px;position: absolute;top: 15px;"
              :src="getImageOfFormItem(formItem)"
              :preview-src-list="[getImageOfFormItem(formItem)]"
              fit="cover">
            </el-image>
          </div>
          <div class="parse-content mt_20">
            <el-row :gutter="10">
              <el-col :span="formItem.info.showRawData?16:24" style="transition: width .1s;">
                <el-descriptions title="" :column="1" border>
                  <el-descriptions-item>
                    <template slot="label">
                      <span class="fontsize_16 font_bold">
                        解析字段
                      </span>
                    </template>
                    <span class="fontsize_16 font_bold">人工审录结果</span>
                  </el-descriptions-item>
                  <el-descriptions-item v-for="itemData in formItem.data" :key="itemData.label">
                    <template slot="label">
                      {{itemData.label}}
                    </template>
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="itemData.value" placeholder="请输入修改内容"></el-input>
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
              <el-col :span="8" v-if="formItem.info.showRawData">
                <!-- <el-input type="textarea" v-model="rawData" :autosize="{ minRows: 2, maxRows: 20}"></el-input> -->
                <div class="raw-data">
                  <div class="header">原始解析数据</div>
                  <div class="content" v-if="recordData.images[formItem.info.id]">{{recordData.images[formItem.info.id].ocr_raw_data.join('\n')}}</div>
                  <div class="content" v-else>无</div>
                </div>
              </el-col>
            </el-row>

          </div>
        </div>
      </template>
      <m-button class="mt_20" w="100px" h="40px" icon="el-icon-plus" @click="addClick">新 增</m-button>
      <div class="pull-right">
        <m-button class="mt_20" w="80px" h="40px" type="default" @click="$router.go(-1)">返 回</m-button>
        <m-button class="mt_20" w="120px" h="40px" :loading="submitLoading" @click="submitClick">提交审录</m-button>
      </div>
    </div>
    <el-dialog
      class="ocr-dialog"
      title="原始解析数据"
      width="70vw"
      height="600px"
      :visible.sync="ocrDialogVisible"
    >
      <el-input type="textarea" v-model="rawData" :autosize="{ minRows: 2, maxRows: 20}"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button class="m-button" type="default" @click="ocrDialogVisible = false"
                   style="width: 100px;">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('OcrDetail', true)

export default {
  name: 'OcrDetail',
  data() {
    return {
      type: 'proof',
      title: '报告审录',
      loading: true,
      submitLoading:false,
      ppid: '', // 项目患者id
      userId: '', // 患者id
      recordId:'', //上传记录的id
      ocrDialogVisible:false,
      ppInfo: {
        project: {},
        patient: {
          user_profile: {}
        },
      },
      rawData:'',
      forms:[],
      templates:[],  //病历模板
      recordData: {},
      total: 0,
      pageSize: 10,
      page: 1,
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
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', {
          type: params.type,
          stage: params.stage,
          ppid: params.ppid,
          userId: params.userId,
          recordId: params.recordId
        })
      }

      this.ppid = data.ppid
      this.userId = data.userId
      this.recordId = data.recordId
      this.type = data.type || 'proof'
      this.title = data.type === 'proof' ? '报告审录' : '查看审录'

      this.getPpInfo()
      this.getMedicalTemplates()
    },
    getPpInfo() {
      this.loading = true
      this.$api.myProjectPatient.getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.loading = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getMedicalRecordUploads(){
      this.$api.medicalRecordUploads.getDetail(this.recordId).then(res=>{
        this.recordData = res.data
        if(this.type=='proof'){
          this.recordData.images.forEach((item,index)=>{
            let dict = {
              info:{id:index,showRawData:false,height:''},
              images:[item.id],
              record_type:item.ocr_image_type=='others'?'':item.ocr_image_type,
              record_date:null,
              data:[]
            }
            if(this.recordData.medical_records.length>0){
              let tgrRecord = this.recordData.medical_records.find(record=>record.images[0]==item.id)
              if(tgrRecord){
                dict.record_type = tgrRecord.record_type
                dict.data = tgrRecord.data
              }
            }
            this.forms.push(dict)
            if(dict.record_type!=''){
              let recordItem = this.templates.find(item=>item.record_type==dict.record_type)
              if(recordItem) this.formTypeChange(recordItem,dict.info.id)
            }
          })
        }else{
          this.recordData.medical_records.forEach((item,index)=>{
            let dict = {
              info:{id:index,showRawData:false,height:''},
              images:item.images,
              record_type:item.record_type,
              record_date:this.$Day(item.created_at).format('YYYY-MM-DD'),
              data:item.data
            }
            this.forms.push(dict)
          })
        }
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    getMedicalTemplates(){
      this.$api.medicalRecordTemps.getList({
        page: 1,
        page_size: 99
      }).then((res) => {
        this.templates = res.data.results
        this.getMedicalRecordUploads()
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    formTypeChange(item,index){
      let form = this.forms.find(item=>item.info.id==index)
      form.data = []
      let tgrImage = this.recordData.images[index]

      item.fields.forEach(field=>{
        let tgr = tgrImage&&tgrImage.ocr_result?tgrImage.ocr_result.find(image=>image.label==field):undefined
        if(tgr){
          if(tgr.value instanceof Array)
            form.data.push({label:field,value:tgr.value.toString()})
          else
            form.data.push({label:field,value:tgr.value})
        }else{
            form.data.push({label:field,value:''})
        }
      })
    },
    viewRawData(formItem){
      formItem.info.showRawData = !formItem.info.showRawData
    },
    addClick(){
      let dict = {
        info:{id:this.forms.concat().pop().info.id+1,showRawData:false,height:''},
        images:[],
        record_type:'',
        record_date:null,
        data:[]
      }
      this.forms.push(dict)
    },
    onClear(index){
      let formItem = this.forms.find(form=>form.info.id==index)
      formItem.data = []
    },
    getImageOfFormItem(formItem){
      let image = this.recordData.images.find(item=>item.id==formItem.images[0])
      if(image) return image.image
      else return ''
    },
    deleteClick(id){
      this.$confirm('确认删除该条解析记录么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let index = this.forms.findIndex(item=>item.info.id===id)
          if(index!=-1) this.forms.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {});
    },
    submitClick(){
      if(this.forms.some(form=>{
        if(form.record_type=='') return true
      })) return this.$message.warning('病历分类不能为空')
      this.$confirm('确认提交审录么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitLoading = true
          let forms = JSON.parse(JSON.stringify(this.forms))
          forms.forEach(item=>{delete item.info})
          let dict = {
            status:'approved',
            medical_records:[...forms]
          }
          this.$api.medicalRecordUploads.patch(this.recordId,dict).then(res=>{
            // console.log(res)
            this.$message.success('提交成功')
          }).catch(err=>{
            this.$message.error(err)
          }).finally(()=>{this.submitLoading = false})
        }).catch(() => {});
    }
  }, // methods end
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
  }
}
.record-wrap{
  border-bottom:1px dashed #eee;
  padding-bottom:10px;
  margin-bottom:10px;
}
.patient-info {
  width: 100%;

  .base {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    margin-bottom: 22px;

    .name {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: #344563;
      line-height: 28px;
      margin-left: 16px;
    }

    .sex {
      margin-left: 8px;
    }

    .tag {
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #D9E1EC;
      font-size: 12px;
      font-weight: 600;
      color: #1E242C;
      margin-left: 4px;
    }

    .tag.age {
      min-width: 42px;
    }

    .tag.stage {
      min-width: 52px;
    }

    .tag.id {
      min-width: 76px;
    }

    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .font-mixin {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5A607F;
    line-height: 20px;
  }

  .base2 {
    display: flex;
    margin-bottom: 22px;

    .item {
      .font-mixin();
      margin-right: 38px;
    }

  }

  .tags {
    .font-mixin();

    .tag {
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #D9E1EC;
      padding: 4px 8px;
    }

    margin-bottom: 32px;
  }
}

.list-title {
  border: 1px solid #D9E1EC;
  border-bottom: unset;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 20px 0 20px 20px;
  margin: 0 !important;
  margin-top: 30px !important;
  background-color: #f4f5fa;
}

.list-title.all-border {
  border: 1px solid #D9E1EC;
  border-radius: 8px;
  margin-top: 0 !important;
}
:deep(.el-descriptions-row .el-input__inner) {
  border: none !important;
  border-radius: 0;
  //background-color: #f4f5fa !important;
  background-color: #fff;
}
.ocr-dialog {
  :deep(.el-dialog) {
    height: 600px;
  }
}
.raw-data{
  height:70vh;
  border: 1px solid #D9E1EC;
  border-radius: 12px;
  overflow: hidden;
  .header{
    font-size:16px;
    font-weight: bold;
    color:@textColor;
    background: #F4F5FA;
    padding:13px 10px;
    border-bottom: 1px solid #D9E1EC;
  }
  .content{
    height:calc(70vh - 68px);
    overflow:hidden auto;
    word-break: break-all;
    white-space: pre-wrap;
    color:#666;
    font-size:14px;
    padding:10px;
  }
}
</style>
