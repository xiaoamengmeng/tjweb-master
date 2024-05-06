// 报告中心
export default {
  data() {
    return {
      reportPanes:[
        {label:'全部',name:'all'},
        {label:'门诊病历',name:'mzbl'},
        {label:'入院记录',name:'ryjl'},
        {label:'出院小结',name:'cyxj'},
        {label:'检查报告',name:'jcbg'},
        {label:'检验报告',name:'jybg'},
      ],
      reportActiveName: 'all',

      // 审录处理
      reviewTableData: [],
      reviewTotal: 0,
      reviewPageSize: 10,
      reviewPage: 1,
      ocrTableData: [
        {
          col1: '1',
          col2: '4',
          col3: '就诊病历',
          col4: '2022-09-09 09:33:44',

        },
      ],
      ocrTotal: 0,
      ocrPageSize: 10,
      ocrPage: 1,

      ocrListDialogVisible: false,
    }
  },
  mounted(){
  },
  methods: {
    reportTabsClick(val) {
      this.reviewTotal = 0
      this.reviewTableData = []
      this.getReportData()
    },
    getReportData(){
      if(this.$refs.reportTable) this.$refs.reportTable.loadStart()
      let params = {
        page:this.reviewPage,
        page_size:this.reviewPageSize,
        patient:this.patient.user_id
      }
      if(this.reportActiveName!='all') params.include_record_type = this.reportActiveName
      this.$api.medicalRecordUploads.getList(params).then(res=>{
        this.reviewTotal = res.data.count
        this.reviewTableData = res.data.results
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    recordTypes(arr){
      let strArr = []
      arr.forEach(element => {
        this.reportPanes.some(pane=>{
          if(pane.name==element){
            strArr.push(pane.label)
            return true
          }
        })
      });
      return strArr.join('、')
    }
  },
  computed: {
  },
}
