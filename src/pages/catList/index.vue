<template>
  <div>
    <i-button type="primary" @click="goto('/pages/addCat/main')">添加猫咪(狗狗也行)</i-button>
    <div
      v-for="cat in catList"
      :key="_id"
      style="margin-top: 10px;"
    >
      <i-card
        :title="cat.catName"
        :thumb="cat.avatarUrl"
        extra="点击查看详情"
        i-class="cat"
        @click="goto(`/pages/catDetail/main?id=${cat._id}`)">
        <div slot="content">
          <div class="flex cat-item">
            <div class="title">体重</div>
            <div>{{cat.weight}}斤</div>
          </div>
          <div class="flex cat-item">
            <div class="title">性别</div>
            <div>{{cat.gender}}</div>
          </div>
          <div class="flex cat-item">
            <div class="title">年龄</div>
            <div>{{cat.age}}月</div>
          </div>
          <div class="flex justify-content-space-between">
            <i-button type="success" shape="circle" size="small" @click.stop="goto(`/pages/record/main?type=vaccine&id=${cat._id}`)">记录疫苗</i-button>
            <i-button type="success" shape="circle" size="small" @click.stop="goto(`/pages/record/main?type=insectRepellent&id=${cat._id}`)">记录驱虫</i-button>
          </div>
        </div>
      </i-card>
    </div>
  </div>
</template>
<script>
import store from './store'
import moment from 'moment'

export default {
  data () {
    return {
      authUser: false
    }
  },
  computed: {
    catList () {
      const catList = store.state.catList
      const g = ['割了', '弟弟', '妹妹']
      for (let i = 0; i < catList.length; i++) {
        if (catList[i].weight > 100) {
          catList[i].weight = '100+'
        }
        catList[i].gender = g[catList[i].gender]
        if (catList[i].birthday) {
          catList[i].age = moment().diff(moment(catList[i].birthday, 'YYYY-MM-DD'), 'months')
        } else {
          catList[i].age = 0
        }
      }
      return catList
    }
  },
  onShow () {
    store.dispatch('getCatList')
  },
  methods: {
    goto (url) {
      mpvue.navigateTo({
        url: url
      })
    }
  }
}
</script>
<style>
.cat-item {
  padding: 5px 0px;
}
.cat-item .title {
  padding-right: 10px;
}
.cat image {
  border-radius: 50%;
}
</style>
