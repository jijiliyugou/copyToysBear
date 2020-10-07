const state = {
  Json: {}
}
const mutations = {
  setGlobalJson (state, val) {
    state.Json = val
  }
}
const actions = {}
const getters = {}

// 不要忘记把state, mutations等暴露出去。
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
