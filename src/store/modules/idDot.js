const state = {
  hide: true
}

const mutations = {
  CHANGE_DOT(state, status) {
    return state.hide = status
  }
}

export default {
  namespaced: true,
  mutations,
  state
}
