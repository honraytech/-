import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Lockr from 'lockr'
import echarts from 'echarts'
import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import routes from './routes'
import VueRouter from 'vue-router'
import plupload from 'plupload'
import store from './vuex/store'
import _g from './assets/js/global'
import NProgress from 'nprogress'        //  页面顶部进度条
import vueScroll from 'vue-scroll'
import httpMixins from 'assets/js/http'
import _dev from 'assets/js/develop'
import 'assets/js/array'
import 'nprogress/nprogress.css'
import 'assets/css/global.css'
import 'assets/css/base.css'
import 'assets/css/honray-theme.css'

console.log('process.env = ', process.env)

let loginApi = 'admin/base/login'
let configApi = 'admin/base/getConfigs'

axios.defaults.baseURL = HOST
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.timeout = 10000000

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(vueScroll)

Vue.mixin(httpMixins)

Vue.config.errorHandler = (err, vm) => {
  console.error(err)
  // console.error('Error from component: ', vm.$options._componentTag)
  // console.error('error from component: ', vm._data.name)
}

window.router = router
window.store = store
window.HOST = HOST
window.imgUrl = imgUrl
window.WSPORT = WSPORT
window.axios = axios
window.echarts = echarts
window.moment = moment
window.Lockr = Lockr
window.Cookies = Cookies
window._ = _
window._g = _g
window._dev = _dev
window.plupload = plupload
window.retryRequestStack = {}

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
// render: h => h(Login)
}).$mount('#app')
