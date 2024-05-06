import Vue from 'vue'
import { message } from './resetMessage'
import 'element-ui/lib/theme-chalk/base.css'

import {
  Card,
  Pagination,
  Dialog,
  Input,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  Form,
  FormItem,
  Tag,
  Icon,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Link,
  Image,
  Carousel,
  CarouselItem,
  Loading,
  MessageBox,
  Message,
  Notification,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Breadcrumb,
  BreadcrumbItem,
  DatePicker,
  Descriptions,
  DescriptionsItem,
  Upload,
  Autocomplete,
  Radio,
  RadioGroup,
  Transfer,
  Divider,
  Checkbox,
  CheckboxGroup,
  RadioButton,
  Avatar,
  Tabs,
  TabPane,
  Progress,
  Collapse,
  CollapseItem,
  Switch,
  Drawer,
  TimePicker,
  Badge,
  Tooltip,
  Cascader,
  Popover,
  Calendar
} from 'element-ui'

Vue.use(Tooltip)
Vue.use(Badge)
Vue.use(TimePicker)
Vue.use(Drawer)
Vue.use(Switch)
Vue.use(CollapseItem)
Vue.use(Collapse)
Vue.use(Progress)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Avatar)
Vue.use(RadioButton)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Divider)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(DatePicker)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Link)
Vue.use(Image)
Vue.use(Loading.directive)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Autocomplete)
Vue.use(Transfer)
Vue.use(Cascader)
Vue.use(Popover)
Vue.use(Calendar)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = message

import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

Vue.component(CollapseTransition.name, CollapseTransition)
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

Vue.component('el-image-viewer', ElImageViewer)
