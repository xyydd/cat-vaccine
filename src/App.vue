<script>
import { getTempFile, mergeTempFile } from './utils/index'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'wx') {
      mpvue.cloud.init()
      mpvue.$getTempFile = getTempFile
      mpvue.$mergeTempFile = mergeTempFile
      mpvue.$tempFileList = []
    }
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.footer {
  width: 100%;
  position: fixed;
  bottom: 5px;
  text-align: center;
}
.footer a {
  text-decoration: underline;
  color: #2d8cf0;
  font-size: 12px;
}
.flex {
  display: flex;
  justify-content: start;
  align-items: center;
}
.flex.justify-content-space-between {
  justify-content: space-between;
}
.flex.flex-wrap {
  flex-wrap: wrap;
}
.flex.justify-content-space-around {
  justify-content: space-around;
}
.flex.justify-content-center {
  justify-content: center;
}
.flex.justify-content-end {
  justify-content: flex-end;
}
.flex.align-items-middle {
  align-items: center;
}
</style>
