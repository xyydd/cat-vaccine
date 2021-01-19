<template>
	<view class="qiun-columns">
		<!--#ifdef H5 -->
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view class="qiun-title-dot-light">页面地址</view>
		</view>
		<view class="qiun-bg-white qiun-padding">
		    <text>pages/basic/line/line</text>
		</view>
		<!--#endif-->
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view class="qiun-title-dot-light">基本折线图</view>
		</view>
		<view class="qiun-bg-white qiun-padding">
		    <text>交互数据：{{Interactive}}</text>
		</view>
		<view class="qiun-charts" >
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts"></canvas>
			<!--#endif-->
		</view>
		<view class="qiun-common-mt" style="font-size:14px;text-align: center;">
			请在图表上左右移动
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<ad unit-id="adunit-908b0a16e90e2a5f" ad-type="grid" grid-count="8" ad-theme="white"></ad>
		<!-- #endif -->
		<!--#ifdef H5 -->
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
			<view class="qiun-title-dot-light">标准数据格式</view>
		</view>
		<view class="qiun-bg-white qiun-padding">
		    <textarea class="qiun-textarea" auto-height="true" maxlength="-1" v-model="textarea"/>
		</view>
		<!--#endif-->
	</view>
</template>

<script>
/*eslint-disable*/
import uCharts from '../../utils/u-charts.min'
const isJSON = function (str){
  if (typeof str == 'string') {
    try {
      var obj=JSON.parse(str)
      if(typeof obj == 'object' && obj ){
        return true
      }else{
        return false
      }
    } catch(e) {
      console.log('error：'+str+'!!!'+e)
      return false
    }
  }
}
let _self
let canvaLineA = null
let lastMoveTime = null//最后执行移动的时间戳
export default {
  data () {
    return {
      cWidth:'414',
      cHeight:'200',
      pixelRatio:1
    }
  },
  onLoad() {
    _self = this
    this.getServerData()
  },
  methods: {
    getServerData(){
      _self.showLineA("canvasLineA",{
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: [
          {name: '成交量A', data: [35, 8, 25, 37, 4, 20]},
          {name: '成交量B', data: [70, 40, 65, 100, 44, 68]},
          {name: '成交量C', data: [100, 80, 95, 150, 112, 132]}
        ]
      })
    },
    showLineA(canvasId,chartData){
      canvaLineA=new uCharts({
        $this:_self,
        canvasId: canvasId,
        type: 'line',
        colors:['#facc14', '#f04864', '#8543e0', '#90ed7d'],
        fontSize:11,
        padding:[15,15,0,15],
        legend:{
          show:true,
          padding:5,
          lineHeight:11,
          margin:0,
        },
        dataLabel:false,
        dataPointShape:true,
        background:'#FFFFFF',
        pixelRatio:_self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        animation: true,
        xAxis: {
          type:'grid',
          gridColor:'#CCCCCC',
          gridType:'dash',
          dashLength:8,
          //disableGrid:true
        },
        yAxis: {
          gridType:'dash',
          gridColor:'#CCCCCC',
          dashLength:8,
        },
        width: _self.cWidth*_self.pixelRatio,
        height: _self.cHeight*_self.pixelRatio,
        extra: {
          line:{
            type: 'straight'
          }
        }
      })
      console.log(canvaLineA)
    }
  }
}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750rpx;
		height: 500rpx;
		background-color: #FFFFFF;
    position: relative;
	}

	.charts {
		width: 750rpx;
		height: 500rpx;
		background-color: #FFFFFF;
	}
</style>
