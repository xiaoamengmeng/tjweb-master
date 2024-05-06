// 干预方案
export default {
  data() {
    return {
      solutionData: [],
      solutionTotal: 0,
      solutionPageSize: 10,
      solutionPage: 1,
    }
  },
  methods: {
    initSolutionData() {
      this.getPpIntervs()
    },
    getPpIntervs() {
      const table = this.$refs.patientSolutionTable
      if(table) {
        table.loadStart()
      }
      this.$api.ppIntervs.getList({
        page: this.solutionPage,
        page_size: this.solutionPageSize,
        ordering:'id',
        project_patient_id: this.ppInfo.id
      })
        .then((res) => {
          this.solutionData = res.data.results
          this.solutionTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetSolutionPage(type, row = {}) {
      this.$router.push({
        name: 'PatientSetSolution',
        params: {
          type: type,
          ppid: this.ppid,
          projectId: this.project.id,
          intervsId: row.id,
          userId: this.userId,
          stage: this.ppInfo.stage
        }
      })
    },
    deletePatientSolution(row) {
      this.$confirm(`确定患者方案【${row.name}】吗？`, '删除方案', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.ppIntervs.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getPpIntervs()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    }
  }, // methods end
}
