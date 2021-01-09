// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    let { OPENID } = cloud.getWXContext()
    db.collection('Cats').where({
      openid: _.eq(OPENID)
    }).get()
      .then(res => {
        console.log('success', res)
        resolve(res)
      })
      .catch(error => {
        console.log('error', res)
        reject(error)
      })
  })
}
