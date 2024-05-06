<template>
  <div class="doctor-card" :class="{ top: showCheckbox && $slots.default }" @click="cardClick">
    <!-- <el-checkbox v-model="model" :label="label" :value="value" v-show="false"></el-checkbox> -->
    <div v-if="showCheckbox" class="checkbox-part" :class="{ top: showCheckbox && $slots.default }">
      <icon-box v-if="isChecked" icon-name="checkbox_check" w="22" h="22" box-w="22" style="margin-right: 10px"></icon-box>
      <icon-box v-else icon-name="checkbox_empty" w="22" h="22" box-w="22" style="margin-right: 10px"></icon-box>
      <slot />
    </div>
    <div v-if="showClose" class="remove-btn" @click.stop="removeCard"><i class="el-icon-remove"></i></div>

    <div class="left-part">
      <div class="avatar">
        <el-image fit="cover" :src="doctorInfo && doctorInfo.avatar_url">
          <div slot="error" class="avatar-error">
            <i class="el-icon-user-solid"></i>
          </div>
        </el-image>
      </div>
      <el-tag class="role" v-if="doctorInfo.role_id === $enum.ROLE.DR" type="success" effect="dark" size="mini">
        {{ doctorInfo.role_name }}
      </el-tag>
      <el-tag class="role" v-else-if="doctorInfo.role_id === $enum.ROLE.LD" color="#6b8cce" effect="dark" size="mini">
        {{ doctorInfo.role_name }}
      </el-tag>
      <el-tag class="role" v-else-if="doctorInfo.role_id === $enum.ROLE.RD" type="warning" effect="dark" size="mini">
        {{ doctorInfo.role_name }}
      </el-tag>
      <el-tag v-else type="info" effect="dark" size="mini">{{ doctorInfo.role_name }}</el-tag>
    </div>
    <div class="right-part">
      <div class="name">{{ doctorInfo.name ? doctorInfo.name : '未命名' }}</div>
      <!--      <div class="organization">{{ doctorInfo.organization }}</div>-->
    </div>
    <div v-if="doctorInfo.isLeader == 1" class="leader">队长</div>
    <div v-if="showLeader" class="leader">队长</div>
  </div>
</template>
<script>
export default {
  name: 'doctorCard',
  inject: {
    CheckboxGroup: {
      default: '',
    },
    RadioGroup: {
      default: '',
    },
  },
  props: {
    doctorInfo: {
      type: Object,
      default: () => {},
    },
    showCheckbox: Boolean,
    checkboxPosition: {
      type: String,
      default: 'left', //optional:'top'
    },
    value: {
      type: Boolean,
      default: false,
    },
    isLeader: Boolean,
    showLeader: Boolean,
    showClose: Boolean,
  },
  computed: {
    model: {
      get() {
        if (this.isCheckGroup) return this.CheckboxGroup.value
        else if (this.isRadioGroup) return this.RadioGroup.value
        else return this.value
      },
      set(value) {
        // 更改值 需要触发父组件的事件(也就是父组件给当前组件注册的事件)
        if (this.isCheckGroup) this.CheckboxGroup.$emit('input', value)
        else if (this.isRadioGroup) {
          if (!this.isChecked && this.RadioGroup.value) {
            this.$confirm(`确定要切换团队长吗？`, '切换团队长', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'info',
            })
              .then(() => {
                this.RadioGroup.$emit('input', value.id)
              })
              .catch(() => {})
            return
          }
          this.RadioGroup.$emit('input', value.id)
        } else this.$emit('input', value)
      },
    },
    isCheckGroup() {
      return !!this.CheckboxGroup
    },
    isRadioGroup() {
      return !!this.RadioGroup
    },
    isChecked() {
      if (this.isCheckGroup) {
        return this.model.find((item) => item.id == this.doctorInfo.id)
      } else if (this.isRadioGroup) {
        return this.RadioGroup.value == this.doctorInfo.id
      } else return this.model
    },
  },
  data() {
    return {}
  },
  methods: {
    cardClick() {
      console.log('cardClick')
      if (this.isCheckGroup) {
        if (this.model.find((item) => item.id == this.doctorInfo.id))
          this.model.splice(
            this.model.findIndex((item) => item.id == this.doctorInfo.id),
            1
          )
        else this.model.push(this.doctorInfo)
      } else if (this.isRadioGroup) {
        this.model = this.doctorInfo
      } else {
        this.model = !this.model
      }
      // this.isCheckGroup ? this.CheckboxGroup.$emit("input",this.model) : this.$emit('input',this.model)
    },
    removeCard() {
      if (this.showClose) {
        this.$emit('remove', this.doctorInfo)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.doctor-card {
  display: flex;
  width: 200px;
  height: 100px;
  padding: 15px;
  margin: 0 10px 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 15px;
  align-items: center;
  cursor: pointer;
  position: relative;

  &.top {
    height: 140px;
    flex-wrap: wrap;
  }

  &:hover {
    background-color: #fafafa;
  }

  .left-part {
    margin-right: 20px;
    text-align: center;

    .avatar {
      background-color: #f4f5fa;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    .avatar-error i {
      color: #5a6d86;
      font-size: 20px;
    }
  }

  .right-part {
    color: @textColor;
    font-size: 14px;

    .name {
      font-size: 20px;
      font-weight: bold;
    }

    .position {
      padding: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      margin: 5px 0;
    }

    .organization {
      font-size: 12px;
    }
  }

  .checkbox-part {
    &.top {
      width: 100%;
      display: flex;
      margin-top: -10px;
      margin-left: 6px;
    }
  }

  .leader {
    position: absolute;
    padding: 3px;
    color: #fff;
    background-color: #f56c6c;
    border-radius: 5px;
    font-size: 12px;
    right: 10px;
    top: 5px;
  }

  .remove-btn {
    position: absolute;
    right: 6px;
    top: 6px;

    i {
      display: block;
      font-size: 24px;
      color: red;
      cursor: pointer;
    }
  }
}
</style>
