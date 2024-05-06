<template>
  <div class="blood-pressure-record-container">
    <el-calendar>
        <template
            slot="dateCell"
            slot-scope="row">
            <div :class="hasDate(row.data.day) ? 'is-selected' : ''" class="date-item">
                <div>
                    {{parseInt(row.data.day.substring(8))}}
                </div>
                <div v-if="showTitle(row.data.day)" class="date-title">月经期</div>
            </div>
        </template>
    </el-calendar>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from "vuex";
export default {
  props: ["ppInfo"],
  data() {
    return {
        list: [],
        settingList: [],
        settingDays: 5,
        period: 30,
    };
  },
  created() {
    this.getList()
  },
  methods: {
    hasDate(date) {
        const item = this.list.find(ele => ele.date == date)
        if (item) return true
        return false
    },
    showTitle(date) {
        const item = this.list.find(ele => ele.date == date)
        if (item) {
            if (item.is_first_day == 1) return true
        }
        return false
    },
    getList() {
        this.$api.menstrualPeriodRecord
          .menstrualSetting({ patient: this.patient.user_id, page_size: 999, page: 1 })
          .then((res) => {
            this.settingList = res.data.results
            if (this.settingList.length) {
              this.settingDays = this.settingList[0].days
              this.period = this.settingList[0].period
            } else {
              this.settingDays = 5
              this.period = 30
            }
            this.$api.menstrualPeriodRecord.getList({
                patient: this.patient.user_id,
                page: 1,
                page_size: 99999,
            }).then((respon) => {
                let dayNum = this.settingDays
                let dateList = []
                for (let index = 0; index < respon.data.results.length; index++) {
                    const element = respon.data.results[index]
                    for (let dayIndex = 0; dayIndex < dayNum; dayIndex++) {
                        let dayStr = dayjs(element.date).add(dayIndex, 'day').format('YYYY-MM-DD')
                        dateList.push({
                            ...element,
                            is_first_day: element.date == dayStr ? 1 : 0,
                            isEndDay: dayIndex + 1 == dayNum,
                            date: dayStr,
                        })
                    }
                }
                this.list = dateList
            }).catch((error) => {
                this.$message.error(JSON.stringify(error));
            });
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err));
          })

    }
  },
  computed: {
    ...mapGetters(["userInfo", "token"]),
    userId() {
      return this.patient.user_id;
    },
    patient() {
      if (
        this.ppInfo &&
        Object.keys(this.ppInfo).length !== 0 &&
        this.ppInfo.patient
      ) {
        return this.ppInfo.patient;
      } else {
        return {
          avatar_url: "",
          user_profile: {},
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.blood-pressure-record-container {
    width: 70%;
    margin-left: 15%;
    .is-selected {
        background-color: #e84e4d;
        color: #fff;
    }
    .date-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 14px;
        position: relative;

        .date-title {
            position: absolute;
            bottom: 10px;
        }
    }

    :deep(.el-calendar-table) {
        .el-calendar-day {
            padding: 0;
        }
    }
    :deep(.el-calendar__button-group) {
        .el-button-group {
            button:nth-child(2) {
                display: none;
            }
            
        }
    }
}



</style>
