<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        打卡Tips管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane v-for="(item, index) in tipsType" :key="index" :label="item.label" :name="item.code + ''"></el-tab-pane>
            </el-tabs>
            <div style="height: calc(100vh - 280px); overflow: scroll; padding-left: 10px; padding-right: 20px">
              <div class="active-item" v-for="(item, index) in list" :key="index">
                  <div class="active-item-common">
                    <div style="width: 120px">使用场景：</div>
                    <div v-if="item.list.length > 0">{{ item.list[0].situation }}</div>
                  </div>
                  <div class="active-item-common" style="margin-top: 20px">
                    <div style="width: 120px">公共文字：</div>
                    <div v-if="item.list.length > 0">{{ item.list[0].public_str }}</div>
                    <!-- <div>
                      <div v-for="(ite, idx) in item.common" :key="idx" >{{ ite }}</div>
                    </div> -->
                  </div>
                  <div class="active-item-common" style="margin-top: 20px">
                    <div style="width: 120px">建议内容：</div>
                    <div class="active-item-content">
                      <div>内容</div>
                      <div style="border-top: 1px solid #eeeeee; width: 100%;" v-for="(i, j) in item.list" :key="j">{{ i.suggestion }}</div>
                    </div>
                  </div>
              </div>
            </div>  
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tips',
  computed: {
    list() {
      let datas = []
      if (this.tableData) {
        this.tableData.forEach(ele => {
          const tip_type = datas.find(ite => ite.tip_type == ele.situation)
          if (tip_type) {
            tip_type.list.push({...ele})
          } else {
            const tip = this.tipsType.find(idx => ele.category.includes(idx.label))
            if (tip) {
              const map = tip.map[ele.situation]
              if (map) {
                datas.push({
                  ...map,
                  tip_type: ele.situation,
                  list: [{...ele}]
                })
              }
            }
          }
        })
      }
      return datas
    }
  },
  data() {
    return {
      viewsMode: '',
      tableData: [],
      total: 0,
      pageSize: 9999,
      page: 1,

      activeName: '1',
      category: '饮食',

      tipsType: [],

    }
  },
  mounted() {
    this.getTipsType()
    this.getList()
  },
  methods: {
    getTipsType() {
      this.tipsType = this.$dict.tipsType.data
    },
    handleClick(tab, event) {
      const active = this.tipsType.find(ele => ele.code == this.activeName)
      this.category = active.label
      this.getList()
    },
    getList() {
      this.$nextTick(() => {
        const { table } = this.$refs
        if (table) table.loadStart()
      })
      this.$api.tips.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
        category: this.category + '打卡',
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
  }, // methods end
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.radio-group {
  width: 250px;
  height: 46px;
  border-radius: 23px;
  background-color: #F4F5FA;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
    height: 34px;
    line-height: 34px;
    padding: 0;
    border-radius: 17px;
    border: none;
    user-select: none;
    color: #000;
    background-color: #F4F5FA;

    &:hover {
      color: #797979;
    }
  }

  .el-radio-button.is-active {
    border: none;

    :deep(.el-radio-button__inner) {
      height: 34px;
      line-height: 34px;
      padding: 0;
      background: #344563;
      border: none;
      user-select: none;
      color: #fff;
    }
  }

  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
    box-shadow: unset;
  }
}


.m-table {
  height: calc(100% - 156px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
}

.search-bar {

  .el-form-item {
    margin: 0;

    .el-select {
      width: 100%;
    }

    :deep(.el-input__inner) {
      width: 100%;
      cursor: default !important;
      font-size: 14px;
      height: 40px !important;
    }
  }
}

.active-item {
  font-size: 14px;
  line-height: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  .active-item-common {
    display: flex;
    flex-direction: row;
  }

  .active-item-content {
    line-height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    border: 1px solid #eeeeee;
    text-align: center;
  }
}

</style>
