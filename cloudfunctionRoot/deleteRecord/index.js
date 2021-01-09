// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-7g313d3r179dfe1c'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event
  if (id) {
    return await db.collection('Records').doc(id).remove()
  } else {
    return Promise.reject(new Error())
  }
}
