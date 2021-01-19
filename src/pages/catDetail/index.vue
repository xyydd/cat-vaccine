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
    <div v-show="isShowWeight" class="qiun-charts" >
      <canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
    </div>
    <div v-show="isShowWeight" class="flex justify-content-space-around timeselect-wrapper">
      <div class="timeselect-item" :class="{ 'timeselect-active': currentTime === 1 }" @click="changeTimeSelect(1)">近1月</div>
      <div class="timeselect-item" :class="{ 'timeselect-active': currentTime === 3 }" @click="changeTimeSelect(3)">近3月</div>
      <div class="timeselect-item" :class="{ 'timeselect-active': currentTime === 6 }" @click="changeTimeSelect(6)">近6月</div>
      <div class="timeselect-item" :class="{ 'timeselect-active': currentTime === 12 }" @click="changeTimeSelect(12)">近1年</div>
      <div class="timeselect-item" :class="{ 'timeselect-active': currentTime === 36 }" @click="changeTimeSelect(36)">近3年</div>
    </div>
    <div v-if="records.length > 0" class="records-wrapper">
      <i-tabs :current="tab" @change="tabChange">
        <i-tab  key="insectRepellent" title="驱虫"></i-tab>
        <i-tab  key="vaccine" title="疫苗"></i-tab>
      </i-tabs>
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
    </div>
    <div class="flex justify-content-space-between fix-btn-group">
      <i-button long="true" style="width: 50%;" type="success" size="large" @click.stop="goto(`/pages/record/main?type=vaccine&id=${cat._id}`)">记录疫苗</i-button>
      <i-button long="true" style="width: 50%;border-left: 1px solid #fff;" size="large" type="success" @click.stop="goto(`/pages/record/main?type=insectRepellent&id=${cat._id}`)">记录驱虫</i-button>
      <i-button long="true" style="width: 50%;border-left: 1px solid #fff;" size="large" type="success" @click.stop="picker = true">记录体重</i-button>
    </div>
    <i-modal title="删除后无法恢复，提醒也会删除，确认删除？" :visible="visible1" @ok="handleDelete" @cancel="visible1 = false">
    </i-modal>
    <i-modal title="体重" :visible="picker" @ok="handleSubmitWeight" @cancel="picker = false">
      <picker @change="weightChange" :value="weight" :range="weights">
        <view class="picker">
          {{weights[weight]}}
        </view>
      </picker>
    </i-modal>
    <i-spin fix v-if="loading"></i-spin>
    <i-message id="message" />
  </div>
</template>

