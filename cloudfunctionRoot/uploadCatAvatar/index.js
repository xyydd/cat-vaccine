// 云函数入口文件
const request = require('request')
const axios = require('axios')
const fs = require('fs')
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}
// 云函数入口函数
exports.main = async (event, context) => {
  const { image, path } = event
  const res = await axios.get(image, {
    responseType: "arraybuffer"
  })
  // return new Promise(async (resolve, reject) => {
    // let { OPENID } = cloud.getWXContext()
    // let stream = fs.createWriteStream(`./${OPENID}.jpg`);
    // request(image).pipe(stream).on('close', () => {
    //   const fileStream = fs.createReadStream(path.join(__dirname, `${OPENID}.jpg`))
    //   cloud.uploadFile({
    //     cloudPath: 'demo.jpg',
    //     fileContent: fileStream,
    //     success: resolve,
    //     fail: reject
    //   })
    // });
  // })
  return await cloud.uploadFile({
    cloudPath: path + '/' + getRandomStr()+'.jpg',
    fileContent: res.data,
  })
}
