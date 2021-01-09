<template>
  <div class="detail-wrapper">
    <div class="cat-header">
      <div class="set flex justify-content-end">
        <i-icon type="setup" size="25" color="#000" @click="goto(`/pages/addCat/main?id=${catId}`)"/>
      </div>
      <div class="bg-cover"></div>
      <image class="bg-image" :src="cat.avatarUrl" mode="aspectFill"></image>
      <div class="cat-text">{{cat.catName}}</div>
      <div class="cat-text detail">{{cat.birthday}}</div>
      <div class="cat-text detail">{{cat.weight}}斤</div>
      <div class="cat-text detail">{{cat.gender}}</div>
      <image class="cat-avatar" :src="cat.avatarUrl" mode="aspectFill"></image>
    </div>
    <div v-if="records.length > 0" class="records-wrapper">
      <div
        v-for="record in records"
        :key="_id"
        class="record-card"
      >
        <div class="record-header flex justify-content-space-between">
          <div class="type">
            <div>{{record.type}}</div>
            <div class="tip">下次：{{record.nextDate}}</div>
          </div>
          <div class="date">{{record.date}}</div>
        </div>
        <div class="record-content">
          <div>{{record.kind}}</div>
          <div v-if="record.code !== ''">{{record.code}}</div>
          <image style="width: 100%;height: 50px;" mode="aspectFill" v-if="record.codeImage" :src="record.codeImage"></image>
        </div>
        <div class="record-foot flex justify-content-end">
          <span @click="handleModal(record._id)">删除</span>
        </div>
      </div>
    </div>
    <div v-else style="text-align: center;color: #605C70;">
      还没有记录，去记录
      <div class="flex justify-content-center">
        <i-button type="success" shape="circle" size="small" @click.stop="goto(`/pages/record/main?type=vaccine&id=${cat._id}`)">记录疫苗</i-button>
        <i-button type="success" shape="circle" size="small" @click.stop="goto(`/pages/record/main?type=insectRepellent&id=${cat._id}`)">记录驱虫</i-button>
      </div>
    </div>
    <i-modal title="删除后无法恢复，提醒也会删除，确认删除？" :visible="visible1" @ok="handleDelete" @cancel="visible1 = false">
    </i-modal>
    <i-spin fix v-if="loading"></i-spin>
    <i-message id="message" />
  </div>
</template>
<script>
import store from './store'
import moment from 'moment'
import { $Message } from '../../utils/base/index'
export default {
  data () {
    return {
      loading: false,
      deleteId: '',
      visible1: false,
      catId: ''
    }
  },
  computed: {
    cat () {
      const cat = store.state.cat
      const g = ['割了', '弟弟', '妹妹']
      cat.gender = g[cat.gender]
      cat.age = moment().diff(moment(cat.birthday, 'YYYY-MM-DD'), 'months')
      if (cat.weight > 100) {
        cat.weight = '100+'
      }
      return cat
    },
    records () {
      const records = store.state.records
      for (let i = 0; i < records.length; i++) {
        records[i].nextDate = moment(records[i].nextDate).format('YYYY-MM-DD')
        if (records[i].type === 'vaccine') {
          records[i].type = '疫苗'
          if (Number(records[i].vaccinetype) === 1) {
            records[i].kind = '猫三联'
          } else {
            records[i].kind = '狂犬'
          }
        } else {
          records[i].type = '驱虫'
          if (Number(records[i].insectRepellentType) === 1) {
            records[i].kind = '体外驱虫'
          } else if (Number(records[i].insectRepellentType) === 2) {
            records[i].kind = '体内驱虫'
          } else {
            records[i].kind = '体内外一体'
          }
        }
      }
      return records
    }
  },
  onLoad (option) {
    console.log(option)
    this.catId = option.id
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
    store.dispatch('getCatRecords', this.catId)
    store.dispatch('getCatDetail', this.catId)
  },
  methods: {
    goto (url) {
      mpvue.navigateTo({
        url: url
      })
    },
    handleModal (id) {
      this.deleteId = id
      this.visible1 = true
    },
    handleDelete () {
      this.loading = true
      this.visible1 = false
      mpvue.cloud.callFunction({
        name: 'deleteRecord',
        data: {
          id: this.deleteId
        }
      })
        .then(() => {
          $Message({
            content: '删除成功',
            type: 'success'
          })
          this.loading = false
          store.dispatch('getCatRecords', this.catId)
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    }
  }
}
</script>
<style>
.detail-wrapper {
  background: #F5F5F5;
  height: 100vh;
  overflow-y: auto;
}
.cat-header {
  height: 126px;
  padding: 30px 36px;
  border-radius: 0px 0px 40px 40px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 50px;
  box-shadow: 0px 8px 24px rgba(0, 100, 221, 0.2);
}
.bg-image {
  width: 100%;
  height: 100%;
  border-radius: 0px 0px 40px 40px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.75;
  filter: blur(7px);
  z-index: 0;
}
.bg-cover {
  width: 100%;
  height: 100%;
  border-radius: 0px 0px 40px 40px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(121, 121, 121, 0.62) 100%);
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
.cat-header .cat-text {
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  color: #FFFFFF;
  text-align: center;
  z-index: 2;
  position: relative;
}
.cat-header .cat-text.detail {
  font-size: 14px;
  line-height: 26px;
}
.cat-header .cat-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  bottom: -40px;
  left: calc(50% - 40px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
.records-wrapper .record-card {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(51, 51, 51, 0.05);
  border-radius: 40px;
  padding: 24px;
  margin-bottom: 20px;
}
.record-header {
  padding-bottom: 12px;
  border-bottom: 1px dashed #E2E4E9;
}
.record-content {
  padding-top: 12px;
  font-size: 14px;
  line-height: 18px;
  color: #605C70;
  font-weight: normal;
}
.record-header .type {
  font-size: 18px;
  line-height: 22px;
  color: #19181D;
  font-weight: bold;
}
.record-header .type .tip {
  font-size: 12px;
  line-height: 18px;
  color: #605C70;
  font-weight: normal;
}
.record-header .date {
  font-size: 13px;
  line-height: 18px;
  text-align: right;
  color: #D67D0D;
}
.record-foot {
  font-size: 12px;
  line-height: 18px;
  color: #605C70;
  font-weight: normal;
  text-decoration: underline;
}
.set {
  position: absolute;
  top: 5px;
  width: calc(100% - 60px);
  z-index: 3;
}
</style>
