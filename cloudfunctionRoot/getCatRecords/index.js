// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const { catId } = event
    db.collection('Records').where({
      catId: _.eq(catId)
    }).orderBy('date', 'desc').get()
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })

}
