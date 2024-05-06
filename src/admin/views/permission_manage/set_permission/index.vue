<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'PermissionManage'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>权限管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
        <div class="info-top">
          <div>
            <p>权限组名称</p>
            <p>{{ permission.name }}</p>
          </div>
        </div>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="功能权限" name="1">
                <div style="height: calc(100vh - 370px); overflow: scroll;">
                    <div>
                        <div class="permission_item_top">
                            <p>PC后台</p>
                            <m-button @click="allPCPermissionInfo()">全选</m-button>
                            <m-button plain @click="deletePCPermissionInfo()">清空</m-button>
                        </div>
                        <div v-for="(item, index) in pcPermissionInfo" :key="index" class="permission_item_bottom">
                            <div v-if="item.count == 1" class="permission_item">
                                <div style="width: 280px">
                                    <el-checkbox v-model="item.checked" @change="change(item)">{{ item.name }}</el-checkbox>
                                </div>
                                <div>
                                    <el-checkbox  @change="change(itemInfo)" v-model="itemInfo.checked" v-for="(itemInfo, ind) in item.items" :key="ind">{{ itemInfo.name }}</el-checkbox>
                                </div>
                            </div>
                            <div v-else>
                              <el-checkbox v-model="item.checked" @change="change(item)">{{ item.name }}</el-checkbox>
                              <el-divider></el-divider>
                              <div v-for="(permissionItem, idx) in item.items" :key="idx" class="permission_item_bottom_item">
                                  <div class="permission_item_bottom_content">
                                      <div class="permission_item_bottom_content_first">
                                          <el-checkbox v-model="permissionItem.checked" @change="change(permissionItem)">{{ permissionItem.name }}</el-checkbox>
                                      </div>
                                      <div class="permission_item_bottom_content_last">
                                          <el-checkbox  @change="change(itemInfo)" v-model="itemInfo.checked" v-for="(itemInfo, ind) in permissionItem.items" :key="ind">{{ itemInfo.name }}</el-checkbox>
                                      </div>
                                  </div>
                                  <el-divider></el-divider>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 30px">
                        <div class="permission_item_top">
                            <p>营养师</p>
                            <m-button @click="allNutrPermissionInfo()">全选</m-button>
                            <m-button plain @click="deleteNutrPermissionInfo()">清空</m-button>
                        </div>
                        <div v-for="(item, index) in nutrPermissionInfo" :key="index" class="permission_item_bottom">
                            <div v-if="item.count == 1" class="permission_item">
                                <div class="permission_item1">
                                    <el-checkbox v-model="item.checked" @change="change(item)">{{ item.name }}</el-checkbox>
                                </div>
                                <div class="permission_item2">
                                    <el-checkbox  @change="change(itemInfo)" v-model="itemInfo.checked" v-for="(itemInfo, ind) in item.items" :key="ind">{{ itemInfo.name }}</el-checkbox>
                                </div>  
                            </div>
                            <el-divider v-if="item.count == 1"></el-divider>
                            <div v-if="item.count != 1">
                              <div>
                                <el-checkbox v-model="item.checked" @change="change(item)">{{ item.name }}</el-checkbox>
                                <el-divider></el-divider>
                              </div>
                              <div v-for="(permissionItem, idx) in item.items" :key="idx" class="permission_item_bottom_item">
                                <div v-if="permissionItem.count == 1" class="permission_item">
                                    <div class="permission_item1" style="width: 120px">
                                        <el-checkbox v-model="permissionItem.checked" @change="change(permissionItem)">{{ permissionItem.name }}</el-checkbox>
                                    </div>
                                    <div class="permission_item2">
                                        <el-checkbox @change="change(itemInfo)" v-model="itemInfo.checked" v-for="(itemInfo, ind) in permissionItem.items" :key="ind">{{ itemInfo.name }}</el-checkbox>
                                    </div>
                                </div>
                                <el-divider v-if="permissionItem.count == 1"></el-divider>
                                <div v-if="permissionItem.count != 1" class="permission_item_bottom_content" style="width: 100%">
                                    <div class="permission_item_bottom1">
                                      <div style="width: 100px">
                                          <el-checkbox v-model="permissionItem.checked" @change="change(permissionItem)">{{ permissionItem.name }}</el-checkbox>
                                      </div>
                                      <div class="permission_item_bottom_content_info">
                                          <div v-for="(itemInfo, ind) in permissionItem.items" :key="ind" >
                                                <div  class="content_info_item" style="align-items: center;">
                                                  <div style="width: 150px">
                                                    <el-checkbox @change="change(itemInfo)" v-model="itemInfo.checked" >{{ itemInfo.name }}</el-checkbox>
                                                  </div>
                                                  <div class="content_info_item_info">
                                                    <el-checkbox @change="change(i)" v-model="i.checked" v-for="(i, j) in itemInfo.items" :key="j">{{ i.name }}</el-checkbox>
                                                  </div>
                                                  
                                                </div>
                                                <el-divider v-if="ind != permissionItem.items.length - 1"></el-divider>
                                          </div>
                                      </div>
                                      
                                    </div>
                                </div>
                                <el-divider v-if="permissionItem.count != 1"></el-divider>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="数据权限" name="2">
                <div style="height: calc(100vh - 370px); overflow: scroll;">
                    <p class="data_tip">说明：数据权限用来设置账号登录PC后台/PC营养师端时允许查看的数据范围</p>
                    <el-radio-group v-model="radio">
                        <div class="data_content">
                            <el-radio class="data_content_item" v-for="(item, index) in dataType" :key="index" :label="item.code">{{ item.label }}</el-radio>
                        </div>
                    </el-radio-group>
                </div>
              </el-tab-pane>
          </el-tabs>
        </template>
        <div class="info_bottom">
            <m-button @click="save">保存</m-button>
            <m-button plain @click="$router.go(-1)">返回</m-button>
        </div>
      </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
