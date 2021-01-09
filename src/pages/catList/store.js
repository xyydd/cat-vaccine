// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    catList: [],
    res: {}
  },
  mutations: {
    handleRes (state, res) {
      state.res = res
    },
    handleCatList (state, data) {
      console.log(data)
      state.catList = data
    }
  },
  actions: {
    getCatList ({commit}) {
      mpvue.cloud.callFunction({
        name: 'getCatList'
      })
        .then(res => {
          console.log(res)
          const data = res.result.data
          const fileIds = data.map(item => item.avatarUrl)
          mpvue.$getTempFile(fileIds)
            .then(res => {
              commit('handleCatList', mpvue.$mergeTempFile(data, res))
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})

export default store
