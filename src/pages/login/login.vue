<template>
  <div class="content">
    <div v-if="!authUser">
      <i-button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">获取用户信息</i-button>
      <i-button type="primary" @click="getUserInfo({target: {userInfo: false}})">游客登录</i-button>
      <div>本小程序本着简单简洁且尽量不获取用户信息的原则，请用户自行选择登录选项。</div>
      <div>注：若选择游客登录，每次进入后都需要进入到该页面进行一次登录</div>
<!--      <div class="footer">-->
<!--        <a @click="visible = true">支持作者一下嘛</a>-->
<!--      </div>-->
    </div>
    <div v-else>
      已登录授权，正在跳转
    </div>
    <i-spin fix v-if="loading"></i-spin>
  </div>
</template>

<script>
import store from './store'
// import Footer from '@/components/footer'

export default {
  // components: {
  //   Footer
  // },
  data () {
    return {
      visible: false,
      authUser: false,
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },

  computed: {
    loading () {
      return store.state.loading
    },
    res () {
      return store.state.res
    }
  },

  watch: {
    res (v) {
      if (v.result && typeof v.result === 'boolean') {
        mpvue.switchTab({
          url: '/pages/catList/main'
        })
      }
    }
  },

  methods: {
    getUserInfo (res) {
      store.commit('handleLoading', true)
      store.dispatch('addUser', res.target.userInfo)
    }
  },

  onLoad () {
    if (mpvuePlatform === 'wx') {
      mpvue.getSetting({
        success: (res) => {
          console.log(res.authSetting['scope.userInfo'])
          if (res.authSetting && res.authSetting['scope.userInfo']) {
            this.authUser = true
            mpvue.switchTab({
              url: '/pages/catList/main'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding: 10px;
  text-align: center;
}
</style>
