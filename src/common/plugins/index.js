import Vue from 'vue'
import './element'
import './echarts'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import IconBox from '../components/IconBox'
import MTag from '../components/MTag'
import MTable from '../components/MTable'
import MViewTable from '../components/MViewTable'
import MCheckbox from '../components/MCheckbox'
import MUpload from '../components/MUpload'
import MButton from '../components/MButton'
import MEditor from "../components/MEditor"
import MCategory from "../components/MCategory"
import RecipeEditor from "../components/RecipeEditor"
import VueCropper from 'vue-cropper'

Vue.use(VueCropper)

Vue.component('icon-box', IconBox)
Vue.component('m-tag', MTag)
Vue.component('m-table', MTable)
Vue.component('m-view-table', MViewTable)
Vue.component('m-checkbox', MCheckbox)
Vue.component('m-upload', MUpload)
Vue.component('m-button', MButton)
Vue.component('Editor', Editor)
Vue.component('Toolbar', Toolbar)
Vue.component('m-editor', MEditor)
Vue.component('m-category', MCategory)
Vue.component('recipe-editor', RecipeEditor)

import '@wangeditor/editor/dist/css/style.css'
import '@/common/style/theme/index.css'
