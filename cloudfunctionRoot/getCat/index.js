// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const { id } = event
    db.collection('Cats').doc(id).get()
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })

}