const localSession = new LocalStore('setPermission', true)

export default {
  name: 'SetPermission',
  components: {
  },
  watch: {
    // pcPermissionInfo: {
    //     handler(newVal, oldVal) {
    //       console.log(newVal);
    //        this.$forceUpdate();
    //     },
    //     deep: true
    // }
  },
  computed: {

  },
  data() {
    return {
      activeName: '1',
      permission: {

      },
      pcPermissionInfo: [],
      nutrPermissionInfo: [],
      dataType: [],
      radio: '',
    }
  },
  mounted() {
    this.initForm()
    this.getPCPermissionInfo()
    this.getNutrPermissionInfo()
    this.getDataType()
  },
  methods: {
    getPCPermissionInfo() {
        var func_permission = (this.permission.func_permission ? this.permission.func_permission : '').split(',')
        this.pcPermissionInfo = this.$dict.pcPermissionInfo.data
        this.pcPermissionInfo.forEach(element => {
            element.checked = func_permission.includes(element.codename)
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = func_permission.includes(ele.codename)
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = func_permission.includes(val.codename)
                  })
                }
              })
            }
        });
    },
    getNutrPermissionInfo() {
        var func_permission = (this.permission.func_permission ? this.permission.func_permission : '').split(',')
        this.nutrPermissionInfo = this.$dict.nutrPermissionInfo.data
        this.nutrPermissionInfo.forEach(element => {
            element.checked = func_permission.includes(element.codename)
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = func_permission.includes(ele.codename)
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = func_permission.includes(val.codename)
                    if (val.items) {
                      val.items.forEach(i => {
                        i.checked = func_permission.includes(i.codename)
                      })
                    }
                  })
                }
              })
            }
        });
    },
    getDataType() {
        this.dataType = this.$dict.permissionDataType.data
    },
    handleClick(tab, event) {
        
    },
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }
      this.permission = data
      if (this.permission.data_permission) {
        this.radio = this.permission.data_permission.id
      }
    },
    allPCPermissionInfo() {
        this.pcPermissionInfo.forEach(element => {
            element.checked = true
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = true
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = true
                  })
                }
              })
            }
        });
        this.$forceUpdate();
    },
    allNutrPermissionInfo() {
        this.nutrPermissionInfo.forEach(element => {
            element.checked = true
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = true
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = true
                    if (val.items) {
                      val.items.forEach(i => {
                        i.checked = true
                      })
                    }
                  })
                }
              })
            }
        });
        this.$forceUpdate();
    },
    deleteNutrPermissionInfo() {
        this.nutrPermissionInfo.forEach(element => {
            element.checked = false
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = false
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = false
                    if (val.items) {
                      val.items.forEach(i => {
                        i.checked = false
                      })
                    }
                  })
                }
              })
            }
        });
        this.$forceUpdate();
    },
    changeItem(item, checked) {
      if (item.items) {
        item.items.forEach(ele => {
            ele.checked = checked
            this.changeItem(ele, checked)
        })
      }
    },
    change(value) {
      this.changeItem(value, value.checked)
      this.$forceUpdate();
    },
    deletePCPermissionInfo() {
        this.pcPermissionInfo.forEach(element => {
            element.checked = false
            if (element.items) {
              element.items.forEach(ele => {
                ele.checked = false
                if (ele.items) {
                  ele.items.forEach(val => {
                    val.checked = false
                  })
                }
              })
            }
        });
        this.$forceUpdate();
    },
    save() {
        var pcPermissionInfo = []
        this.pcPermissionInfo.forEach(element => {
            if (element.checked) {
              pcPermissionInfo.push(element.codename)
            }
            if (element.items) {
              element.items.forEach(ele => {
                if (ele.checked) {
                  pcPermissionInfo.push(ele.codename)
                }
                if (ele.items) {
                  ele.items.forEach(val => {
                    if (val.checked) {
                      pcPermissionInfo.push(val.codename)
                    }
                  })
                }
              })
            }
        });
        this.nutrPermissionInfo.forEach(element => {
            if (element.checked) {
              pcPermissionInfo.push(element.codename)
            }
            if (element.items) {
              element.items.forEach(ele => {
                if (ele.checked) {
                  pcPermissionInfo.push(ele.codename)
                }
                if (ele.items) {
                  ele.items.forEach(val => {
                    if (val.checked) {
                      pcPermissionInfo.push(val.codename)
                    }
                    if (val.items) {
                      val.items.forEach(i => {
                        if (i.checked) {
                          pcPermissionInfo.push(i.codename)
                        }
                      })
                    }
                  })
                }
              })
            }
        });

        this.$api.permissionManagement.update(this.permission.id, {
          name: this.permission.name,
          func_permission: pcPermissionInfo.join(','),
          data_permission_id: this.radio
        }).then(res => {
          this.$message.success('保存成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })

    },
    leavePage() {
      this.$router.go(-1)
    },
  }, // methods end
}
</script>

<style scoped lang="less">

.m-table {
  height: calc(100% - 50px);
}

.calc-dialog {
  :deep(.el-dialog) {
    height: 450px;

    .el-form-item__label {
      width: 80px;
    }
  }
}

.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
    padding-top: 20px;
    position: relative;

    .info-top {
      display: flex;
      flex-direction: row;
      align-items: center;

      div {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 30px;

        p {
          font-size: 14px;
        }
      }

      div p:first-child {
        font-weight: 700;
      }

      div p:last-child {
        margin-left: 10px;
      }
    }

    :deep(.el-tabs__content) {
      height: calc(100vh - 340px);
    }

    .permission_item_top {
        display: flex;
        flex-direction: row;
        align-items: center;
        p {
            font-size: 16px;
            font-weight: 600;
            width: 150px;
        }
    }

    .permission_item_bottom {
        margin-top: 20px;
        padding-left: 50px;

        .permission_item {
          display: flex;
          flex-direction: row;
          align-items: center;
          .permission_item1 {
              width: 150px;
          }

          .permission_item2 {
              margin-left: 130px;
              display: flex;
              flex: 1;
              flex-direction: row;
              flex-wrap: wrap;
          }
        }

        .permission_item_bottom_item {
            margin-left: 30px;
            .permission_item_bottom_content {
                display: flex;
                flex-direction: row;
                align-items: center;

                .permission_item_bottom_content_first {
                    width: 150px;
                }

                .permission_item_bottom_content_last {
                    margin-left: 100px;
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    flex-wrap: wrap;
                }

                .permission_item_bottom_content_info {
                  flex-direction: column;
                  display: flex;
                  flex: 1;

                  .content_info_item {
                    flex-direction: row;
                    display: flex;
                    flex: 1;

                    .content_info_item_info {
                      flex-direction: row;
                      display: flex;
                      flex: 1;
                      flex-wrap: wrap;
                    }

                  }
                }
            }
        }
    }
  }
}



