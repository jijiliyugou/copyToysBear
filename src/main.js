import Vue from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
import store from '@/store'
import '@/styles/base.less'
import myAxios from '@/request/http'
import md5 from 'js-md5'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import AgoraRTM from 'agora-rtm-sdk'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import '@/assets/css/globalVariable.less'
import _ from 'lodash'
import ElTreeGrid from 'element-tree-grid'
import wsConnection from '@/store/wsStore'
import VueClipboard from 'vue-clipboard2'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
Vue.use(VueClipboard)
Vue.prototype.$setWs = wsConnection
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.prototype.$video = Video;
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt =
    'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = clientWidth / 7.5 + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

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
  },
  mounted () {
    window.onresize = () => {
      window.screenWidth = document.documentElement.clientWidth
      this.$store.state.screenWidth = window.screenWidth
    }
  }
}).$mount('#app')
