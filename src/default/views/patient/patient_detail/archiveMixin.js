// 健康档案
export default {
  data() {
    return {
      patientPhysicalData: {},
      patientPhysicalDataForm: {},
      physicalDataIsEditStatus: false,
      patientInfoRecords: [],
      patientInfoFields: [],
      scaleHistoryVisible:false,
    }
  },
  methods: {
    initArchiveData() {
      this.physicalDataIsEditStatus = false
      this.getPhysicalData()
      this.getPatientInfoRecords()
    },
    getPhysicalData() {
      this.$api.physicalData.get(this.userId)
        .then((res) => {
          this.patientPhysicalData = res.data
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    physicalDataSave() {
      const params = {
        ...this.patientPhysicalData,
      }
      const isInteger = (val) => {
        return /^\d+$/.test(val)
      }
      if (!params.height) {
        return this.$message.error('请填写身高')
      }
      if (!isInteger(params.height)) {
        return this.$message.error('身高只能输入整数')
      }
      if (!params.latest_weight) {
        return this.$message.error('请填写最新体重')
      }
      if (!isFinite(params.latest_weight)) {
        return this.$message.error('最新体重只能输入数字')
      }
      if (!params.waistline) {
        return this.$message.error('请填写腰围')
      }
      if (!params.initial_waistline) {
        return this.$message.error('请填写初始腰围')
      }
      if (!isFinite(params.waistline)) {
        return this.$message.error('腰围只能输入数字')
      }
      if (!params.initial_weight) {
        return this.$message.error('请填写初始体重')
      }
      if (!isFinite(params.initial_weight)) {
        return this.$message.error('初始体重只能输入数字')
      }
      if (!params.target_weight) {
        return this.$message.error('请填写目标体重')
      }
      if (!isFinite(params.target_weight)) {
        return this.$message.error('目标体重只能输入数字')
      }
      if (!isFinite(params.blood_sugar)) {
        return this.$message.error('血糖只能输入数字')
      }
      if (!isFinite(params.cal_weight)) {
        return this.$message.error('参与计算的初始体重只能输入数字，如不填写，则默认使用初始体重')
      }
      if ((~~params.bp_systolic != 0 && ~~params.bp_diastolic == 0) || (~~params.bp_systolic == 0 && ~~params.bp_diastolic != 0)) {
        return this.$message.error('提交血压数据，必须同时包含舒张压与收缩压')
      } else if ((~~params.bp_systolic != 0 && ~~params.bp_diastolic != 0) && (!isInteger(params.bp_systolic) || !isInteger(params.bp_diastolic))) {
        return this.$message.error('舒张压与收缩压只能输入整数')
      }
      if (params.bp_systolic == '') params.bp_systolic = null
      if (params.bp_diastolic == '') params.bp_diastolic = null

      if (params.cal_weight === '' || params === null) {
        params.cal_weight = params.initial_weight
      }

      this.$api.physicalData.update(this.userId, params)
        .then((res) => {
          this.patientPhysicalData = res.data
          this.physicalDataIsEditStatus = false
          this.$message.success('系统已保存您的更改')
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 患者生活习惯的答题记录
    getPatientInfoRecords() {
      this.$api.cfRecords.getList({
        creator_id: this.userId,
        form__form_type: 'patient_info',
      })
        .then((res) => {
          this.patientInfoRecords = res.data.results
          this.getPatientInfoRecordDetail()
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    getPatientInfoRecordDetail() {
      if (this.patientInfoRecords.length === 0) {
        this.patientInfoFields = []
      } else {
        const first = this.patientInfoRecords[0]
        this.$api.cfRecords.getDetail(first.id)
          .then((res) => {
            this.patientInfoFields = res.data.fields
          })
          .catch((err) => {
            this.$message.error(err)
          })
      }
    },
    getValueText(value) {
      if (value.length === 0) {
        return ''
      }
      let text = ''
      let last = value.length - 1
      value.forEach((item, index) => {
        if (index === last) {
          text += item
        } else {
          text += item + '、'
        }
      })
      return text
    },
    showScaleHistory(){
      this.scaleHistoryVisible = true
    },
    toDetailPage(row) {
      this.$router.push({
        name: 'ScaleDetail',
        query: {
          id:row.id,
          formId:row.form.id
        }
      })
    }

  }, // methods end
}
