// 导入所有的组件
import AppCU from "./components/curd/AppCU.vue"
import AppForm from "./components/curd/AppForm.vue"
import AppTable from "./components/curd/AppTable.vue"
import AppFilterDrawer from "./components/curd/AppFilterDrawer.vue"

// 为组件提供 install 安装方法，供按需引入
AppCU.install = function (Vue) {
  Vue.component(AppCU.name, AppCU)
}

AppForm.install = function (Vue) {
  Vue.component(AppForm.name, AppForm)
}

AppTable.install = function (Vue) {
  Vue.component(AppTable.name, AppTable)
}

AppFilterDrawer.install = function (Vue) {
  Vue.component(AppFilterDrawer.name, AppFilterDrawer)
}

export { AppCU, AppForm, AppTable, AppFilterDrawer }