<script>
/*eslint-disable*/
import cloneDeep from 'lodash/cloneDeep'
import { $Message } from '../../utils/base/index'
import moment from 'moment'
import uCharts from '../../utils/u-charts.min'
let _self
let canvaLineA = null
export default {
  data () {
    return {
      isShowWeight: true,
      currentTime: 1,
      isRendered: false,
      cWidth: mpvue.getSystemInfoSync().windowWidth,
      cHeight: '200',
      pixelRatio: 1,
      recordsData: [],
      catData: {
        gender: 0,
        age: 12,
        birthday: '',
        weight: 0,
        catName: ''
      },
      ecComponent: {},
      ec: {
        lazyLoad: true
      },
      picker: false,
      tab: 'insectRepellent',
      loading: false,
      deleteId: '',
      visible1: false,
      catId: '',
      myChart: undefined,
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
    option () {
      const days = moment().diff(moment().subtract(this.currentTime, 'months'), 'days')
      const records = cloneDeep(this.recordsData)
        .filter(item => {
          return item.type === 'weight'
        })
        .sort((a, b) => {
          return moment(a.date).isBefore(b.date)
        })
        .slice(-days)
      const weights = {
        name: 'cat',
        data: []
      }
      const dates = []
      if (records.length > 0) {
        const last = cloneDeep(records[records.length - 1])
        if (records.length < days) {
          const len = days - records.length
          for (let i = 0; i < len; i++) {
            last.date = moment(last.date, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD')
            records.push(cloneDeep(last))
          }
        }
        records.reverse()
        for (let i = 0; i < records.length; i++) {
          weights.data.push(records[i].weight)
          dates.push(records[i].date)
        }
        return {
          categories: dates,
          series: [weights]
        }
      }
      return {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: []
      }

    },
    cat () {
      const cat = this.catData
      const g = ['割了', '弟弟', '妹妹']
      cat.gender = g[cat.gender]
      cat.age = moment().diff(moment(cat.birthday, 'YYYY-MM-DD'), 'months')
      if (cat.weight > 100) {
        cat.weight = '100+'
      }
      return cat
    },
    records () {
      const records = cloneDeep(this.recordsData)
      const res = []
      for (let i = 0; i < records.length; i++) {
        records[i].nextDate = moment(records[i].nextDate).format('YYYY-MM-DD')
        if (records[i].type === 'vaccine' && this.tab === 'vaccine') {
          records[i].type = '疫苗'
          if (Number(records[i].vaccinetype) === 1) {
            records[i].kind = '猫三联'
          } else {
            records[i].kind = '狂犬'
          }
          res.push(records[i])
        } else if (records[i].type === 'insectRepellent' && this.tab === 'insectRepellent') {
          records[i].type = '驱虫'
          if (Number(records[i].insectRepellentType) === 1) {
            records[i].kind = '体外驱虫'
          } else if (Number(records[i].insectRepellentType) === 2) {
            records[i].kind = '体内驱虫'
          } else {
            records[i].kind = '体内外一体'
          }
          res.push(records[i])
        }
      }
      return res
    }
  },
  watch: {
    option (v) {
      if (v.series.length <= 0) {
        this.isShowWeight = false
      } else {
        this.isShowWeight = true
        setTimeout(() => {
          if (!this.isRendered) {
            this.showLineA("canvasLineA", v)
          } else {
            this.resetChartData(v)
          }
        }, 1000)
      }
    }
  },
  onLoad (option) {
    this.isRendered = false
    canvaLineA = null
    this.catId = option.id
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
    this.getCatRecords(this.catId)
    this.getCatDetail(this.catId)
    _self = this
  },
  methods: {
    changeTimeSelect (v) {
      this.currentTime = v
    },
    showLineA (canvasId, chartData) {
      const max = Math.max(...chartData.series[0].data) + 10
      canvaLineA = new uCharts({
        $this:_self,
        canvasId: canvasId,
        type: 'line',
        colors:['#facc14', '#f04864', '#8543e0', '#90ed7d'],
        fontSize:11,
        padding:[15, 15, 0, 15],
        legend:{
          show: true,
          padding: 5,
          lineHeight: 11,
          margin: 0,
        },
        dataLabel: false,
        dataPointShape: false,
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        xAxis: {
          type: 'grid',
          gridColor: '#CCCCCC',
          gridType: 'dash',
          dashLength: 8,
          rotateLabel: true,
          disableGrid: true,
          labelCount: 5
        },
        yAxis: {
          gridType: 'dash',
          gridColor: '#CCCCCC',
          dashLength: 8,
          showTitle: true,
          data: [{
            min: 0,
            max: max,
            title: '斤'
          }]
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          line: {
            type: 'curve'
          }
        }
      })
      canvaLineA.addEventListener('renderComplete', () => {
        this.isRendered = true
      })
    },
    resetChartData ({ categories, series }) {
      canvaLineA.updateData({
        series: series,
        categories: categories
      });
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
              catId: this.catId
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
    tabChange (e) {
        this.tab = e.mp.detail.key
      },
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
            this.getCatRecords(this.catId)
          })
          .catch(err => {
            this.loading = false
            console.log(err)
          })
      },
    handleCatRecords (data) {
        this.recordsData = data
      },
    handleCat (data) {
        this.catData = data[0]
      },
    getCatRecords (id) {
        mpvue.cloud.callFunction({
          name: 'getCatRecords',
          data: {
            catId: id
          }
        })
          .then(res => {
            const data = res.result.data
            const fileIds = data.map(item => {
              if (item.codeImage && item.codeImage !== '') {
                return item.codeImage
              }
            }).filter(item => item)
            mpvue.$getTempFile(fileIds)
              .then(res => {
                this.handleCatRecords(mpvue.$mergeTempFile(data, res, 'codeImage'))
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
          })
      },
    getCatDetail (id) {
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
                this.handleCat(mpvue.$mergeTempFile(data, res))
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
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts {
  width: 100%;
  height: 400rpx;
  background-color: #FFFFFF;
  position: relative;
}

.charts {
  width: 100%;
  height: 400rpx;
  background-color: #FFFFFF;
}
.detail-wrapper {
   background: #F5F5F5;
   /*height: 100vh;*/
   overflow-y: auto;
   position: relative;
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
.records-wrapper {
  margin-bottom: 58px;
  min-height: 200px;
}
.records-wrapper .record-card {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(51, 51, 51, 0.05);
  border-radius: 40px;
  padding: 24px;
  margin-bottom: 20px;
}
.records-wrapper .record-card:nth-child(2) {
  margin-top: 20px;
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
.fix-btn-group {
  position: fixed;
  bottom: 0px;
  z-index: 3;
  width: 100%;
}
.timeselect-wrapper {
  background-color: #FFFFFF;
  color: #999;
  font-size: 12px;
}
.timeselect-wrapper .timeselect-item {
  word-spacing: 5px;
  padding: 0px 15px;
  border-radius: 25px;
  line-height: 26px;
}
.timeselect-wrapper .timeselect-item.timeselect-active {
  background-color: rgba(92, 173, 255, .2);
  color: #2d8cf0;
}
</style>
