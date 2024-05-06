<template>
  <div>
    <template v-if="userInfo.isNotMember">
      <div class="team-name-title flex align_center">
        <el-avatar
          fit="cover"
          :src="userInfo.avatar_url ? userInfo.avatar_url : require('@/common/assets/bg/default_team_avatar.png')"
          style="width: 20px;height: 20px; margin-right: 5px;"
        ></el-avatar>
        {{ userInfo.teamName }}
      </div>
    </template>
    <template v-else-if="userInfo.isUser">
      <div class="doctor-card" :class="{'top':showCheckbox&&$slots.default}" @click="cardClick">
        <!-- <el-checkbox v-model="model" :label="label" :value="value" v-show="false"></el-checkbox> -->

        <div v-if="showCheckbox" class="checkbox-part" :class="{'top':showCheckbox&&$slots.default}">
          <icon-box v-if="isChecked" icon-name="checkbox_check" w="22" h="22" box-w="22"
                    style="margin-right: 10px;"></icon-box>
          <icon-box v-else icon-name="checkbox_empty" w="22" h="22" box-w="22" style="margin-right: 10px;"></icon-box>
        </div>
        <div class="left-part">
          <div class="avatar">
            <el-image :src="userInfo && userInfo.avatar_url">
              <div slot="error" class="avatar-error">
                <i class="el-icon-user-solid"></i>
              </div>
            </el-image>
          </div>
        </div>
        <div class="right-part">
          <div class="name">{{ userInfo.name ? userInfo.name : '未命名' }}</div>
          <el-tag type="info" effect="dark" size="mini">{{ userInfo.stage ? userInfo.stage : '未设置' }}</el-tag>
          <slot/>
          <div v-if="showRemove" class="remove-btn" @click.stop="removeCard"><i class="el-icon-remove"></i></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="doctor-card"
           :class="{'top':showCheckbox&&$slots.default, 'readonly': userInfo.lock}"
           @click="cardClick">
        <!-- <el-checkbox v-model="model" :label="label" :value="value" v-show="false"></el-checkbox> -->

        <div v-if="showCheckbox" class="checkbox-part" :class="{'top':showCheckbox&&$slots.default}">
          <icon-box v-if="userInfo.lock" w="22" h="22" box-w="22" icon-name="tongyi" style="margin-right: 10px;"></icon-box>
          <template v-else>
            <icon-box v-if="isChecked" icon-name="checkbox_check" w="22" h="22" box-w="22"
                      style="margin-right: 10px;"></icon-box>
            <icon-box v-else icon-name="checkbox_empty" w="22" h="22" box-w="22" style="margin-right: 10px;"></icon-box>
          </template>
        </div>
        <div class="left-part">
          <div class="avatar">
            <el-image :src="userInfo && userInfo.avatar_url">
              <div slot="error" class="avatar-error">
                <i class="el-icon-user-solid"></i>
              </div>
            </el-image>
          </div>
        </div>
        <div class="right-part">
          <div class="name">{{ userInfo.name ? userInfo.name : '未命名' }}</div>
          <el-tag class="role" v-if="userInfo.role_id === $enum.ROLE.DR" type="success"
                  effect="dark"
                  size="mini">
            {{ userInfo.role_name }}
          </el-tag>
          <el-tag class="role" v-else-if="userInfo.role_id === $enum.ROLE.LD" color="#6b8cce"
                  effect="dark"
                  size="mini">
            {{ userInfo.role_name }}
          </el-tag>
          <el-tag class="role" v-else-if="userInfo.role_id === $enum.ROLE.RD" type="warning"
                  effect="dark"
                  size="mini">
            {{ userInfo.role_name }}
          </el-tag>
          <el-tag v-else type="info" effect="dark" size="mini">{{ userInfo.role_name }}</el-tag>
          <el-tag v-if="showLeader && userInfo.isLeader" class="ml_10" color="#f56c6c" type="danger" effect="dark"
                  size="mini">团队长
          </el-tag>

          <slot/>
          <div v-if="showRemove && !userInfo.lock" class="remove-btn" @click.stop="removeCard"><i
            class="el-icon-remove"></i></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'doctorCard',
  inject: {
    CheckboxGroup: {
      default: ''
    },
    RadioGroup: {
      default: ''
    }
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
      }
    },
    showCheckbox: Boolean,
    checkboxPosition: {
      type: String,
      default: 'left'  //optional:'top'
    },
    value: {
      type: Boolean,
      default: false
    },
    showRemove: Boolean,
    showLeader: Boolean,
  },
  computed: {
    model: {
      get() {
        if (this.isCheckGroup)
          return this.CheckboxGroup.value
        else if (this.isRadioGroup)
          return this.RadioGroup.value
        else return this.value;
      },
      set(value) {
        // 更改值 需要触发父组件的事件(也就是父组件给当前组件注册的事件)
        if (this.isCheckGroup)
          this.CheckboxGroup.$emit("input", value)
        else if (this.isRadioGroup)
          this.RadioGroup.$emit("input", value.id)
        else this.$emit("input", value);
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
        return this.model.find(item => item.id == this.userInfo.id)
      } else if (this.isRadioGroup) {
        return this.RadioGroup.value == this.userInfo.id
      } else return this.model;
    }
  },
  data() {
    return {}
  },
  methods: {
    cardClick() {
      if (this.isCheckGroup) {
        if(this.userInfo.lock) return

        if (this.model.find(item => item.id == this.userInfo.id)) this.model.splice(this.model.findIndex(item => item.id == this.userInfo.id), 1)
        else this.model.push(this.userInfo)
      } else if (this.isRadioGroup) {
        this.model = this.userInfo
      } else {
        this.model = !this.model
      }
      // this.isCheckGroup ? this.CheckboxGroup.$emit("input",this.model) : this.$emit('input',this.model)
    },
    removeCard() {
      if (this.showRemove) {
        this.$emit("remove", this.userInfo)
      }
    }
  }

}
</script>
<style lang="less" scoped>
.doctor-card {
  display: flex;
  width: 100%;
  // height: 20px;
  padding: 5px;
  margin-bottom: 10px;
  // border: 1px solid #dcdfe6;
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
    margin-right: 10px;
    text-align: center;

    .avatar {
      background-color: #F4F5FA;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .avatar-error i {
      color: #5A6D86;
      font-size: 20px;
    }
  }

  .right-part {
    color: @textColor;
    font-size: 14px;
    display: flex;
    flex: 1;

    .name {
      font-size: 20px;
      font-weight: bold;
      margin-right: 10px;
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
    margin-right: 10px;
    margin-left: auto;
    text-align: right;

    i {
      display: block;
      font-size: 24px;
      color: red;
      cursor: pointer;
    }
  }
}

.team-name-title {
  height: 32px;
  line-height: 32px;
  margin-left: 5px;
  font-size: 18px;
  color: #344563;
}

.readonly {
  &:after {
    content: " ";
  }
}
</style>
