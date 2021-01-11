<template>
  <div class="content">
    <i-input :value="catName" title="猫咪/狗狗" autofocus placeholder="名字" :maxlength="12" @change="nameChange"/>
    <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
      <div style="padding-right: 18px;">出生日期</div>
      <picker mode="date" :value="birthday" @change="dateChange">
        <view class="picker">
          {{birthday}}
        </view>
      </picker>
    </div>
    <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
      <div style="padding-right: 46px;">多重</div>
      <picker @change="weightChange" :value="weight" :range="weights">
        <view class="picker">
          {{weights[weight]}}
        </view>
      </picker>
    </div>
    <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
      <div style="padding-right: 32px;">割了没</div>
      <picker @change="genderChange" :value="gender" :range="genders">
        <view class="picker">
          {{genders[gender]}}
        </view>
      </picker>
    </div>
    <div class="flex input-item" style="font-size: 14px;padding: 7px 15px;">
      <div style="padding-right: 34px;">有木有可爱照片</div>
      <div @click="chooseImage">
        <div v-if="!isUpload && imagePath === ''">点击上传</div>
        <image v-else mode="aspectFit" :src="imagePath"></image>
      </div>
    </div>
    <i-button v-if="!isEdit" type="primary" @click="handleSubmit">添加</i-button>
    <i-button v-else type="primary" @click="handleSubmit">编辑</i-button>
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
      isEdit: false,
      loading: false,
      isUpload: false,
      imagePath: '',
      catName: '',
      birthday: moment().format('YYYY-MM-DD'),
      gender: 0,
      genders: ['割了', '弟弟', '妹妹'],
      weight: 0,
      weights: (() => {
        let res = []
        for (let i = 0; i < 101; i++) {
          res.push(i + ' 斤')
        }
        res.push('100+斤，太重啦赶快减肥！')
        return res
      })()
    }
  },
  onLoad (option) {
    this.isEdit = false
    this.catId = ''
    if (option.id) {
      this.isEdit = true
      this.catId = option.id
      this.getCatDetail(this.catId)
    }
  },
  onShow () {
    this.clear()
  },
  methods: {
    clear () {
      this.isEdit = false
      this.loading = false
      this.isUpload = false
      this.imagePath = ''
      this.catName = ''
      this.birthday = moment().format('YYYY-MM-DD')
      this.gender = 0
      this.weight = 0
    },
    getCatDetail (id) {
      mpvue.cloud.callFunction({
        name: 'getCat',
        data: {
          id: id
        }
      })
        .then(res => {
          if (!res.result.data.avatarUrl || res.result.data.avatarUrl === '') {
            const d = res.result.data
            this.catName = d.catName
            this.birthday = d.birthday
            this.gender = Number(d.gender)
            this.weight = Number(d.weight)
          } else {
            const data = [res.result.data]
            const fileIds = data.map(item => item.avatarUrl)
            mpvue.$getTempFile(fileIds)
              .then(res => {
                const d = mpvue.$mergeTempFile(data, res)[0]
                console.log(d)
                this.catName = d.catName
                this.imagePath = d.avatarUrl
                this.birthday = d.birthday
                this.gender = Number(d.gender)
                this.weight = Number(d.weight)
              })
              .catch(error => {
                console.log(error)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSubmit () {
      if (this.catName === '') {
        $Message({
          content: '小猫咪名字一定要写哦',
          type: 'warning'
        })
      } else {
        this.loading = true
        if (!this.isEdit) {
          mpvue.cloud.callFunction({
            name: 'addCat',
            data: {
              birthday: this.birthday,
              image: this.isUpload ? mpvue.cloud.CDN({
                type: 'filePath',
                filePath: this.imagePath
              }) : '',
              catName: this.catName,
              gender: this.gender,
              weight: this.weight
            },
            success: () => {
              this.loading = false
              this.clear()
              mpvue.switchTab({
                url: '/pages/catList/main'
              })
            },
            fail: error => {
              this.loading = true
              console.log(error)
              $Message({
                content: '添加失败',
                type: 'warning'
              })
            }
          })
        } else {
          mpvue.cloud.callFunction({
            name: 'editCat',
            data: {
              id: this.catId,
              birthday: this.birthday,
              image: this.isUpload ? mpvue.cloud.CDN({
                type: 'filePath',
                filePath: this.imagePath
              }) : false,
              catName: this.catName,
              gender: this.gender,
              weight: this.weight
            },
            success: () => {
              this.loading = false
              this.clear()
              mpvue.switchTab({
                url: '/pages/catList/main'
              })
            },
            fail: error => {
              this.loading = true
              console.log(error)
              $Message({
                content: '编辑失败',
                type: 'warning'
              })
              mpvue.switchTab({
                url: '/pages/catList/main'
              })
            }
          })
        }
      }
    },
    chooseImage () {
      this.isUpload = false
      wx.chooseImage({
        count: 1,
        sizeType: 'compressed',
        success: res => {
          console.log(res)
          this.isUpload = true
          this.imagePath = res.tempFilePaths[0]
        }
      })
    },
    nameChange (e) {
      this.catName = e.target.detail.value
    },
    weightChange (e) {
      console.log('weight', e)
      this.weight = Number(e.target.value)
    },
    genderChange (e) {
      this.gender = Number(e.target.value)
    },
    dateChange (e) {
      this.birthday = e.target.value
    }
  }
}
</script>
<style scoped>
.content {
  padding-top: 30px;
}
.input-item {
  color: #495060;
  position: relative;
  display: flex;
  background: #fff;
  align-items: center;
  line-height: 1.4;
  overflow: hidden;
}
image {
  width: 160px;
  height: 120px;
}
</style>
