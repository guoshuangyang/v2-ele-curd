import Vue from "vue"
import App from "./App.vue"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
// import { useComponent } from "@/components/ele"

Vue.config.productionTip = false
// Vue.use(useComponent)
Vue.use(ElementUI)

let app = new Vue({
  render: (h) => h(App)
})
app.$mount("#app")
