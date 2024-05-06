export default {
  data() {
    return {
      groupName: '群聊',
      createGroupVisible: false,
      createGroupName: '',
      selectedMembers: [],
      members: [],
      teamKeyword: '',
      userKeyword: '',
      teamSelectAll: false,
      userSelectAll: false,
      teamMemberLoading: true,
      userMemberLoading: true,
      teamMemberMe: {},
    }
  },
  watch: {
    createGroupVisible(visible) {
      if (!visible) {
        this.members = []
        this.selectedMembers = []
        this.teamMemberMe = {}
      }
    }
  },
  methods: {
    createGroupClick() {
      this.teamSelectAll = false
      this.userSelectAll = false
      this.selectedMembers = []
      this.groupName = this.user.displayName + '的群聊'
      this.createGroupVisible = true
      this.teamMemberLoading = true
      this.userMemberLoading = true
      this.getTeamsMember()
      this.getUserMember()
      this.$nextTick(() => {
        document.querySelector('.create-group-dialog .el-dialog__body').scrollTop = 0
      })
    },
    onRemove(member) {
      let index = -1
      index = this.selectedMembers.findIndex(item => item.id === member.id)
      if (index !== -1) {
        this.selectedMembers.splice(index, 1)
      }
    },
    getTeamsMember() {
      this.$api.team.getList({
        member: this.userInfo.id
      })
        .then((res) => {
          let members = []
          const teamList = res.data.results
          teamList.forEach((team) => {
            // 用于显示团队名称
            members.push({
              id: this.$uuid,
              isNotMember: true,
              teamName: team.name,
              avatar_url: team.avatar,
            })
            const leaderId = team?.leader?.id
            team.members.forEach(member => {
              if (member.id === leaderId) {
                member.isLeader = true
              }
              if (member.id === this.user.userId) {
                this.teamMemberMe = member
                member.lock = true
              }
              members.push(member)
            })
          })
          this.members = [...this.members, ...members]
          // 默认选中自己
          this.selectedMembers.push(this.teamMemberMe)
          this.teamMemberLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.teamMemberLoading = false
          this.$message.error(JSON.stringify(err))
        })
    },
    getUserMember() {
      this.$api.myProjectPatient.getList()
        .then((res) => {
          let members = []
          const userList = res.data.results
          userList.forEach((user) => {
            members.push({
              id: user.patient.user_id,
              name: user.patient.name,
              avatar_url: user.patient.avatar_url,
              stage: user.stage,
              isUser: true,
              im_user_id: user.patient.im_user_id,
            })
          })
          this.members = [...this.members, ...members]
          this.userMemberLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.userMemberLoading = false
          this.$message.error(JSON.stringify(err))
        })
    },
    handleTeamSelectAll(checked) {
      const selectUser = this.selectedMembers.filter(item => item.isUser)
      if (checked) {
        // 多个团队之间存在有相同的成员，去重
        const teamUser = this.unique(this.members.filter(item => !item.isUser && !item.isNotMember && !item.lock), 'id')
        this.selectedMembers = [this.teamMemberMe, ...teamUser, ...selectUser]
      } else {
        this.selectedMembers = [this.teamMemberMe, ...selectUser]
      }
    },
    handleUserSelectAll(checked) {
      const selectTeamUser = this.selectedMembers.filter(item => !item.isUser && !item.isNotMember)
      if (checked) {
        this.selectedMembers = [...selectTeamUser, ...this.calcUserMembers]
      } else {
        this.selectedMembers = [...selectTeamUser]
      }
    },
    unique(arr, uniId) {
      const res = new Map()
      return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
    },
    createGroup() {
      if (this.selectedMembers.length < 3) {
        return this.$message.error('至少选择3名成员（含本人）')
      }
      if (this.groupName === '') {
        return this.$message.error('请输入群聊名称')
      }
      if(this.countStrToBit(this.groupName) > 30) {
        return this.$message.error('群名称最多15个字')
      }
      const memberList = this.selectedMembers.map(item => {
        return {
          userID: item.im_user_id,
          memberCustomField: [1, 2, 3],
        }
      })

      this.$tim.createGroup({
        name: this.groupName,
        userID: this.userID,
        memberList: memberList,
        groupCustomField: [{
          project: '胃转流-减重'
        }]
      })
        .then((res) => {
          this.createGroupVisible = false
          this.$message.success('创建群聊成功')
        })
        .catch((err) => {
          if (err.code === 10037) {
            return this.$message.error('无法创建或加入更多群组。当前用户已达到群组数量限制')
          } else if (err.code === 10004) {
            return this.$message.error('群名称最多15个字')
          }
          console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    handleClearAll() {
      this.teamSelectAll = false
      this.userSelectAll = false
      this.selectedMembers = [this.teamMemberMe]
    },
    countStrToBit(str) {
      let count = 0
      const arr = str.split('')
      arr.forEach(item => {
        count += Math.ceil(item.charCodeAt().toString(2).length / 8)
      })
      return count
    },
  }, // methods
  computed: {
    calcTeamMembers() {
      if (this.teamKeyword !== '') {
        const teamUser = this.unique(this.members.filter(item => !item.isUser && !item.isNotMember), 'id')
        return teamUser.filter(item => item.name.indexOf(this.teamKeyword) !== -1)
      } else {
        return this.members.filter(item => !item.isUser)
      }
    },
    calcUserMembers() {
      if (this.userKeyword !== '') {
        return this.members
          .filter(item => item.isUser)
          .filter(item => item.name.indexOf(this.userKeyword) !== -1)
      } else {
        return this.members.filter(item => item.isUser)
      }
    },
    memberCount() {
      return this.unique(this.members.filter(item => !item.isNotMember), 'id').length
    },

  },
}
