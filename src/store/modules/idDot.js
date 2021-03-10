const state = {
  isDot: true
}

const mutations = {
  CHANGE_DOT(state, status = true) {
    return state.isDots = status
  }
}

const actions = {
  changeDot({ commit }, status) {
    commit('CHANGE_DOT', status)
  }
}

export default {
  namespaced: true,
  mutations,
  actions,
  state
}
