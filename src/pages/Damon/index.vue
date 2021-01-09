<template>
  <div>
    <div class="cat-header">
      <div class="bg-cover"></div>
      <image class="bg-image" src="https://6465-dev-7g313d3r179dfe1c-1304701411.tcb.qcloud.la/eAPUIBYbaKTcgNYMSTDKbcMSbAXBIJFC.jpg?sign=401987698ee38cb2efceac523dcfa200&t=1610161534" mode="aspectFill"></image>
      <div class="cat-text">Damon</div>
      <div class="cat-text detail">2019-06-06</div>
      <div class="cat-text detail">10斤(目前还是)</div>
      <div class="cat-text detail">割了</div>
      <image class="cat-avatar" src="https://6465-dev-7g313d3r179dfe1c-1304701411.tcb.qcloud.la/eAPUIBYbaKTcgNYMSTDKbcMSbAXBIJFC.jpg?sign=401987698ee38cb2efceac523dcfa200&t=1610161534" mode="aspectFill"></image>
    </div>
    <div class="flex flex-wrap justify-content-space-around">
      <image
        v-for="img in albums"
        :key="img"
        :src="img"
        class="album-item"
        mode="aspectFill"
        @click="perviewImage(img)"
      ></image>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      albums: (function () {
        const res = []
        for (let i = 0; i < 22; i++) {
          res.push(`https://www.ydtx08.cn/damon-album/${i + 1}.jpg`)
        }
        return res
      })()
    }
  },
  methods: {
    perviewImage (img) {
      mpvue.previewImage({
        current: img,
        urls: this.albums
      }, true)
    }
  }
}
</script>
<style scoped>
div {
  text-align: center;
}
.album-item {
  width: calc(33% - 10px);
  height: 125px;
  border-radius: 4px;
  box-shadow: 0px 8px 24px rgba(51, 51, 51, 0.05);
  margin-bottom: 10px;
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
</style>
