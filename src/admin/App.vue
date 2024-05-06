<template>
  <div id="app">
    <!-- <router-view/> -->
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  // data() {
  //   return {
  //     keepList:['NutritionalPrescription']
  //   }
  // },

  // watch: {
  //   $route(to, form){
  //     // if (to.name == 'NutritionalPrescriptionDetail' && form.name == 'NutritionalPrescription') {
  //     //   form.meta.keepAlive = true
  //     // } else {
  //     //   form.meta.keepAlive = false
  //     // }
  //   } 
  // }
}
</script>
