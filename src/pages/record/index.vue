<template>
  <div style="padding: 10px 5px;">
    <div v-if="type === 'vaccine'">
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 46px;">疫苗类型</div>
        <picker @change="vaccinetypeChange" :value="vaccinetype" :range="vaccinetypes">
          <view class="picker">
            {{vaccinetypes[vaccinetype]}}
          </view>
        </picker>
      </div>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 31px;">打疫苗日期</div>
        <picker mode="date" :value="date" @change="dateChange">
          <view class="picker">
            {{date}}
          </view>
        </picker>
      </div>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 31px;">下一次打疫苗日期</div>
        <picker mode="date" :value="nextDate" @change="nextDateChange">
          <view class="picker">
            {{nextDate}}
          </view>
        </picker>
      </div>
      <i-divider content="疫苗码可二选一,不写也行"></i-divider>
      <i-input :value="code" title="疫苗码" placeholder="疫苗码" @change="codeChange"/>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 64px;">疫苗码(图片)</div>
        <div @click="chooseImage">
          <i-button v-if="!isUpload" size="small">点击上传</i-button>
          <image v-else mode="aspectFit" :src="imagePath"></image>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 46px;">驱虫类型</div>
        <picker @change="insectRepellentTypeChange" :value="insectRepellentType" :range="insectRepellentTypes">
          <view class="picker">
            {{insectRepellentTypes[insectRepellentType]}}
          </view>
        </picker>
      </div>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 31px;">驱虫日期</div>
        <picker mode="date" :value="date" @change="dateChange">
          <view class="picker">
            {{date}}
          </view>
        </picker>
      </div>
      <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
        <div style="padding-right: 31px;">下一次驱虫日期</div>
        <picker mode="date" :value="nextDate" @change="nextDateChange">
          <view class="picker">
            {{nextDate}}
          </view>
        </picker>
      </div>
    </div>
    <i-button type="success" @click="handleSubmit">记录</i-button>
    <i-message id="message" />
    <i-spin fix v-if="loading"></i-spin>
  </div>
</template>
<script>
import moment from 'moment'
import { $Message } from '../../utils/base/index'
export default {
  data () {
    return {
      loading: false,
      catId: '',
      isUpload: false,
      imagePath: '',
      type: '',
      code: '',
      date: '请选择',
      nextDate: '请选择',
      insectRepellentType: 0,
      insectRepellentTypes: ['请选择', '体外驱虫', '体内驱虫', '体内外一体'],
      vaccinetype: 0,
      vaccinetypes: ['请选择', '猫三联', '狂犬']
    }
  },
  onShow () {
    this.clear()
  },
  onLoad (option) {
    console.log(option)
    this.type = option.type
    this.catId = option.id
  },
  computed: {
    valid () {
      return (this.insectRepellentType !== 0 || this.vaccinetype !== 0) && this.date !== '请选择'
    }
  },
  methods: {
    clear () {
      this.loading = false
      this.catId = ''
      this.isUpload = false
      this.imagePath = ''
      this.type = ''
      this.code = ''
      this.date = '请选择'
      this.nextDate = '请选择'
      this.insectRepellentType = 0
      this.vaccinetype = 0
    },
    subscribeMessage () {
      return new Promise((resolve, reject) => {
        mpvue.requestSubscribeMessage({
          tmplIds: ['vHIAsfMykxzfLh2vzuV4tllncKyDbvoYwLba1ltgiLA'],
          success: function () {
            resolve(true)
          },
          fail: function (err) {
            reject(err)
          }
        })
      })
    },
    async handleSubmit () {
      if (this.valid) {
        this.loading = true
        let isSub = false
        try {
          let subscribeRes = await this.subscribeMessage()
          console.log(subscribeRes)
          if (subscribeRes) {
            isSub = true
          }
        } catch (e) {
          console.log(e)
        }
        mpvue.cloud.callFunction({
          name: 'addRecord',
          data: {
            isSub: isSub,
            catId: this.catId,
            type: this.type,
            date: this.date,
            nextDate: this.nextDate,
            insectRepellentType: this.insectRepellentType,
            vaccinetype: this.vaccinetype,
            code: this.code,
            codeImage: this.isUpload ? mpvue.cloud.CDN({
              type: 'filePath',
              filePath: this.imagePath
            }) : ''
          }
        })
          .then(res => {
            this.loading = false
            $Message({
              content: '记录成功',
              type: 'success'
            })
            mpvue.switchTab({
              url: '/pages/catList/main'
            })
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
      } else {
        $Message({
          content: '检查一下是不是没填类型或日期呀',
          type: 'warning'
        })
      }
    },
    chooseImage () {
      this.isUpload = false
      mpvue.chooseImage({
        count: 1,
        sizeType: 'compressed',
        success: res => {
          console.log(res)
          this.isUpload = true
          this.imagePath = res.tempFilePaths[0]
        }
      })
    },
    codeChange (e) {
      this.code = e.target.detail.value
    },
    nextDateChange (e) {
      this.nextDate = e.target.value
    },
    dateChange (e) {
      this.date = e.target.value
      if (this.type === 'vaccine') {
        this.nextDate = moment(this.date, 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD')
      } else {
        if (this.insectRepellentType >= 2) {
          this.nextDate = moment(this.date, 'YYYY-MM-DD').add(3, 'months').format('YYYY-MM-DD')
        } else {
          this.nextDate = moment(this.date, 'YYYY-MM-DD').add(1, 'months').format('YYYY-MM-DD')
        }
      }
    },
    insectRepellentTypeChange (e) {
      this.insectRepellentType = e.target.value
    },
    vaccinetypeChange (e) {
      this.vaccinetype = e.target.value
    }
  }
}
</script>
<style>
.input-item {
  color: #495060;
  position: relative;
  display: flex;
  background: #fff;
  align-items: center;
  line-height: 1.4;
  overflow: hidden;
}
</style>
