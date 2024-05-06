<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/scale_manage'}">
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>量表管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.id">
        答题记录
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <div class="back-btn">
          <m-button plain @click="$router.go(-1)">返回</m-button>
        </div>
        <div class="iframe-container">
          <div class="iframe-wrap" v-loading="loading">
            <iframe id="iframe" class="iframe" :src="src" frameborder="0" width="400px" height="100%"></iframe>
            <div class="home-btn" @click="$router.go(-1)"></div>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'ScaleDetail',
  data() {
    return {
      title: '详情',
      src:'',
      loading:true
    }
  },
  computed:{
    ...mapGetters(['token']),
  },
  mounted(){
    let src
    if(this.$route.query.formId){
      let _iframe = document.querySelector('#iframe')
      _iframe.onload=()=>{
        this.loading = false
      }
      src = `/scale/${this.$route.query.formId}`
      if(this.$route.query.id){
        src += `?token=${this.token}&record_id=${this.$route.query.id}`
      }else{
        src += `?token=${this.token}&previewMode=1`
        this.title = "预览量表"
      }
      this.src = src
    }
  },
  methods: {

  },

}
</script>

<style scoped lang="less">
.back-btn{
  position: absolute;
}
.iframe-container{
  text-align: center;
}
.iframe-wrap{
  display: inline-block;
  padding:25px 5px 60px;
  background:#fff;
  border:1px solid #ccc;
  border-radius: 20px;
  overflow: hidden;
  height:calc(100vh - 330px);
  position:relative;
  
  .home-btn{
    content:' ';
    display: block;
    margin:0 auto;
    width:35px;
    height:35px;
    border-radius: 50%;
    border:1px solid #ccc;
    cursor: pointer;
  }
  .iframe{
    padding:5px;
    border:1px solid #ccc;
  }
}
</style>
