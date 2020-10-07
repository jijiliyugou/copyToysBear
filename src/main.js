import Vue from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
import store from '@/store'
import '@/styles/base.less'
import myAxios from '@/request/http'
import md5 from 'js-md5'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AgoraRTM from 'agora-rtm-sdk'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import '@/assets/css/globalVariable.less'
import _ from 'lodash'
import ElTreeGrid from 'element-tree-grid'
import wsConnection from '@/store/wsStore'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.prototype.$setWs = wsConnection

Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.prototype.$video = Video

Vue.prototype.$_ = _

Vue.use(ElementUI)
Vue.prototype.$md5 = md5
Vue.prototype.$AgoraRTM = AgoraRTM
Vue.use(myAxios)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
}).$mount('#app')
