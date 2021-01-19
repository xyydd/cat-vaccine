<template>
  <div>
    <i-button type="warning" @click="goto('/pages/addCat/main')">添加猫咪(狗狗也行)</i-button>
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
            <i-button type="success" shape="circle" size="small" @click.stop="showModal(cat._id)">记录体重</i-button>
          </div>
        </div>
      </i-card>
    </div>
    <i-modal title="体重" :visible="picker" @ok="handleSubmitWeight" @cancel="picker = false">
      <picker @change="weightChange" :value="weight" :range="weights">
        <view class="picker">
          {{weights[weight]}}
        </view>
      </picker>
    </i-modal>
    <i-message id="message" />
  </div>
</template>
<script>
import moment from 'moment'
import { $Message } from '../../utils/base'

export default {
  data () {
    return {
      picker: false,
      pickerCat: '',
      authUser: false,
      catListData: [],
      weight: 0,
      weights: (() => {
        let res = ['请点击选择']
        for (let i = 1; i < 101; i++) {
          res.push(i + ' 斤')
        }
        res.push('100+斤，太重啦赶快减肥！')
        return res
      })()
    }
  },
  computed: {
    catList () {
      const catList = this.catListData
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
    this.getCatList()
  },
  methods: {
    showModal (id) {
      this.picker = true
      this.pickerCat = id
    },
    weightChange (e) {
      this.weight = Number(e.target.value)
    },
    handleSubmitWeight () {
      if (this.weight > 0) {
        mpvue.cloud.callFunction({
          name: 'addRecord',
          data: {
            type: 'weight',
            isSub: false,
            weight: this.weight,
            date: moment().format('YYYY-MM-DD'),
            catId: this.pickerCat
          }
        })
          .then(res => {
            this.loading = false
            $Message({
              content: '记录成功',
              type: 'success'
            })
            this.picker = false
          })
          .catch(err => {
            this.picker = false
            console.log(err)
          })
      }
    },
    goto (url) {
      mpvue.navigateTo({
        url: url
      })
    },
    handleCatList (data) {
      this.catListData = data
    },
    getCatList () {
      mpvue.cloud.callFunction({
        name: 'getCatList'
      })
        .then(res => {
          console.log(res)
          const data = res.result.data
          const fileIds = data.map(item => item.avatarUrl)
          mpvue.$getTempFile(fileIds)
            .then(res => {
              this.handleCatList(mpvue.$mergeTempFile(data, res))
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
