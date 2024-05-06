import store from '@/common/store'

const install = Vue => {
  Vue.directive('auth', {
    inserted(el, binding, vnode, oldVnode) {

      // if (binding.value === '#ROOT#') return

      const permissions = store.getters?.userInfo?.func_permissions.split(',')
      if (!permissions) return
      let verify = permissions.indexOf(binding.value)
      if (verify === -1) {
        el?.parentNode?.removeChild(el)
      }
    }
  })
}
export default {
  install
}
