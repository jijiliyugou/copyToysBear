import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import globalJson from './Json.js'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    screenWidth: document.documentElement.clientWidth, // 屏幕宽度
    wsOrderMsg: null,
    beforeSearchImgPreview: null,
    wsId: '',
    wsMsg: null,
    isLogin: false,
    beforeSearch: { value: '', type: 'name' },
    beforeSearchImg: null,
    searchValue: '',
    vueElementLoading: false,
    AppLoading: false,
    imageSearchValue: null,
    routers: null,
    userInfo: null,
    currentComparnyId: null
  },
  mutations: {
    handlerLogin (state, value) {
      state.isLogin = value
    },
    updateLoading (state, value) {
      state.vueElementLoading = value
    },
    handlerBeforeSearch (state, value) {
      state.beforeSearch = value
    },
    handlerBeforeSearchImgPreview (state, value) {
      state.beforeSearchImgPreview = value
    },
    handlerBeforeSearchImg (state, value) {
      state.beforeSearchImg = value
    },
    updateAppLoading (state, value) {
      state.AppLoading = value
    },
    searchValues (state, value) {
      state.imageSearchValue = value
    },
    searchTxtValues (state, value) {
      state.searchValue = value
    },
    clearSearch (state) {
      state.imageSearchValue = null
    },
    setRouters (state, routers) {
      state.routers = routers
    },
    setToken (state, user) {
      state.userInfo = user
    },
    setComparnyId (state, id) {
      state.currentComparnyId = id
    },
    setWsId (state, id) {
      state.wsId = id
    },
    setwsMsg (state, msg) {
      state.wsMsg = msg
    },
    clearWsMsg (state) {
      state.wsMsg = null
    },
    setWsOrderMsg (state, msg) {
      state.wsOrderMsg = msg
    },
    clearWsOrderMsg (state) {
      state.wsOrderMsg = null
    },
    removeLoginItems (state) {
      state.token = null
      state.userInfo = {}
      state.currentComparnyId = null
      state.globalJson.Json = {}
      state.routers = []
      state.isLogin = null
    }
  },
  actions: {
    async getToken ({ commit }) {
      const res = await axios.post('/api/GetToken', {
        companyNum: 'LittleBearWeb',
        platForm: 'PC'
      })
      if (res.data.result.code === 200) {
        const obj = { accessToken: res.data.result.item }
        commit('setToken', obj)
      }
    }
  },
  modules: {
    globalJson
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