.form-box {
  width: 100%;

    .add-image-content {

      display: flex;
      flex-direction: row;
      align-items: center;

      .add-image {
          width: 450px; 
          height: 48px; 
          border: 1px solid #D9E1EC !important; 
          border-radius: 12px !important;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-left: 12px;


          
          // .el-button {
          //     background: ;
          // }

      }

      .add-image-select {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .add-image-delete {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffffff;
      }

    }



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

.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }
}


.roles-select {
  :deep(.el-input__suffix) {
    display: none;
  }
}

.role-editor {
  :deep(.el-select.roles-select) {
    width: 450px !important;
    .el-select__tags {
      max-width: unset !important;
    }
  }
}

.close-btn {
  display: none;
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 11;
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  color: #fff;
  background-color: #000;
  opacity: .3;
  border-radius: 50%;
  font-size: 12px;
}

.image-wrapper:hover .close-btn {
  //visibility: visible;
  display: block;
}

.info_bottom {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-right: 32px;
    bottom: 12px;
}

.data_tip {
    font-size: 14px;
    color: @primaryColor;
}

.data_content {
    display: flex;
    flex-direction: column;
    padding-left: 100px;
    .data_content_item {
        margin-top: 30px;
    }
}

.el-divider--horizontal {
  margin: 10px 0;
}

.permission_item_bottom1 {
  display: flex; 
  flex-direction: row;
  align-items: center;
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
