// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cat: {},
    records: [],
    res: {}
  },
  mutations: {
    handleRes (state, res) {
      state.res = res
    },
    handleCatRecords (state, data) {
      console.log(data)
      state.records = data
    },
    handleCat (state, data) {
      console.log(data)
      state.cat = data[0]
    }
  },
  actions: {
    getCatRecords ({commit}, id) {
      mpvue.cloud.callFunction({
        name: 'getCatRecords',
        data: {
          catId: id
        }
      })
        .then(res => {
          const data = res.result.data
          console.log('1', data)
          const fileIds = data.map(item => {
            if (item.codeImage && item.codeImage !== '') {
              return item.codeImage
            }
          }).filter(item => item)
          console.log(fileIds)
          mpvue.$getTempFile(fileIds)
            .then(res => {
              commit('handleCatRecords', mpvue.$mergeTempFile(data, res, 'codeImage'))
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCatDetail ({commit}, id) {
      mpvue.cloud.callFunction({
        name: 'getCat',
        data: {
          id: id
        }
      })
        .then(res => {
          const data = [res.result.data]
          const fileIds = data.map(item => item.avatarUrl)
          mpvue.$getTempFile(fileIds)
            .then(res => {
              commit('handleCat', mpvue.$mergeTempFile(data, res))
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
