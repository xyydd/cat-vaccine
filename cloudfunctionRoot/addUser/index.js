const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-7g313d3r179dfe1c'
});
const db = cloud.database();
const _ = db.command;
const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    let { userInfo } = event
    let { OPENID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
    db.collection('Users').where({
      openid: _.eq(OPENID)
    }).get()
      .then(res => {
        console.log(res.data)
        if (res.data.length > 0 ) {
          if (userInfo) {
            db.collection('Users').doc(res.data[0]._id).update({
              data: Object.assign(userInfo, {openid: OPENID})
            })
              .then(res => {
                console.log(res)
                resolve(true)
              })
              .catch(error => {
                console.log(error)
                reject(error)
              })
          } else {
            resolve(true)
          }
        } else {
          if (userInfo) {
            db.collection('Users').add({
              data: Object.assign(userInfo, {openid: OPENID})
            })
              .then(res => {
                resolve(true)
              })
              .catch(error => {
                console.log(error)
                reject(error)
              })
          } else {
            db.collection('Users').add({
              data: {
                openid: OPENID,
                nickName: getRandomStr(5) + '铲屎官',
                gender: 0,
                country: '未知',
                language: 'zh_CN',
                avatarUrl: 'https://6465-dev-7g313d3r179dfe1c-1304701411.tcb.qcloud.la/%E5%9B%BE%E7%89%87/logo.jpg?sign=a0b4234b8353c8637173d58c8201c152&t=1609901931'
              }
            })
              .then(res => {
                resolve(true)
              })
              .catch(error => {
                console.log(error)
                reject(error)
              })
          }
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
