// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    res: {}
  },
  mutations: {
    handleLoading (state, status) {
      state.loading = status
    },
    handleRes (state, data) {
      state.res = data
    }
  },
  actions: {
    addUser ({commit}, userInfo) {
      mpvue.cloud.callFunction({
        name: 'addUser',
        data: {
          userInfo: userInfo
        }
      })
        .then(res => {
          commit('handleRes', res)
          commit('handleLoading', false)
        })
        .catch(error => {
          commit('handleRes', error)
          commit('handleLoading', false)
        })
    }

  }
})

export default store
